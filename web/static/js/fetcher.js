/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BaseListener from './base-listener.js'

export default class Fetcher extends BaseListener {
    static LISTENER_DATA_FETCHED = 'on-data-fetched'

    constructor(info) {
        super()
        this.serverInfo = info

        this.route = {}

        this.initStruct()
    }

    initStruct() {
        this.route.lines = [] //original response from tsp or tmap`
        this.route.linePath = [] // for route
        this.route.pointPath = [] //for point route, 경유지
        this.route.pointInfos = []

        this.routePolyLine = {}
        this.pointPolyLine = {}
        this.partlyPolyLine = {}

        this.routeOverlay = []
        this.pointOverlay = []
    }

    clearMap() {
        this.routePolyLine.setMap(null)
        this.pointPolyLine.setMap(null)
        this.partlyPolyLine.setMap(null)

        this.routeOverlay.forEach(element => {
            element.setMap(null)
        })

        this.pointOverlay.forEach(element => {
            element.setMap(null)
        })
    }

    reset() {
        this.clearMap()
        this.initStruct()
        this.initPolyLines()
    }

    initPolyLines() {
    }

    isTestMode() {
        return this.serverInfo.mode === FETCH_MODE_TEST
    }

    fetchRoutePath(req) {
        throw new Error('Abstract Method has no implementation')
    }

    parseRequest() {
        throw new Error('Abstract Method has no implementation')
    }

    parseRoute() {
        throw new Error('Abstract Method has no implementation')
    }
}