import { ClientEntity } from '../../client/entities/client.entity.js';

export interface InitializeOptionsInterface {
  clientId: ClientEntity['id'];
  clientSecret: ClientEntity['secret'];
  start: 'Yes' | 'No' | `I'm ready!`;
  redirectUriPort: string;
}
