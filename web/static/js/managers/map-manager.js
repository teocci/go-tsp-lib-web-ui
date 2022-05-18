/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BaseListener from '../base/base-listener.js'
import Polyline from '../geo/polyline.js'
import Point from '../geo/point.js'
import Overlay from '../geo/overlay.js'

export default class MapManager extends BaseListener {
    static TAG = 'map'

    static POLYLINE_TYPES = [
        POLYLINE_TYPE_ROUTE,
        POLYLINE_TYPE_POINTS,
        POLYLINE_TYPE_SEGMENT,
    ]

    static LISTENER_ADD_CLICKED = 'on-add-point'
    static LISTENER_FINISH_CLICKED = 'finished-click-mode'

    constructor(panel) {
        if (!panel) throw 'InvalidPanel: null panel'

        super()

        this.panel = panel

        this.map = null
        this.markers = new Map()
        this.routes = new Map()
        this.overlays = new Map()

        this.handlerOnClick = null

        this.initPanel()
        this.initMapListeners()
    }

    initPanel() {
        const placeholder = this.panel.placeholder
        const options = {
            center: new kakao.maps.LatLng(36.4310406, 127.3934052),
            level: 3
        }

        this.map = new kakao.maps.Map(placeholder, options)
        kakaoMap = this.map
    }

    initMapListeners() {

        this.handlerOnClick = e => {
            this.mapClickListener(e)
        }

    }

    activateClickListener() {
        const map = this.map
        map.setCursor('pointer')
        kakao.maps.event.addListener(map, 'click', this.handlerOnClick)

        kakao.maps.event.addListener(map, 'rightclick', me => {
            this.map.setCursor(null)
            this.callListener(MapManager.LISTENER_FINISH_CLICKED, me)
            kakao.maps.event.removeListener(map, 'click', this.handlerOnClick)
        })
    }

    mapClickListener(me) {
        //call the listener. send data to main-moudle.
        this.callListener(MapManager.LISTENER_ADD_CLICKED, me)
    }

    loadMarkers(steps) {
        steps.forEach((step, i) => this.loadMarkerFromStep(step, i))
    }

    loadMarkerFromStep(step, i) {
        const marker = this.makeMarker(step.label, step.position, i)
        this.appendMarker(marker)
    }

    loadMarker(pos, i) {
        const title = i === 0 ? 'start' : `${i}`
        const marker = this.makeMarker(title, pos, i)
        this.appendMarker(marker)
    }

    makeMarker(title, pos, i) {
        const marker = new kakao.maps.Marker()
        marker.setPosition(pos)
        marker.setTitle(title)
        marker.setImage(i === 0 ? MARKERS.start : MARKERS.waypoint)
        marker.setMap(this.map)

        return marker
    }

    appendMarker(marker) {
        this.markers.set(this.markers.size, marker)
    }

    removeMarkers() {
        this.markers.forEach(m => m.setMap(null))
        this.markers = new Map()
    }

    loadRoutes(data) {
        data.forEach(r => this.addRoute(r.api, r.route))
        console.log({routes: this.routes})
    }

    addRoute(api, route) {
        if (!api) throw new Error('InvalidAPI: null apis')
        if (!route) throw new Error('InvalidRoute: null route')

        route.loadPLPaths()
        this.routes.set(api, route)
    }

    loadOverlays(data) {
        data.forEach(r => this.loadOverlay(r.api, r.route))
        console.log({overlays: this.overlays})
    }

    loadOverlay(api, route) {
        const map = this.map
        route.steps.forEach(step => {
            const overlay = this.findOverlay(route.api, step) ?? this.makeOverlay(step)
            overlay.position = step.position
            overlay.updateTagByAPI(api, step.id, step.label)
            overlay.activateTagByAPI(api)
            overlay.render(map)
        })
    }

    findOverlay(api, step) {
        for (const overlay of this.overlays.values()) {
            const p = new Point(truncate(overlay.position.getLng(), 5), truncate(overlay.position.getLat(), 5))
            const q = new Point(truncate(step.position.getLng(), 5), truncate(step.position.getLat(), 5))

            if (p.equals(q)) {
                return overlay
            }
        }

        return null
    }

    makeOverlay() {
        const overlay = new Overlay()
        this.appendOverlay(overlay)

        return overlay
    }

    appendOverlay(overlay) {
        const id = this.overlaysSize()
        this.overlays.set(id, overlay)

        return id
    }

    overlaysSize() {
        return this.overlays?.size ?? 0
    }

    activateOTagByAPI(api){
        this.overlays.forEach(o => o.activateTagByAPI(api))
    }

    deactivateOTagByAPI(api){
        this.overlays.forEach(o => o.deactivateTagByAPI(api))
    }

    routeByAPI(api) {
        return this.routes.get(api) ?? null
    }

    renderRouteByAPI(api, type) {
        this.renderRoute(this.routeByAPI(api), type)
    }

    renderRoutes(type) {
        console.log({type})
        this.routes.forEach(route => this.renderRoute(route, type))
    }

    renderRoute(route, type) {
        const pl = route.polyline(type)
        pl.render(this.map)
    }

    removeRouteByAPI(api, type) {
        this.removeRoute(this.routeByAPI(api), type)
    }

    removeRoute(route, type) {
        const pl = route.polyline(type)
        console.log({route, type, pl})
        pl.remove()
    }

    renderSegment(api, stepId) {
        const type = Polyline.TYPE_SEGMENT
        const route = this.routeByAPI(api)
        const pl = route.polyline(type)
        const path = route.pathByType(type, stepId)
        console.log({route, type, pl, path})

        pl.load(path)
        pl.render(this.map)
    }

    moveMapToBase(api) {
        const route = this.routeByAPI(api)
        const step = route.baseStep
    }

    moveMapToStep(api, stepId = null) {
        const route = this.routeByAPI(api)
        const step = route.step(stepId) ?? route.baseStep
        console.log({route, step})

        this.moveMapTo(step.position)
    }

    moveMapTo(pos) {
        if (!pos) throw new Error('InvalidPosition: null pos')

        this.map.setCenter(pos);
    }

    // drawTSPLine(lines) {
    //     let linePath = []
    //     let pointPath = []
    //     let pointInfos = []
    //
    //     lines.SPathList.paths.forEach(path => {
    //         let obj = {
    //             pos: new kakao.maps.LatLng(path.SPoint.y, path.SPoint.x),
    //             id: path.id - 1,  //path.id가 1부터 옴.
    //             cost: path.cost
    //         };
    //         pointInfos.push(obj);
    //
    //         pointPath.push(new kakao.maps.LatLng(path.SPoint.y, path.SPoint.x));
    //
    //         path.SLineString.nodes.forEach(element => {
    //             linePath.push(new kakao.maps.LatLng(element.y, element.x))
    //         })
    //
    //         pointTable.putTLibPoint(obj.id, path.SPoint.x, path.SPoint.y);
    //
    //     })
    //
    //     //trigger tsp complete event
    //     pointTable.tlib = true
    //
    //     let overlayPromise = new Promise((resolve, reject) => {
    //         resolve()
    //     })
    //
    //     overlayPromise.then(() => {
    //         if (pointTable.tlib && pointTable.tmap) {
    //             console.log('tlib promise..')
    //
    //             resultsPanel.initOverlay(pointTable, map)
    //             resultsPanel.initDetailRouteTable(tsp, tmap)
    //
    //             pointTable.tlib = false;
    //             pointTable.tmap = false;
    //         }
    //     })
    //
    //     tsp.routePolyLine.setPath(linePath)
    //     tsp.routePolyLine.setMap(map)
    //
    //     tsp.route.lines = lines.SPathList.paths
    //     tsp.route.linePath = linePath
    //
    //     pointPath.push(pointPath[0]) //경유점 표현시 마지막 포인트로 되돌아가게
    //
    //     tsp.route.pointPath = pointPath
    //     tsp.route.pointInfos = pointInfos
    // }
    //
    // drawTLibLinePartly(id) {
    //     console.log({drawTLibLinePartly: id})
    //
    //     let path = []
    //     tsp.partlyPolyLine.setMap(null);
    //     tsp.route.lines.forEach(line => {
    //         if (line.id === id) {
    //             path.push(new kakao.maps.LatLng(line.SPoint.y, line.SPoint.x))
    //             line.SLineString.nodes.forEach(node => {
    //                 path.push(new kakao.maps.LatLng(node.y, node.x))
    //             })
    //             path.push(new kakao.maps.LatLng(line.EPoint.y, line.EPoint.x))
    //         }
    //     })
    //     tsp.partlyPolyLine.setPath(path)
    //     tsp.partlyPolyLine.setMap(map);
    //
    // }
    //
    // drawTMapLinePartly(id) {
    //     let path = []
    //     console.log(`after :  id : ${id}`)
    //     tmap.route.lines.features.forEach(feature => {
    //
    //         if (parseInt(feature.properties.index) === id) {
    //             if (feature.geometry.type === 'Point') {
    //                 let x = feature.geometry.coordinates[0];
    //                 let y = feature.geometry.coordinates[1];
    //                 path.push(new kakao.maps.LatLng(y, x))
    //             } else {
    //                 feature.geometry.coordinates.forEach(coord => {
    //                     let x = coord[0]
    //                     let y = coord[1]
    //                     path.push(new kakao.maps.LatLng(y, x))
    //                 });
    //             }
    //         }
    //     })
    //
    //     tmap.partlyPolyLine.setPath(path)
    //     tmap.partlyPolyLine.setMap(map);
    // }
    //
    // drawTMapLine(lines) {
    //     let linePath = []
    //     let pointPath = []
    //     let pointInfos = []
    //
    //     lines.features.forEach(feature => {
    //         if (feature.geometry.type === 'Point') {
    //             let x = feature.geometry.coordinates[0];
    //             let y = feature.geometry.coordinates[1];
    //
    //             let obj = {
    //                 pos: new kakao.maps.LatLng(y, x),
    //                 id: parseInt(feature.properties.index),
    //                 cost: 0,
    //             }
    //
    //             pointPath.push(new kakao.maps.LatLng(y, x))
    //
    //             pointInfos.push(obj)
    //             if (obj.id < pointTable.points.length) {
    //                 pointTable.putTMapPoint(obj.id, x, y)
    //             }
    //
    //         } else {
    //             feature.geometry.coordinates.forEach(coord => {
    //                 let x = coord[0]
    //                 let y = coord[1]
    //                 linePath.push(new kakao.maps.LatLng(y, x))
    //             });
    //         }
    //     });
    //
    //     pointTable.tmap = true;
    //     // Trigger tmap complete event
    //     let overlayPromise = new Promise((resolve, reject) => {
    //         resolve()
    //     })
    //
    //     overlayPromise.then(() => {
    //         if (pointTable.tmap && pointTable.tlib) {
    //             console.log('tmap promise..')``
    //
    //             resultsPanel.initOverlay(pointTable, map)
    //             resultsPanel.initDetailRouteTable(tsp, tmap)
    //
    //             pointTable.tlib = false;
    //             pointTable.tmap = false;
    //         }
    //     })
    //
    //     tmap.routePolyLine.setPath(linePath)
    //     tmap.routePolyLine.setMap(map)
    //
    //     tmap.route.lines = lines
    //     tmap.route.linePath = linePath
    //     tmap.route.pointPath = pointPath
    //     tmap.route.pointInfos = pointInfos
    // }

    // MBR 가져오기
    mapBounds() {
        const bounds = this.map.getBounds().toString().split(',')
        const minX = bounds[0].replace('((', '')
        const minY = bounds[1].replace(')', '')
        const maxX = bounds[2].replace('(', '')
        const maxY = bounds[3].replace('))', '')
        console.log({bounds})

        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
        }
    }
}