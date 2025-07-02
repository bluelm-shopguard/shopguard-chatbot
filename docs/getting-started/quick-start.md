# Quick Start Guide

Get your ShopGuard chatbot up and running in minutes with this step-by-step guide.

## Prerequisites Checklist

Before starting, ensure you have completed the [Environment Setup](environment-setup.md):

- ✅ Quick App IDE installed and configured
- ✅ Node.js 12.0+ installed
- ✅ Development environment tested
- ✅ Git configured (optional but recommended)

## Step 1: Clone the Repository

Clone the ShopGuard chatbot repository to your local machine:

```bash
git clone https://github.com/bluelm-shopguard/shopguard-chatbot.git
cd shopguard-chatbot
```

Alternatively, download the ZIP file from GitHub and extract it.

## Step 2: Project Structure Overview

Familiarize yourself with the project structure:

```
shopguard-chatbot/
├── src/                    # Source code
│   ├── app.ux             # Main application entry
│   ├── manifest.json      # App configuration
│   ├── pages/             # Application pages
│   │   ├── chat.ux        # Main chat interface
│   │   ├── settings.ux    # Settings page
│   │   └── about.ux       # About page
│   ├── components/        # Reusable components
│   ├── common/            # Shared resources
│   │   ├── images/        # Image assets
│   │   ├── styles/        # CSS stylesheets
│   │   └── utils/         # Utility functions
│   └── data/              # Configuration data
├── docs/                  # Documentation
├── package.json           # Dependencies
└── README.md             # Project information
```

## Step 3: Open in Quick App IDE

1. Launch Quick App IDE
2. Click "Open Project" or "Import Project"
3. Navigate to the `shopguard-chatbot` directory
4. Select the project folder and click "Open"

The IDE will automatically detect the project type and load the configuration.

## Step 4: Install Dependencies

If the project uses npm dependencies, install them:

```bash
npm install
```

!!! note "Dependencies"
    The basic Quick App project may not require external dependencies, but some advanced features might need additional packages.

## Step 5: Configure the Application

### Update Manifest Configuration

Open `src/manifest.json` and customize the basic information:

```json
{
  "package": "com.yourcompany.shopguard",
  "name": "ShopGuard AI",
  "versionName": "1.0.0",
  "versionCode": 1,
  "minPlatformVersion": 1070,
  "icon": "/common/images/logo.jpeg",
  "features": [
    { "name": "system.network" },
    { "name": "system.storage" },
    { "name": "system.device" }
  ],
  "permissions": [
    { "origin": "*" }
  ],
  "config": {
    "logLevel": "debug"
  }
}
```

### Configure API Settings

Update the API configuration in `src/data/system-settings.js`:

```javascript
export default {
  // Backend API configuration
  apiConfig: {
    baseURL: 'http://localhost:8000',  // Change to your backend URL
    timeout: 30000,
    apiKey: 'your-api-key-here'
  },
  
  // Chat settings
  chatConfig: {
    maxMessages: 100,
    autoSave: true,
    typingIndicator: true
  },
  
  // UI settings
  uiConfig: {
    theme: 'light',
    animations: true,
    soundEnabled: false
  }
}
```

## Step 6: Build and Run

### Build the Project

In the Quick App IDE:

1. Click the "Build" button in the toolbar
2. Wait for the build process to complete
3. Check the output panel for any errors

Alternatively, use the command line if CLI tools are available:

```bash
quickapp build
```

### Preview in Emulator

1. In the IDE, click "Preview" or "Run"
2. Select the emulator/simulator option
3. The app will launch in the emulator

### Test on Device

For testing on a physical device:

1. Enable developer mode on your device
2. Connect device via USB or scan QR code
3. Install the Quick App runtime if not already installed
4. Launch the app through the runtime

## Step 7: Test Basic Functionality

### Chat Interface Test

1. Open the app in emulator or device
2. Type a test message: "Hello, can you help me check if this deal is legitimate?"
3. Verify the UI responds appropriately
4. Test the message input and send functionality

### Navigation Test

1. Test the sidebar menu
2. Navigate to different pages (Settings, About)
3. Verify smooth transitions and animations
4. Test the back button functionality

## Step 8: Connect to Backend (Optional)

If you want to test with a live backend:

### Start the Backend Server

```bash
# Navigate to backend directory (if separate)
cd backend/

# Install Python dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### Update Frontend Configuration

Modify `src/data/system-settings.js` to point to your running backend:

```javascript
apiConfig: {
  baseURL: 'http://localhost:8000',  // Your backend URL
  // ... other settings
}
```

### Test API Integration

1. Send a test message in the chat
2. Verify the message is sent to the backend
3. Check that responses are received and displayed
4. Test error handling for network issues

## Common Issues and Solutions

### Build Fails

**Issue**: Build process fails with errors.

**Solutions**:
- Check `manifest.json` syntax
- Verify all required files are present
- Clear build cache and rebuild
- Check console for specific error messages

### App Won't Start

**Issue**: App launches but shows blank screen or crashes.

**Solutions**:
- Check JavaScript console for errors
- Verify entry page is correctly configured
- Test with minimal configuration first
- Check device compatibility

### Network Requests Fail

**Issue**: API calls don't work or return errors.

**Solutions**:
- Verify network permissions in manifest
- Check CORS configuration on backend
- Test API endpoints with curl or Postman
- Verify SSL/HTTPS configuration

### Styling Issues

**Issue**: UI doesn't look as expected.

**Solutions**:
- Check CSS syntax and selectors
- Verify image paths are correct
- Test on different screen sizes
- Clear app cache and reload

## Next Steps

Now that you have a running ShopGuard chatbot:

### 1. Customize the Interface
- Modify colors and themes in `common/styles/`
- Update logos and images in `common/images/`
- Adjust layout and spacing

### 2. Add Features
- Implement additional chat commands
- Add user authentication
- Integrate more AI capabilities
- Enhance fraud detection logic

### 3. Learn More
- **[UI Design Guide](../development/ui-design.md)**: Create beautiful interfaces
- **[Core Features](../development/core-features.md)**: Implement advanced functionality
- **[API Integration](../api/overview.md)**: Connect with backend services

### 4. Deploy and Share
- **[Build for Production](../deployment/build.md)**: Prepare for release
- **[Deployment Guide](../deployment/production.md)**: Deploy to production

## Development Tips

### Hot Reload

Enable hot reload for faster development:
- Most changes to `.ux` files will auto-reload
- Changes to `manifest.json` require a full rebuild
- CSS changes usually reflect immediately

### Debugging

Use these debugging techniques:
- Check JavaScript console in emulator
- Add `console.log()` statements in your code
- Use the IDE's debugger features
- Test on multiple devices and screen sizes

### Performance

Keep these performance tips in mind:
- Optimize images (use WebP when possible)
- Minimize JavaScript bundle size
- Use lazy loading for non-critical resources
- Test on lower-end devices

Congratulations! You now have a working ShopGuard chatbot. The next sections will help you customize and enhance it further.
