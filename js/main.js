// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏移动端菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 首页功能
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initIndexPage();
    }
    
    // 梦境日记功能
    if (window.location.pathname.includes('history.html')) {
        initHistoryPage();
    }
    
    // 梦境词典功能
    if (window.location.pathname.includes('dictionary.html')) {
        initDictionaryPage();
    }
});

// 初始化首页
function initIndexPage() {
    const dreamInput = document.getElementById('dream-input');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultContainer = document.getElementById('result-container');
    const saveBtn = document.getElementById('save-btn');
    
    // 快捷标签点击事件
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tagText = this.textContent;
            dreamInput.value += (dreamInput.value ? ' ' : '') + tagText;
            dreamInput.focus();
        });
    });
    
    // 开始解梦按钮点击事件
    analyzeBtn.addEventListener('click', function() {
        const dreamText = dreamInput.value.trim();
        if (!dreamText) {
            alert('请描述你的梦境');
            return;
        }
        
        // 搜索梦境关键词
        const results = searchDreamKeywords(dreamText);
        
        if (results.length === 0) {
            // 如果没有匹配到关键词，显示通用解析
            document.getElementById('traditional-interpretation').textContent = '根据周公解梦，你的梦境可能预示着近期会有一些变化，需要保持积极的心态。';
            document.getElementById('meaning-interpretation').textContent = '你的梦境反映了你的内心世界，可能是对现实生活的一种映射。';
            document.getElementById('psychological-interpretation').textContent = '从心理学角度看，梦境是潜意识的表达，可能反映了你当前的情绪状态或未解决的问题。';
            document.getElementById('life-interpretation').textContent = '在生活中，这可能提示你需要关注自己的内心需求，平衡工作和生活。';
        } else {
            // 显示第一个匹配结果的解析
            const firstResult = results[0];
            document.getElementById('traditional-interpretation').textContent = firstResult.traditional;
            document.getElementById('meaning-interpretation').textContent = firstResult.meaning;
            document.getElementById('psychological-interpretation').textContent = firstResult.psychological;
            document.getElementById('life-interpretation').textContent = firstResult.life;
        }
        
        // 显示结果容器
        resultContainer.classList.remove('hidden');
    });
    
    // 保存解梦记录按钮点击事件
    saveBtn.addEventListener('click', function() {
        const dreamText = dreamInput.value.trim();
        if (!dreamText) return;
        
        // 获取解析结果
        const traditional = document.getElementById('traditional-interpretation').textContent;
        const meaning = document.getElementById('meaning-interpretation').textContent;
        const psychological = document.getElementById('psychological-interpretation').textContent;
        const life = document.getElementById('life-interpretation').textContent;
        
        // 创建记录对象
        const record = {
            id: Date.now(),
            dream: dreamText,
            interpretation: {
                traditional,
                meaning,
                psychological,
                life
            },
            timestamp: new Date().toISOString()
        };
        
        // 从本地存储获取现有记录
        let history = JSON.parse(localStorage.getItem('dreamHistory') || '[]');
        
        // 添加新记录
        history.unshift(record);
        
        // 保存到本地存储
        localStorage.setItem('dreamHistory', JSON.stringify(history));
        
        // 提示保存成功
        alert('解梦记录已保存到梦境日记');
    });
}

// 初始化梦境日记页面
function initHistoryPage() {
    const historyList = document.getElementById('history-list');
    const emptyState = document.getElementById('empty-state');
    const clearAllBtn = document.getElementById('clear-all-btn');
    
    // 加载历史记录
    loadHistory();
    
    // 清空全部记录按钮点击事件
    clearAllBtn.addEventListener('click', function() {
        if (confirm('确定要清空全部梦境记录吗？')) {
            localStorage.removeItem('dreamHistory');
            loadHistory();
        }
    });
    
    // 加载历史记录函数
    function loadHistory() {
        // 从本地存储获取记录
        const history = JSON.parse(localStorage.getItem('dreamHistory') || '[]');
        
        // 清空列表
        historyList.innerHTML = '';
        
        // 显示空状态或记录列表
        if (history.length === 0) {
            emptyState.classList.remove('hidden');
            historyList.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            historyList.classList.remove('hidden');
            
            // 渲染记录列表
            history.forEach(record => {
                const item = document.createElement('div');
                item.className = 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl shadow-lg p-6 border border-purple-800/50 history-item';
                
                const date = new Date(record.timestamp);
                const formattedDate = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                item.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-semibold text-purple-300">${formattedDate}</h3>
                        <button class="delete-btn bg-red-800/40 hover:bg-red-700/60 text-red-200 px-3 py-1 rounded-lg text-sm transition-colors" data-id="${record.id}">删除</button>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg font-medium text-purple-200 mb-2">梦境内容</h4>
                        <p class="text-purple-100 leading-relaxed">${record.dream}</p>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg font-medium text-purple-200 mb-2">解梦结果</h4>
                        <div class="space-y-2">
                            <p class="text-purple-100"><strong>传统周公解梦：</strong>${record.interpretation.traditional}</p>
                            <p class="text-purple-100"><strong>寓意解读：</strong>${record.interpretation.meaning}</p>
                            <p class="text-purple-100"><strong>心理暗示：</strong>${record.interpretation.psychological}</p>
                            <p class="text-purple-100"><strong>生活暗示：</strong>${record.interpretation.life}</p>
                        </div>
                    </div>
                `;
                
                historyList.appendChild(item);
            });
            
            // 添加删除按钮事件
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const recordId = parseInt(this.getAttribute('data-id'));
                    deleteRecord(recordId);
                });
            });
        }
    }
    
    // 删除记录函数
    function deleteRecord(id) {
        if (confirm('确定要删除这条梦境记录吗？')) {
            let history = JSON.parse(localStorage.getItem('dreamHistory') || '[]');
            history = history.filter(record => record.id !== id);
            localStorage.setItem('dreamHistory', JSON.stringify(history));
            loadHistory();
        }
    }
}

// 初始化梦境词典页面
function initDictionaryPage() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const dictionaryContent = document.getElementById('dictionary-content');
    
    // 加载全部词条
    loadDictionary('all');
    
    // 分类按钮点击事件
    categoryBtns.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            // 加载对应分类的词条
            const category = this.getAttribute('data-category');
            loadDictionary(category);
        });
    });
    
    // 加载词典函数
    function loadDictionary(category) {
        // 获取对应分类的词条
        const dreams = getDreamsByCategory(category);
        
        // 清空内容
        dictionaryContent.innerHTML = '';
        
        // 渲染词条
        dreams.forEach(dream => {
            const item = document.createElement('div');
            item.className = 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl shadow-lg p-6 border border-purple-800/50 dictionary-item';
            
            item.innerHTML = `
                <h3 class="text-xl font-semibold text-purple-300 mb-4">${dream.keyword}</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-lg font-medium text-purple-200 mb-1">传统周公解梦</h4>
                        <p class="text-purple-100 leading-relaxed">${dream.traditional}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-purple-200 mb-1">寓意解读</h4>
                        <p class="text-purple-100 leading-relaxed">${dream.meaning}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-purple-200 mb-1">心理暗示</h4>
                        <p class="text-purple-100 leading-relaxed">${dream.psychological}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-purple-200 mb-1">生活暗示</h4>
                        <p class="text-purple-100 leading-relaxed">${dream.life}</p>
                    </div>
                </div>
            `;
            
            dictionaryContent.appendChild(item);
        });
    }
}