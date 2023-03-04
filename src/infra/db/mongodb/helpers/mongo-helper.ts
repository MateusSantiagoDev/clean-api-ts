import { MongoClient, Collection, } from 'mongodb'

export const MongoHelper = {
  Client: null as MongoClient,
  Url: null as string,

  async connect (Url: string) {
    this.Url = Url
    this.Client = await MongoClient.connect(Url)
  },

  async disconnect () {
    await this.Client.disconnect()
    this.Client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.Client) {
      await this.connect(this.url)
    }
    return this.Client.db().collection(name)
  },

  mapper: (collection: any): any => {
    const { _id, ...collectionData } = collection
    return Object.assign({}, collectionData, { id: _id })
  }
}