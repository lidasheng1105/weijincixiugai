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

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modifyButton = document.getElementById('modifyButton');
    const copyButton = document.getElementById('copyButton');

    // 创建一个显示输入内容的div元素（用于显示标红的违禁词）
    let inputDisplay = null;

    // 修改按钮点击事件
    modifyButton.addEventListener('click', function() {
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
        
        // 创建新的显示元素
        inputDisplay = document.createElement('div');
        inputDisplay.className = 'w-full h-40 p-3 border border-gray-300 rounded-md overflow-auto';
        inputDisplay.innerHTML = inputHtmlText;
        inputText.parentNode.insertBefore(inputDisplay, inputText.nextSibling);
        
        // 添加编辑按钮（如果不存在）
        let editButton = document.getElementById('editButton');
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.id = 'editButton';
            editButton.textContent = '编辑原文';
            editButton.className = 'mt-2 text-blue-500 hover:text-blue-700';
            
            // 点击编辑按钮时恢复输入框
            editButton.addEventListener('click', function() {
                inputText.style.display = 'block';
                if (inputDisplay) {
                    inputDisplay.style.display = 'none';
                }
                editButton.style.display = 'none';
            });
            
            // 插入到DOM中
            inputDisplay.parentNode.insertBefore(editButton, inputDisplay.nextSibling);
        } else {
            editButton.style.display = 'block';
        }
        
        // 更新输出框内容
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