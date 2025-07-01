# FAQ - Frequently Asked Questions

This page addresses common questions about ShopGuard chatbot development and usage.

## General Questions

### What is ShopGuard?

ShopGuard is an AI-powered chatbot designed to help users identify online shopping fraud and scams. It's built using the Quick App framework and powered by vivo BlueLM AI model.

### Why use Quick App instead of native development?

Quick App offers several advantages:
- **No installation required**: Users can access instantly without downloading
- **Web technology familiarity**: Uses HTML, CSS, JavaScript that developers already know
- **Cross-platform compatibility**: Works across different Quick App platforms
- **Easy development**: Lower barrier to entry compared to native app development
- **Fast deployment**: Simplified distribution and update process

### Is ShopGuard free to use?

The open-source version of ShopGuard is free to use and modify. However, you'll need:
- API access to vivo BlueLM (may have costs)
- Hosting for the backend service
- Optional: Premium features or support

## Technical Questions

### What are the system requirements?

**For Development:**
- Node.js 12.0+
- Quick App IDE
- Python 3.8+ (for backend)
- 4GB RAM minimum, 8GB recommended

**For Users:**
- Quick App runtime installed
- Android 6.0+ or iOS 10.0+
- Internet connection for AI features

### Can I use a different AI model?

Yes! The architecture is designed to be model-agnostic. You can integrate:
- OpenAI GPT models
- Claude (Anthropic)
- Local models via Ollama
- Other vivo BlueLM variants

Simply modify the API client configuration in the backend.

### How accurate is the fraud detection?

Fraud detection accuracy depends on several factors:
- **Training data quality**: Better data = better detection
- **Model capabilities**: vivo BlueLM provides strong analytical capabilities
- **Knowledge base**: RAG system enhances accuracy with real fraud cases
- **Continuous learning**: System improves with more data

Typical accuracy ranges from 80-95% depending on fraud type and context.

### Can I customize the UI?

Absolutely! The UI is built with standard web technologies:
- Modify styles in `src/common/styles/`
- Update colors, fonts, layouts
- Add custom components
- Implement different themes
- Responsive design modifications

## Development Questions

### How do I get started with development?

1. **Follow the setup guide**: Complete [Environment Setup](../getting-started/environment-setup.md)
2. **Clone the repository**: Get the source code
3. **Run the quick start**: Follow [Quick Start Guide](../getting-started/quick-start.md)
4. **Read the documentation**: Explore [Development Guide](../development/architecture.md)

### What if I encounter build errors?

Common solutions:
1. **Clear cache**: Delete `node_modules` and reinstall
2. **Check Node.js version**: Ensure 12.0+ is installed
3. **Verify manifest.json**: Check syntax and required fields
4. **Update dependencies**: Run `npm update`
5. **Check console logs**: Look for specific error messages

### How do I add new features?

1. **Plan the feature**: Define requirements and user stories
2. **Design the architecture**: Plan component structure
3. **Implement frontend**: Add UI components and logic
4. **Implement backend**: Add API endpoints if needed
5. **Test thoroughly**: Unit tests, integration tests, user testing
6. **Document changes**: Update documentation

### Can I contribute to the project?

Yes! We welcome contributions:
- **Bug reports**: Submit issues on GitHub
- **Feature requests**: Propose new features
- **Code contributions**: Submit pull requests
- **Documentation**: Improve documentation
- **Testing**: Help with testing and quality assurance

## Deployment Questions

### How do I deploy ShopGuard?

**Frontend Deployment:**
1. Build the Quick App package
2. Sign with your developer certificate
3. Submit to Quick App stores
4. Or distribute via QR code for testing

**Backend Deployment:**
1. Choose hosting provider (AWS, Azure, GCP, VPS)
2. Set up Docker container
3. Configure environment variables
4. Set up monitoring and logging
5. Configure SSL/HTTPS

### What hosting options are available?

**Cloud Platforms:**
- AWS (EC2, Lambda, ECS)
- Google Cloud Platform
- Microsoft Azure
- DigitalOcean
- Heroku

**Self-hosted:**
- VPS providers (Linode, Vultr)
- On-premises servers
- Home servers (for development)

### How much does hosting cost?

Costs vary by usage and provider:
- **Development**: $5-20/month (basic VPS)
- **Small scale**: $20-100/month (managed services)
- **Production**: $100-500/month (high availability)
- **Enterprise**: $500+/month (multiple regions, dedicated support)

## Usage Questions

### How do I analyze a shopping link?

1. **Copy the suspicious link**
2. **Paste it into the chat**
3. **Add context**: Describe what you're buying
4. **Ask for analysis**: "Is this deal legitimate?"
5. **Review the assessment**: Check risk level and recommendations

### What types of fraud can ShopGuard detect?

- **Price fraud**: Unrealistic discounts and pricing
- **Fake websites**: Impersonation of legitimate stores
- **Seller fraud**: Untrustworthy merchants
- **Product fraud**: Fake or misrepresented products
- **Payment fraud**: Unsafe payment methods
- **Phishing**: Attempts to steal personal information

### How do I report a false positive/negative?

Help improve the system by reporting:
1. **False positives**: Legitimate deals marked as fraud
2. **False negatives**: Scams not detected
3. **Feedback method**: Use the feedback button in the app
4. **Provide details**: Include URLs, screenshots, context
5. **Follow up**: Check if the issue is resolved in updates

## Troubleshooting

### The app won't start

**Possible causes and solutions:**
- **Check device compatibility**: Ensure Quick App runtime is installed
- **Update runtime**: Install latest Quick App runtime version
- **Clear cache**: Clear app data and cache
- **Restart device**: Sometimes a simple restart helps
- **Check internet connection**: Many features require connectivity

### Messages aren't sending

**Troubleshooting steps:**
1. **Check internet connection**: Ensure stable connectivity
2. **Verify backend status**: Check if API server is running
3. **Check API key**: Ensure valid API key is configured
4. **Check rate limits**: You may have exceeded usage limits
5. **Try again later**: Server may be temporarily unavailable

### Fraud detection seems inaccurate

**Improvement strategies:**
- **Provide more context**: Include product details, seller info
- **Report feedback**: Help train the system
- **Check for updates**: New versions may have improved accuracy
- **Verify information**: Cross-reference with other sources
- **Use additional tools**: Combine with other fraud detection methods

### How do I backup my chat history?

**Backup methods:**
1. **Export feature**: Use built-in export functionality
2. **Cloud sync**: Enable cloud synchronization if available
3. **Manual backup**: Screenshot important conversations
4. **Database backup**: Advanced users can backup local storage

## Performance Questions

### Why is the app slow?

**Common causes:**
- **Poor internet connection**: Slow network affects AI responses
- **Server overload**: High traffic can slow response times
- **Device performance**: Older devices may be slower
- **Large chat history**: Too many messages can slow the app
- **Background apps**: Other apps consuming resources

**Performance optimization:**
- **Clear chat history**: Remove old conversations
- **Close other apps**: Free up device resources
- **Use Wi-Fi**: Faster than mobile data
- **Update app**: Latest version may have optimizations

### How can I make responses faster?

**Speed optimization tips:**
- **Disable unnecessary features**: Turn off web search if not needed
- **Use shorter messages**: Concise queries process faster
- **Clear context**: Remove unnecessary conversation history
- **Local processing**: Some features can work offline
- **Upgrade internet**: Faster connection = faster responses

## Security Questions

### Is my data safe?

**Data protection measures:**
- **Encryption**: All data transmitted securely
- **No storage**: Conversations aren't permanently stored by default
- **Privacy controls**: User controls data sharing
- **Open source**: Code can be audited for security
- **Local processing**: Some features work without sending data

### What data is collected?

**Typical data collection:**
- **Chat messages**: For processing and response generation
- **Usage analytics**: Anonymous usage statistics
- **Error logs**: For debugging and improvement
- **Device info**: Basic device and app version info
- **Performance metrics**: Response times and success rates

**Data not collected:**
- **Personal information**: Unless explicitly provided
- **Financial data**: No payment or banking information
- **Location data**: Unless required for specific features
- **Contacts**: No access to personal contacts

### Can I use ShopGuard offline?

**Offline capabilities:**
- **Basic UI**: Interface works without internet
- **Cached responses**: Some responses may be cached
- **Local storage**: Chat history stored locally
- **Limited functionality**: AI features require internet connection

**Online requirements:**
- **AI responses**: Requires connection to AI model
- **Fraud detection**: Needs access to knowledge base
- **Web search**: Real-time information gathering
- **Updates**: App updates and improvements

## Support Questions

### Where can I get help?

**Support channels:**
- **Documentation**: Start with these docs
- **GitHub Issues**: Report bugs and request features
- **Community Forums**: Discuss with other users
- **Discord/Slack**: Real-time community support
- **Email Support**: For specific technical issues

### How do I report bugs?

**Bug reporting process:**
1. **Check existing issues**: Search for similar problems
2. **Gather information**: Screenshots, error messages, steps to reproduce
3. **Create detailed report**: Use the bug report template
4. **Provide context**: Device info, app version, network conditions
5. **Follow up**: Respond to questions from developers

### How often is ShopGuard updated?

**Update frequency:**
- **Security patches**: As needed (immediately for critical issues)
- **Bug fixes**: Weekly to monthly
- **Feature updates**: Monthly to quarterly
- **Major releases**: Quarterly to biannually

**Update channels:**
- **Automatic updates**: Through Quick App store
- **Beta testing**: Early access to new features
- **GitHub releases**: Development versions
- **Announcement channels**: Stay informed about updates

---

*Don't see your question here? [Submit an issue](https://github.com/your-username/shopguard-chatbot/issues) or reach out through our [community channels](https://github.com/your-username/shopguard-chatbot/discussions).*
