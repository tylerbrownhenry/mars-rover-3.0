export const defs = {
  N: {
    symbol: '^',
    label: 'North',
    moveForward: [0, 1]
  },
  E: {
    symbol: '>',
    label: 'East',
    moveForward: [1, 0]
  },
  S: {
    symbol: 'v',
    label: 'South',
    moveForward: [0, -1]
  },
  W: {
    symbol: '<',
    label: 'West',
    moveForward: [-1, 0]
  },
  X: {
    symbol: 'X',
    label: 'Unknown',
    moveForward: [0, 0]
  }
};
export const order = ['N', 'E', 'S', 'W'];
