import { strict as assert } from 'assert';
import {
 checkEdges,
} from '../../src/utils/grid';
const { Rover } = require('../../src/classes/rover');
const { performCommands } = require('../../src/cli/prompts');
const { createMiniMapRows } = require('../../src/utils/grid');

describe('moving rover', () => {
  it('moving rover on "6x6" grid, starting at "1 2 N" and provided commands "LMLMLMLMM" should end on "1 3 N"', () => {

    const walle = new Rover();
    walle.gridSize = [6, 6]; // If were giving "5 5" 
    walle.totalPower = 25;
    walle.powerLevel = 25;
    walle.position = [1, 2];
    walle.orientation = "N";
    createMiniMapRows(walle);

    performCommands(()=>{
        assert.equal(`${walle.position[0]} ${walle.position[1]} ${walle.orientation}`, "1 3 N");
    }, "LMLMLMLMM".split(''), walle, false);

  })
});

describe('moving rover', () => {
    it('moving rover on "6x6" grid, starting at "3 3 E" and provided commands "MMRMMRMRRM" should end on "5 1 E"', () => {
  
      const walle = new Rover();
      walle.gridSize = [6, 6]; // If were giving "5 5" 
      walle.totalPower = 25;
      walle.powerLevel = 25;
      walle.position = [3, 3];
      walle.orientation = "E";
      createMiniMapRows(walle);
  
      performCommands(()=>{
          assert.equal(`${walle.position[0]} ${walle.position[1]} ${walle.orientation}`, "5 1 E");
      }, "MMRMMRMRRM".split(''), walle, false);
  
    })
  });