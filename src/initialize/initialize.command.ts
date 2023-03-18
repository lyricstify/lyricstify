import chalk from 'chalk';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import ora from 'ora';
import terminalLink from 'terminal-link';
import { CommandValidationService } from '../command-validation/command-validation.service.js';
import { InitializeOptionsDto } from './dto/initialize-options.dto.js';
import { RequestAuthorizationDto } from './dto/request-authorization.dto.js';
import { InitializeService } from './initialize.service.js';
import { InitializeOptionsInterface } from './interfaces/initialize-options.interface.js';

@Command({ name: 'init', description: 'Initialize Lyricstify configuration' })
export class InitializeCommand extends CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly initializeService: InitializeService,
    private readonly commandValidationService: CommandValidationService,
  ) {
    super();
  }

  async run(inputs: string[], options: InitializeOptionsInterface) {
    this.commandValidationService.validateInputsCommandOrFail(inputs);

    const answers = await this.inquirerService.ask('initialize', options);

    if (answers.start === 'No') {
      process.exit();
    }

    const requestAuthorizationDto = new RequestAuthorizationDto({
      clientId: answers.clientId,
      redirectUriPort: Number(answers.redirectUriPort),
    });
    const initializeOptionsDto = new InitializeOptionsDto({
      id: answers.clientId,
      secret: answers.clientSecret,
      redirectUri: requestAuthorizationDto.redirectUri,
      redirectUriPort: answers.redirectUriPort,
    });
    const link = this.initializeService.createAuthorizationLink(
      requestAuthorizationDto,
    );

    console.info(
      `Please open ${chalk.bold(
        terminalLink('this link', link),
      )} to start authorize.`,
    );

    const loading = ora('We are waiting for you to finish.').start();
    const result = await this.initializeService.authorize(initializeOptionsDto);

    loading.stop();

    if (result.status === 'SUCCESS') {
      console.info(result.message);
    } else {
      console.error(result.message);
    }
  }

  @Option({
    flags: '--client-id <client-id>',
    description:
      'The client ID for your app, available from the Spotify developer dashboard.',
  })
  parseClientId(val: string) {
    this.commandValidationService.validateSpotifyClientIdentityOrFail(
      val,
      'id',
    );

    return val;
  }

  @Option({
    flags: '--client-secret <client-secret>',
    description:
      'The secret key for authenticating the app to access your Spotify account.',
  })
  parseClientSecret(val: string) {
    this.commandValidationService.validateSpotifyClientIdentityOrFail(
      val,
      'password',
    );

    return val;
  }

  @Option({
    flags: '--redirect-uri-port <redirect-uri-port>',
    description:
      'The URI port to redirect to after the user grants or denies permission.',
  })
  parseRedirectUriPort(val: string) {
    const redirectUriPort = Number(val);

    this.commandValidationService.validateRedirectUriPortOrFail(
      redirectUriPort,
    );

    return redirectUriPort;
  }
}
