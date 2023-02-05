(async () => {
    const FPS = 60;
    const elements = [];

    function setupGrid(width, height) {
        const svg = document.querySelector("svg.js-calendar-graph-svg");
        const grid = svg.children[0];
        
        svg.setAttribute("height", "385");
        
        for (let i = 0; i < width; i++) {
            const col = grid.children[i];
            const diff = height - col.children.length;
            const elem = col.children[col.children.length - 1];

            for (let o = 0; o < diff; o++) {
                const y = parseInt(elem.getAttribute("y"));
                const clone = elem.cloneNode(true);
                clone.setAttribute("y", (y + ((o + 1) * 13)).toString());
                col.appendChild(clone);
            }
        }

        for (let x = 0; x < width; x++) {
            const col = grid.children[x];
            const colElems = [];
            
            for (let y = 0; y < height; y++) {
                const elem = col.children[y];
                elem.id = `bad-apple-${x}-${y}`;
                colElems.push({ elem, data: 0 });
                elem.setAttribute("data-level", "0");
            }

            elements.push(colElems);
        }
    }

    console.log("Downloading Bad Apple!! (thanks kevinjycui/bad-apple)\n");

    const response = await fetch("https://raw.githubusercontent.com/kevinjycui/bad-apple/master/vscode-formatter/bad-apple/src/data.json");
    const data = await response.json();

    const [frames, width, height] = [data.length, data[0][0].length, data[0].length];

    console.log(`\nSuccessfully downloaded Bad Apple!! (${frames} frames at ${width}x${height} resolution)`);
    console.log(`Playing at ${FPS} frames per second. Should take ~${Math.round(frames / FPS)} seconds to play.`);

    setupGrid(width, height);

    console.log("Setup grid! Let's play Bad Apple!! now.");

    let i = 0;

    const id = setInterval(async () => {
        const frame = data[i];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const { elem, data } = elements[x][y];
                const value = frame[y][x] === 0 ? 0 : 3;
                
                if (data !== value) {
                    elem.setAttribute("data-level", value.toString());
                    elements[x][y].data = value;
                }
            }
        }

        if (i++ === frames - 1)
            clearInterval(id);
    }, 1000 / FPS);
})(); 