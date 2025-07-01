# ShopGuard Chatbot Documentation

This directory contains the complete documentation for the ShopGuard AI chatbot project, structured for easy building with MkDocs or Read the Docs.

## 📖 Documentation Structure

The documentation is organized into the following sections:

### 🚀 Getting Started
- **[Overview](getting-started/overview.md)** - Project introduction and goals
- **[Environment Setup](getting-started/environment-setup.md)** - Development environment configuration
- **[Quick Start](getting-started/quick-start.md)** - Get up and running quickly

### 💻 Development Guide
- **[Architecture](development/architecture.md)** - System architecture and design patterns
- **UI Design** - Interface design principles and components
- **Core Features** - Implementation of key functionality  
- **Frontend** - Quick App frontend development
- **Performance** - Optimization strategies and best practices

### 📚 API Reference
- **[Overview](api/overview.md)** - API architecture and integration patterns
- **[Backend API](api/backend.md)** - Complete backend API reference
- **[OpenAI Compatibility](api/openai-compatibility.md)** - OpenAI API compatibility layer
- **[Examples](api/examples.md)** - Practical usage examples

### 🚢 Deployment
- **Build & Package** - Building for production
- **Production Deployment** - Production deployment strategies
- **Monitoring** - Monitoring and observability

### 📖 Tutorials
- **Basic Chat** - Step-by-step chat implementation
- **Advanced Features** - Implementing advanced functionality
- **Customization** - Customizing the chatbot

### 📋 Reference
- **[FAQ](reference/faq.md)** - Frequently asked questions
- **Troubleshooting** - Common issues and solutions
- **Best Practices** - Development and deployment best practices

## 🛠️ Building the Documentation

### Prerequisites

Install the required dependencies:

```bash
pip install -r requirements-docs.txt
```

### Local Development

Start the development server:

```bash
mkdocs serve
```

The documentation will be available at `http://localhost:8000` with live reloading.

### Building Static Site

Build the static documentation:

```bash
mkdocs build
```

The built documentation will be in the `site/` directory.

### Deployment

#### Read the Docs

1. Connect your GitHub repository to Read the Docs
2. The documentation will build automatically using `mkdocs.yml`
3. Configure the Python environment to use `requirements-docs.txt`

#### GitHub Pages

Deploy to GitHub Pages:

```bash
mkdocs gh-deploy
```

#### Manual Deployment

Build and deploy the `site/` directory to any web server.

## 📝 Writing Documentation

### Markdown Files

- Use standard Markdown syntax
- Follow the existing structure and style
- Include code examples where appropriate
- Add diagrams using Mermaid syntax

### Images and Assets

Place images in the `assets/` directory and reference them using relative paths:

```markdown
![Description](../assets/image-name.png)
```

### Code Examples

Use syntax highlighting for code blocks:

````markdown
```python
def example_function():
    return "Hello, World!"
```
````

### Admonitions

Use Material theme admonitions for important information:

```markdown
!!! tip "Helpful Tip"
    This is a helpful tip for users.

!!! warning "Important Warning"
    This is something users should be careful about.

!!! note "Additional Information"
    This provides additional context.
```

## 🎨 Customization

### Theme Configuration

The documentation uses Material for MkDocs theme. Customize in `mkdocs.yml`:

- **Colors**: Modify the `palette` section
- **Navigation**: Update the `nav` section
- **Features**: Enable/disable features in `theme.features`
- **Extensions**: Add Markdown extensions in `markdown_extensions`

### Custom CSS

Add custom styles in `docs/assets/extra.css` and reference in `mkdocs.yml`:

```yaml
extra_css:
  - assets/extra.css
```

### Custom JavaScript

Add custom JavaScript in `docs/assets/extra.js` and reference in `mkdocs.yml`:

```yaml
extra_javascript:
  - assets/extra.js
```

## 🔧 Configuration

### MkDocs Configuration

The main configuration is in `mkdocs.yml`:

- **Site metadata**: Title, description, author
- **Theme settings**: Material theme configuration
- **Navigation structure**: Page organization
- **Extensions**: Markdown processing extensions
- **Plugins**: Additional functionality

### Environment Variables

For Read the Docs deployment, set these environment variables:

```bash
READTHEDOCS=True
READTHEDOCS_VERSION=latest
```

## 📊 Analytics and Monitoring

### Google Analytics

Add Google Analytics tracking in `mkdocs.yml`:

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Search

The documentation includes search functionality powered by MkDocs search plugin.

## 🤝 Contributing to Documentation

### Guidelines

1. **Follow the structure**: Use the established organization
2. **Be clear and concise**: Write for your audience
3. **Include examples**: Provide practical code examples
4. **Test your changes**: Build locally before submitting
5. **Update navigation**: Add new pages to `mkdocs.yml`

### Submitting Changes

1. Fork the repository
2. Create a new branch for your changes
3. Make your documentation updates
4. Test locally with `mkdocs serve`
5. Submit a pull request

### Style Guide

- **Headers**: Use sentence case for headers
- **Code**: Use code blocks for all code examples
- **Links**: Use descriptive link text
- **Images**: Include alt text for accessibility
- **Language**: Use clear, professional language

## 🆘 Support

If you need help with the documentation:

- **Issues**: Report documentation issues on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Pull Requests**: Suggest improvements via PR
- **Community**: Join our community channels

## 📄 License

This documentation is part of the ShopGuard project and is licensed under the same terms as the main project.

---

*Last updated: December 2024*
