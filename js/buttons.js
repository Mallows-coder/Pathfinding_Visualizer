// this js file focuses on the buttons
import * as Maze from './maze.js';
import * as Pathfinding from './algoPathFinder.js';
import * as Stats from './stats.js'
import {algoSelect} from './algoInformation.js';

const generateMazeBtn = document.getElementById('btn-generate');
const mazeSelection = document.getElementById('maze-selection');
const speedSelection = document.getElementById('speed-selection');
const clearBoardBtn = document.getElementById('btn-clear-board');
const clearPathBtn = document.getElementById('btn-clear-path');
const visualizeBtn = document.getElementById('btn-visualize');

const speedDelayMap = {
    'fast': 10,
    'average': 30,
    'slow': 75
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper functions

const clearBoard = () => {
    for (let r = 0; r < Maze.rows; r++){
        for (let c = 0; c < Maze.columns; c++){
            const node = Maze.gridMatrix[r][c];
            node.className = 'grid-node';

            if (r === Maze.startNode.row && c === Maze.startNode.column){
                node.classList.add('node-start');
            }
            if (r === Maze.targetNode.row && c === Maze.targetNode.column){
                node.classList.add('node-target');
            }
        }
    }
};

const clearPath = () => {
    for (let r = 0; r < Maze.rows; r++){
        for (let c = 0; c < Maze.columns; c++){
            const node = Maze.gridMatrix[r][c];
            node.classList.remove('node-visited', 'node-shortest-path');
        }
    }
};

// Helper to check if a position is the start or target node
const isSpecialNode = (r, c) => {
    return (r === Maze.startNode.row && c === Maze.startNode.column) || (r === Maze.targetNode.row && c === Maze.targetNode.column);
};

// Fills the grid with walls to prepare for carving algorithms, preserving special nodes and user walls
const setupFullWallGrid = () => {
    for (let r = 0; r < Maze.rows; r++) {
        for (let c = 0; c < Maze.columns; c++) {
            if (!isSpecialNode(r, c)) {
                // Keep it if it's already a user wall, otherwise make it a wall
                Maze.gridMatrix[r][c].classList.add('node-wall');
            }
        }
    }
};

// Maze Generation Algorithms

// 1. Random Wall Scatter
const generateRandomScatter = async (delay) => {
    for (let r = 0; r < Maze.rows; r++){
        for (let c = 0; c < Maze.columns; c++){
            if (isSpecialNode(r, c) || Maze.gridMatrix[r][c].classList.contains('node-wall')) {
                continue;
            }

            if (Math.random() < 0.28) {
                Maze.gridMatrix[r][c].classList.add('node-wall');
                await sleep(delay);
            }
        }
    }
};

// 2. Recursive Backtracking
const generateRecursiveBacktracking = async (delay) => {
    setupFullWallGrid();
    
    // Create a tracker for path cells
    const visited = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const stack = [];

    // Start cell (must be odd indices for standard maze tracking layout)
    let startR = 1, startC = 1;
    visited[startR][startC] = true;
    Maze.gridMatrix[startR][startC].classList.remove('node-wall');
    stack.push([startR, startC]);

    while (stack.length > 0) {
        const [currentR, currentC] = stack[stack.length - 1];
        const neighbors = [];

        // Check 4 directions, moving 2 steps away
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        
        for (const [dr, dc] of directions) {
            const nextR = currentR + dr;
            const nextC = currentC + dc;

            if (nextR > 0 && nextR < Maze.rows - 1 && nextC > 0 && nextC < Maze.columns - 1) {
                // If destination cell hasn't been carved yet AND isn't a user-placed wall
                if (!visited[nextR][nextC]) {
                    neighbors.push([nextR, nextC, currentR + dr / 2, currentC + dc / 2]);
                }
            }
        }

        if (neighbors.length > 0) {
            // Pick a random unvisited neighbor
            const [nextR, nextC, wallR, wallC] = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            visited[nextR][nextC] = true;
            
            // Carve passage through intervening wall and destination cell
            Maze.gridMatrix[wallR][wallC].classList.remove('node-wall');
            Maze.gridMatrix[nextR][nextC].classList.remove('node-wall');
            
            await sleep(delay);
            stack.push([nextR, nextC]);
        } else {
            stack.pop();
        }
    }
    
    // Ensure Start and Target remain open pathways
    Maze.gridMatrix[Maze.startNode.row][Maze.startNode.column].classList.remove('node-wall');
    Maze.gridMatrix[Maze.targetNode.row][Maze.targetNode.column].classList.remove('node-wall');
};

// 3. Randomized Prim's Algorithm (Carving Approach)
const generateRandomizedPrims = async (delay) => {
    setupFullWallGrid();
    
    const passage = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const frontiers = [];

    const addFrontiers = (r, c) => {
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr > 0 && nr < Maze.rows - 1 && nc > 0 && nc < Maze.columns - 1) {
                if (!passage[nr][nc] && Maze.gridMatrix[nr][nc].classList.contains('node-wall')) {
                    frontiers.push([nr, nc]);
                }
            }
        }
    };

    // Pick a starting point
    let startR = 1, startC = 1;
    passage[startR][startC] = true;
    Maze.gridMatrix[startR][startC].classList.remove('node-wall');
    addFrontiers(startR, startC);

    while (frontiers.length > 0) {
        const randIndex = Math.floor(Math.random() * frontiers.length);
        const [fr, fc] = frontiers.splice(randIndex, 1)[0];

        if (passage[fr][fc]) {
            continue;
        }

        // Find adjacent cells that are already part of the passage
        const neighbors = [];
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        for (const [dr, dc] of directions) {
            const nr = fr + dr;
            const nc = fc + dc;
            if (nr > 0 && nr < Maze.rows - 1 && nc > 0 && nc < Maze.columns - 1) {
                if (passage[nr][nc]) {
                    neighbors.push([nr + (dr * -1) / 2, nc + (dc * -1) / 2]);
                }
            }
        }

        if (neighbors.length > 0) {
            const [wr, wc] = neighbors[Math.floor(Math.random() * neighbors.length)];
            passage[fr][fc] = true;
            Maze.gridMatrix[fr][fc].classList.remove('node-wall');
            Maze.gridMatrix[wr][wc].classList.remove('node-wall');
            
            addFrontiers(fr, fc);
            await sleep(delay);
        }
    }
    
    Maze.gridMatrix[Maze.startNode.row][Maze.startNode.column].classList.remove('node-wall');
    Maze.gridMatrix[Maze.targetNode.row][Maze.targetNode.column].classList.remove('node-wall');
};

// 4. Recursive Division 
const generateRecursiveDivision = async (delay) => {
    // We surround the grid perimeter with walls first
    for (let r = 0; r < Maze.rows; r++) {
        for (let c = 0; c < Maze.columns; c++) {
            if (r === 0 || r === Maze.rows - 1 || c === 0 || c === Maze.columns - 1) {
                if (!isSpecialNode(r, c)) Maze.gridMatrix[r][c].classList.add('node-wall');
            }
        }
    }

    const divide = async (minR, maxR, minC, maxC, orientation) => {
        if (maxR - minR < 2 || maxC - minC < 2) return;

        const isHorizontal = orientation === 'horizontal';

        // Choose where to build the wall line (must be an even index)
        let wallR = minR + 1 + Math.floor(Math.random() * (maxR - minR - 1));
        let wallC = minC + 1 + Math.floor(Math.random() * (maxC - minC - 1));

        while (wallR % 2 !== 0) wallR = minR + 1 + Math.floor(Math.random() * (maxR - minR - 1));
        while (wallC % 2 !== 0) wallC = minC + 1 + Math.floor(Math.random() * (maxC - minC - 1));

        // Choose where to put the passage gap (must be an odd index)
        let passageR = wallR;
        let passageC = wallC;

        if (isHorizontal) {
            passageC = minC + Math.floor(Math.random() * (maxC - minC + 1));
            while (passageC % 2 === 0) passageC = minC + Math.floor(Math.random() * (maxC - minC + 1));
        } else {
            passageR = minR + Math.floor(Math.random() * (maxR - minR + 1));
            while (passageR % 2 === 0) passageR = minR + Math.floor(Math.random() * (maxR - minR + 1));
        }

        // Render the drawn wall line
        if (isHorizontal) {
            for (let c = minC; c <= maxC; c++) {
                if (c !== passageC && !isSpecialNode(wallR, c)) {
                    Maze.gridMatrix[wallR][c].classList.add('node-wall');
                    await sleep(delay);
                }
            }
        } else {
            for (let r = minR; r <= maxR; r++) {
                if (r !== passageR && !isSpecialNode(r, wallC)) {
                    Maze.gridMatrix[r][wallC].classList.add('node-wall');
                    await sleep(delay);
                }
            }
        }

        // Subdivide the resulting sub-chambers
        if (isHorizontal) {
            await divide(minR, wallR - 1, minC, maxC, chooseOrientation(wallR - 1 - minR, maxC - minC));
            await divide(wallR + 1, maxR, minC, maxC, chooseOrientation(maxR - (wallR + 1), maxC - minC));
        } else {
            await divide(minR, maxR, minC, wallC - 1, chooseOrientation(maxR - minR, wallC - 1 - minC));
            await divide(minR, maxR, wallC + 1, maxC, chooseOrientation(maxR - minR, maxC - (wallC + 1)));
        }
    };

    const chooseOrientation = (width, height) => {
        if (width < height) return 'horizontal';
        if (height < width) return 'vertical';
        return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    };

    await divide(1, Maze.rows - 2, 1, Maze.columns - 2, chooseOrientation(Maze.rows - 2, Maze.columns - 2));
};

const handleMazeGeneration = async () => {
    visualizeBtn.disabled = true;
    generateMazeBtn.disabled = true;
    clearBoardBtn.disabled = true;
    clearPathBtn.disabled = true;
    mazeSelection.disabled = true;
    speedSelection.disabled = true;
    algoSelect.disabled = true;

    const speed = speedSelection.value;
    const delay = speedDelayMap[speed] || 30;
    
    clearPath();

    if (mazeSelection.value === "random-scatter") {
        await generateRandomScatter(delay);
    } else if (mazeSelection.value === "recursive-backtracker") {
        await generateRecursiveBacktracking(delay);
    } else if (mazeSelection.value === "recursive-division") {
        await generateRecursiveDivision(delay);
    } else if (mazeSelection.value === "random-prims") {
        await generateRandomizedPrims(delay);
    }

    visualizeBtn.disabled = false;
    generateMazeBtn.disabled = false;
    clearBoardBtn.disabled = false;
    clearPathBtn.disabled = false;
    mazeSelection.disabled = false;
    speedSelection.disabled = false;
    algoSelect.disabled = false;
};

// visualization button 

const handlePathfindingVisualization = async () => {
    visualizeBtn.disabled = true;
    generateMazeBtn.disabled = true;
    clearBoardBtn.disabled = true;
    clearPathBtn.disabled = true;
    mazeSelection.disabled = true;
    speedSelection.disabled = true;
    algoSelect.disabled = true;

    const speed = speedSelection.value;
    const delay = speedDelayMap[speed] || 30;

    clearPath();
    Stats.defaultStat();

    if (algoSelect.value === "bfs") {
        await Pathfinding.runBFS(delay);
    } else if (algoSelect.value === "dfs") {
        await Pathfinding.runDFS(delay);
    } else if (algoSelect.value === "dijkstra") {
        await Pathfinding.runDijkstra(delay);
    } else if (algoSelect.value === "astar") {
        await Pathfinding.runAStar(delay);
    }

    visualizeBtn.disabled = false;
    generateMazeBtn.disabled = false;
    clearBoardBtn.disabled = false;
    clearPathBtn.disabled = false;
    mazeSelection.disabled = false;
    speedSelection.disabled = false;
    algoSelect.disabled = false;
};

/* These two functions ensure that when the board or path 
is cleared the status are reverted to default */
const handleClearBoard = () => {
    clearBoard();
    Stats.defaultStat();
}

const handleClearPath = () => {
    clearPath();
    Stats.defaultStat();
}

clearBoardBtn.addEventListener('click', handleClearBoard);
clearPathBtn.addEventListener('click', handleClearPath);
generateMazeBtn.addEventListener('click', handleMazeGeneration);
visualizeBtn.addEventListener('click', handlePathfindingVisualization);