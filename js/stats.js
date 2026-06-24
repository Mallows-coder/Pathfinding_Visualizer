// this js file focuses on the live data when a user run the algorithm

// side panel elements
const sidePanelStatus = document.getElementById('status-running'); 
const sidePanelNodes = document.getElementById('status-explored');
const sidePanelPath = document.getElementById('status-path-length');
const sidePanelTime = document.getElementById('status-time');

// footer elements 
const footerNodes = document.getElementById('footer-nodes-explored');
const footerPath = document.getElementById('footer-path-length');
const footerTime = document.getElementById('footer-time');

// Displays status ("Running", "Path Found!")
export const updateStatus = (statusText) => {
    if (sidePanelStatus){
        sidePanelStatus.innerHTML = `<strong>Status: </strong> ${statusText}`
    }
};

// Displays node explored count
export const updateNodeExplored = (count) => {
    if (sidePanelNodes){
        sidePanelNodes.innerHTML= `<strong>Nodes Explored: </strong> ${count}`;
    }

    if (footerNodes){
        footerNodes.innerHTML = `<strong>Nodes Explored: </strong> ${count}`;
    }
};

// Displays path length of the shortest path
export const updatePathLength = (length) => {
    if (sidePanelPath){
        sidePanelPath.innerHTML = `<strong>Path Length: </strong> ${length}`;
    }

    if (footerPath){
        footerPath.innerHTML = `<strong>Path Length: </strong> ${length}`;
    }
}

// Dispaly time in milliseconds (ms)
export const updateTime = (msTime) => {
    // formats the time do have 2 decimal places
    const formattedTime = `${msTime.toFixed(2)}ms`;

    if (sidePanelTime){
        sidePanelTime.innerHTML = `<strong>Time: </strong> ${formattedTime}`;
    }

    if (footerTime){
        footerTime.innerHTML = `<strong>Time: </strong> ${formattedTime}`;
    }
}

export const defaultStat = () => {
    updateStatus("Waiting");
    updateNodeExplored(0);
    updatePathLength(0);
    updateTime(0);
}