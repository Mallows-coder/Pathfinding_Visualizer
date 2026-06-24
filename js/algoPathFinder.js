import * as Maze from './maze.js';
import * as Stats from './stats.js';

// Helper to pause execution for animations
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if a node is valid to move into
const isValidNode = (r, c) => {
    if (r < 0 || r >= Maze.rows || c < 0 || c >= Maze.columns) {
        return false;
    }

    const node = Maze.gridMatrix[r][c];
    // Cannot move into walls
    if (node.classList.contains('node-wall')) {
        return false;
    }

    return true;
};

// Animates the final shortest path by working backward from target to start
const drawShortestPath = async (parentMatrix, delay) => {
    let current = parentMatrix[Maze.targetNode.row][Maze.targetNode.column];
    
    // track path length
    let pathLength = 0;

    // Track backward until we hit the start node (which has no parent)
    while (current !== null) {
        // Array Destructuring current
        const [r, c] = current;
        if (r === Maze.startNode.row && c === Maze.startNode.column) {
            break; // stops if it finds the starting node
        }
        
        Maze.gridMatrix[r][c].classList.add('node-shortest-path');

        // increment and update path length
        pathLength++
        Stats.updatePathLength(pathLength);

        await sleep(delay * 2); // Slightly slower step for an smooth tracing animation
        current = parentMatrix[r][c];
    }

    Stats.updateStatus("Path Found!");
};

// 1. Breadth-First Search (BFS)
export const runBFS = async (delay) => {
    const queue = [[Maze.startNode.row, Maze.startNode.column]];
    const visited = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const parents = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(null));
    
    visited[Maze.startNode.row][Maze.startNode.column] = true;
    let pathFound = false;

    // counts the node and gets the executime time of the algo
    let nodesExploredCount = 0;
    const startTime = performance.now();

    Stats.updateStatus("Running BFS...");

    while (queue.length > 0) {
        const [currR, currC] = queue.shift();

        // If target found, stop exploring
        if (currR === Maze.targetNode.row && currC === Maze.targetNode.column) {
            pathFound = true;
            break;
        }

        // Animate exploration (skipping start node visual overwrite)
        if (!(currR === Maze.startNode.row && currC === Maze.startNode.column)) {
            Maze.gridMatrix[currR][currC].classList.add('node-visited');
            
            // increment and update node explored and time
            nodesExploredCount++;
            Stats.updateNodeExplored(nodesExploredCount);
            Stats.updateTime(performance.now() - startTime);
            
            await sleep(delay);
        }

        // Standard 4-directional movement (Up, Right, Down, Left)
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
            const nextR = currR + dr;
            const nextC = currC + dc;

            if (isValidNode(nextR, nextC) && !visited[nextR][nextC]) {
                visited[nextR][nextC] = true;
                parents[nextR][nextC] = [currR, currC];
                queue.push([nextR, nextC]);
            }
        }
    }

    if (pathFound) {
        await drawShortestPath(parents, delay);
    } else {
        // The queue is empty but never hit the target node
        Stats.updateStatus("Path Not Found!");
    } 

    return pathFound;
};

// 2. Depth-First Search (DFS)
export const runDFS = async (delay) => {
    // The stack now holds objects containing the node AND its parent!
    const stack = [{ current: [Maze.startNode.row, Maze.startNode.column], parent: null }];
    const visited = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const parents = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(null));
    
    let pathFound = false;
    let nodesExploredCount = 0;
    const startTime = performance.now();

    Stats.updateStatus("Running DFS...");

    while (stack.length > 0) {
        // Unpack the current node coordinates AND the parent that brought us here
        const { current: [currR, currC], parent } = stack.pop();

        if (visited[currR][currC]) continue;
        
        // Lock in the visited status AND the parent here, to prevent overwriting
        visited[currR][currC] = true;
        if (parent !== null) {
            parents[currR][currC] = parent;
        }

        if (currR === Maze.targetNode.row && currC === Maze.targetNode.column) {
            pathFound = true;
            break;
        }

        if (!(currR === Maze.startNode.row && currC === Maze.startNode.column)) {
            Maze.gridMatrix[currR][currC].classList.add('node-visited');

            nodesExploredCount++;
            Stats.updateNodeExplored(nodesExploredCount);
            Stats.updateTime(performance.now() - startTime);

            await sleep(delay);
        }

        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
            const nextR = currR + dr;
            const nextC = currC + dc;

            if (isValidNode(nextR, nextC) && !visited[nextR][nextC]) {
                // Don't touch the parents array yet! Just push the data into the stack.
                stack.push({ current: [nextR, nextC], parent: [currR, currC] });
            }
        }
    }

    if (pathFound) {
        await drawShortestPath(parents, delay);
    } else {
        Stats.updateStatus("Path Not Found!");
    } 

    return pathFound;
};

// 3. Dijkstra's Algorithm
export const runDijkstra = async (delay) => {
    const visited = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const distances = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(Infinity));
    const parents = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(null));
    
    distances[Maze.startNode.row][Maze.startNode.column] = 0;
    
    // Array acts as an unvisited tracker node list
    const unvisitedNodes = [];
    for (let r = 0; r < Maze.rows; r++) {
        for (let c = 0; c < Maze.columns; c++) {
            if (!Maze.gridMatrix[r][c].classList.contains('node-wall')) {
                unvisitedNodes.push([r, c]);
            }
        }
    }

    let pathFound = false;

    // counts the node and gets the executime time of the algo
    let nodesExploredCount = 0;
    const startTime = performance.now();

    Stats.updateStatus("Running Dijkstra...");

    while (unvisitedNodes.length > 0) {
        // Sort to discover the node with the absolute lowest structural distance metric
        unvisitedNodes.sort((a, b) => distances[a[0]][a[1]] - distances[b[0]][b[1]]);
        const closestNode = unvisitedNodes.shift();
        const [currR, currC] = closestNode;

        // If closest node distance value is Infinity, grid space connectivity is blocked
        if (distances[currR][currC] === Infinity) {
            break;
        }

        visited[currR][currC] = true;

        if (currR === Maze.targetNode.row && currC === Maze.targetNode.column) {
            pathFound = true;
            break;
        }

        if (!(currR === Maze.startNode.row && currC === Maze.startNode.column)) {
            Maze.gridMatrix[currR][currC].classList.add('node-visited');

            // increment and update node explored and time
            nodesExploredCount++;
            Stats.updateNodeExplored(nodesExploredCount);
            Stats.updateTime(performance.now() - startTime);

            await sleep(delay);
        }

        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
            const nextR = currR + dr;
            const nextC = currC + dc;

            if (isValidNode(nextR, nextC) && !visited[nextR][nextC]) {
                const alternateDist = distances[currR][currC] + 1; // Step cost is uniform (1)
                if (alternateDist < distances[nextR][nextC]) {
                    distances[nextR][nextC] = alternateDist;
                    parents[nextR][nextC] = [currR, currC];
                }
            }
        }
    }

    if (pathFound) {
        await drawShortestPath(parents, delay);
    } else {
        // The queue is empty but never hit the target node
        Stats.updateStatus("Path Not Found!");
    }

    return pathFound;
};

// 4. A* Search Algorithm (Heuristic: Manhattan Distance)
export const runAStar = async (delay) => {
    const visited = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(false));
    const gScores = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(Infinity));
    const fScores = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(Infinity));
    const parents = Array.from({ length: Maze.rows }, () => Array(Maze.columns).fill(null));

    // Manhattan distance calculation helper
    const getHeuristic = (r, c) => {
        return Math.abs(r - Maze.targetNode.row) + Math.abs(c - Maze.targetNode.column);
    };

    const startR = Maze.startNode.row;
    const startC = Maze.startNode.column;
    
    gScores[startR][startC] = 0;
    fScores[startR][startC] = getHeuristic(startR, startC);

    // Open set array stores items matching structural format: [row, col]
    const openSet = [[startR, startC]];
    let pathFound = false;

    // counts the node and gets the executime time of the algo
    let nodesExploredCount = 0;
    const startTime = performance.now();

    Stats.updateStatus("Running A*...");

    while (openSet.length > 0) {
        // Sort so the item with the lowest total expected path routing metric cost (fScore) is evaluated next
        openSet.sort((a, b) => fScores[a[0]][a[1]] - fScores[b[0]][b[1]]);
        const [currR, currC] = openSet.shift();

        if (currR === Maze.targetNode.row && currC === Maze.targetNode.column) {
            pathFound = true;
            break;
        }

        visited[currR][currC] = true;

        if (!(currR === Maze.startNode.row && currC === Maze.startNode.column)) {
            Maze.gridMatrix[currR][currC].classList.add('node-visited');

            // increment and update node explored and time
            nodesExploredCount++;
            Stats.updateNodeExplored(nodesExploredCount);
            Stats.updateTime(performance.now() - startTime);

            await sleep(delay);
        }

        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
            const nextR = currR + dr;
            const nextC = currC + dc;

            if (isValidNode(nextR, nextC) && !visited[nextR][nextC]) {
                const tentativeGScore = gScores[currR][currC] + 1;

                if (tentativeGScore < gScores[nextR][nextC]) {
                    parents[nextR][nextC] = [currR, currC];
                    gScores[nextR][nextC] = tentativeGScore;
                    fScores[nextR][nextC] = tentativeGScore + getHeuristic(nextR, nextC);
                    
                    // Add to search list evaluation pool if it's not already tracked inside openSet
                    if (!openSet.some(node => node[0] === nextR && node[1] === nextC)) {
                        openSet.push([nextR, nextC]);
                    }
                }
            }
        }
    }

    if (pathFound) {
        await drawShortestPath(parents, delay);
    } else {
        // The queue is empty but never hit the target node
        Stats.updateStatus("Path Not Found!");
    }

    return pathFound;
};