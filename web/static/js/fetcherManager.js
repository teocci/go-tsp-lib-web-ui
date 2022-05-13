/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import TLibFetcher from './tlib-fetcher.js'
import TMapFetcher from './tmap-fetcher.js'
import BaseListener from './base-listener.js'

export default class FetcherManager extends BaseListener{
    static LISTENER_ALL_DATA_FETCHED = 'on-all-data-fetched'
    constructor() {
        super()

        this.tlibManager = new TLibFetcher()
        this.tmapManager = new TMapFetcher()
    }

    executeRequest(path, apis) {
        console.log({path, apis: apis})
        const req = path.toRequest()

        this.start(req, apis).then(data => {
            console.log({data})
            this.callListener(FetcherManager.LISTENER_ALL_DATA_FETCHED, data)
        })
    }

    async start(req, apis) {
        const [a, b] = await Promise.all([
            (async () => {
                if (apis.tlib) return this.tlibManager.fetchRoutePath(req);
            })(),
            (async () => {
                if (apis.tlib) return this.tmapManager.fetchRoutePath(req)
            })(),
        ])

        const tlib = await a ?? null
        const tmap = await b ?? null

        const data = []
        if (tlib != null) data.push(tlib)
        if (tmap != null) data.push(tmap)

        return data
    }
}