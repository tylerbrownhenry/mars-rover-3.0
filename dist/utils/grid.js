"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const { defs } = require('../constants/orientations');
exports.checkEdges = (gridSize, newPosition) => {
    // are we headed off the edge of flat mars?
    const maxLat = gridSize[0] - 1;
    const maxLong = gridSize[1] - 1;
    const x = newPosition[0];
    const y = newPosition[1];
    if (x < 0 || y < 0 || x > maxLat || y > maxLong) {
        return {
            result: false,
            message: 'Rover was denied an attempted to move outside of the grid.',
        };
    }
    return { result: true, message: 'Inside bounds' };
};
exports.centerAlign = (len, longest) => Math.floor((longest - len) / 2);
exports.createMiniMapColumns = walle => {
    const columns = [
        {
            id: 'title',
            name: '',
            maxWidth: 23,
            type: 'string',
        },
    ];
    const max = walle.gridSize[0];
    let i = 0;
    while (i !== max) {
        columns.push({
            id: `col_${i}`,
            name: `${i}`,
            maxWidth: 23,
            type: 'string',
        });
        i++;
    }
    return columns;
};
exports.findTerrain = (walle, e, i) => {
    // Randomly place rocks at every 3 places
    if (!walle.grid[e]) {
        walle.grid[e] = [];
    }
    if (!walle.grid[e][i]) {
        const terrain = Math.floor(Math.random() * 3);
        let char = CGS.red(' . ');
        if (terrain === 0) {
            walle.totalRocks++;
            char = CGS.blue(' & ');
        }
        walle.grid[e][i] = char;
    }
    return walle.grid[e][i];
};
exports.createMiniMapRows = walle => {
    // Most of the logic may loook complicated
    // but it is only because I was trying to add the legends
    // on the top and left side of grid.
    const rows = [];
    const max = walle.gridSize[1];
    const maxCol = walle.gridSize[0];
    let i = 0;
    while (i !== max) {
        const thisRow = {
            label: { r: i },
            maxWidth: 13,
        };
        let e = -1;
        while (e !== maxCol) {
            // nested loop === bad BigO
            let char = 'X';
            let id = `col_${e}`;
            if (e === -1) {
                char = `${max - i - 1}`;
                id = 'title';
            }
            else {
                const realRow = max - i - 1;
                if (e === walle.position[0] && realRow === walle.position[1]) {
                    char = CGS.bg.green(` ${defs[walle.orientation].symbol} `);
                }
                else {
                    char = exports.findTerrain(walle, e, realRow);
                }
            }
            thisRow[id] = char;
            e++;
        }
        rows.push(thisRow);
        i++;
    }
    return rows;
};
