# AI Models Comparison Dashboard

A comprehensive, interactive dashboard for comparing AI model capabilities across leading platforms. Analyze performance, features, and insights side-by-side with a modern, responsive interface.

## ✨ Features

- **Interactive Comparison Grid**: Side-by-side comparison of multiple AI platforms
- **Question-Based Navigation**: Switch between different test questions with tab navigation
- **Detailed Analysis**: Click any result card to view comprehensive markdown-formatted analysis
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and hover effects
- **Official Brand Colors**: Authentic color schemes for each AI platform

## 🎨 Supported AI Platforms

### ChatGPT-5
- **Modes**: Web Search, Deep Research, Agent Mode
- **Brand Color**: `#74AA9C` (Official ChatGPT Green)

### Gemini 2.5 Pro
- **Modes**: Web Search, Deep Research
- **Brand Color**: `#078EFA` (Official Gemini Blue)

### Perplexity
- **Modes**: Search, Research, Labs, Learn, Comet Browser
- **Brand Color**: `#1A73E8` (Official Perplexity Blue)


## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (Python, Node.js, or any HTTP server)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yuvaavuthu-alt/ai-comparison-dashboard.git
cd ai-comparison-dashboard
```

2. **Start a local web server**:

   **Using Python 3**:
   ```bash
   python3 -m http.server 8080
   ```

   **Using Python 2**:
   ```bash
   python -m SimpleHTTPServer 8080
   ```

   **Using Node.js** (if you have `http-server` installed):
   ```bash
   npx http-server -p 8080
   ```

3. **Open in your browser**:
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
├── index.html              # Main dashboard HTML
├── css/
│   └── style.css          # Stylesheet with responsive design
├── js/
│   └── main.js            # Dashboard logic and interactions
├── data/
│   ├── questions.json     # Question prompts and AI insights
│   └── details/           # Detailed analysis markdown files
│       ├── chatgpt-5-websearch-q1.md
│       ├── gemini-25-websearch-q1.md
│       ├── perplexity-search-q1.md
│       └── ...
└── README.md
```

## 📝 Adding Content

### Adding New Questions

Edit `data/questions.json` to add new questions:

```json
{
  "questions": [
    {
      "text": "Your question here",
      "chatgpt5": {
        "websearch": ["Insight 1", "Insight 2"],
        "deepresearch": ["Insight 1", "Insight 2"],
        "agent": ["Insight 1", "Insight 2"]
      },
      "gemini25": {
        "websearch": ["Insight 1", "Insight 2"],
        "deepresearch": ["Insight 1", "Insight 2"]
      },
      "perplexity": {
        "search": ["Insight 1", "Insight 2"],
        "research": ["Insight 1", "Insight 2"],
        "labs": ["Insight 1", "Insight 2"],
        "learn": ["Insight 1", "Insight 2"],
        "cometbrowser": ["Insight 1", "Insight 2"]
      },
      "verizonai": {
        "search": ["Insight 1", "Insight 2"]
      }
    }
  ]
}
```

### Adding Detailed Analysis

Create markdown files in `data/details/` following this naming convention:

```
{model}-{mode}-q{number}.md
```

**Examples**:
- `chatgpt-5-websearch-q1.md`
- `gemini-25-deepresearch-q2.md`
- `perplexity-search-q1.md`

The markdown content will be rendered in the modal when users click on result cards.

## 🎯 Usage

1. **Navigate Questions**: Use the Q1, Q2 tabs in the left sidebar header to switch between questions
2. **View Insights**: Each AI platform's row shows key insights for different modes
3. **Detailed Analysis**: Click any mode card to open a modal with comprehensive markdown-formatted analysis
4. **Scroll Results**: Horizontally scroll within each platform's row to see all available modes

## 🔧 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks required
- **Marked.js**: Client-side markdown parsing for detailed analysis
- **Google Fonts**: Inter font family for typography

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available for use and modification.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.
