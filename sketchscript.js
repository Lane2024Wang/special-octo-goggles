// 获取矩形和容器元素
const rectangles = document.querySelectorAll('.rectangle');

// 加载 `1.html` 文件内容
async function loadHtmlContent() {
    try {
        const response = await fetch('1.html'); // 加载 1.html 文件
        if (!response.ok) throw new Error(`Failed to load 1.html: ${response.status}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.body; // 返回 HTML Body 的内容
    } catch (error) {
        console.error('Error loading 1.html:', error);
        return null;
    }
}

// 从 dataFlow.csv 文件加载数据
async function loadFlowData() {
    try {
        const response = await fetch('dataFlow.csv');
        if (!response.ok) throw new Error(`Failed to load dataFlow.csv: ${response.status}`);
        const text = await response.text();
        const rows = text.split('\n');
        const data = rows.slice(1) // 去掉第一行标题
            .map(row => row.split(','))
            .filter(row => row.length >= 7); // 确保数据行完整

        // 提取数据
        return data.map(row => ({
            population: parseFloat(row[2].trim()),
            malePercentage: parseFloat(row[4].trim()) / 100
        }));
    } catch (error) {
        console.error('Error loading dataFlow.csv:', error);
        return [];
    }
}

// 从 dataLmt.csv 文件加载数据
async function loadLmtData() {
    try {
        const response = await fetch('dataLmt.csv');
        if (!response.ok) throw new Error(`Failed to load dataLmt.csv: ${response.status}`);
        const text = await response.text();
        const rows = text.split('\n');
        const data = rows.slice(1) // 去掉第一行标题
            .map(row => row.split(','))
            .filter(row => row.length >= 8); // 确保数据行完整

        // 提取数据
        return data.map(row => ({
            lyPercent: parseFloat(row[2].trim()),
            lnPercent: parseFloat(row[4].trim()),
            ryPercent: parseFloat(row[6].trim()),
            rnPercent: parseFloat(row[8].trim())
        }));
    } catch (error) {
        console.error('Error loading dataLmt.csv:', error);
        return [];
    }
}

// 初始化矩形
async function initializeRectangles() {
    const flowData = await loadFlowData();
    const lmtData = await loadLmtData();
    const htmlContent = await loadHtmlContent();

    if (!htmlContent) {
        console.error('HTML content not loaded, skipping initialization.');
        return;
    }

    rectangles.forEach((rect, index) => {
        const flow = flowData[index] || {};
        const lmt = lmtData[index] || {};
        const contentId = `chart${index + 1}`; // 每个 Pie Chart 的 `id` 为 chart1, chart2, ..., chart10

        // 设置矩形高度
        if (flow.population != null) {
            const percentage = flow.population / 25000; // 按比例缩放
            const rectHeight = rect.offsetHeight;
            const pixelHeight = rectHeight * percentage;
            rect.style.setProperty('--dot-bottom', `${pixelHeight}px`);
        }

        // 添加点击事件监听器
        rect.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedId = e.target.closest('.rectangle').dataset.id;

            rectangles.forEach((r, idx) => {
                if (r.dataset.id === clickedId) {
                    const dotBottom = parseFloat(getComputedStyle(r).getPropertyValue('--dot-bottom'));
                    const blueHeight = (dotBottom + 5) * (flow.malePercentage || 0.5);
                    const redHeight = dotBottom + 5 - blueHeight;

                    r.classList.add('dynamic-content');
                    r.style.width = '440px'; // 调整宽度以适应右侧图表
                    r.innerHTML = ''; // 清空内容

                    // 添加蓝色矩形
                    const blueRect = document.createElement('div');
                    blueRect.style.position = 'absolute';
                    blueRect.style.bottom = '0';
                    blueRect.style.left = '0';
                    blueRect.style.width = '220px';
                    blueRect.style.height = `${blueHeight}px`;
                    blueRect.style.backgroundColor = 'blue';

                    // 添加红色矩形
                    const redRect = document.createElement('div');
                    redRect.style.position = 'absolute';
                    redRect.style.bottom = `${blueHeight}px`;
                    redRect.style.left = '0';
                    redRect.style.width = '220px';
                    redRect.style.height = `${redHeight}px`;
                    redRect.style.backgroundColor = 'red';

                    // 将矩形添加到当前元素中
                    r.appendChild(blueRect);
                    r.appendChild(redRect);

                    // 创建主容器
                    const mainContainer = document.createElement('div');
                    mainContainer.style.position = 'absolute';
                    mainContainer.style.right = '10px';
                    mainContainer.style.top = '53%';
                    mainContainer.style.transform = 'translateY(-50%)';
                    mainContainer.style.display = 'flex';
                    mainContainer.style.flexDirection = 'column';
                    mainContainer.style.gap = '20px';

                    // 添加圆形容器
                    const circle = document.createElement('div');
                    circle.style.width = '200px';
                    circle.style.height = '250px';
                    circle.style.backgroundColor = 'white';
                    circle.style.margin = '0 auto';
                    circle.style.marginBottom = '-10px';
                    circle.classList.add('circle');

                    // 插入对应的 Pie Chart 内容
                    const content = htmlContent.querySelector(`#${contentId}`);
                    if (content) {
                        circle.appendChild(content.cloneNode(true)); // 克隆节点
                    } else {
                        console.error(`Content with ID ${contentId} not found in 1.html`);
                    }

                    mainContainer.appendChild(circle);
                    r.appendChild(mainContainer);
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

// 初始化
initializeRectangles();
