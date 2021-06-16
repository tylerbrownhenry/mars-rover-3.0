import * as homePage from './homepage';
import * as ConsoleGrid from 'console-grid';
import * as express from 'express';

const app = express()
const port = 8080; // default port to listen
const { Rover } = require('./classes/rover');
const { intro } = require('./cli/prompts');

const walle = new Rover()
const miniMap = new ConsoleGrid();
const grid = new ConsoleGrid();

app.get( "/", ( req, res ) => {
    res.send( homePage );
} );

app.listen( port, () => {
  console.clear();
  intro(port, walle, grid, miniMap);
});