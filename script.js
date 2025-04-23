// 违禁词替换工具 - JavaScript逻辑

// 违禁词和合规词映射（示例）
const wordMap = {
    "违禁": "合规",
    "敏感": "安全",
    "低俗": "健康",
    "色情": "和谐",
    "赌博": "游戏",
    "毒品": "药物",
    "枪支": "道具",
    "暴力": "和平",
    "政治": "公共",
    "腐败": "问题",
    "黄色": "明亮",
    "血腥": "刺激",
    "自杀": "伤害",
    "裸露": "展示",
    "情色": "氛围"
};

// 固定高度设置
const FIXED_HEIGHT = 500; // 固定高度值

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modifyButton = document.getElementById('modifyButton');
    const copyButton = document.getElementById('copyButton');
    
    // 创建两个按钮容器，将按钮分离
    const mainButtonContainer = document.createElement('div');
    mainButtonContainer.className = 'flex items-center';
    
    const secondaryButtonContainer = document.createElement('div');
    secondaryButtonContainer.className = 'flex items-center ml-2'; // 添加左边距与第一个按钮分开
    
    // 获取修改按钮的父元素
    const modifyButtonParent = modifyButton.parentNode;
    
    // 克隆修改按钮并添加到主容器
    const modifyButtonClone = modifyButton.cloneNode(true);
    mainButtonContainer.appendChild(modifyButtonClone);
    
    // 创建编辑按钮，初始设为隐藏
    const editButton = document.createElement('button');
    editButton.id = 'editButton';
    editButton.textContent = '编辑原文';
    editButton.className = 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
    editButton.style.display = 'none';
    secondaryButtonContainer.appendChild(editButton);
    
    // 创建清空内容按钮，初始也设为隐藏
    const clearButton = document.createElement('button');
    clearButton.id = 'clearButton';
    clearButton.textContent = '清空内容';
    clearButton.className = 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2';
    clearButton.style.display = 'none';
    secondaryButtonContainer.appendChild(clearButton);
    
    // 创建一个总容器来存放两个按钮容器
    const allButtonsContainer = document.createElement('div');
    allButtonsContainer.className = 'flex items-center';
    allButtonsContainer.appendChild(mainButtonContainer);
    allButtonsContainer.appendChild(secondaryButtonContainer);
    
    // 替换原有的按钮结构
    modifyButtonParent.innerHTML = '';
    modifyButtonParent.appendChild(allButtonsContainer);
    
    // 重新获取修改按钮引用
    const newModifyButton = mainButtonContainer.querySelector(':first-child');
    
    // 更新清空按钮可见性的函数
    function updateClearButtonVisibility() {
        // 当输入框有内容且原始输入框可见时才显示清空按钮
        if (inputText.value.trim() && inputText.style.display !== 'none') {
            clearButton.style.display = 'inline-block';
            // 当清空按钮显示时，始终确保它在编辑按钮的正确位置
            if (editButton.style.display === 'none') {
                // 如果编辑按钮不可见，清空按钮应该直接跟在开始修改按钮后面
                secondaryButtonContainer.style.display = 'inline-flex';
            }
        } else {
            clearButton.style.display = 'none';
            // 如果编辑按钮也不可见，则整个辅助按钮容器都可以隐藏
            if (editButton.style.display === 'none') {
                secondaryButtonContainer.style.display = 'none';
            }
        }
    }
    
    // 输入框内容变化时检查是否显示清空按钮
    inputText.addEventListener('input', updateClearButtonVisibility);
    
    // 初始检查是否应显示清空按钮
    updateClearButtonVisibility();
    
    // 点击编辑按钮时恢复输入框
    editButton.addEventListener('click', function() {
        inputText.style.display = 'block';
        if (inputDisplay) {
            inputDisplay.style.display = 'none';
        }
        editButton.style.display = 'none';
        // 如果输入框有内容，仍应显示清空按钮
        updateClearButtonVisibility();
    });
    
    // 点击清空按钮时清空输入框内容
    clearButton.addEventListener('click', function() {
        inputText.value = '';
        // 更新清空按钮可见性
        updateClearButtonVisibility();
    });

    // 创建一个显示输入内容的div元素（用于显示标红的违禁词）
    let inputDisplay = null;

    // 修改按钮点击事件
    newModifyButton.addEventListener('click', function() {
        // 检查输入内容是否为空
        if (!inputText.value.trim()) {
            outputText.innerHTML = '<span class="text-gray-500">请先输入需要检查的文案</span>';
            return;
        }

        let originalText = inputText.value;
        let inputHtmlText = originalText;
        let outputHtmlText = originalText;
        
        // 在输入框中标记违禁词（红色加粗）
        for (const [forbidden, compliant] of Object.entries(wordMap)) {
            const regex = new RegExp(forbidden, 'g');
            inputHtmlText = inputHtmlText.replace(regex, `<span class="highlight-forbidden">${forbidden}</span>`);
        }

        // 在输出框中替换为合规词（绿色加粗）
        for (const [forbidden, compliant] of Object.entries(wordMap)) {
            const regex = new RegExp(forbidden, 'g');
            outputHtmlText = outputHtmlText.replace(regex, `<span class="highlight-compliant">${compliant}</span>`);
        }

        // 保持换行并更新显示
        inputHtmlText = inputHtmlText.replace(/\n/g, '<br>');
        outputHtmlText = outputHtmlText.replace(/\n/g, '<br>');
        
        // 隐藏原始输入框，显示带有标记的输入内容
        inputText.style.display = 'none';
        
        // 如果已经有显示元素，先移除
        if (inputDisplay) {
            inputDisplay.remove();
        }
        
        // 创建新的显示元素（使用固定高度）
        inputDisplay = document.createElement('div');
        inputDisplay.className = 'w-full border border-gray-300 rounded-md overflow-auto input-display';
        inputDisplay.style.height = FIXED_HEIGHT + 'px';
        inputDisplay.style.padding = '16px';
        inputDisplay.style.fontSize = '16px';
        inputDisplay.style.lineHeight = '1.6';
        inputDisplay.innerHTML = inputHtmlText;
        
        // 在新布局中插入到正确的位置
        const inputContainer = inputText.parentNode;
        inputContainer.insertBefore(inputDisplay, inputText.nextSibling);
        
        // 显示编辑按钮
        editButton.style.display = 'inline-block';
        // 隐藏清空按钮（因为原始输入框已被隐藏）
        clearButton.style.display = 'none';
        // 确保辅助按钮容器显示（为了显示编辑按钮）
        secondaryButtonContainer.style.display = 'inline-flex';
        
        // 更新输出框内容（使用固定高度）
        outputText.innerHTML = outputHtmlText;
    });

    // 复制按钮点击事件
    copyButton.addEventListener('click', function() {
        // 检查是否有内容可复制
        if (!outputText.textContent.trim() || outputText.textContent === '请先输入需要检查的文案') {
            return;
        }

        // 获取纯文本内容（不带HTML标记）
        let plainText = outputText.innerText;
        
        // 创建临时元素用于复制
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = plainText;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        
        try {
            // 执行复制命令
            document.execCommand('copy');
            
            // 显示复制成功提示
            const originalText = copyButton.textContent;
            copyButton.textContent = '复制成功！';
            copyButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            copyButton.classList.add('bg-gray-500');
            
            // 2秒后恢复按钮原样
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.classList.remove('bg-gray-500');
                copyButton.classList.add('bg-green-500', 'hover:bg-green-600');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        // 移除临时元素
        document.body.removeChild(tempTextarea);
    });
}); 