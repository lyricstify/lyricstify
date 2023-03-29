<div align="center">
  <p><a href="https://github.com/lyricstify/lyricstify"><img src="assets/lyricstify.svg" alt="Lyricstify Logo" height="60"/></a></p>
  <h1>Lyricstify</h1>
  <p>Show synchronized Spotify lyrics in your terminal.</p>
  <p><img src="./assets/lyricstify.gif" width="600"/></p>
  <p>
    <a href="#introduction">Introduction</a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#usage-and-features">Usage and Features</a>
    ·
    <a href="#compatibility">Compatibility</a>
    ·
    <a href="#roadmap">Roadmap</a>
    ·
    <a href="#contributing">Contributing</a>
    ·
    <a href="#license">License</a>
  </p>
</div>

## Introduction

Although the official Spotify client already has a good app that can display synchronized lyrics, it still misses the most anticipated features like romanization and translation, especially when using its desktop and web client.

However, even if these features exist, you may still prefer to use a more flexible, terminal-based application. This is why Lyricstify exists - with Lyricstify, you can customize the lyrics style of your favorite songs and attach them to your favorite places, such as your IDE or your beautiful desktop ricing!

## Installation

Choose one of the following installation options:

### Using NPM (Node Package Manager) - recommended for most use cases

First, you need to install [Node.js](https://nodejs.org/en/download) (using the latest LTS version or higher is recommended). Then, you can run the following command in your terminal:

```
npm install -g @lyricstify/lyricstify
```

### Cross-platform single executable file, 0 dependencies

If you don't want to add another dependency to your OS, you can use this installation option. Simply just go to the [releases page](https://github.com/lyricstify/lyricstify/releases) and download the latest version executable file according to your OS.

### Build it yourself!

When using this installation option, you also need to install [Node.js](https://nodejs.org/en/download) first. Then you can choose one of the following choices:

- Building for Node.js

  Since this project uses TypeScript, it can't be executed directly using Node.js. To make it executable by Node.js, you can do the following steps:

  - Download the source code of this project by [cloning this repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or directly downloading via the [releases page](https://github.com/lyricstify/lyricstify/releases).
  - Open the project directory and run the following command to install the required dependencies:
    ```bash
    npm install
    ```
  - After that, you can run the following command to build the source code so it can be executed by Node.js:
    ```bash
    npm run build
    ```
  - Finally, you can execute Lyricstify by using this command:
    ```bash
    node ./dist/cli.js
    ```
  - This step is about creating a shortcut to our `./dist/cli.js` file. This is optional and depends on what OS you are using. For example in Linux, you can do the following commands to make it can be executed globally from anywhere:

    ```bash
    # Add permission to "./dist/cli.js" to be able to execute directly without using the "node ..." command.
    chmod +x ./dist/cli.js

    # Add "./dist/cli.js" to the user binary path and make it can be executed globally by calling "lyricstify" from anywhere.
    ln -r -s ./dist/cli.js /usr/bin/lyricstify
    ```

- Building cross-platform binaries

  You also can be able to build cross-platform binaries by following these steps:

  - Download the source code of this project by [cloning this repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or directly downloading via the [releases page](https://github.com/lyricstify/lyricstify/releases).
  - Open the project directory and run the following command to install the required dependencies:
    ```bash
    npm install
    ```
  - After that, you can run the following command to build the source code to cross-platform binaries:
    ```bash
    npm run build
    npm run build:bundle
    npm run build:executable
    ```
  - Finally, if all of the previous steps are successful, cross-platform binaries will be available in the `./executable/@lyricstify` folder.

## Usage and Features

### Initializing Configuration

Before you can use Lyricstify, you need to generate the Client ID and Client Secret of your Spotify account. To do so you can follow these steps:

- Go to [your Spotify Applications Dashboard](https://developer.spotify.com/dashboard/) and click on the _Create an App_ button.
- Enter an _App Name_ and _App Description_ of your choice (they will be displayed to the user on the grant screen), put a tick in the _Developer Terms of Service_ checkbox and finally click on _CREATE_.

  ![Create App Dialog!](https://ik.imagekit.io/snwxmen1z/assets/tr:w-300/createappdialog.png)

- Open your created app, and you will see the _Client ID_ and _SHOW CLIENT SECRET_ button. You can copy this Client ID and Client Secret to your Notepad and we will use it later.

  ![App Overview!](https://ik.imagekit.io/snwxmen1z/assets/tr:h-150/app_overview.png)

  > Always store the client secret key securely, never reveal it publicly! If you suspect that the secret key has been compromised, regenerate it immediately by clicking the _ROTATE_ button on the app overview page.

- It is time to configure our app. Click on _Edit Settings_ to view and update your app settings.

  ![Edit Settings!](https://ik.imagekit.io/snwxmen1z/assets/tr:w-300/dashboardeditsettings.png)

- Pay attention to _Redirect URIs_, fill in `http://localhost:3000/api/v1/authorize`, then click the _ADD_ button and finally click on the _SAVE_ button.
  > If port 3000 on your OS is already in use by another application, you can replace it with another unused URI port like `http://localhost:8080/api/v1/authorize`. Just make sure you fill in the same port number when running the `lyricstify init` command.

After you already get the Client ID and Client Secret, now you are ready to start using Lyricstify. Simply run this command in your terminal:

```bash
lyricstify init
```

And you will be asked interactive questions to fill in the required information.

### Starting Lyricstify

Here are two choices for starting Lyricstify:

- Starting full-screen Lyricstify
  ```bash
  lyricstify start
  ```
  This is the main feature of Lyricstify, with this you can display full-screen lyrics on your terminal that will scroll automatically based on your current track progress.
- Printing active lyrics to stdout
  ```bash
  lyricstify pipe
  ```
  If you would like to do advanced customization lyrics output that is not available in the basic `lyricstify start` command, this may be your choice. With this command, you can chain Lyricstify output with another command that support reading values from the stdout pipe like [awk](https://en.wikipedia.org/wiki/AWK). For example:
  ```bash
  # Transform odd line output to green and even line to white
  lyricstify pipe | awk '{if(NR%2==1) print "\033[32m" $0 "\033[0m"; else print $0}'
  ```

### Core available options

- `--romanize`

  Add romanized sentences to the output lyrics if the lyrics contain characters that can be romanized. (default: false)

  ```bash
  lyricstify start --romanize
  # or
  lyricstify pipe --romanize
  ```

- `--romanization-provider <romanization-provider>`

  Specify the provider used during the romanization. (default: "kuroshiro")

  - `gcloud` (EXPERIMENTAL) - romanization using Google Translation Cloud service, this romanization provides more accurate romanization sentences but since the current status is experimental so it may be unstable and can cause some errors.

  - `kuroshiro` - romanization using https://kuroshiro.org/ language library, only able to romanize Japanese sentences and has fewer romanization sentences but more stable compared to the `gcloud`.

  ```bash
  lyricstify start --romanize --romanization-provider gcloud
  # or
  lyricstify pipe --romanize --romanization-provider gcloud
  ```

- `--delay <delay>`

  Sets delay time (in ms) between HTTP requests to the Spotify API. (default: 2000)

  ```bash
  lyricstify start --delay 3000
  # or
  lyricstify pipe --delay 3000
  ```

- `--translate-to <translate-to>`

  (EXPERIMENTAL) Add lyrics translation. The value should be ISO-639 code, see https://cloud.google.com/translate/docs/languages for all available language codes. (default: false)

  ```bash
  lyricstify start --translate-to en
  # or
  lyricstify pipe --translate-to en
  ```

- `--sync-type <sync-type>`
  Controls the synchronization type for displaying lyrics. (default: "none")

  - `none` means not modifying synchronizations that are already given from Spotify, this may cause lyrics not perfectly synced in your next songs that played automatically.
  - `autoplay` can be used if your songs are played automatically, but your lyrics also may not sync perfectly if you control tracks manually (e.g switching between songs, seeking, or pausing and resuming manually)
  - `balance` may be used if you let your songs play automatically but sometimes you also control tracks manually.

  ```bash
  lyricstify start --sync-type autoplay
  # or
  lyricstify pipe --sync-type autoplay
  ```

- `--highlight-markup <highlight-markup>`

  Markup style to the currently active lyrics. By default, the highlighted lyrics will be bolded, see https://github.com/cronvel/terminal-kit/blob/master/doc/markup.md for all available markups. (default: "^+")

  ```bash
  lyricstify start --highlight-markup ^G
  ```

> To see all other available options for each command, simply use the `--help` option after each command. E.g:
>
> - `lyricstify --help`
> - `lyricstify init --help`.
> - `lyricstify start --help`.
> - `lyricstify pipe --help`.

## Compatibility

Here is a list of Lyricstify compatibility in various terminals and operating systems. If the terminal and OS you are using are not listed, it doesn't mean that Lyricstify can't be used on your device, it's just that we haven't had the chance to test it so there may be bugs. Also, feel free to open a new PR to update this compatibility list!

| OS    | Terminal       | Status | Additional Notes |
| ----- | -------------- | ------ | ---------------- |
| Linux | Bash           | ✓      |                  |
|       | GNOME Terminal | ✓      |                  |
|       | Tilda          | ✓      |                  |

## Roadmap

Please visit the following page to view the [Lyricstify roadmap](https://github.com/lyricstify/lyricstify/projects). If the task hasn't been assigned to anyone yet and you'd like to try working on it, you're welcome to open a new PR or a draft. If you have other ideas that aren't on the roadmap, feel free to open a new issue.

## Contributing

Please see [this page](https://github.com/lyricstify/lyricstify/blob/main/CONTRIBUTING.md) for a detailed explanation of how you can contribute to this repository.

## License

This application is licensed under the [MIT license](https://github.com/lyricstify/lyricstify/blob/main/LICENSE).
