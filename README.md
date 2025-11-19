# AI Models Comparison Dashboard

A simple, interactive dashboard to compare AI model capabilities (ChatGPT, Gemini, Perplexity, Verizon AI) side-by-side. It features a unique **Generative Engine Optimization (GEO)** analysis tool to score content based on how well it is structured for AI.

## ✨ Features

- **Compare AI Models**: Side-by-side view of ChatGPT-5.1, Gemini 2.5, Perplexity, and Verizon AI.
- **GEO Analysis Scorecard**: Automatically scores content (0-100) based on structure, keywords, and readability.
- **Interactive UI**: Tab-based navigation for different questions.
- **Detailed Insights**: Click any result to see the full markdown response and its GEO score.

## 🚀 Quick Start

1. **Clone the repo**:
   ```bash
   git clone https://github.com/yuvaavuthu-alt/ai-comparison-dashboard.git
   cd ai-comparison-dashboard
   ```

2. **Start a local server** (using Python):
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in browser**:
   Go to `http://localhost:8080`

## 📊 Generative Engine Optimization (GEO)

This project includes a custom Python script that analyzes markdown content to determine how "AI-friendly" it is.

### How it works:
- **Scoring (0-100)**: Based on header usage, bullet points, bold text, and keyword density.
- **Metrics**: Tracks word count, average sentence length, and key terms (e.g., "Verizon", "5G").
- **Smart Detection**: Identifies implicit lists and headers even if standard markdown isn't used.

### Running the Analysis:
If you add new markdown files to `data/details/`, run this script to update the scores:

```bash
python3 analyze_geo.py
```

This generates `data/geo_analysis.json`, which the UI reads to display the scorecards.

## 📁 Project Structure

```
├── index.html              # Main dashboard
├── analyze_geo.py          # Python script for GEO analysis
├── css/
│   └── style.css           # Styles
├── js/
│   └── main.js             # Logic (UI + GEO rendering)
├── data/
│   ├── questions.json      # Questions configuration
│   ├── geo_analysis.json   # Generated analysis data
│   └── details/            # Markdown files with AI responses
└── README.md
```

## 📝 Adding New Content

1. **Add Question**: Update `data/questions.json`.
2. **Add Response**: Create a markdown file in `data/details/` (e.g., `chatgpt-5-1-agent-q1.md`).
3. **Update Scores**: Run `python3 analyze_geo.py`.
