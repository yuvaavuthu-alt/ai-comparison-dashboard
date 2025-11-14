# AI Models Comparison Dashboard

A comprehensive comparison dashboard for analyzing AI model capabilities across different platforms, featuring authentic Verizon brand colors and professional design.

## 🎨 Design Features

### Authentic Verizon Brand Colors
- **Primary Red**: `#f50a23`
- **Stone/Tan**: `#f3ede0`
- **Vibrant Yellow**: `#f5ff1e`
- **Coral Accent**: `#ff3c2d`
- **Black & White** supporting colors

### Key Features
- Clean, modern comparison grid layout
- Interactive result cards with hover effects
- Modal popup for detailed analysis
- Responsive design for all screen sizes
- Smooth animations and transitions

## 📁 Directory Structure

```
├── index.html              # Main dashboard page
├── css/
│   └── style.css          # Verizon-branded styles
├── js/
│   └── main.js            # Dashboard logic and interactions
├── data/
│   ├── questions.json     # Question prompts and insights
│   └── details/
│       ├── chatgpt-5-websearch-q1.md
│       ├── gemini-25-websearch-q1.md
│       └── ... (detailed analysis markdown files)
└── README.md
```

## 🚀 Getting Started

### Local Development

1. Navigate to the project directory:
```bash
cd "/Users/yuvaraj/Desktop/projects/verizon/AgentPaymentProtocol/AI Agents Comparision"
```

2. Start a local web server:
```bash
python3 -m http.server 8080
```

3. Open your browser and visit:
```
http://localhost:8080/index.html
```

### Updating Content

#### Adding Questions
Edit `data/questions.json` to add new questions and insights:
```json
{
  "questions": [
    {
      "text": "Your question here",
      "chatgpt5": { "websearch": [...], ... },
      "gemini25": { "websearch": [...], ... },
      "perplexity": { "search": [...], ... },
      "verizonai": { "search": [...] }
    }
  ]
}
```

#### Adding Detailed Analysis
Create markdown files in `data/details/` following this naming convention:
```
{model}-{mode}-q{number}.md
```

Example: `chatgpt-5-websearch-q1.md`

## 🎯 AI Models Covered

1. **ChatGPT-5**
   - Web Search
   - Deep Research
   - Agent

2. **Gemini 2.5 Pro**
   - Web Search
   - Deep Research

3. **Perplexity**
   - Search
   - Research
   - Labs
   - Learn
   - Comet Browser

4. **Verizon AI**
   - Search

## 🔧 Technology Stack

- Pure HTML5, CSS3, and JavaScript
- [Marked.js](https://marked.js.org/) for markdown parsing
- Google Fonts (Inter family)
- No build process required

## 📝 Notes

- The dashboard loads data dynamically from `questions.json`
- Click any result card to view detailed analysis in a modal
- All styling uses Verizon brand guidelines
- Responsive design works on mobile, tablet, and desktop
