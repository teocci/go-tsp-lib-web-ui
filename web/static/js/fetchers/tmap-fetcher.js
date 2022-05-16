/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import BaseFetcher from '../base/base-fetcher.js'
import TMapAPI from '../apis/tmap-api.js'
import Route from '../geo/route.js'
import Point from '../geo/point.js'
import Step from '../geo/step.js'
import Path from '../geo/path.js'
import ExecutionInfo from './execution-info.js'
import RouteResponse from './route-response.js'

export default class TMapFetcher extends BaseFetcher {
    // Use this class to control the tmap data
    constructor() {
        super(TMapAPI.instance())

        this.initPolyLines()
    }

    initPolyLines() {
        this.routePolyLine = new kakao.maps.Polyline(TMAP_ROUTE_POLYLINE)
        this.pointPolyLine = new kakao.maps.Polyline(TMAP_POINT_POLYLINE)
        this.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)
    }

    async fetchRoutePath(req) {
        const config = this.prepareRouteRequest(req)

        const data = await this.fetch(config)

        const info = this.parseInfo(data.body, data.duration)
        const route = this.parseRoute(data.body)

        return new RouteResponse(TMapAPI.TAG, info, route).toObject()
    }

    prepareRouteRequest(req) {
        const num = req.SPointList.nodes.length + 1
        if (num < 10) throw new Error('InvalidLength: tmap request is possible when the number of delivery destinations is 10, 20, 30, 100.')

        const type = 'find-route'

        let url, options
        if (this.isRequestTestMode(type)) {
            url = this.testResponse(type)
            options = {
                method: 'GET'
            }
        } else {
            const re = /#/gi
            url = this.apiURL().replace(re, `${num}`)
            options = {
                method: 'POST',
                headers: {
                    'appKey': this.apiKey(),
                    'Content-type': 'application/json'
                },
                body: serialize(this.makeTMapReqObject(req))
            }
        }

        console.log({url, options})

        return {
            'url': url,
            'options': options,
        }
    }

    parseInfo(body, duration) {
        return new ExecutionInfo(body.properties.totalDistance, body.properties.totalTime, duration)
    }

    parseRoute(data) {
        const route = new Route(TMapAPI.TAG)

        data.features.forEach(feature => {
            const id = parseInt(feature.properties.index)
            const x = feature.geometry.coordinates[0]
            const y = feature.geometry.coordinates[1]

            let step
            if (id === 0) {
                step = new Step(0, 'base')
                route.baseStep = step
            } else if (id > 0) {
                if (!route.has(id)) route.addStep(id, new Step(id, id))
                step = route.step(id)
            }

            if (feature.geometry.type === 'Point') {
                step.distance = feature.properties.distance
                step.point = new Point(x, y)
                step.position = new kakao.maps.LatLng(y, x)
            }

            if (feature.geometry.type === 'LineString') {
                step.path = new Path()
                step.path.start = step.position
                step.path.nodes = []
                feature.geometry.coordinates.forEach(coord => {
                    step.path.nodes.push(new kakao.maps.LatLng(coord[1], coord[0]))
                })
                step.path.end = step.path.nodes.pop()
            }
        })

        return route
    }

    makeTMapReqObject(req) {
        const tmapReq = {
            'reqCoordType': 'WGS84GEO',
            'resCoordType': 'WGS84GEO',
            'startName': '출발',
            'startX': req.SPoint.x.toString(),
            'startY': req.SPoint.y.toString(),
            'startTime': serializeDate(),
            'endName': '도착',
            'endX': req.EPoint.x.toString(),
            'endY': req.EPoint.y.toString(),
            'searchOption': '',
            'viaPoints': [],
        }

        const nodes = req.SPointList.nodes
        nodes.forEach((n, i) => {
            tmapReq['viaPoints'].push({
                'viaPointId': 'test' + addPadding(i, 2),
                'viaPointName': 'test' + addPadding(i, 2),
                'viaX': n.x.toString(),
                'viaY': n.y.toString(),
            })
        })

        return tmapReq
    }
}