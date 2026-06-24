// this js file focuses on the utility buttons

import { applyNewGridSettings } from './maze.js';

// settings button
const settingsBtn = document.getElementById('settings');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const applySettingsBtn = document.getElementById('btn-apply-settings');

// theme button
const themeBtn = document.getElementById('theme');

// this portion is for the settings button
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

applySettingsBtn.addEventListener('click', () => {
    let totalRows = parseInt(document.getElementById('grid-rows').value);
    let totalCols = parseInt(document.getElementById('grid-cols').value);

    if (totalRows % 2 === 0){
        totalRows += 1;
    }

    if (totalCols % 2 === 0){
        totalCols += 1;
    }

    const startNodeRow = parseInt(document.getElementById('start-row').value) - 1;
    const startNodeCol = parseInt(document.getElementById('start-col').value) - 1;
    
    const targetNodeRow = parseInt(document.getElementById('target-row').value) - 1;
    const targetNodeCol = parseInt(document.getElementById('target-col').value) - 1;

    if (startNodeRow >= totalRows || startNodeCol >= totalCols || 
        targetNodeRow >= totalRows || targetNodeCol >= totalCols ||
        startNodeRow < 0 || startNodeCol < 0 || targetNodeRow < 0 || targetNodeCol < 0) {
        alert("Oops! Node positions must fall within your selected grid dimensions.");
        return; 
    }

    const updatedGridConfig = {
        rows: totalRows,
        cols: totalCols,
        startNode: { row: startNodeRow, column: startNodeCol },
        targetNode: { row: targetNodeRow, column: targetNodeCol }
    };

    console.log("Applying New Grid State Config:", updatedGridConfig);

    applyNewGridSettings(updatedGridConfig);

    settingsModal.classList.add('hidden');
});


// this portion if for the theme button
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('diff-theme');
});