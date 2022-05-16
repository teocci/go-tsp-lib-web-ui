/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import BaseFetcher from '../base/base-fetcher.js'
import TLibAPI from '../apis/tlib-api.js'
import Route from '../geo/route.js'
import Point from '../geo/point.js'
import Step from '../geo/step.js'
import Path from '../geo/path.js'
import ExecutionInfo from './execution-info.js'
import RouteResponse from './route-response.js'

export default class TLibFetcher extends BaseFetcher {
    // Use this class to control the tlib data
    constructor() {
        super(TLibAPI.instance())
    }

    // async fetchRoutePath(req) {
    //     const config = this.parseRequest(req)
    //
    //     const sTime = performance.now()
    //     const body = await (await fetch(config.url, config.options)).json()
    //     const duration = performance.now() - sTime
    //
    //     const info = this.parseInfo(body, duration)
    //     const route = this.parseRoute(body)
    //
    //     return new RouteResponse(TLibAPI.TAG, info, route).toObject()
    // }

    async fetchRoutePath(req) {
        const config = this.prepareRouteRequest(req)

        const data = await this.fetch(config)

        const info = this.parseInfo(data.body, data.duration)
        const route = this.parseRoute(data.body)

        return new RouteResponse(TLibAPI.TAG, info, route).toObject()
    }

    prepareRouteRequest(req) {
        const type = REQUEST_FIND_ROUTE

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
            step.point = new Point(path.SPoint.x, path.SPoint.y)
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