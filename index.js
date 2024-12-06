// 引入外部模块
import { generateRectangleContent } from './rectangleContent.js';

// 获取矩形和容器元素
const rectangles = document.querySelectorAll('.rectangle');

// 从 dataFlow.csv 文件加载数据
async function loadFlowData() {
    const response = await fetch('dataFlow.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 7);

    // 提取 Total_Flow_Population 和 M_per 数据
    const flowData = data.map(row => ({
        population: parseFloat(row[2].trim()),
        malePercentage: parseFloat(row[4].trim()) / 100
    }));
    return flowData;
}

// 从 dataLmt.csv 文件加载数据
async function loadLmtData() {
    const response = await fetch('dataLmt.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 8);

    // 提取百分比数据
    const lmtData = data.map(row => ({
        lyPercent: parseFloat(row[2].trim()),
        lnPercent: parseFloat(row[4].trim()),
        ryPercent: parseFloat(row[6].trim()),
        rnPercent: parseFloat(row[8].trim())
    }));
    return lmtData;
}

// 初始化矩形
async function initializeRectangles() {
    const flowData = await loadFlowData();
    const lmtData = await loadLmtData();

    rectangles.forEach((rect, index) => {
        const flow = flowData[index] || {};
        const lmt = lmtData[index] || {};

        if (flow.population != null) {
            const percentage = flow.population / 25000;
            const rectHeight = rect.offsetHeight;
            const pixelHeight = rectHeight * percentage;
            rect.style.setProperty('--dot-bottom', `${pixelHeight}px`);
        }

        rect.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedId = e.target.closest('.rectangle').dataset.id;

            rectangles.forEach((r, idx) => {
                if (r.dataset.id === clickedId) {
                    const dotBottom = parseFloat(getComputedStyle(r).getPropertyValue('--dot-bottom'));
                    const blueHeight = (dotBottom + 5) * (flow.malePercentage || 0.5);
                    const redHeight = dotBottom + 5 - blueHeight;

                    r.classList.add('dynamic-content');
                    r.style.width = '440px'; // 调整宽度以容纳右侧内容
                    generateRectangleContent(r, flow, lmt, blueHeight, redHeight); // 调用外部模块
                } else {
                    r.style.width = '40px';
                    r.classList.remove('dynamic-content');
                    r.innerHTML = '';
                }
            });
        });
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.rectangle .dynamic-content')) return;
        rectangles.forEach((r) => {
            r.style.width = '80px';
            r.classList.remove('dynamic-content');
            r.innerHTML = '';
        });
    });
}

// Initialize the rectangles
initializeRectangles();
