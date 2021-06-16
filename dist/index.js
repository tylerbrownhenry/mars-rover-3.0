"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homePage = require("./homepage");
const cliGrid = require("./cli/grid");
const express = require("express");
const app = express();
const port = 8080; // default port to listen
const readlineSync = require("readline-sync");
const ConsoleGrid = require("console-grid");
const orientations = {
    N: {
        symbol: '^',
        label: 'North',
        moveForward: [0, 1]
    },
    E: {
        symbol: '›',
        label: 'East',
        moveForward: [1, 0]
    },
    S: {
        symbol: '˅',
        label: 'South',
        moveForward: [0, -1]
    },
    W: {
        symbol: '‹',
        label: 'West',
        moveForward: [-1, 0]
    }
};
let orientationOrder = ['N', 'E', 'S', 'W'];
const actionLabel = {
    M: 'Moved Forward',
    L: 'Turned Left',
    R: 'Turned Right',
};
let position = [-1, -1];
let gridSize = [0, 0];
let moveCount = 0;
let orientation = 'N';
const checkEdges = (gridSize, newPosition) => {
    // are we headed off the edge of flat mars?
    const maxLat = gridSize[0];
    const maxLong = gridSize[1];
    const x = newPosition[0];
    const y = newPosition[1];
    if (x < 0 || y < 0 || x > maxLat || y > maxLong) {
        return { result: false, message: 'Rover was denied an attempted to move outside of the grid.' };
    }
    return { result: true };
};
class Rover {
    constructor(orientation, position, gridSize) {
        this.moveCount = 0;
        this.actionCount = 0;
        this.orientation = orientation;
        this.position = position;
        this.gridSize = gridSize;
        this.actions = [];
    }
    logMove(action, position, orientation, result, resultMessage) {
        const increment = action === 'M' ? 1 : 0;
        this.moveCount += increment;
        const moveLog = {
            command: action,
            action: actionLabel[action] || action === 'X' ? 'Landed' : '',
            result,
            resultMessage,
            position,
            direction: orientations[orientation].symbol,
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
        const adjustmentValues = orientations[this.orientation].moveForward;
        const newPosition = [this.position[0] + adjustmentValues[0], this.position[1] + adjustmentValues[1]];
        const response = checkEdges(this.gridSize, newPosition);
        if (!response.result) {
            return response;
        }
        this.position = newPosition;
        const directionLabel = orientations[this.orientation].label.toLowerCase();
        return { result: true, message: `Rover ${actionLabel['M'].toLowerCase()} one square ${directionLabel}.` };
    }
    turnRover(action) {
        // Turning Rover Left or Right
        const direction = action === 'R' ? 1 : -1;
        const orientationIndex = orientationOrder.indexOf(this.orientation);
        const maxIndex = orientationOrder.length - 1;
        let newOrientationIndex = orientationIndex + direction;
        if (newOrientationIndex < 0) {
            // Turning N => W
            this.orientation = orientationOrder[3];
        }
        else if (newOrientationIndex > maxIndex) {
            // Turing W => N
            this.orientation = orientationOrder[0];
        }
        else {
            // Any other movement
            this.orientation = orientationOrder[newOrientationIndex];
        }
        return {
            result: true,
            message: `Rover ${actionLabel[action].toLowerCase()} 90 degrees.`
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
    }
}
const walle = new Rover(orientation, position, gridSize);
let miniMap = new ConsoleGrid();
let CGS = ConsoleGrid.Style;
const createMiniMapRows = (walle) => {
    const rows = [];
    const max = walle.gridSize[1];
    const maxCol = walle.gridSize[0];
    let i = 0;
    while (i !== max) {
        let thisRow = {
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
                    char = CGS.bg.green(` ${walle.orientation} `);
                }
                else {
                    char = ' . ';
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
const createMiniMapColumns = (walle) => {
    const columns = [{
            id: 'title',
            name: '',
            maxWidth: 23,
            type: "string",
        }];
    const max = walle.gridSize[0];
    let i = 0;
    while (i !== max) {
        columns.push({
            id: `col_${i}`,
            name: `${i}`,
            maxWidth: 23,
            type: "string",
        });
        i++;
    }
    return columns;
};
let grid = new ConsoleGrid();
const createRows = (walle, columns) => {
    let rows = [];
    walle.actions.forEach(action => rows.push(action));
    return rows;
};
const columns = [{
        id: "position",
        name: "Position",
        type: "string",
        maxWidth: 10,
    }, {
        id: "orientation",
        name: "Orientation",
        type: "string",
        maxWidth: 15,
        formatter: (v) => {
            return orientations[v].label;
        }
    },
    {
        id: "command",
        name: "Command",
        type: "string",
        maxWidth: 50,
    },
    {
        id: "action",
        name: "Action",
        type: "string",
        maxWidth: 50,
    },
    {
        id: "actionCount",
        name: "Action Count",
        type: "string",
        maxWidth: 50,
    },
    {
        id: "resultMessage",
        name: "Result Message",
        type: "string",
        maxWidth: 150,
    },
];
const renderScreen = () => {
    if (walle.actions.length > 1) {
        console.log(`LOGS`);
        let data = {
            rows: createRows(walle, columns),
            columns,
        };
        grid.render(data);
    }
    const miniMapData = {
        rows: createMiniMapRows(walle),
        columns: createMiniMapColumns(walle),
    };
    miniMap.render(miniMapData);
    console.log(`Rover Location: ${CGS.bg.green(" X ")} `);
};
app.get("/", (req, res) => {
    res.send(homePage);
});
const validateStartingPosition = (startingPosition, gridSize) => {
    if (startingPosition.length < 3) {
        console.log(`${CGS.red("Entry is too short: " + startingPosition)}`);
        return false;
    }
    else {
        let pos = startingPosition.split(' ');
        if (pos.length !== 3) {
            console.log(`${CGS.red("Please provide only 2 numbers followed a single letter ['N','E','S','W'] separated by spaces: " + startingPosition)}`);
            return false;
        }
        else {
            console.log('pos', gridSize, pos, checkEdges(gridSize, [Number(pos[0]), Number(pos[1])]).result);
            if (!checkEdges(gridSize, [Number(pos[0]), Number(pos[1])]).result) {
                console.log(`${CGS.red("Starting position provided is out of bounds of grid, please enter a new one.")}`);
                return false;
            }
            else if (orientationOrder.indexOf(pos[2].toUpperCase()) === -1) {
                console.log(`${CGS.red("Orientation must be one of 4 possible inputs ['N','E','S','W']")}`);
                return false;
            }
            else {
                return true;
            }
        }
    }
};
const askStartingPosition = (gridSize) => {
    let startingPosition = readlineSync.question('What is the Rover\'s starting position? ie: 3 2 N');
    if (!validateStartingPosition(startingPosition, gridSize)) {
        askStartingPosition(gridSize);
    }
    else {
        walle.position = [Number(startingPosition[0]), Number(startingPosition[2]), startingPosition[4]];
        walle.logMove('X', walle.position, walle.orientation, true, 'Landed Successfully');
        renderScreen();
        askForStartingCommands();
    }
};
const validateCommands = (commands) => {
    commands = commands.split('');
    let passed = true;
    commands.forEach((letter) => {
        if (!actionLabel[letter]) {
            passed = false;
        }
    });
    return passed;
};
const askForStartingCommands = () => {
    let commands = readlineSync.question('What are the commands you\'d like to send to the Rover? ie: MMMMRLLLLMMMMRRRR');
    if (commands.length == 0) {
        console.log(`${CGS.red("Received a blank entry")}`);
        askForStartingCommands();
    }
    else if (!validateCommands(commands)) {
        console.log(`${CGS.red("The only valid commands are M, R, or L")}`);
        askForStartingCommands();
    }
    else {
        performCommands(commands.split(''));
    }
};
let additionalCommands = 0;
const promptNext = () => {
    let commands = readlineSync.question('What\'s Next? [M]ove Forward, Turn [R]ight, Turn [L]eft, [Q]uit');
    if (commands.toLowerCase() === 'q') {
        // Quit
        process.exit();
    }
    // DRY (Shrug)
    if (commands.length == 0) {
        console.log(`${CGS.red("Received a blank entry")}`);
        promptNext();
    }
    else if (!validateCommands(commands)) {
        console.log(`${CGS.red("The only valid commands are M, R, or L")}`);
        promptNext();
    }
    else {
        additionalCommands++;
        performCommands(commands.split(''));
    }
};
const performCommands = (commands) => {
    // Animate the Rover moving to correct position
    walle.move(commands.shift());
    renderScreen();
    setTimeout(() => {
        if (commands.length > 0) {
            performCommands(commands);
        }
        else {
            promptNext();
        }
    }, 500);
};
const askGridSize = () => {
    // Prompt user to enter grid size
    let gridSize = readlineSync.question('What size grid would you like to start with?');
    console.log('gridSize', gridSize, gridSize.length, typeof gridSize);
    if (!cliGrid.validateGridSize(gridSize)) {
        askGridSize();
    }
    else {
        walle.gridSize = [Number(gridSize[0]), Number(gridSize[2])];
        renderScreen();
        askStartingPosition(walle.gridSize);
    }
};
app.listen(port, () => {
    console.clear();
    const lh = "http://localhost:" + port;
    console.log(`
  You are now connected to a real ${CGS.bg.green(" Mars Rover ")}! 
  
  View feed on: ${CGS.blue(lh)}
  
  Or you can follow the prompts below:
  
  `);
    askGridSize();
});
