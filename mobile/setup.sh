#!/bin/bash
set -e

# Servly Mobile - iOS Setup Script
# Run this on your Mac to initialize the React Native iOS project.
#
# Prerequisites:
#   - macOS with Xcode 15+ installed
#   - Node.js 18+
#   - Ruby (comes with macOS)
#   - CocoaPods: gem install cocoapods
#
# Usage:
#   cd mobile
#   chmod +x setup.sh
#   ./setup.sh

echo "=== Servly Mobile Setup ==="
echo ""

# Step 1: Install JS dependencies
echo "[1/4] Installing node dependencies..."
npm install

# Step 2: Initialize React Native native projects
echo "[2/4] Initializing React Native native project..."
TEMP_DIR=$(mktemp -d)
npx @react-native-community/cli init ServlyMobile --directory "$TEMP_DIR/ServlyMobile" --skip-install --version 0.76.6

# Step 3: Copy iOS project files
echo "[3/4] Copying iOS project..."
cp -r "$TEMP_DIR/ServlyMobile/ios" ./ios

# Update the Podfile for our dependencies
cat > ./ios/Podfile << 'PODFILE'
# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'ServlyMobile' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end
end
PODFILE

# Step 4: Register Ionicons font in Info.plist
echo "[4/5] Registering Ionicons font in Info.plist..."
/usr/libexec/PlistBuddy -c "Delete :UIAppFonts" ./ios/ServlyMobile/Info.plist 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :UIAppFonts array" ./ios/ServlyMobile/Info.plist
/usr/libexec/PlistBuddy -c "Add :UIAppFonts:0 string Ionicons.ttf" ./ios/ServlyMobile/Info.plist

# Step 5: Install CocoaPods
echo "[5/5] Installing CocoaPods dependencies..."
cd ios
pod install
cd ..

# Cleanup temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To run on iOS Simulator:"
echo "  npm run ios"
echo ""
echo "To run on a specific simulator:"
echo "  npm run ios:sim"
echo ""
echo "To open in Xcode:"
echo "  open ios/ServlyMobile.xcworkspace"
echo ""
