export type Where = {
  clause: string,
  params?: {
    [key: string]: any
  }
}

export default class Table {
  #tableName;

  constructor(tableName: string) {
    this.#tableName = tableName;
  }

  get tableName() {
    return this.#tableName;
  }

  async save(item: any) {}

  async update(where: Where) {}

  async delete(where: Where) {}
}