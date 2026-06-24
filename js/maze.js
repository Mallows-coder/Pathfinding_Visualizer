// this js file focuses on the maze (creation and interaction)

const mazeContainer = document.getElementById('maze');

// Define how big the grid for the maze
export let rows = 21;
export let columns = 41;

export let isMousePressed = false;

// 2d array to track DOM elements
export let gridMatrix = [];

// default placement of start node and target node
export let startNode = {row: 10, column: 1};
export let targetNode = {row:10, column: 39};

const createGrid = () => {
    // tells the css grid how many columns and rows to create
    mazeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    mazeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let r = 0; r < rows; r++){
        const currentRow = [];
        for (let c = 0; c < columns; c++){
            // creates the grids
            const node = document.createElement('div');
            node.classList.add('grid-node');

            node.dataset.row = r;
            node.dataset.column = c;

            // this setups the starting and target node in the maze
            if (r === startNode.row && c === startNode.column){
                node.classList.add('node-start');
            } else if (r === targetNode.row && c === targetNode.column){
                node.classList.add('node-target');
            }

            // prevents the start and target node to be drawn
            const specialNode = () =>{
                // this will return either true or false
                return (r === startNode.row && c === startNode.column) || (r === targetNode.row && c === targetNode.column);
            }

            // changes the color of the grid if clicked
            node.addEventListener('mousedown', () => {
                if (!specialNode()){
                    isMousePressed = true;
                    node.classList.toggle('node-wall');
                }
            });

            // changes the color of the grid if mouse is dragged
            node.addEventListener('mouseenter', () => {
                if (isMousePressed && !specialNode()){
                    node.classList.toggle('node-wall');
                }
            });

            node.addEventListener('mouseup', () => {
                isMousePressed = false;
            })

            mazeContainer.appendChild(node);
            currentRow.push(node);
        }
        gridMatrix.push(currentRow);
    }
}

createGrid();

// if the user clicks and drags their mouse outside the grid, set the isMousePressed to false
window.addEventListener('mouseup', () => {
    isMousePressed = false;
});

export const applyNewGridSettings = (config) => {
    rows = config.rows;
    columns = config.cols;
    startNode = config.startNode;
    targetNode = config.targetNode;

    mazeContainer.innerHTML = ''; 
    gridMatrix = []; 

    createGrid();
};