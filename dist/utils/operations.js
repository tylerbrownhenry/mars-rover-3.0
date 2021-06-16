"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createMiniMapRows, createMiniMapColumns } = require('../utils/grid');
const { columns } = require('../constants/logs');
const { defs } = require('../constants/orientations');
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const createRows = (walle) => {
    let rows = [];
    let actions = walle.actions;
    if (actions.length > 10) {
        actions = actions.slice(actions.length - 10, actions.length);
    }
    actions.forEach(action => rows.push(action));
    return rows;
};
const findPowerMessage = (walle) => {
    let amount = walle.powerLevel / walle.totalPower;
    if (amount < 0.50 && amount >= 0.2) {
        // warning
        return CGS.bg.yellow(`${walle.powerLevel} Power Running Low`);
    }
    else if (amount < 0.25 && walle.powerLevel !== 0) {
        // very low
        return CGS.bg.red(`${walle.powerLevel} Critical Low`);
    }
    else if (walle.powerLevel === 0) {
        // empty
        return CGS.bg.red('EMPTY');
    }
    //default 
    return walle.powerLevel;
};
const findRockMessage = (walle) => {
    if (walle.rockCount === walle.totalRocks) {
        return CGS.bg.green(`All Rocks Have Been Gathered`);
    }
    return `${walle.rockCount}/${walle.totalRocks}`;
};
exports.renderScreen = (walle, grid, miniMap) => {
    console.log(`
    
    
    
    
    
    
    
    









    
    ${CGS.red(`
╔╦╗╔═╗╦═╗╔═╗  ╦═╗╔═╗╦  ╦╔═╗╦═╗  
║║║╠═╣╠╦╝╚═╗  ╠╦╝║ ║╚╗╔╝║╣ ╠╦╝  
╩ ╩╩ ╩╩╚═╚═╝  ╩╚═╚═╝ ╚╝ ╚═╝╩╚═  v3.0
    `)}

    `);
    if (walle.actions.length > 1 && walle.hideLogs !== true) {
        console.log(`LOGS`);
        let data = {
            rows: createRows(walle),
            columns,
        };
        grid.render(data);
    }
    const miniMapData = {
        rows: createMiniMapRows(walle),
        columns: createMiniMapColumns(walle),
    };
    console.log(`MAP`);
    miniMap.render(miniMapData);
    console.log(`Rocks [${CGS.blue(' & ')}] Dirt [${CGS.red(' . ')}] Rover [${CGS.bg.green(` ${defs[walle.orientation].symbol} `)}]`);
    const position = walle.orientation !== 'X' ? `Position: ${CGS.bg.green(` ${walle.position} `)}` : '';
    console.log(`
    Rover Orientation: ${defs[walle.orientation].label}
    ${position}
    Rocks: ${findRockMessage(walle)}
    Power: ${findPowerMessage(walle)}
    `);
};
