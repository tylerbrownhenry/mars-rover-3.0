"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const utils = require("../utils/grid");
const { order } = require('../constants/orientations');
const { actions, customCommands } = require('../constants/actions');
const messages = {
    startingPosition: {
        tooShort: (startingPosition) => {
            console.log(`${CGS.red("Entry is too short: " + startingPosition)}`);
        },
        invalid: (startingPosition) => {
            console.log(`${CGS.red("Please provide only 2 numbers followed a single letter ['N','E','S','W'] separated by spaces: " + startingPosition)}`);
        },
        leavingGrid: () => {
            console.log(`${CGS.red("Starting position provided is out of bounds of grid, please enter a new one.")}`);
        },
        invalidOrientation: () => {
            console.log(`${CGS.red("Orientation must be one of 4 possible inputs ['N','E','S','W']")}`);
        }
    },
    gridSize: {
        tooManyArguments: (gridSize) => {
            console.log(`${CGS.red("Too many arguments, please provide only 2 numbers separated by a space: " + gridSize)}`);
        },
        valueTooLow: (gridSize) => {
            console.log(`${CGS.red("Values most be greater than 0: " + gridSize)}`);
        },
        largeArea: (gridSize) => {
            return readlineSync.question('Some features are limited to a smaller grid sizes than what was enter, but you may still continue, would you like to proceed with your entry? [Y]es [N]o');
        }
    }
};
exports.validateStartingPosition = (startingPosition, gridSize) => {
    if (startingPosition.length < 3) {
        return messages.startingPosition.tooShort(startingPosition);
    }
    else {
        const pos = startingPosition.split(' ');
        if (pos.length !== 3) {
            return messages.startingPosition.invalid(startingPosition);
        }
        else {
            if (!utils.checkEdges(gridSize, [Number(pos[0]), Number(pos[1])]).result) {
                return messages.startingPosition.leavingGrid();
            }
            else if (order.indexOf(pos[2].toUpperCase()) === -1) {
                return messages.startingPosition.invalidOrientation();
            }
            else {
                return true;
            }
        }
    }
};
exports.validateCommands = (commands, promptCommands) => {
    commands = commands.split('');
    let passed = true;
    commands.forEach((letter) => {
        if (!actions[letter]) {
            if (promptCommands && !customCommands[letter])
                passed = false;
        }
    });
    return passed;
};
exports.validateGridSize = (gridSize) => {
    if (gridSize.length < 3) {
        console.log(`${CGS.red("Entry is too short: " + gridSize)}`);
        return false;
    }
    else {
        const sizes = gridSize.split(' ');
        if (sizes.length !== 2) {
            messages.gridSize.tooManyArguments(gridSize);
            return false;
        }
        else {
            if (Number(sizes[0]) === 0 || Number(sizes[1]) === 0) {
                messages.gridSize.valueTooLow(gridSize);
                return false;
            }
            if (Number(sizes[0]) > 30 || Number(sizes[1]) > 30) {
                const warn = messages.gridSize.largeArea(gridSize);
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
};
