// // 获取通知内容并动态创建 notice-box
// async function loadNotice() {
//     try {
//         const response = await fetch('/config/notice.txt');
//         if (!response.ok) throw new Error('请求失败: ' + response.status);
//         const text = await response.text(); // 返回纯文本

//         // 创建 notice-box
//         const noticeBox = document.createElement('div');
//         noticeBox.id = 'notice';
//         noticeBox.className = 'notice-box';
//         noticeBox.textContent = text;

//         // 添加到 bell 容器中
//         const bellContainer = document.getElementById('bell');
//         bellContainer.appendChild(noticeBox);

//         // 初始隐藏
//         noticeBox.style.display = 'none';

//         // 点击小红点显示/隐藏
//         bellContainer.addEventListener('click', (e) => {
//             e.stopPropagation(); // 阻止冒泡，避免触发 body 点击事件
//             noticeBox.style.display = (noticeBox.style.display === 'none') ? 'block' : 'none';
//         });

//         // 点击 noticeBox 本身不关闭
//         noticeBox.addEventListener('click', (e) => {
//             e.stopPropagation();
//         });

//         // 点击外部区域关闭
//         document.addEventListener('click', () => {
//             noticeBox.style.display = 'none';
//         });

//     } catch (err) {
//         console.error('加载通知失败:', err);
//     }
// }

// // 页面加载后调用
// document.addEventListener('DOMContentLoaded', loadNotice);



const noticeUrl = "https://abc.luei.me/config/notice.json";

const bell = document.getElementById("noticeBell");
const box = document.getElementById("noticeBox");
const dot = document.getElementById("noticeDot");
const content = document.getElementById("noticeContent");

let noticeVersion = null;

// 获取公告
async function loadNotice() {

    try {

        const res = await fetch(noticeUrl);
        const data = await res.json();

        noticeVersion = data.version;
        content.innerText = data.content;

        const readVersion = localStorage.getItem("notice_read");

        if (readVersion !== noticeVersion) {
            dot.style.display = "block";
        }

    } catch (e) {

        content.innerText = "公告加载失败";

    }
}

loadNotice();

// 点击铃铛
bell.addEventListener("click", (e) => {

    box.classList.toggle("show");

    if (noticeVersion) {

        localStorage.setItem("notice_read", noticeVersion);
        dot.style.display = "none";

    }

    e.stopPropagation();

});

// 点击外部关闭
document.addEventListener("click", () => {
    box.classList.remove("show");
});
