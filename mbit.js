
/**
 * MBTI Personality Test Logic
 * Handles question flow, scoring, result calculation, chart rendering, and local storage.
 */

// --- Data: Questions & Types ---

// Simplified MBTI Questions (5 per dimension for a total of 20)
// Dimensions: E/I, S/N, T/F, J/P
const questions = [
    // E vs I
    { id: 1, dim: 'EI', text: "在社交聚会中，你通常会？", a: "主动与很多人交谈，即使是不认识的人", b: "只与几个熟悉的朋友深入交流", score: { a: 'E', b: 'I' } },
    { id: 2, dim: 'EI', text: "经过一周繁忙的工作后，你更倾向于？", a: "和朋友出去聚会放松", b: "独自在家看书或看电影", score: { a: 'E', b: 'I' } },
    { id: 3, dim: 'EI', text: "你通常被认为是？", a: "容易被人了解，外向", b: "深沉，难以被看透", score: { a: 'E', b: 'I' } },
    { id: 4, dim: 'EI', text: "当你需要充电时，你会？", a: "找人聊天", b: "独处静思", score: { a: 'E', b: 'I' } },
    { id: 5, dim: 'EI', text: "在团队项目中，你更喜欢？", a: "通过头脑风暴和大家一起讨论", b: "先自己思考清楚再发表意见", score: { a: 'E', b: 'I' } },
    
    // S vs N
    { id: 6, dim: 'SN', text: "你更关注？", a: "现实和实际细节", b: "可能性和未来愿景", score: { a: 'S', b: 'N' } },
    { id: 7, dim: 'SN', text: "你更信任？", a: "具体的经验和事实", b: "自己的直觉和灵感", score: { a: 'S', b: 'N' } },
    { id: 8, dim: 'SN', text: "描述事物时，你倾向于？", a: "如实描述原本的样子", b: "使用比喻和联想", score: { a: 'S', b: 'N' } },
    { id: 9, dim: 'SN', text: "你更喜欢处理？", a: "已知的、常规的问题", b: "新颖的、复杂的问题", score: { a: 'S', b: 'N' } },
    { id: 10, dim: 'SN', text: "你更注重？", a: "当下的享受", b: "未来的规划", score: { a: 'S', b: 'N' } },

    // T vs F
    { id: 11, dim: 'TF', text: "做决定时，你更看重？", a: "逻辑和客观分析", b: "人情和谐与价值观", score: { a: 'T', b: 'F' } },
    { id: 12, dim: 'TF', text: "当朋友遇到困难时，你首先会？", a: "提供解决问题的建议", b: "提供情感支持和安慰", score: { a: 'T', b: 'F' } },
    { id: 13, dim: 'TF', text: "你认为哪种赞美更受用？", a: "你是个很聪明/有能力的人", b: "你是个很善良/体贴的人", score: { a: 'T', b: 'F' } },
    { id: 14, dim: 'TF', text: "在争论中，你更在意？", a: "谁是对的（真理）", b: "大家的感受（和谐）", score: { a: 'T', b: 'F' } },
    { id: 15, dim: 'TF', text: "你更倾向于？", a: "公正无私", b: "富有同情心", score: { a: 'T', b: 'F' } },

    // J vs P
    { id: 16, dim: 'JP', text: "你的生活方式更倾向于？", a: "有计划、有条理", b: "灵活、随性", score: { a: 'J', b: 'P' } },
    { id: 17, dim: 'JP', text: "面对截止日期，你通常？", a: "提前完成，避免压力", b: "在最后关头冲刺，享受压力", score: { a: 'J', b: 'P' } },
    { id: 18, dim: 'JP', text: "你喜欢？", a: "事情尘埃落定", b: "保持开放选择", score: { a: 'J', b: 'P' } },
    { id: 19, dim: 'JP', text: "你的工作台/房间通常？", a: "整洁有序", b: "随意但找得到东西", score: { a: 'J', b: 'P' } },
    { id: 20, dim: 'JP', text: "旅行时，你更喜欢？", a: "详细的行程表", b: "走到哪算哪", score: { a: 'J', b: 'P' } }
];

// MBTI Type Descriptions
const typeDescriptions = {
    'ISTJ': { name: '物流师', desc: '安静、严肃，通过全面性和可靠性获得成功。注重实际、实事求是、追求现实。', strengths: ['诚实直接', '意志坚强', '责任感强'], weaknesses: ['固执己见', '对情绪不敏感', '总是责怪自己'] },
    'ISFJ': { name: '守卫者', desc: '安静、友好、有责任感和良知。坚定地致力于完成他们的义务。', strengths: ['支持他人', '可靠耐心', '想象力丰富'], weaknesses: ['过于谦虚', '压抑情感', '抗拒改变'] },
    'INFJ': { name: '提倡者', desc: '寻求思想、关系、物质等之间的意义和联系。希望了解什么能够激励人。', strengths: ['富有洞察力', '利他主义', '创造性'], weaknesses: ['容易倦怠', '过于完美主义', '难以敞开心扉'] },
    'INTJ': { name: '建筑师', desc: '在实现自己的想法和达成目标时有创新的想法和非凡的动力。', strengths: ['战略思维', '独立自主', '决心坚定'], weaknesses: ['傲慢', '对情感迟钝', '过度分析'] },
    'ISTP': { name: '鉴赏家', desc: '灵活、忍耐力强，是个安静的观察者直到有问题发生，就会马上行动。', strengths: ['乐观活力', '创造性', '实用主义'], weaknesses: ['固执', '情绪敏感', '容易厌倦'] },
    'ISFP': { name: '探险家', desc: '安静、友好、敏感、和善。享受当前。喜欢有自己的空间。', strengths: ['艺术气质', '好奇心强', '善于观察'], weaknesses: ['难以预测', '容易紧张', '缺乏长远规划'] },
    'INFP': { name: '调停者', desc: '理想主义，对于自己的价值观和自己觉得重要的人非常忠诚。', strengths: ['共情能力', '创造性', '开放思维'], weaknesses: ['不切实际', '自我批判', '难以决断'] },
    'INTP': { name: '逻辑学家', desc: '对感兴趣的事物寻求合理解释。喜欢理论和抽象的事情。', strengths: ['分析能力强', '原创性', '开放心态'], weaknesses: ['脱离现实', '害怕失败', '情感表达困难'] },
    'ESTP': { name: '企业家', desc: '灵活、忍耐力强，采取实际行动使事情发生。喜欢即时满足。', strengths: ['大胆直接', '理性实用', '社交能力强'], weaknesses: ['冲动', '不耐无聊', '风险偏好过高'] },
    'ESFP': { name: '表演者', desc: '外向、友好、接受力强。热爱生活、人类和物质上的享受。', strengths: ['大胆原创', '展示美感', '社交达人'], weaknesses: ['敏感', '冲突回避', '缺乏专注'] },
    'ENFP': { name: '竞选者', desc: '热情洋溢、富有想象力。认为人生充满可能性。能很快地将事情和信息联系起来。', strengths: ['好奇心强', '感知力强', '善于沟通'], weaknesses: ['思维跳跃', '过度思考', '压力管理差'] },
    'ENTP': { name: '辩论家', desc: '反应快、睿智，擅长激励同伴，警惕性强，直言不讳。', strengths: ['知识渊博', '思维敏捷', '魅力十足'], weaknesses: ['好辩', '不切实际', '情感迟钝'] },
    'ESTJ': { name: '总经理', desc: '务实、具体现实。果断，一旦下决心就会马上行动。', strengths: ['奉献敬业', '直截了当', '意志坚强'], weaknesses: ['固执', '控制欲强', '忽视情感'] },
    'ESFJ': { name: '执政官', desc: '热心肠、有责任心、合作。希望周边的环境温馨而和谐。', strengths: ['极强执行力', '忠诚敏感', '善于社交'], weaknesses: ['担心社会地位', '僵化', '需要认可'] },
    'ENFJ': { name: '主人公', desc: '热情、为他人着想、反应敏捷、有责任感。非常关注别人的情绪、需要和动机。', strengths: ['宽容', '可靠 charismatic', '自然领导者'], weaknesses: ['过度理想化', '过于无私', '自我批评'] },
    'ENTJ': { name: '指挥官', desc: '坦诚、果断，是天生的领导者。能很快看到公司/组织程序中的不合理。', strengths: ['高效', '精力充沛', '自信'], weaknesses: ['固执', '冷漠', '傲慢'] }
};

// --- State Management ---
let currentQuestionIndex = 0;
let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let userAnswers = []; // Store answers for review if needed
let resultChartInstance = null;

// --- DOM Elements ---
const views = {
    welcome: document.getElementById('view-welcome'),
    quiz: document.getElementById('view-quiz'),
    loading: document.getElementById('view-loading'),
    result: document.getElementById('view-result'),
    history: document.getElementById('view-history')
};

const ui = {
    questionText: document.getElementById('question-text'),
    optionA: document.getElementById('text-option-a'),
    optionB: document.getElementById('text-option-b'),
    btnA: document.getElementById('btn-option-a'),
    btnB: document.getElementById('btn-option-b'),
    progressBar: document.getElementById('progress-bar'),
    counter: document.getElementById('question-counter'),
    badge: document.getElementById('dimension-badge'),
    resultTypeCode: document.getElementById('result-type-code'),
    resultTypeName: document.getElementById('result-type-name'),
    resultDesc: document.getElementById('result-description'),
    strengthsList: document.getElementById('strengths-list'),
    weaknessesList: document.getElementById('weaknesses-list'),
    btnSave: document.getElementById('btn-save-result')
};

// --- Navigation Functions ---

function switchView(viewName) {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    views[viewName].classList.remove('hidden');
    views[viewName].classList.add('fade-in');
}

function startTest() {
    currentQuestionIndex = 0;
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    userAnswers = [];
    ui.btnSave.style.display = 'inline-block'; // Reset save button visibility
    renderQuestion();
    switchView('quiz');
}

function quitTest() {
    if(confirm('确定要退出测试吗？进度将不会保存。')) {
        switchView('welcome');
    }
}

function restartTest() {
    startTest();
}

function backToWelcome() {
    switchView('welcome');
}

// --- Quiz Logic ---

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    
    // Update Text
    ui.questionText.textContent = q.text;
    ui.optionA.textContent = q.a;
    ui.optionB.textContent = q.b;
    
    // Update Progress
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    ui.progressBar.style.width = `${progress}%`;
    ui.counter.textContent = `问题 ${currentQuestionIndex + 1} / ${questions.length}`;
    
    // Update Badge
    let dimText = '';
    if(q.dim === 'EI') dimText = '能量来源: E/I';
    else if(q.dim === 'SN') dimText = '信息获取: S/N';
    else if(q.dim === 'TF') dimText = '决策方式: T/F';
    else dimText = '生活态度: J/P';
    ui.badge.textContent = dimText;

    // Reset Styles
    ui.btnA.classList.remove('option-selected', 'border-indigo-600', 'bg-indigo-50');
    ui.btnB.classList.remove('option-selected', 'border-indigo-600', 'bg-indigo-50');
    
    // Animation reset
    const container = document.getElementById('question-container');
    container.classList.remove('fade-in');
    void container.offsetWidth; // trigger reflow
    container.classList.add('fade-in');
}

function selectOption(choice) {
    const q = questions[currentQuestionIndex];
    const selectedTrait = q.score[choice.toLowerCase()];
    
    // Visual Feedback
    const selectedBtn = choice === 'A' ? ui.btnA : ui.btnB;
    selectedBtn.classList.add('option-selected', 'border-indigo-600', 'bg-indigo-50');
    
    // Record Score
    scores[selectedTrait]++;
    userAnswers.push({ qId: q.id, choice: choice, trait: selectedTrait });

    // Disable buttons temporarily
    ui.btnA.disabled = true;
    ui.btnB.disabled = true;

    // Delay for next question
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            ui.btnA.disabled = false;
            ui.btnB.disabled = false;
            renderQuestion();
        } else {
            calculateAndShowResult();
        }
    }, 400);
}

// --- Result Calculation ---

function calculateAndShowResult() {
    switchView('loading');
    
    setTimeout(() => {
        // Determine Type
        let type = '';
        type += scores.E >= scores.I ? 'E' : 'I';
        type += scores.S >= scores.N ? 'S' : 'N';
        type += scores.T >= scores.F ? 'T' : 'F';
        type += scores.J >= scores.P ? 'J' : 'P';
        
        const data = typeDescriptions[type];
        
        // Render Result
        ui.resultTypeCode.textContent = type;
        ui.resultTypeName.textContent = data.name;
        ui.resultDesc.textContent = data.desc;
        
        // Render Lists
        ui.strengthsList.innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');
        ui.weaknessesList.innerHTML = data.weaknesses.map(w => `<li>${w}</li>`).join('');
        
        // Render Chart
        renderChart();
        
        switchView('result');
    }, 1500);
}

function renderChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    
    if (resultChartInstance) {
        resultChartInstance.destroy();
    }
    
    // Calculate percentages for display
    const totalEI = scores.E + scores.I;
    const totalSN = scores.S + scores.N;
    const totalTF = scores.T + scores.F;
    const totalJP = scores.J + scores.P;
    
    // Avoid division by zero
    const pE = totalEI ? Math.round((scores.E / totalEI) * 100) : 50;
    const pS = totalSN ? Math.round((scores.S / totalSN) * 100) : 50;
    const pT = totalTF ? Math.round((scores.T / totalTF) * 100) : 50;
    const pJ = totalJP ? Math.round((scores.J / totalJP) * 100) : 50;

    resultChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['外向 (E)', '实感 (S)', '理智 (T)', '判断 (J)', '内向 (I)', '直觉 (N)', '情感 (F)', '感知 (P)'],
            datasets: [{
                label: '性格倾向分布',
                data: [pE, pS, pT, pJ, 100-pE, 100-pS, 100-pT, 100-pJ],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false } // Hide numbers on radar for cleaner look
                }
            },
            plugins: {
                legend: { display: false }
            },
            maintainAspectRatio: false
        }
    });
}

// --- Local Storage & History ---

function saveResult() {
    const type = ui.resultTypeCode.textContent;
    const name = ui.resultTypeName.textContent;
    const date = new Date().toLocaleDateString('zh-CN');
    
    const record = {
        id: Date.now(),
        type: type,
        name: name,
        date: date,
        details: { ...scores }
    };
    
    let history = JSON.parse(localStorage.getItem('mbti_history') || '[]');
    history.unshift(record); // Add to top
    localStorage.setItem('mbti_history', JSON.stringify(history));
    
    alert('结果已保存！');
    ui.btnSave.style.display = 'none'; // Hide button after save
}

function showHistory() {
    const listEl = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('mbti_history') || '[]');
    
    if (history.length === 0) {
        listEl.innerHTML = '<div class="text-center text-gray-500 py-10">暂无历史记录，快去进行一次测试吧！</div>';
    } else {
        listEl.innerHTML = history.map(item => `
            <div class="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
                <div>
                    <div class="font-bold text-indigo-900 text-lg">${item.type} <span class="text-sm font-normal text-gray-500">(${item.name})</span></div>
                    <div class="text-xs text-gray-400 mt-1">${item.date}</div>
                </div>
                <button onclick="deleteHistoryItem(${item.id})" class="text-red-400 hover:text-red-600 p-2">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    switchView('history');
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('mbti_history') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('mbti_history', JSON.stringify(history));
    showHistory(); // Refresh list
}

function clearHistory() {
    if(confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
        localStorage.removeItem('mbti_history');
        showHistory();
    }
}

// Initialize
// Check if we need to do anything on load, e.g., pre-load images
window.onload = () => {
    console.log("MBTI App Loaded");
};
