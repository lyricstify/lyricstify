import chalk from 'chalk';
import {
  ChoicesFor,
  MessageFor,
  Question,
  QuestionSet,
  ValidateFor,
  WhenFor,
} from 'nest-commander';
import terminalLink from 'terminal-link';
import { ClientService } from '../client/client.service.js';
import { InitializeOptionsInterface } from './interfaces/initialize-options.interface.js';

@QuestionSet({ name: 'initialize' })
export class InitializeQuestion {
  constructor(private readonly clientService: ClientService) {}

  @Question({
    type: 'list',
    name: 'start',
  })
  parseStart(val: string) {
    return val.trim();
  }

  @MessageFor({ name: 'start' })
  async messageStart() {
    if ((await this.isConfigurationAlreadyExists()) === true) {
      return 'We detected that there was already a previously saved configuration. Do you want to update it?';
    }

    const link = terminalLink(
      'this page first',
      'https://github.com/lyricstify/lyricstify/',
    );

    return `Welcome to Lyricstify! Please follow the guide on ${chalk.bold(
      link,
    )} to get the necessary Spotify App authorization data.`;
  }

  @ChoicesFor({ name: 'start' })
  async choicesStart() {
    if ((await this.isConfigurationAlreadyExists()) === true) {
      return ['Yes', 'No'];
    }

    return [`I'm ready!`];
  }

  @Question({
    type: 'input',
    name: 'clientId',
    message: `What's your client id?`,
  })
  parseClientId(val: string) {
    return val.trim();
  }

  @WhenFor({ name: 'clientId' })
  whenClientId(answers: InitializeOptionsInterface): boolean {
    return answers.start !== 'No';
  }

  @ValidateFor({ name: 'clientId' })
  validateClientId(value: string) {
    if (this.validateSpotifyClientIdOrPassword(value) === false) {
      return 'Please fill in a valid client id!';
    }

    return true;
  }

  @Question({
    type: 'password',
    name: 'clientSecret',
    message: `What's your client secret?`,
  })
  parseClientSecret(val: string) {
    return val.trim();
  }

  @WhenFor({ name: 'clientSecret' })
  whenClientSecret(answers: InitializeOptionsInterface): boolean {
    return answers.start !== 'No';
  }

  @ValidateFor({ name: 'clientSecret' })
  validateClientSecret(value: string) {
    if (this.validateSpotifyClientIdOrPassword(value) === false) {
      return 'Please fill in a valid client secret!';
    }

    return true;
  }

  @Question({
    type: 'input',
    name: 'redirectUriPort',
    message: `What's your redirect URI port?`,
    default: '3000',
  })
  parseRedirectUriPort(val: string) {
    return val.trim();
  }

  @WhenFor({ name: 'redirectUriPort' })
  whenRedirectUriPort(answers: InitializeOptionsInterface): boolean {
    return answers.start !== 'No';
  }

  @ValidateFor({ name: 'redirectUriPort' })
  validateRedirectUriPort(value: string) {
    if (Number.isNaN(Number(value)) === true) {
      return 'Please fill in a valid redirect URI!';
    }

    return true;
  }

  private async isConfigurationAlreadyExists() {
    return (await this.clientService.findOne()) !== null;
  }

  private validateSpotifyClientIdOrPassword(value: string) {
    return /^[a-zA-Z0-9]{32}$/.test(value);
  }
}
