export function generateRectangleContent(r, flow, lmt, blueHeight, redHeight) {
    r.innerHTML = '';

    // Render Blue Rectangle
    const blueRect = document.createElement('div');
    blueRect.style.position = 'absolute';
    blueRect.style.bottom = '0';
    blueRect.style.left = '0';
    blueRect.style.width = '220px';
    blueRect.style.height = `${blueHeight}px`;
    blueRect.style.backgroundColor = 'blue';

    // Render Red Rectangle
    const redRect = document.createElement('div');
    redRect.style.position = 'absolute';
    redRect.style.bottom = `${blueHeight}px`;
    redRect.style.left = '0';
    redRect.style.width = '220px';
    redRect.style.height = `${redHeight}px`;
    redRect.style.backgroundColor = 'red';

    // Append rectangles
    r.appendChild(blueRect);
    r.appendChild(redRect);

    // Create a container for the two main containers
    const mainContainer = document.createElement('div');
    mainContainer.style.position = 'absolute';
    mainContainer.style.right = '10px';
    mainContainer.style.top = '75%';
    mainContainer.style.transform = 'translateY(-50%)';
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.gap = '45px'; // Space between top and bottom containers

    // Create top container with title
    const topContainer = document.createElement('div');
    topContainer.style.display = 'flex';
    topContainer.style.flexDirection = 'column';
    topContainer.style.gap = '5px';

    const topTitle = document.createElement('div');
    topTitle.textContent = 'Longterm Migration or Not?';
    topTitle.style.fontWeight = 'bold';
    topTitle.style.textAlign = 'center';
    topContainer.appendChild(topTitle);

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.position = 'relative';
    topRow.style.gap = '0px';

    const topShapes = [
        { width: `${(lmt.lyPercent / 100) * 200}px`, height: '30px', color: 'lightblue', text: `${lmt.lyPercent}%` },
        { width: `${(lmt.lnPercent / 100) * 200}px`, height: '30px', color: 'lightgreen', text: `${lmt.lnPercent}%` }
    ];

    topShapes.forEach(shape => {
        const rectangle = document.createElement('div');
        rectangle.style.width = shape.width;
        rectangle.style.height = shape.height;
        rectangle.style.backgroundColor = shape.color;
        rectangle.style.position = 'relative';

        const text = document.createElement('div');
        text.textContent = shape.text;
        text.style.position = 'absolute';
        text.style.bottom = '-20px';
        text.style.textAlign = 'center';
        text.style.width = shape.width;

        rectangle.appendChild(text);
        topRow.appendChild(rectangle);
    });

    topContainer.appendChild(topRow);

    // Add additional logic for bottom container and append it to mainContainer
    const bottomContainer = document.createElement('div');
    bottomContainer.style.display = 'flex';
    bottomContainer.style.flexDirection = 'column';
    bottomContainer.style.gap = '5px';

    const bottomTitle = document.createElement('div');
    bottomTitle.textContent = 'Registered Refugee or Not?';
    bottomTitle.style.fontWeight = 'bold';
    bottomTitle.style.textAlign = 'center';
    bottomContainer.appendChild(bottomTitle);

    const bottomRow = document.createElement('div');
    bottomRow.style.display = 'flex';
    bottomRow.style.gap = '0px';

    const bottomShapes = [
        { width: `${(lmt.ryPercent / 100) * 200}px`, height: '30px', color: 'lightcoral', text: `${lmt.ryPercent}%` },
        { width: `${(lmt.rnPercent / 100) * 200}px`, height: '30px', color: 'lightsalmon', text: `${lmt.rnPercent}%` }
    ];

    bottomShapes.forEach(shape => {
        const rectangle = document.createElement('div');
        rectangle.style.width = shape.width;
        rectangle.style.height = shape.height;
        rectangle.style.backgroundColor = shape.color;
        rectangle.style.position = 'relative';

        const text = document.createElement('div');
        text.textContent = shape.text;
        text.style.position = 'absolute';
        text.style.bottom = '-20px';
        text.style.textAlign = 'center';
        text.style.width = shape.width;

        rectangle.appendChild(text);
        bottomRow.appendChild(rectangle);
    });

    bottomContainer.appendChild(bottomRow);

    // Append containers to mainContainer
    mainContainer.appendChild(topContainer);
    mainContainer.appendChild(bottomContainer);

    // Append mainContainer to rectangle
    r.appendChild(mainContainer);
}
