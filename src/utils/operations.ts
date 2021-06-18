import * as ConsoleGrid from 'console-grid';

const { createMiniMapRows, createMiniMapColumns } = require('../utils/grid');
const { columns } = require('../constants/logs');
const { defs } = require('../constants/orientations');

const CGS = ConsoleGrid.Style;

const createRows = walle => {
  const rows = [];
  let { actions } = walle;
  if (actions.length > 10) {
    actions = actions.slice(actions.length - 10, actions.length);
  }
  actions.forEach(action => rows.push(action));
  return rows;
};

const findPowerMessage = walle => {
  const amount = walle.powerLevel / walle.totalPower;
  if (amount < 0.5 && amount >= 0.2) {
    // warning
    return CGS.bg.red(`${walle.powerLevel} Power Running Low`);
  }
  if (amount < 0.25 && walle.powerLevel !== 0) {
    // very low
    return CGS.bg.red(`${walle.powerLevel} Critical Low`);
  }
  if (walle.powerLevel === 0) {
    // empty
    return CGS.bg.red('EMPTY');
  }
  // default
  return walle.powerLevel;
};

const findRockMessage = walle => {
  if (walle.rockCount === walle.totalRocks) {
    return CGS.bg.green('All Rocks Have Been Gathered');
  }
  return `${walle.rockCount}/${walle.totalRocks}`;
};

export const renderScreen = (walle, grid, miniMap) => {
  // The space at the top is intended to clear out the previous screen.
  console.clear();
  console.log(`
    
    ${CGS.red(`
╔╦╗╔═╗╦═╗╔═╗  ╦═╗╔═╗╦  ╦╔═╗╦═╗  
║║║╠═╣╠╦╝╚═╗  ╠╦╝║ ║╚╗╔╝║╣ ╠╦╝  
╩ ╩╩ ╩╩╚═╚═╝  ╩╚═╚═╝ ╚╝ ╚═╝╩╚═  v3.0
    `)}

    `);
  if (walle.actions.length > 1 && walle.hideLogs !== true) {
    console.log('LOGS');
    const data = {
      rows: createRows(walle),
      columns
    };
    grid.render(data);
  }
  const miniMapData = {
    rows: createMiniMapRows(walle),
    columns: createMiniMapColumns(walle)
  };
  console.log('MAP');
  miniMap.render(miniMapData);
  console.log(
    `Rocks [${CGS.blue(' & ')}] Dirt [${CGS.red(' . ')}] Rover [${CGS.bg.green(
      ` ${defs[walle.orientation].symbol} `
    )}]`
  );
  const position =
    walle.orientation !== 'X'
      ? `Position: ${CGS.bg.green(` ${walle.position} `)}`
      : '';
  console.log(`
    Rover Orientation: ${defs[walle.orientation].label}
    ${position}
    Rocks: ${findRockMessage(walle)}
    Power: ${findPowerMessage(walle)}
    `);
};
