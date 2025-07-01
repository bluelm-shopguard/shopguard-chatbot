# Environment Setup

This guide will walk you through setting up your development environment for ShopGuard chatbot development using the Quick App framework.

## Prerequisites

Before starting, ensure you have the following:

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Node.js**: Version 12.0 or higher ([Download here](https://nodejs.org/))
- **Git**: For version control ([Download here](https://git-scm.com/))
- **Text Editor**: VS Code recommended ([Download here](https://code.visualstudio.com/))

## Quick App IDE Installation

### Step 1: Download Quick App IDE

1. Visit the [Quick App Official Website](https://www.quickapp.cn/)
2. Navigate to the Developer Tools section
3. Download the IDE installer for your operating system
4. Run the installer and follow the setup wizard

### Step 2: Initial Configuration

After installation, launch the IDE for the first time:

1. **SDK Download**: The IDE will automatically download necessary SDKs
2. **Emulator Setup**: Install the Quick App emulator for testing
3. **Account Setup**: Create or sign in to your developer account

!!! tip "Network Requirements"
    The initial setup requires a stable internet connection as it downloads several GB of development tools and resources.

## Node.js Setup

### Installation

1. Download Node.js LTS version from [nodejs.org](https://nodejs.org/)
2. Install using the downloaded installer
3. Verify installation by opening terminal/command prompt and running:

```bash
node --version
npm --version
```

### Global Package Installation

Install commonly used global packages:

```bash
# Quick App CLI tools (if available)
npm install -g quickapp-cli

# Development utilities
npm install -g http-server
npm install -g live-server
```

## Development Tools Configuration

### VS Code Extensions

If using VS Code as your primary editor, install these helpful extensions:

- **Quick App Support**: Syntax highlighting and IntelliSense
- **JavaScript (ES6) Snippets**: Code snippets for faster development
- **Auto Rename Tag**: Automatically rename paired HTML tags
- **Bracket Pair Colorizer**: Visual bracket matching
- **GitLens**: Enhanced Git capabilities

### Git Configuration

Set up Git with your information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Project Structure Setup

### Directory Organization

Create a workspace directory for your projects:

```bash
mkdir ~/quickapp-projects
cd ~/quickapp-projects
```

### Environment Variables

Add these environment variables to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent):

```bash
# Quick App Development
export QUICKAPP_SDK_PATH="/path/to/quickapp/sdk"
export PATH="$PATH:$QUICKAPP_SDK_PATH/tools"
```

## Backend Environment (Optional)

If you plan to run the ShopGuard backend locally:

### Python Environment

1. Install Python 3.8+ ([Download here](https://python.org/))
2. Create a virtual environment:

```bash
python -m venv shopguard-backend
source shopguard-backend/bin/activate  # On Windows: shopguard-backend\Scripts\activate
```

3. Install required packages:

```bash
pip install fastapi uvicorn openai requests python-multipart
```

### API Key Configuration

Set up environment variables for API keys:

```bash
# Add to your shell profile
export VIVO_API_KEY="your-vivo-api-key"
export OPENAI_API_KEY="your-openai-api-key-if-needed"
```

## Testing Your Setup

### Create a Test Project

1. Open Quick App IDE
2. Create a new project:
   - Project Name: `test-setup`
   - Package Name: `com.test.setup`
   - Template: Basic Template

3. Build and run the project:
   - Click the "Build" button
   - Launch in emulator or preview mode

### Verify Development Server

Test that you can serve files locally:

```bash
# Navigate to any directory with HTML files
cd ~/quickapp-projects/test-setup
http-server -p 8080
```

Visit `http://localhost:8080` to ensure the server works.

## Common Issues and Solutions

### IDE Won't Start

**Problem**: Quick App IDE fails to launch or crashes on startup.

**Solutions**:
- Check system requirements (RAM, OS version)
- Disable antivirus temporarily during installation
- Run IDE as administrator/root
- Clear IDE cache and preferences

### Build Errors

**Problem**: Project fails to build with cryptic error messages.

**Solutions**:
- Ensure Node.js version compatibility (12.0+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check project path for special characters or spaces

### Emulator Issues

**Problem**: Emulator won't start or displays blank screen.

**Solutions**:
- Update graphics drivers
- Enable hardware acceleration if available
- Try different emulator images
- Use physical device for testing

### Network Connectivity

**Problem**: Cannot download SDKs or packages during setup.

**Solutions**:
- Configure proxy settings if behind corporate firewall
- Use mobile hotspot as alternative internet source
- Download packages manually and install offline
- Check DNS settings and try Google DNS (8.8.8.8)

## Next Steps

Once your environment is set up:

1. **[Quick Start Guide](quick-start.md)**: Create your first ShopGuard chatbot
2. **[Architecture Overview](../development/architecture.md)**: Understand the system design
3. **[UI Development](../development/ui-design.md)**: Learn about interface design patterns

## Development Workflow

### Recommended Daily Workflow

1. **Start Development**:
   - Open Quick App IDE
   - Start development server
   - Open browser for testing

2. **Code and Test**:
   - Make changes in your preferred editor
   - Auto-reload in browser/emulator
   - Test on multiple devices/screen sizes

3. **Version Control**:
   - Commit changes regularly
   - Use meaningful commit messages
   - Push to remote repository

4. **End of Day**:
   - Build and test final version
   - Update documentation if needed
   - Plan next day's tasks

This workflow ensures consistent development practices and reduces the likelihood of issues during development.
