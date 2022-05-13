/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import Fetcher from './fetcher.js'
import Point from './point.js'
import Step from './step.js'
import ExecutionInfo from './execution-info.js'
import RouteResponse from './route-response.js'

export default class TLibFetcher extends Fetcher {
    // Use this class to control the tlib data
    static TAG = 'tlib'

    constructor() {
        super({
            'url': TLIB_SVR_URL,
            'test': TLIB_TEST_API,
            'mode': FETCH_MODE_PROD,
        })

        this.initPolyLines()
    }

    initPolyLines() {
        this.routePolyLine = new kakao.maps.Polyline(TLIB_ROUTE_POLYLINE)
        this.pointPolyLine = new kakao.maps.Polyline(TLIB_POINT_POLYLINE)
        this.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)
    }

    async fetchRoutePath(req) {
        const header = this.parseRequest(req)

        const sTime = performance.now()
        const body = await (await fetch(header.url, header.config)).json()
        const duration = performance.now() - sTime

        const info = this.parseInfo(body, duration)
        const route = this.parseRoute(body)

        return new RouteResponse(TLibFetcher.TAG, info, route).toObject()
    }

    parseRequest(req) {
        let url
        let config
        if (this.isTestMode()) {
            url = this.serverInfo.test
            config = {
                method: 'GET'
            }
        } else {
            url = `${this.serverInfo.url}/TSP_find_shortest4`
            config = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: serialize(req)
            }
        }

        return {
            'url': url,
            'config': config,
        }
    }

    parseInfo(body, duration) {
        return new ExecutionInfo(body.SPathList.total_cost, body.SPathList.use_time, duration)
    }

    parseRoute(data) {
        const steps = new Map()
        data.SPathList.paths.forEach(path => {
            const step = new Step(path.id, path.id)
            step.point = new Point(path.SPoint.x, path.SPoint.y)
            step.position = new kakao.maps.LatLng(path.SPoint.y, path.SPoint.x)
            step.distance = path.cost

            step.nodes = []
            path.SLineString.nodes.forEach(node => {
                step.nodes.push(new kakao.maps.LatLng(node.y, node.x))
            })
            steps.set(path.id, step)
        })

        return steps
    }
}