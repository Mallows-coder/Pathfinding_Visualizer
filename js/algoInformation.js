// this js file focuses on the text that appears on the sidepanel and footer

export const algoSelect = document.getElementById('algorithm-selection');

// side panel
const algoTitle = document.getElementById('algorithm-title');
const algoShortDesc = document.getElementById('algorithm-short-desc');

// footer
const footerAlgoTitle = document.getElementById('footer-algorithm');
const footerTimeComplexity = document.getElementById('footer-time-complexity');

// create an object for the algorithm info
const algorithmInformation = {
    'bfs': {name: "Breadth-First Search", timeComplexity: "O(V + E)", shortDesc: "Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Guarantees the shortest path."},
    'dfs': {name: "Depth-First Search", timeComplexity: "O(V + E)", shortDesc: "Explores as far as possible along each branch before backtracking. Does NOT guarantee the shortest path."},
    'dijkstra': {name: "Dijkstra's Algorithm", timeComplexity: "O((V + E) log V))", shortDesc: "Finds the shortest path between nodes in a graph. Guarantees the shortest path."},
    'astar': {name: "A* Search", timeComplexity: "O(b\u1D48)", shortDesc: "Uses a heuristic to guide its search, making it much faster than Dijkstra. Guarantees the shortest path."},
};

// updates the sidepanel whenever the user selects an algorithm
algoSelect.addEventListener('change', (e) => {
    const selectedAlgorithm = e.target.value;
    const info = algorithmInformation[selectedAlgorithm];

    algoTitle.innerHTML = `<strong>${info.name}</strong>`;
    algoShortDesc.innerText = info.shortDesc;

    footerAlgoTitle.innerHTML = `<strong>${info.name}</strong>`;
    footerTimeComplexity.innerHTML= `<strong>Time Complexity: </strong> ${info.timeComplexity}`;
});

algoSelect.dispatchEvent(new Event('change'));
