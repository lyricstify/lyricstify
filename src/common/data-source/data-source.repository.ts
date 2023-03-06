import { Low } from 'lowdb';

export class DataSourceRepository<T> {
  constructor(private readonly db: Low<T>) {}

  async replace(data: T) {
    this.db.data = data;

    await this.db.write();

    return this.db.data;
  }

  async find() {
    await this.db.read();

    return this.db.data;
  }
}
