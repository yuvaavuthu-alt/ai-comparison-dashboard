let currentQuestionIndex = 0;
let questionsData = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data/questions.json?v=' + Date.now());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const jsonText = await response.text();
        console.log('JSON received, length:', jsonText.length);
        questionsData = JSON.parse(jsonText);
        
        // Validate data structure
        if (!questionsData || !questionsData.questions || !Array.isArray(questionsData.questions)) {
            throw new Error('Invalid data structure - missing questions array');
        }
        if (questionsData.questions.length === 0) {
            throw new Error('No questions found in data');
        }
        console.log('Loaded', questionsData.questions.length, 'questions');
        
        renderDashboard();
        setupNavigation();
        setupModal();
        
        // Set up MutationObserver after initial render
        setTimeout(() => {
            const container = document.querySelector('.comparison-table');
            if (container) {
                observer.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            }
        }, 1000);
    } catch (error) {
        console.error('Error loading data:', error);
        console.error('Error details:', error.message);
        showError(error.message);
    }
});

// Render the dashboard
function renderDashboard() {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.innerHTML = '';
    
    questionsData.questions.forEach((q, index) => {
        const column = createQuestionColumn(q, index + 1);
        wrapper.appendChild(column);
    });
    
    renderQuestionTabs();
    
    // Wait for DOM to be fully updated, then sync multiple times
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            syncRowHeights();
            // Additional syncs to catch any delayed rendering
            setTimeout(() => syncRowHeights(), 50);
            setTimeout(() => syncRowHeights(), 150);
            setTimeout(() => syncRowHeights(), 300);
            setTimeout(() => syncRowHeights(), 500);
        });
    });
}

// Render question navigation tabs
function renderQuestionTabs() {
    const tabsContainer = document.getElementById('questionTabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    
    questionsData.questions.forEach((q, index) => {
        const tab = document.createElement('button');
        tab.className = `question-tab ${index === currentQuestionIndex ? 'active' : ''}`;
        tab.textContent = `Q${index + 1}`;
        tab.onclick = () => navigateToQuestion(index);
        tabsContainer.appendChild(tab);
    });
}

// Create a question column
function createQuestionColumn(question, qNum) {
    const column = document.createElement('div');
    column.className = 'question-column';
    
    // Question header
    const header = document.createElement('div');
    header.className = 'question-header';
    header.innerHTML = `
        <p class="question-text">${question.text}</p>
        <div class="question-number">${qNum}</div>
    `;
    column.appendChild(header);
    
    // ChatGPT row
    column.appendChild(createResultRow('chatgpt-result', [
        { mode: 'Web Search', insights: question.chatgpt51.websearch, slug: 'websearch' },
        { mode: 'Deep Research', insights: question.chatgpt51.deepresearch, slug: 'deepresearch' },
        { mode: 'Agent', insights: question.chatgpt51.agent, slug: 'agent' }
    ], 'chatgpt-5-1', qNum));
    
    // Gemini row
    column.appendChild(createResultRow('gemini-result', [
        { mode: 'Web Search', insights: question.gemini25.websearch, slug: 'websearch' },
        { mode: 'Deep Research', insights: question.gemini25.deepresearch, slug: 'deepresearch' }
    ], 'gemini-25', qNum));
    
    // Perplexity row
    column.appendChild(createResultRow('perplexity-result', [
        { mode: 'Search', insights: question.perplexity.search, slug: 'search' },
        { mode: 'Research', insights: question.perplexity.research, slug: 'research' }
    ], 'perplexity', qNum));
    
    // Verizon AI row
    column.appendChild(createResultRow('verizon-result', [
        { mode: 'Search', insights: question.verizonai.search, slug: 'search' }
    ], 'verizon-ai', qNum));
    
    return column;
}

// Create result row
function createResultRow(className, modes, model, qNum) {
    const row = document.createElement('div');
    row.className = `result-row ${className}`;
    
    const modesContainer = document.createElement('div');
    modesContainer.className = 'result-modes';
    
    modes.forEach(({ mode, insights, slug }) => {
        // Skip if insights is undefined or not an array
        if (!insights || !Array.isArray(insights)) {
            console.warn(`Missing insights for ${model} - ${slug}`);
            return;
        }
        
        const modeResult = document.createElement('div');
        modeResult.className = 'mode-result';
        modeResult.onclick = () => openModal(model, slug, qNum);
        
        modeResult.innerHTML = `
            <div class="mode-name">${mode}</div>
            <ul class="insights-list">
                ${insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        `;
        
        modesContainer.appendChild(modeResult);
    });
    
    row.appendChild(modesContainer);
    return row;
}

// Setup navigation
function setupNavigation() {
    // Navigation is now handled by question tabs
}

// Navigate to specific question
function navigateToQuestion(index) {
    if (index >= 0 && index < questionsData.questions.length) {
        currentQuestionIndex = index;
        const wrapper = document.getElementById('questionsWrapper');
        const offset = -currentQuestionIndex * 100;
        wrapper.style.transform = `translateX(${offset}%)`;
        
        renderQuestionTabs();
        
        // Sync after transition completes
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                syncRowHeights();
                setTimeout(() => syncRowHeights(), 100);
            });
        });
    }
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('detailModal');
    const closeBtn = document.getElementById('closeModal');
    
    closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Open modal
async function openModal(model, mode, qNum) {
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');

    // Build the expected file name and URL
    const fileName = `${model}-${mode}-q${qNum}.md`;
    const url = `./data/details/${fileName}?v=${Date.now()}`; // cache-buster

    title.textContent = `${formatModelName(model)} - ${formatModeName(mode)}`;
    content.innerHTML = '<p style="text-align: center; padding: 60px; color: #a3a3a3;">Loading...</p>';

    // Show the modal
    modal.classList.add('active');

    try {
        console.log('Loading markdown file:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Content not found: ${fileName} (status ${response.status})`);
        }

        const markdown = await response.text();

        // Make sure marked is available
        if (typeof marked === 'undefined') {
            throw new Error('The "marked" library is not loaded. Check the <script> tag in index.html.');
        }

        content.innerHTML = marked.parse(markdown);
    } catch (error) {
        console.error('Error loading detail content:', error);

        content.innerHTML = `
            <h2>Content Not Available</h2>
            <p>We tried to load: <code>${fileName}</code></p>
            <p style="color:#737373;font-size:0.9em;margin-top:8px;">
                ${error.message}
            </p>
        `;
    }
}

// Close modal
function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Format model name
function formatModelName(model) {
    const names = {
        'chatgpt-5-1': 'ChatGPT-5.1',
        'gemini-25': 'Gemini 2.5 Pro',
        'perplexity': 'Perplexity Comet',
        'verizon-ai': 'Verizon AI'
    };
    return names[model] || model;
}

// Format mode name
function formatModeName(mode) {
    const modes = {
        'websearch': 'Web Search',
        'deepresearch': 'Deep Research',
        'agent': 'Agent Mode',
        'search': 'Search',
        'research': 'Research',
        'labs': 'Labs',
        'learn': 'Learn'
    };
    return modes[mode] || mode;
}

// Sync row heights between left sidebar and right content
function syncRowHeights() {
    const activeColumn = document.querySelectorAll('.question-column')[currentQuestionIndex];
    if (!activeColumn) return;
    
    const leftHeaders = document.querySelectorAll('.model-row-header');
    const rightRows = activeColumn.querySelectorAll('.result-row');
    
    if (leftHeaders.length !== rightRows.length) {
        console.warn('Row count mismatch:', leftHeaders.length, 'vs', rightRows.length);
        return;
    }
    
    // Force a reflow to ensure accurate measurements
    void document.body.offsetHeight;
    
    rightRows.forEach((rightRow, index) => {
        const leftHeader = leftHeaders[index];
        if (leftHeader && rightRow) {
            // Reset heights to get natural size
            leftHeader.style.height = 'auto';
            leftHeader.style.minHeight = '';
            rightRow.style.height = 'auto';
            rightRow.style.minHeight = '';
            
            // Re-measure
            const rightHeight = rightRow.getBoundingClientRect().height;
            const leftHeight = leftHeader.getBoundingClientRect().height;
            
            // Match the taller of the two (no hard 200px minimum)
            const targetHeight = Math.max(rightHeight, leftHeight);
            leftHeader.style.height = `${targetHeight}px`;
            rightRow.style.height = `${targetHeight}px`;
        }
    });
}

// Show error
function showError(errorMessage) {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.innerHTML = `
        <div style="padding: 60px; text-align: center;">
            <h2 style="color: #f50a23;">Error Loading Data</h2>
            <p>Please refresh the page.</p>
            ${errorMessage ? `<p style="color: #737373; font-size: 0.9em; margin-top: 10px;">${errorMessage}</p>` : ''}
        </div>
    `;
}

// Resync heights on window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        syncRowHeights();
    }, 150);
});

// Also sync when images/content loads
window.addEventListener('load', () => {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
                syncRowHeights();
                setTimeout(() => syncRowHeights(), 100);
                setTimeout(() => syncRowHeights(), 300);
            });
        });
    } else {
        requestAnimationFrame(() => {
            syncRowHeights();
            setTimeout(() => syncRowHeights(), 100);
            setTimeout(() => syncRowHeights(), 300);
        });
    }
});

// Use MutationObserver to watch for DOM changes and sync
const observer = new MutationObserver(() => {
    requestAnimationFrame(() => {
        syncRowHeights();
    });
});
