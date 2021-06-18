"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
const align = require('align-text');
const { logo } = require('../constants/terminalLogo');
const { centerAlign } = require('../utils/grid');
const { validateStartingPosition, validateCommands, validateGridSize } = require('./validations');
const { renderScreen } = require('../utils/operations');
//TODO - Move Messages
const messages = {
    askStartingPosition: gridSize => readlineSync.question(`
    
        Where would you like to the Rover's starting coordinates and orientation to be? 
          
        ${CGS.cyan(`Coordinates can be any value within your current grid with X values of 0-${gridSize[0]}, Y values 0-${gridSize[1]}.`)}
        ${CGS.cyan('Orientation values can be N, E, S or W.')}
        ${CGS.cyan('Example: To start on X:0 Y:0 position, facing North, enter: "0 0 N".')}
        
        Input: 
        `),
    askStartingCommand: () => readlineSync.question(`

        What would you like the rover to do?

        ${CGS.cyan('[M]ove Forward, Turn [R]ight, Turn [L]eft, [H]ide Logs, Swi[T]ch Rover, [H]ide Logs, [Q]uit')}
        ${CGS.cyan('Example: "M" or "MMRMMMRMML"')}

        Input:
        `),
    askGridSize: () => readlineSync.question(`
  
        How many points from the point would you like to explore? 
          
        ${CGS.cyan('Please enter 2 numbers for the grid size, seperated by a space.')}
        ${CGS.cyan('Example: For example to have 5 points N and 5 points E you would enter "5 5".')}
      
        Input: 
        `),
    intro: () => {
        console.log(align(`${logo}
        Press any key to continue`, centerAlign));
    },
    firstSplash: host => {
        console.log(`
        You are now connected to the ${CGS.bg.green(' Mars Rover ')}! 
        
        Follow the prompts below:

        `);
    },
};
const askStartingPosition = (walle, grid, miniMap) => {
    // Where should the rover start?
    const { gridSize } = walle;
    const startingPosition = messages.askStartingPosition(gridSize);
    //TODO - Move
    if (!validateStartingPosition(startingPosition, gridSize)) {
        askStartingPosition(walle, grid, miniMap);
    }
    else {
        const pos = startingPosition.split(' ');
        walle.position = [Number(pos[0]), Number(pos[1])];
        const startingPoint = walle.grid[Number(pos[0])][Number(pos[1])];
        if (startingPoint === CGS.blue(' & ')) {
            walle.rockCount++;
        }
        walle.grid[Number(pos[0])][Number(pos[1])] = CGS.cyan(' . '); // travelled
        walle.orientation = pos[2];
        walle.logMove('X', walle.position, walle.orientation, true, 'Landed successfully.');
        renderScreen(walle, grid, miniMap);
        askForStartingCommands(askForStartingCommands, walle, grid, miniMap);
    }
};
exports.checkCommands = (cb, commands, walle, grid, miniMap, wait) => {
    if (commands.length > 0) {
        exports.performCommands(cb, commands, walle, grid, miniMap, wait);
    }
    else {
        cb(cb, walle, grid, miniMap);
    }
};
exports.performCommands = (cb, commands, walle, grid, miniMap, wait) => {
    // Animate the Rover moving to correct position
    walle.move(commands.shift());
    if (grid && miniMap) {
        renderScreen(walle, grid, miniMap);
    }
    if (wait) {
        setTimeout(() => {
            exports.checkCommands(cb, commands, walle, grid, miniMap, wait);
        }, 250);
    }
    else {
        exports.checkCommands(cb, commands, walle, grid, miniMap, wait);
    }
};
const askForStartingCommands = (cb, walle, grid, miniMap) => {
    // Ask what should the Rover do?
    //TODO - Move
    if (walle.rockCount === walle.totalRocks) {
        /*eslint-disable */
        const success = readlineSync.question(CGS.bg.green(`
                                                                                                                                                
        Urgent Message From Houston:                                                                                                            
                                                                                                                                                
        "Good job Cadet! You've collected all of the rocks in the area.  Time to move on to the next one!"                                      
                                                                                                                                                
        [Q]uit                                                                                                                                  
                                                                                                                                                
        Input:                                                                                                                                  
        `));
        /*eslint-enable */
        process.exit();
    }
    //TODO - Move
    if (walle.powerLevel === 0) {
        /*eslint-disable */
        const powerOut = readlineSync.question(`${CGS.bg.red(`
  
    Urgent Message From Houston:                                                                                                            
                                                                                                                                                
    "You let the battery run out?! It doesn't take rocket science to read a power gauge!"                                                       
                                                                                                                                                
    [Q]uit                                                                                                                                  
                                                                                                                                                
    Input:                                                                                                                                  
    `)}`);
        /*eslint-enable */
        process.exit();
    }
    const commands = messages.askStartingCommand();
    //TODO - Validation Logic
    if (commands.length == 0) {
        // Could move these additional validations to the validations files
        console.log(`${CGS.red('Received a blank entry')}`);
        cb(cb, walle, grid, miniMap);
    }
    else if (commands.toLowerCase().indexOf('t') > -1) {
        // Added last to support requirements
        console.clear();
        walle.powerLevel = walle.totalPower;
        askStartingPosition(walle, grid, miniMap);
    }
    else if (!validateCommands(commands, false)) {
        console.log(`${CGS.red('The only valid commands are M, R, or L')}`);
        cb(cb, walle, grid, miniMap);
    }
    else {
        exports.performCommands(cb, commands.split(''), walle, grid, miniMap, true);
    }
};
// TODO: Export functions in these files, so the functions do not ask questions,
// so can write tests for them.
exports.askGridSize = (walle, grid, miniMap) => {
    // Prompt user to enter grid size
    let gridSize = messages.askGridSize();
    if (!validateGridSize(gridSize)) {
        // Incorrect Input
        exports.askGridSize(walle, grid, miniMap);
    }
    else {
        // Update Grid With Input
        gridSize = gridSize.split(' ');
        const x = Number(gridSize[0]) + 1;
        const y = Number(gridSize[1]) + 1;
        const totalPower = x * y;
        walle.gridSize = [x, y];
        walle.totalPower = totalPower;
        walle.powerLevel = totalPower;
        renderScreen(walle, grid, miniMap);
        askStartingPosition(walle, grid, miniMap);
    }
};
exports.intro = (port, walle, grid, miniMap) => {
    // Intro App
    const host = `http://localhost:${port}`;
    messages.intro();
    readlineSync.question('');
    messages.firstSplash(host);
    exports.askGridSize(walle, grid, miniMap);
};
