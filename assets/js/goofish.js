let isEncrypting = false;       // 防止重复点击
let lastClipboardContent = '';  // 缓存上一次写入的内容
async function handleEncrypt() {
    if (isEncrypting) {
        showToast("正在处理，请稍候…", false);
        return;
    }
    isEncrypting = true;
    try {
        const text = await navigator.clipboard.readText();
        if (!text) {
            showToast("剪切板为空", false, 'goofish-toast');
            return;
        }
        if (text === lastClipboardContent) {
            showToast("请勿重复点击", false, 'goofish-toast');
            return;
        }
        const res = await fetch('/goofish/contentEncrypt', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text})
        });
        const data = await res.json();
        if (!data.success) {
            showToast("闲鱼内容加密失败", false, 'goofish-toast');
            return;
        }
        lastClipboardContent = data.result;
        await navigator.clipboard.writeText(data.result);
        showToast("闲鱼内容已加密复制到剪贴板", false, 'goofish-toast');
    } catch (err) {
        showToast("请允许剪切板权限", false, 'goofish-toast');
    } finally {
        isEncrypting = false;
    }
}





































// 全局 tooltip 容器
const tooltipEl = document.createElement('div');
tooltipEl.className = 'global-tooltip';
document.body.appendChild(tooltipEl);

// 样式，可放 CSS 文件中
const style = document.createElement('style');
style.textContent = `
.global-tooltip {
    position: fixed;
    pointer-events: none;
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: pre;
    z-index: 9999;
    display: none;
}
`;
document.head.appendChild(style);

// 鼠标悬停事件委托，只针对 rebate-panel 内的 channel-item
document.addEventListener('mouseover', e => {
    const target = e.target.closest('.rebate-panel .channel-item[data-tooltip]');
    if (!target) return; // 不在 panel 内，直接跳过
    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    tooltipEl.textContent = text;
    tooltipEl.style.display = 'block';

    function moveHandler(evt) {
        const offsetX = 10;
        const offsetY = 20;
        tooltipEl.style.left = (evt.clientX + offsetX) + 'px';
        tooltipEl.style.top = (evt.clientY + offsetY) + 'px';
    }

    function hideHandler() {
        tooltipEl.style.display = 'none';
        document.removeEventListener('mousemove', moveHandler);
        target.removeEventListener('mouseleave', hideHandler);
    }

    document.addEventListener('mousemove', moveHandler);
    target.addEventListener('mouseleave', hideHandler);
});
