import * as readlineSync from 'readline-sync';
import * as ConsoleGrid from 'console-grid';
import * as utils from '../utils/grid';

const CGS = ConsoleGrid.Style;
const { order } = require('../constants/orientations');
const { actions, customCommands } = require('../constants/actions');

const messages = {
  startingPosition: {
    tooShort: (startingPosition) => {
      console.log(`${CGS.red(`Entry is too short: ${startingPosition}`)}`);
    },
    invalid: (startingPosition) => {
      console.log(`${CGS.red(`Please provide only 2 numbers followed a single letter ['N','E','S','W'] separated by spaces: ${startingPosition}`)}`);
    },
    leavingGrid: () => {
      console.log(`${CGS.red('Starting position provided is out of bounds of grid, please enter a new one.')}`);
    },
    invalidOrientation: () => {
      console.log(`${CGS.red("Orientation must be one of 4 possible inputs ['N','E','S','W']")}`);
    },

  },
  gridSize: {
    tooManyArguments: (gridSize) => {
      console.log(`${CGS.red(`Too many arguments, please provide only 2 numbers separated by a space: ${gridSize}`)}`);
    },
    valueTooLow: (gridSize) => {
      console.log(`${CGS.red(`Values most be greater than 0: ${gridSize}`)}`);
    },
    largeArea: (gridSize) => readlineSync.question('Some features are limited to a smaller grid sizes than what was enter, but you may still continue, would you like to proceed with your entry? [Y]es [N]o'),
  },
};

export const validateStartingPosition = (startingPosition: string, gridSize: string) => {
  if (startingPosition.length < 3) {
    return messages.startingPosition.tooShort(startingPosition);
  }
  const pos = startingPosition.split(' ');
  if (pos.length !== 3) {
    return messages.startingPosition.invalid(startingPosition);
  }
  if (!utils.checkEdges(gridSize, [Number(pos[0]), Number(pos[1])]).result) {
    return messages.startingPosition.leavingGrid();
  } if (order.indexOf(pos[2].toUpperCase()) === -1) {
    return messages.startingPosition.invalidOrientation();
  }
  return true;
};

export const validateCommands = (commands, promptCommands) => {
  commands = commands.split('');
  let passed = true;
  commands.forEach((letter) => {
    if (!actions[letter]) {
      if (promptCommands && !customCommands[letter]) passed = false;
    }
  });
  return passed;
};

export const validateGridSize = (gridSize: string) => {
  if (gridSize.length < 3) {
    console.log(`${CGS.red(`Entry is too short: ${gridSize}`)}`);
    return false;
  }
  const sizes = gridSize.split(' ');
  if (sizes.length !== 2) {
    messages.gridSize.tooManyArguments(gridSize);
    return false;
  }
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
  return true;
};
