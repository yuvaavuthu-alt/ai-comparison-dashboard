// Load questions data
async function loadData() {
  try {
      const response = await fetch('data/questions.json');
      const data = await response.json();
      renderDashboard(data);
  } catch (error) {
      console.error('Error loading data:', error);
  }
}

// Render dashboard with questions and insights
function renderDashboard(data) {
  const dataRowsContainer = document.getElementById('data-rows');
  
  data.questions.forEach((question, qIndex) => {
      const row = document.createElement('div');
      row.className = 'data-row';
      
      // Question cell
      const questionCell = document.createElement('div');
      questionCell.className = 'question-cell';
      questionCell.textContent = question.text;
      row.appendChild(questionCell);
      
      // ChatGPT-5 data
      const chatgptData = document.createElement('div');
      chatgptData.className = 'model-data';
      chatgptData.innerHTML = `
          ${createInsightCard('chatgpt-5', 'websearch', qIndex + 1, question.chatgpt5.websearch)}
          ${createInsightCard('chatgpt-5', 'deepresearch', qIndex + 1, question.chatgpt5.deepresearch)}
          ${createInsightCard('chatgpt-5', 'agent', qIndex + 1, question.chatgpt5.agent)}
      `;
      row.appendChild(chatgptData);
      
      // Gemini 2.5 Pro data
      const geminiData = document.createElement('div');
      geminiData.className = 'model-data';
      geminiData.innerHTML = `
          ${createInsightCard('gemini-25', 'websearch', qIndex + 1, question.gemini25.websearch)}
          ${createInsightCard('gemini-25', 'deepresearch', qIndex + 1, question.gemini25.deepresearch)}
      `;
      row.appendChild(geminiData);
      
      // Perplexity data
      const perplexityData = document.createElement('div');
      perplexityData.className = 'model-data';
      perplexityData.innerHTML = `
          ${createInsightCard('perplexity', 'search', qIndex + 1, question.perplexity.search)}
          ${createInsightCard('perplexity', 'research', qIndex + 1, question.perplexity.research)}
          ${createInsightCard('perplexity', 'labs', qIndex + 1, question.perplexity.labs)}
          ${createInsightCard('perplexity', 'learn', qIndex + 1, question.perplexity.learn)}
          ${createInsightCard('perplexity', 'cometbrowser', qIndex + 1, question.perplexity.cometbrowser)}
      `;
      row.appendChild(perplexityData);
      
      // Verizon AI data
      const verizonData = document.createElement('div');
      verizonData.className = 'model-data';
      verizonData.innerHTML = `
          ${createInsightCard('verizon-ai', 'search', qIndex + 1, question.verizonai.search)}
      `;
      row.appendChild(verizonData);
      
      dataRowsContainer.appendChild(row);
  });
  
  // Add click event listeners
  document.querySelectorAll('.insight-card').forEach(card => {
      card.addEventListener('click', function() {
          const model = this.dataset.model;
          const feature = this.dataset.feature;
          const question = this.dataset.question;
          loadDetailedView(model, feature, question);
      });
  });
}

// Create insight card HTML
function createInsightCard(model, feature, questionNum, insights) {
  const bulletPoints = insights.map(insight => `<li>${insight}</li>`).join('');
  return `
      <div class="insight-card" data-model="${model}" data-feature="${feature}" data-question="q${questionNum}">
          <ul>${bulletPoints}</ul>
          <div class="click-hint">Click for details</div>
      </div>
  `;
}

// Load detailed view in modal
async function loadDetailedView(model, feature, question) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  try {
      const response = await fetch(`data/details/${model}-${feature}-${question}.md`);
      const markdownText = await response.text();
      
      // Convert markdown to HTML
      modalBody.innerHTML = marked.parse(markdownText);
      modal.style.display = 'block';
  } catch (error) {
      modalBody.innerHTML = `<h2>Details</h2><p>Content not found for ${model} - ${feature} - ${question}</p>`;
      modal.style.display = 'block';
  }
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close');
  
  closeBtn.onclick = function() {
      modal.style.display = 'none';
  }
  
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
  
  // Load data on page load
  loadData();
});
