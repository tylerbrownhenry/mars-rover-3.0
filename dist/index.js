"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homePage = require("./homepage");
const ConsoleGrid = require("console-grid");
const express = require("express");
const app = express();
const port = 8080; // default port to listen
const { Rover } = require('./classes/rover');
const { intro } = require('./cli/prompts');
const walle = new Rover();
const miniMap = new ConsoleGrid();
const grid = new ConsoleGrid();
app.get("/", (req, res) => {
    res.send(homePage);
});
app.listen(port, () => {
    console.clear();
    intro(port, walle, grid, miniMap);
});
