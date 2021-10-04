import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan

  // prevent access to client until connect is run
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting!')
    }

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    // adjust nats connect function to make it async (like mongoose)
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })
      this.client.on('error', err => {
        reject(err)
      })
    })
  }
}

// export one single instance to share w/ all files
export const natsWrapper = new NatsWrapper()
