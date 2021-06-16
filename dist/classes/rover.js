"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const { order, defs } = require('../constants/orientations');
const { actions } = require('../constants/actions');
const utils = require("../utils/grid");
class Rover {
    constructor(orientation, position, gridSize) {
        this.moveCount = 0;
        this.hideLogs = false,
            this.actionCount = 0;
        this.orientation = 'X';
        this.position = [];
        this.gridSize = [];
        this.powerLevel = 0;
        this.rockCount = 0;
        this.totalRocks = 0;
        this.grid = [];
        this.actions = [];
    }
    logMove(action, position, orientation, result, resultMessage) {
        const increment = action === 'M' ? 1 : 0;
        this.moveCount += increment;
        const moveLog = {
            command: action,
            action: actions[action] || action === 'X' ? 'Landed' : '',
            result,
            resultMessage,
            position,
            direction: defs[orientation].symbol,
            orientation,
            actionCount: ++this.actionCount,
            moveCount: this.moveCount
        };
        this.actions.push(moveLog);
    }
    move(action) {
        const response = this.moveRover(action);
        this.logMove(action, this.position, this.orientation, response.result, response.message);
    }
    moveForward() {
        // Moving Rover Forward
        const adjustmentValues = defs[this.orientation].moveForward;
        const newPosition = [this.position[0] + adjustmentValues[0], this.position[1] + adjustmentValues[1]];
        const response = utils.checkEdges(this.gridSize, newPosition);
        if (!response.result) {
            return response;
        }
        let collectedMessage = 'Rover';
        console.log('this.grid[newPosition[0]][newPosition[1]]', this.grid[newPosition[0]][newPosition[1]]);
        if (this.grid[newPosition[0]][newPosition[1]] === CGS.blue(' & ')) {
            this.rockCount++;
            collectedMessage = CGS.green('Found a martian rock! After having');
        }
        if (this.powerLevel === 0) {
            return { result: false, message: CGS.red('Rover ran out of power. ') };
        }
        this.position = newPosition;
        this.grid[this.position[0]][this.position[1]] = CGS.cyan(' . ');
        this.powerLevel--;
        const directionLabel = defs[this.orientation].label.toLowerCase();
        let message = `${collectedMessage} ${actions['M'].toLowerCase()} one square ${directionLabel}.`;
        return { result: true, message };
    }
    turnRover(action) {
        // Turning Rover Left or Right
        const direction = action === 'R' ? 1 : -1;
        const orientationIndex = order.indexOf(this.orientation);
        const maxIndex = order.length - 1;
        let newOrientationIndex = orientationIndex + direction;
        if (newOrientationIndex < 0) {
            // Turning N => W
            this.orientation = order[3];
        }
        else if (newOrientationIndex > maxIndex) {
            // Turing W => N
            this.orientation = order[0];
        }
        else {
            // Any other movement
            this.orientation = order[newOrientationIndex];
        }
        return {
            result: true,
            message: `Rover ${actions[action].toLowerCase()} 90 degrees.`
        };
    }
    moveRover(action) {
        if (action === 'M') {
            // Movng forward
            return this.moveForward();
            ;
        }
        else if (action === "L" || action === "R") {
            // Changing Direction
            return this.turnRover(action);
        }
        else if (action === 'H') {
            this.hideLogs = !this.hideLogs;
            return { result: true, message: 'Logs toggled' };
        }
        else {
            return { result: false, message: 'Invalid command' };
        }
    }
}
exports.Rover = Rover;
