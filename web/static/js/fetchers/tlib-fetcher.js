/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import Fetcher from '../fetcher.js'
import TLibAPI from '../apis/tlib-api.js'
import Route from '../geo/route.js'
import Step from '../geo/step.js'
import Path from '../geo/path.js'
import ExecutionInfo from './execution-info.js'
import RouteResponse from './route-response.js'

export default class TLibFetcher extends Fetcher {
    // Use this class to control the tlib data
    constructor() {
        super(TLibAPI.instance())

        this.initPolyLines()
    }

    initPolyLines() {
        this.routePolyLine = new kakao.maps.Polyline(TLIB_ROUTE_POLYLINE)
        this.pointPolyLine = new kakao.maps.Polyline(TLIB_POINT_POLYLINE)
        this.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)
    }

    async fetchRoutePath(req) {
        const config = this.parseRequest(req)

        console.log(config)

        const sTime = performance.now()
        const body = await (await fetch(config.url, config.options)).json()
        const duration = performance.now() - sTime

        const info = this.parseInfo(body, duration)
        const route = this.parseRoute(body)

        return new RouteResponse(TLibAPI.TAG, info, route).toObject()
    }

    parseRequest(req) {
        const type = 'find-route'

        let url, options
        if (this.isRequestTestMode(type)) {
            url = this.testResponse(type)
            options = {
                method: 'GET'
            }
        } else {
            url = `${this.apiURL()}/TSP_find_shortest4`
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: serialize(req),
            }
        }

        return {
            'url': url,
            'options': options,
        }
    }

    parseInfo(body, duration) {
        return new ExecutionInfo(body.SPathList.total_cost, body.SPathList.use_time, duration)
    }

    parseRoute(data) {
        const route = new Route(TLibAPI.TAG)
        data.SPathList.paths.forEach(path => {
            const step = new Step(path.id, path.id)
            step.distance = path.cost

            step.path = new Path()
            step.path.start = new kakao.maps.LatLng(path.SPoint.y, path.SPoint.x)
            step.path.end  = new kakao.maps.LatLng(path.EPoint.y, path.EPoint.x)
            step.path.nodes = []
            path.SLineString.nodes.forEach(node => {
                step.path.nodes.push(new kakao.maps.LatLng(node.y, node.x))
            })
            step.position = step.path.start

            route.addStep(path.id, step)
        })

        return route
    }
}