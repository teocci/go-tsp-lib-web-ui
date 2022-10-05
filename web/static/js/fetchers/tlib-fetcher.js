/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import BaseFetcher from '../base/base-fetcher.js'
import TLibAPI from '../apis/route/tlib-api.js'
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

    async fetchFixPoints(points) {
        if (!points) throw new Error('InvalidPoints: null points')
        console.log({points})

        const [start, ...rest] = points
        const req = {
            SPoint: start,
            EPoint: start,
            SPointList: {
                nodes: rest,
            },
        }

        const config = this.prepareFixPointsRequest(req)

        return await this.fetch(config)
    }

    async fetchRoutePath(req) {
        const config = this.prepareRouteRequest(req)

        const data = await this.fetch(config)

        const info = this.parseInfo(data.body, data.duration)
        const route = this.parseRoute(data.body)

        return new RouteResponse(TLibAPI.TAG, info, route).toObject()
    }

    prepareFixPointsRequest(req) {
        const type = REQUEST_FIX_POINTS
        const url = `${this.apiURL}/fix_points`

        return this.prepareRequest(type, url, req)
    }

    prepareRouteRequest(req) {
        const type = REQUEST_FIND_ROUTE
        const url = `${this.apiURL}/TSP_find_shortest4`

        return this.prepareRequest(type, url, req)
    }

    prepareRequest(type, prod_url, req) {
        const url = this.isRequestTestMode(type) ? this.testResponse(type) : prod_url
        let options = {
            method: this.isRequestTestMode(type) ? 'GET' : 'POST',
        }

        if (!this.isRequestTestMode(type)) {
            const optionsExt = {
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: serialize(req),
            }
            options = {...options, ...optionsExt}
        }

        console.log({url, options})

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
        let step
        data.SPathList.paths.forEach((path, i) => {
            step = new Step(path.id, path.id)
            step.distance = path.cost

            step.path = new Path()
            step.point = new Point(path.SPoint.x, path.SPoint.y)
            step.path.start = new kakao.maps.LatLng(path.SPoint.y, path.SPoint.x)
            step.path.end = new kakao.maps.LatLng(path.EPoint.y, path.EPoint.x)
            step.path.nodes = []
            path.SLineString?.nodes.forEach(node => {
                step.path.nodes.push(new kakao.maps.LatLng(node.y, node.x))
            })
            step.position = step.path.end

            if (i === 0) {
                route.baseStep = new Step(i, '시작점')
                route.baseStep.type = Step.TYPE_START
                route.baseStep.point = step.point
                route.baseStep.position = step.path.start
            }

            route.addStep(path.id, step)
        })
        step.type = Step.TYPE_END

        return route
    }
}