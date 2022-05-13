/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import Fetcher from './fetcher.js'
import ExecutionInfo from './execution-info.js'

export default class TMapFetcher extends Fetcher {
    static TAG = 'tmap'

    // Use this class to control the tmap data
    constructor() {
        super({
            'url': TMAP_SVR_URL,
            'test': TMAP_TEST_API,
            'mode': FETCH_MODE,
        })

        this.initPolyLines()
    }

    initPolyLines() {
        this.routePolyLine = new kakao.maps.Polyline(TMAP_ROUTE_POLYLINE)
        this.pointPolyLine = new kakao.maps.Polyline(TMAP_POINT_POLYLINE)
        this.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)
    }

    async fetchRoutePath(req) {
        const header = this.parseRequest(req)

        const sTime = performance.now()
        fetch(header.url, header.config).then(response => response.json()).then(body => {
            const duration = performance.now() - sTime
            const execInfo = new ExecutionInfo(body.properties.totalDistance, body.properties.totalTime, duration)

            const callback = this.listener(Fetcher.LISTENER_DATA_FETCHED) ?? null
            if (callback) callback(execInfo.toJSON())
        })
    }

    parseRequest(req) {
        const num = req.SPointList.nodes.length + 1
        if (num < 10) throw new Error('InvalidLength: tmap request is possible when the number of delivery destinations is 10, 20, 30, 100.')

        const re = /#/gi

        let url
        let config
        if (this.isTestMode()) {
            url = this.serverInfo.test
            config = {
                method: 'GET'
            }
        } else {
            url = this.serverInfo.url.replace(re, `${num}`)
            config = {
                method: 'POST',
                headers: {
                    'appKey': T_MAP_APP_KEY,
                    'Content-type': 'application/json'
                },
                body: serialize(this.makeTMapReqObject(req))
            }
        }

        return {
            'url': url,
            'config': config,
        }
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