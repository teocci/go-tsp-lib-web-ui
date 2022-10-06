/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import TLibFetcher from '../fetchers/tlib-fetcher.js'
import TMapFetcher from '../fetchers/tmap-fetcher.js'
import BaseListener from '../base/base-listener.js'

export default class FetcherManager extends BaseListener {

    static LISTENER_FIX_POINTS_FETCHED = 'on-fix-points-fetched'
    static LISTENER_ALL_DATA_FETCHED = 'on-all-data-fetched'

    constructor() {
        super()

        this.tlibManager = new TLibFetcher()
        this.tmapManager = new TMapFetcher()
    }

    fetchFixPoints(points) {
        this.tlibManager.fetchFixPoints(points).then(data => {
            const [first] = points
            const body = data.body
            if (first.name !== undefined) {
                body.FixPoint.EPoint.name = first.name
                body.FixPoint.SPoint.name = first.name
                body.FixPoint.pts.forEach((pt, idx) => {
                    pt.name = points[idx + 1].name
                })
            }

            mainModule.onFixPointsFetched(body)
        })
    }

    fetchRoutes(req, apis) {
        console.log({req, apis})

        this.runParallelRequests(req, apis).then(data => {
            mainModule.onAllDataFetched(data)
        })
    }

    async runParallelRequests(req, apis) {
        const [a, b] = await Promise.all([
            (async () => {
                if (apis.tlib) return this.tlibManager.fetchRoutePath(req)
            })(),
            (async () => {
                if (apis.tmap) return this.tmapManager.fetchRoutePath(req)
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