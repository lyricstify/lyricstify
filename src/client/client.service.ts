import { Injectable } from '@nestjs/common';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { CreateClientDto } from './dto/create-client-dto.js';
import { ClientEntity } from './entities/client.entity.js';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: DataSourceRepository<ClientEntity>,
  ) {}

  async replace(createClientDto: CreateClientDto) {
    return await this.clientRepository.replace(createClientDto);
  }

  async findOne() {
    return await this.clientRepository.find();
  }
}
