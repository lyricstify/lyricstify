# Contributing to Lyricstify

Thank you for being interested in contributing to Lyricsify! As a contributor, here are the guidelines we would like you to follow:

- [Development Setup](#development-setup)
- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Submitting a Pull Request (PR)](#submitting-a-pull-request-pr)

## Development Setup

### Installation

You can follow the installation steps as described on the [following page](https://github.com/lyricstify/lyricstify/blob/main/README.md#build-it-yourself) in the _Building for Node.js_ section.

### Commonly used NPM scripts

```bash
# build the Lyricstify, so it can be executed by Node.js
npm run build

# build cross-platform binaries
npm run build:bundle && npm run build:executable

# run the unit & e2e tests suite
npm run test

# run the linter
npm run lint

# run the code formatter
npm run format

# run an interactive command line environment to interact with most of the available Lyricstify services
npm run start:repl
```

Please see `scripts` section inside [package.json](https://github.com/lyricstify/lyricstify/blob/main/package.json) for more available commands.

### Debugging Guides

If you modify the source code inside `./src` folder, you may need to do debugging to check the value of variables in some specific steps, please see [this guide](https://nodejs.org/en/docs/guides/debugging-getting-started) for a more detailed explanation of how to debug Node.js applications.

When using Visual Studio Code, [here is](https://code.visualstudio.com/docs/nodejs/nodejs-debugging) also a good guide about how to run code debugging in it.

## Coding Rules

You are expected to follow the code style used by this project. In short, just run the following commands to do automatic checks and repairs your code style:

```
npm run format
npm run lint
```

## Commit Message Guidelines

To make every commit work well with our [Semantic Release CI/CD](https://github.com/semantic-release/semantic-release), it is expected that your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Don't get overwhelmed, you just need to run the following command in the terminal when you commit:

```
git commit
```

And it will automatically run [Commitizen](https://github.com/commitizen/cz-cli) to interactively prompt you for commit message type and description.

## Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Make sure the PR that you would like to create has not been assigned by someone else. Please see the [roadmap](https://github.com/lyricstify/lyricstify/projects) page or [pull requests](https://github.com/lyricstify/lyricstify/pulls) page to find out.

2. When you have a new idea that hasn't been listed on the [roadmap](https://github.com/lyricstify/lyricstify/projects), feel free to open a PR draft or issue first to discuss your idea.

3. Make sure your code follows our [coding rules](#coding-rules).

4. If you change files related to the source code in this repository, please build this project on your local computer first to check if there are type errors that appear via the following command:

   ```
   npm run build
   ```

   Then don't forget to make sure you have tested the changes you made, both testings manually and running automated tests via the following command:

   ```
   npm run test
   ```

   And it's even better if you add unit/integration/e2e tests to the source code you've modified.

5. Write clear commit messages according to our [guidelines](#commit-message-guidelines) and include relevant information about the changes you've made.
