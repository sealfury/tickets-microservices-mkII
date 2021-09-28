import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    // adjust nats connect function to make it async (like mongoose)
    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })
      this._client!.on('error', err => {
        reject(err)
      })
    })
  }
}

// export one single instance to share w/ all files
export const natsWrapper = new NatsWrapper()
