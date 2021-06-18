const { defs } = require('../constants/orientations');

export const columns = [
  {
    id: 'position',
    name: 'Position',
    type: 'string',
    maxWidth: 10
  },
  {
    id: 'orientation',
    name: 'Orientation',
    type: 'string',
    maxWidth: 15,
    formatter: v => defs[v].label
  },
  {
    id: 'command',
    name: 'Command',
    type: 'string',
    maxWidth: 50
  },
  {
    id: 'action',
    name: 'Action',
    type: 'string',
    maxWidth: 50
  },
  {
    id: 'actionCount',
    name: 'Action Count',
    type: 'string',
    maxWidth: 50
  },
  {
    id: 'resultMessage',
    name: 'Result Message',
    type: 'string',
    maxWidth: 150
  }
];
