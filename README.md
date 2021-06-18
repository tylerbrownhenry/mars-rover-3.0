## About

![Screen](assets/screen.gif?raw=true "CLI")

Testing a CLI that is a themed like a Mars Rover being remotely driven around on Mars collecting rocks.

This has only been ran on a 2021 Macbook Air. 

Note:
There is no UI for this outside of the terminal, and it seems to work best if you set the window width relatively width and high, but can adjust based on your screen size. And entering a very large number for the gridSize may provide mixed results, but feel feel to try :D 


## Project setup

```shell
git clone https://github.com/tylerbrownhenry/mars-rover-3.0.git
cd mars-rover-3.0
npm install
npm run build && npm run start
```
Ideally make a relatively small grid.

You will be prompted to enter the the number of points from the origin you want
which you would enter just as 2 numbers separated by a space:

example: to have 5 points to the north and 5 points to the east enter:

```shell
5 5
```

Next you will be prompted to enter the Rover's starting coordinates and orientation.
Coordinates are x and y values separated by space, they most be points that are on the grid that was created.
Coordinations are immediately followed a space then bay the first letter of a cardinal orientation. Valid values are 'N', 'S', 'E' or 'W'.

example: to start on the most southwest corner facing notrth enter:

```shell
0 0 N
```

Now you may control the rover on the grid, starting at the position you provided using the commands: 'M', 'R', L' to move forward, turn right or turn left respectively. You may provided a single input or a string them one after anoter.

example: move forward one position

```shell
M
```

example: move forward two positions and turn right

```shell
MMR
```

Finally, you may change to controlling a different rover on the same grid by entering 'T'.  Which will prompt you to enter the new Rover's position.

## Running Tests 
```shell
npm run test
```


## Project structure

```
/dist   <- compiled JavaScript code goes here
/src    <- TypeScript source code lives here
/test   <- test files (**.test.ts) live     here
/asset   <- images
```

## License

[MIT](./LICENSE)
