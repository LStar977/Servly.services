#!/bin/bash
# fix-fonts.sh
# Fixes the "?" icon issue by registering Ionicons.ttf in Info.plist.
#
# The RNVectorIcons CocoaPod copies all .ttf font files into the app bundle
# (via s.resources in its podspec), but iOS won't load custom fonts unless
# they're listed in UIAppFonts in Info.plist.
#
# Usage:
#   bash fix-fonts.sh                    # runs in current directory
#   bash fix-fonts.sh ~/ServlyMobile     # specify project path

set -e

PROJ_DIR="${1:-$(pwd)}"
PLIST="$PROJ_DIR/ios/ServlyMobile/Info.plist"

if [ ! -f "$PLIST" ]; then
  echo "Error: Cannot find $PLIST"
  echo "Usage: bash fix-fonts.sh [path-to-ServlyMobile]"
  exit 1
fi

echo "==> Registering Ionicons.ttf in Info.plist..."
/usr/libexec/PlistBuddy -c "Delete :UIAppFonts" "$PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :UIAppFonts array" "$PLIST"
/usr/libexec/PlistBuddy -c "Add :UIAppFonts:0 string Ionicons.ttf" "$PLIST"
echo "    UIAppFonts:"
/usr/libexec/PlistBuddy -c "Print :UIAppFonts" "$PLIST"

echo "==> Removing react-native.config.js if present..."
rm -f "$PROJ_DIR/react-native.config.js"

echo "==> Cleaning Xcode build cache..."
rm -rf "$PROJ_DIR/ios/build"

echo ""
echo "Done! Now run:"
echo "  cd $PROJ_DIR && npx react-native run-ios --simulator=\"iPhone 16\""
