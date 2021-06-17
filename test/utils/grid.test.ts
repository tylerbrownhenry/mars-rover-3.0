import { strict as assert } from 'assert';
import {
  findTerrain, createMiniMapColumns, createMiniMapRows, checkEdges, centerAlign,
} from '../../src/utils/grid';

describe('utils.grid.checkEdges', () => {
  it('should return false if newPosition is off grid', () => {
    let resp;
    resp = checkEdges([1, 1], [2, 2]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [-2, -2]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [2, -2]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [0, -1]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [0, -1]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [2, 1]);
    assert.equal(resp.result, false);

    resp = checkEdges([1, 1], [2, 2]);
    assert.equal(resp.result, false);
  });

  it('should return true if newPosition is on grid', () => {
    let resp;
    resp = checkEdges([2, 2], [1, 1]);
    assert.equal(resp.result, true);

    resp = checkEdges([1, 1], [0, 0]);
    assert.equal(resp.result, true);

    resp = checkEdges([1, 2], [0, 1]);
    assert.equal(resp.result, true);

    resp = checkEdges([2, 2], [1, 0]);
    assert.equal(resp.result, true);
  });
});
