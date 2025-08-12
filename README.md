# BugSafe

A powerful React application that analyzes GitHub Pull Requests using AI to detect bugs, security vulnerabilities, and automatically generate fix suggestions. Built with Vite and powered by ChatAnywhere API for intelligent code analysis.

## 🚀 Features

### **Core Functionality**
- **GitHub PR Analysis**: Parse and fetch PR details from any public or private repository
- **AI-Powered Code Review**: Automatic bug detection and security vulnerability scanning
- **Smart Fix Suggestions**: AI-generated code fixes and prevention tips
- **Professional Reports**: Export comprehensive analysis reports

### **Analysis Types**
- **🐛 Code Quality Analysis**: Detects bugs, logic errors, and bad practices
- **🔒 Security Review**: Identifies security vulnerabilities (XSS, SQL injection, etc.)
- **🔧 Auto Fix Suggestions**: Provides actionable code fixes and best practices

### **User Experience**
- **Clean, Modern UI**: Professional interface with clear visual organization
- **Real-time Progress**: Loading indicators for all analysis operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Options**: Copy to clipboard or download as text file

## 🛠️ Technology Stack

- **Frontend**: React 18+ with Hooks
- **Build Tool**: Vite
- **AI Integration**: ChatAnywhere API (GPT-5-nano)
- **Styling**: CSS with modern design principles
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- GitHub Personal Access Token (for private repos)
- ChatAnywhere API Key (for AI analysis)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BugSafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Keys Setup

### **GitHub Token (Optional but Recommended)**
- Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
- Generate a new token with `repo` scope
- Use for private repositories and higher rate limits (5,000 vs 60 requests/hour)

### **ChatAnywhere API Key (Required for AI Analysis)**
- Visit [ChatAnywhere](https://api.chatanywhere.tech/) to get your API key
- Required for code quality, security analysis, and fix suggestions
- Uses GPT-5-nano model for optimal performance

## 📖 Usage

### **Basic Workflow**

1. **Enter GitHub PR URL**
   ```
   https://github.com/owner/repo/pull/123
   ```

2. **Add API Keys** (if needed)
   - GitHub token for private repos
   - ChatAnywhere API key for AI analysis

3. **Click Submit**
   - Fetches PR details and changed files
   - Shows up to 3 files for analysis

4. **Run Analysis**
   - Click "🐛 Code Quality" for bug detection
   - Click "🔒 Security Review" for vulnerability scanning
   - Fix suggestions generate automatically

5. **Export Results**
   - Copy report to clipboard
   - Download as text file

### **Analysis Results**

The app displays results in organized sections:

- **🐛 Bug Findings**: Code quality issues and logic errors
- **🔒 Security Issues**: Security vulnerabilities and risks
- **🔧 Fix Suggestions & Tips**: AI-generated solutions and best practices

## 📁 Project Structure

```
github-pr-viewer/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Vite entry point
│   └── index.css        # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Available Scripts

- **`npm run dev`**: Start development server
- **`npm run build`**: Build for production
- **`npm run preview`**: Preview production build

## 🌟 Key Features Explained

### **Automatic Fix Suggestions**
After running code quality or security analysis, the app automatically:
- Combines findings from both analyses
- Calls the AI API for fix suggestions
- Displays actionable solutions with prevention tips

### **Smart Error Handling**
- Graceful fallbacks if AI analysis fails
- Clear error messages for debugging
- Continues operation even if some features fail

### **Professional Reporting**
- Structured text format for easy sharing
- Includes all analysis results and suggestions
- Professional formatting for team communication

## 🎯 Use Cases

- **Code Review**: Analyze PRs before merging
- **Security Audits**: Identify vulnerabilities in code changes
- **Team Collaboration**: Share comprehensive analysis reports
- **Learning**: Understand common coding mistakes and fixes
- **Quality Assurance**: Ensure code meets standards

## 🔒 Security & Privacy

- **No data storage**: All analysis happens in real-time
- **API keys**: Stored only in memory during session
- **GitHub integration**: Uses official GitHub API
- **AI processing**: Secure API calls to ChatAnywhere

## 🚧 Limitations

- **Rate Limits**: GitHub API (60/hour unauthenticated, 5,000/hour authenticated)
- **File Limit**: Analyzes up to 3 changed files per PR
- **API Dependencies**: Requires ChatAnywhere API for AI features
- **Browser Support**: Modern browsers with ES6+ support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API keys are correct
3. Ensure the GitHub PR URL is valid
4. Check your API rate limits

## 🔮 Future Enhancements

- [ ] Support for more file types
- [ ] Integration with GitHub Actions
- [ ] Custom analysis rules
- [ ] Team collaboration features
- [ ] Historical analysis tracking
- [ ] Integration with other AI providers

## 🙏 Acknowledgments

- Built with React and Vite
- Powered by ChatAnywhere API
- GitHub API for repository access
- Modern web development practices

---

**Happy Code Reviewing! 🚀**
