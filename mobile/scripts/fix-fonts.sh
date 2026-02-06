#!/bin/bash
# fix-fonts.sh
# Removes duplicate font file references from the Xcode project that were
# added by react-native-asset. The RNVectorIcons CocoaPod already bundles
# the font files; we only need the UIAppFonts entry in Info.plist so iOS
# knows to load Ionicons.ttf at runtime.

set -e

PROJ_DIR="${1:-$(pwd)}"
PBXPROJ="$PROJ_DIR/ios/ServlyMobile.xcodeproj/project.pbxproj"
PLIST="$PROJ_DIR/ios/ServlyMobile/Info.plist"

if [ ! -f "$PBXPROJ" ]; then
  echo "Error: Cannot find $PBXPROJ"
  echo "Usage: bash fix-fonts.sh [path-to-ServlyMobile]"
  exit 1
fi

echo "==> Cleaning font references from Xcode project..."

# Remove any lines in the pbxproj that reference .ttf files added by react-native-asset
# These show up in PBXBuildFile, PBXFileReference, PBXGroup children, and
# PBXResourcesBuildPhase "Copy Bundle Resources"
cp "$PBXPROJ" "$PBXPROJ.bak"

# Remove lines containing .ttf references (these are the react-native-asset additions)
# We need to be careful to only remove the font asset references, not pod references
grep -v '\.ttf.*react-native-vector-icons\|Fonts.*\.ttf\|\.ttf.*sourceTree.*"<group>"' "$PBXPROJ" > "$PBXPROJ.tmp" 2>/dev/null || true

# More targeted: remove PBXBuildFile and PBXFileReference entries for .ttf files
# that have sourceTree = "<group>" (these are the ones react-native-asset adds)
python3 - "$PBXPROJ" <<'PYEOF'
import sys
import re

pbxproj_path = sys.argv[1]
with open(pbxproj_path, 'r') as f:
    lines = f.readlines()

# Collect UUIDs of .ttf file references and build file entries
ttf_uuids = set()
cleaned_lines = []
skip_next = False

for i, line in enumerate(lines):
    # Skip lines that reference .ttf files added by react-native-asset
    # PBXBuildFile entries look like: UUID /* FontName.ttf in Resources */ = {isa = PBXBuildFile; fileRef = UUID; };
    # PBXFileReference entries look like: UUID /* FontName.ttf */ = {isa = PBXFileReference; ... sourceTree = "<group>"; };
    if '.ttf' in line and 'PBXBuildFile' in line and 'in Resources' in line:
        # Extract UUID
        match = re.match(r'\s+([A-F0-9]+)\s+/\*', line)
        if match:
            ttf_uuids.add(match.group(1))
        continue
    if '.ttf' in line and 'PBXFileReference' in line and '"<group>"' in line:
        match = re.match(r'\s+([A-F0-9]+)\s+/\*', line)
        if match:
            ttf_uuids.add(match.group(1))
        continue
    # Remove .ttf entries from PBXGroup children and PBXResourcesBuildPhase files
    if '.ttf' in line and ('/* Resources */' in lines[max(0,i-5):i+1][-1] if i > 0 else False):
        continue
    # Remove UUID references that point to our removed .ttf entries
    stripped = line.strip().rstrip(',').rstrip(';').strip()
    if stripped in ttf_uuids:
        continue
    # Remove lines that are just a .ttf UUID in a children/files array
    uuid_match = re.match(r'\s+([A-F0-9]+)\s+/\*\s+\S+\.ttf\s', line)
    if uuid_match:
        continue

    cleaned_lines.append(line)

with open(pbxproj_path, 'w') as f:
    f.writelines(cleaned_lines)

removed = len(lines) - len(cleaned_lines)
print(f"    Removed {removed} .ttf reference lines from pbxproj")
PYEOF

echo "==> Ensuring UIAppFonts is set in Info.plist..."

# Remove existing UIAppFonts entry if any, then add fresh one
/usr/libexec/PlistBuddy -c "Delete :UIAppFonts" "$PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :UIAppFonts array" "$PLIST"
/usr/libexec/PlistBuddy -c "Add :UIAppFonts:0 string Ionicons.ttf" "$PLIST"

echo "==> Removing react-native.config.js if present..."
rm -f "$PROJ_DIR/react-native.config.js"

echo "==> Cleaning Xcode build cache..."
rm -rf "$PROJ_DIR/ios/build"
rm -rf "$PROJ_DIR/ios/Pods" 2>/dev/null || true

echo "==> Running pod install..."
cd "$PROJ_DIR/ios" && pod install

echo ""
echo "Done! Now run:"
echo "  cd $PROJ_DIR && npx react-native run-ios"
