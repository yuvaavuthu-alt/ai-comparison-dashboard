let currentQuestionIndex = 0;
let questionsData = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/questions.json');
        questionsData = await response.json();
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
        showError();
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
        { mode: 'Web Search', insights: question.chatgpt5.websearch, slug: 'websearch' },
        { mode: 'Deep Research', insights: question.chatgpt5.deepresearch, slug: 'deepresearch' },
        { mode: 'Agent', insights: question.chatgpt5.agent, slug: 'agent' }
    ], 'chatgpt-5', qNum));
    
    // Gemini row
    column.appendChild(createResultRow('gemini-result', [
        { mode: 'Web Search', insights: question.gemini25.websearch, slug: 'websearch' },
        { mode: 'Deep Research', insights: question.gemini25.deepresearch, slug: 'deepresearch' }
    ], 'gemini-25', qNum));
    
    // Perplexity row
    column.appendChild(createResultRow('perplexity-result', [
        { mode: 'Search', insights: question.perplexity.search, slug: 'search' },
        { mode: 'Research', insights: question.perplexity.research, slug: 'research' },
        { mode: 'Labs', insights: question.perplexity.labs, slug: 'labs' },
        { mode: 'Learn', insights: question.perplexity.learn, slug: 'learn' },
        { mode: 'Comet Browser', insights: question.perplexity.cometbrowser, slug: 'cometbrowser' }
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
    
    title.textContent = `${formatModelName(model)} - ${formatModeName(mode)}`;
    content.innerHTML = '<p style="text-align: center; padding: 60px; color: #a3a3a3;">Loading...</p>';
    
    modal.classList.add('active');
    
    try {
        const response = await fetch(`data/details/${model}-${mode}-q${qNum}.md`);
        if (!response.ok) throw new Error('Content not found');
        
        const markdown = await response.text();
        content.innerHTML = marked.parse(markdown);
    } catch (error) {
        content.innerHTML = `
            <h2>Content Not Available</h2>
            <p>Detailed analysis has not been added yet.</p>
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
        'chatgpt-5': 'ChatGPT-5',
        'gemini-25': 'Gemini 2.5 Pro',
        'perplexity': 'Perplexity',
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
        'learn': 'Learn',
        'cometbrowser': 'Comet Browser'
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
    
    // Sync each row
    rightRows.forEach((rightRow, index) => {
        const leftHeader = leftHeaders[index];
        if (leftHeader && rightRow) {
            // Reset heights first to get natural height
            leftHeader.style.height = 'auto';
            rightRow.style.minHeight = 'auto';
            
            // Force reflow
            void leftHeader.offsetHeight;
            void rightRow.offsetHeight;
            
            // Get the actual rendered height
            const rightHeight = rightRow.getBoundingClientRect().height;
            const leftHeight = leftHeader.getBoundingClientRect().height;
            
            // Use the larger height to ensure both align
            const targetHeight = Math.max(rightHeight, leftHeight, 200); // Minimum 200px
            
            // Apply the height
            leftHeader.style.height = `${targetHeight}px`;
            leftHeader.style.minHeight = `${targetHeight}px`;
            rightRow.style.minHeight = `${targetHeight}px`;
        }
    });
}

// Show error
function showError() {
    const wrapper = document.getElementById('questionsWrapper');
    wrapper.innerHTML = `
        <div style="padding: 60px; text-align: center;">
            <h2 style="color: #f50a23;">Error Loading Data</h2>
            <p>Please refresh the page.</p>
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
