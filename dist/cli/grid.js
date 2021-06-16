"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const readlineSync = require("readline-sync");
function validateGridSize(gridSize) {
    if (gridSize.length < 3) {
        console.log(`${CGS.red("Entry is too short: " + gridSize)}`);
        return false;
    }
    else {
        let sizes = gridSize.split(' ');
        if (sizes.length !== 2) {
            console.log(`${CGS.red("Too many arguments, please provide only 2 numbers separated by a space: " + gridSize)}`);
            return false;
        }
        else {
            if (Number(sizes[0]) > 10 || Number(sizes[1]) > 10) {
                let warn = readlineSync.question('Some features are limited to a smaller grid sizes than what was enter, but you may still continue, would you like to proceed with your entry? [Y]es [N]o');
                if (warn.toLowerCase() !== 'y') {
                    return false;
                }
                return true;
            }
            else {
                return true;
            }
        }
    }
}
exports.validateGridSize = validateGridSize;
