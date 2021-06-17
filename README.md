## About

![Screen](assets/screen.gif?raw=true "CLI")

Testing a CLI that is a themed like a Mars Rover being remotely driven around on Mars collecting rocks.

This has only been ran on a 2021 Macbook Air.


## Project setup

```shell
git clone https://github.com/tylerbrownhenry/mars-rover-3.0.git
cd mars-rover-3.0
npm install
npm run build && npm run start
```

## Project structure

```
/dist   <- compiled JavaScript code goes here
/src    <- TypeScript source code lives here
/test   <- test files (**.test.ts) live     here
```

## Main dependencies

* [TypeScript](https://www.typescriptlang.org/)
* [`ts-node`](https://github.com/TypeStrong/ts-node) for development server
* [ESLint](https://eslint.org/) for linting
* [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint) for ESLint plugins to support TypeScript
* [Prettier](https://prettier.io/) for formatting source code
* [Mocha](https://mochajs.org/) for testing

## npm scripts

npm script | description
--- | ---
`build` | Compile TypeScript source code to JavaScript
`lint` | Typecheck, lint and format TypeScript source code
`serve` | Run TypeScript source code directly with `ts-node`
`start` | Run compiled JavaScript code
`test` | Run tests with Mocha


## License

[MIT](./LICENSE)
