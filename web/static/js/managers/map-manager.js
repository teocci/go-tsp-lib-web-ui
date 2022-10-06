/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BaseListener from '../base/base-listener.js'
import Point from '../geo/point.js'
import Polyline from '../geo/polyline.js'
import Overlay from '../geo/overlay.js'
import OverlayTags from '../geo/overlay-tags.js'
import OverlayLabel from '../geo/overlay-label.js'

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
        this.handlerOnClick = null

        this.markers = new Map()
        this.routes = new Map()
        this.tagOverlays = new Map()
        this.labelOverlays = new Map()

        this.initMapPanel()
        this.initMapListeners()
    }

    initMapPanel() {
        const placeholder = this.panel.placeholder
        const options = {
            center: new kakao.maps.LatLng(CENTER.y, CENTER.x),
            level: DEFAULT_MAP_LEVEL,
        }

        this.map = new kakao.maps.Map(placeholder, options)
    }

    initMapListeners() {
        this.handlerOnClick = e => {
            this.mapClickListener(e)
        }
    }

    reset() {
        this.resetMarkers()
        this.resetRoutes()
        this.resetTagsOverlays()
        this.resetLabelOverlays()
        this.deactivateClickListener()
    }

    activateClickListener() {
        const map = this.map
        map.setCursor('pointer')
        kakao.maps.event.addListener(map, 'click', this.handlerOnClick)

        kakao.maps.event.addListener(map, 'rightclick', me => {
            this.deactivateClickListener()
            mainModule.onMapClickFinished(me)
        })
    }

    deactivateClickListener() {
        this.map.setCursor(null)
        kakao.maps.event.removeListener(this.map, 'click', this.handlerOnClick)
    }

    mapClickListener(me) {
        // Call the listener. send data to main-module.
        // this.callListener(MapManager.LISTENER_ADD_CLICKED, me)
        mainModule.onMapClicked(me)
    }

    loadMarkers(steps) {
        steps.forEach((step, i) => {
            this.loadMarkerFromStep(step, i)
            this.loadLabelOverlayFromStep(step, i)
        })
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
        const map = this.map
        const marker = new kakao.maps.Marker()
        marker.setPosition(pos)
        marker.setTitle(title)
        marker.setImage(i === 0 ? MARKERS.start : MARKERS.waypoint)
        marker.setMap(map)
        marker.setZIndex(1)

        return marker
    }

    appendMarker(marker) {
        this.markers.set(this.markers.size, marker)
    }

    resetMarkers() {
        this.markers.forEach(m => {
            m.setMap(null)
        })
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

    resetRoutes() {
        this.routes.forEach(r => {
            r.resetSteps()
            r.resetPolylines()
        })
        this.routes = new Map()
    }

    loadTagsOverlays(data) {
        data.forEach(r => this.loadTagsOverlay(r.api, r.route))
    }

    loadTagsOverlay(api, route) {
        const map = this.map
        route.steps.forEach(step => {
            const overlay = this.findTagsOverlay(step) ?? this.makeTagsOverlay(step)
            overlay.position = step.position
            overlay.updateTagByAPI(api, step.id, step.label)
            overlay.activateTagByAPI(api)
            overlay.render(map)
        })
    }

    // TODO replace with position
    findTagsOverlay(step) {
        for (const overlay of this.tagOverlays.values()) {
            const p = new Point(truncate(overlay.position.getLng(), 5), truncate(overlay.position.getLat(), 5))
            const q = new Point(truncate(step.position.getLng(), 5), truncate(step.position.getLat(), 5))
            if (p.equals(q)) return overlay
        }

        return null
    }

    makeTagsOverlay() {
        const overlay = new OverlayTags()
        this.appendTagsOverlay(overlay)

        return overlay
    }

    appendTagsOverlay(overlay) {
        const id = this.tagsOverlaysSize()
        this.tagOverlays.set(id, overlay)

        return id
    }

    tagsOverlaysSize() {
        return this.tagOverlays?.size ?? 0
    }

    resetTagsOverlays() {
        this.tagOverlays.forEach(ol => ol.remove())
        this.tagOverlays = new Map()
    }

    activateOTagByAPI(api) {
        this.tagOverlays.forEach(o => o.activateTagByAPI(api))
    }

    deactivateOTagByAPI(api) {
        this.tagOverlays.forEach(o => o.deactivateTagByAPI(api))
    }

    loadLabelOverlays(steps) {
        steps.forEach((step, i) => this.loadLabelOverlayFromStep(step, i))
    }

    loadLabelOverlayFromStep(step, i) {
        const overlay = this.makeLabelOverlay(step.name, step.position, i)
        this.appendLabelOverlay(overlay)
    }

    makeLabelOverlay(label, position, index) {
        const map = this.map
        const overlay = new OverlayLabel()
        overlay.index = index
        overlay.updateLabel(label)
        overlay.position = position
        overlay.render(map)

        return overlay
    }

    appendLabelOverlay(overlay) {
        const id = this.labelOverlaysSize()
        this.labelOverlays.set(id, overlay)

        return id
    }

    labelOverlaysSize() {
        return this.labelOverlays?.size ?? 0
    }

    // TODO reset
    resetLabelOverlays() {
        this.labelOverlays.forEach(ol => ol.remove())
        this.labelOverlays = new Map()
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

    clearAllSegment() {
        APIS.forEach(api => this.routeByAPI(api)?.clearSegmentPL())
    }

    moveMapToStep(api, stepId = null) {
        const route = this.routeByAPI(api)
        if (route == null) return

        const step = route.step(stepId) ?? route.baseStep
        this.moveMapTo(step.position)
    }

    moveMapTo(pos) {
        if (!pos) throw new Error('InvalidPosition: null pos')

        this.map.setCenter(pos)
    }

    // MBR 가져오기
    mapBounds() {
        const bounds = this.map.getBounds().toString().split(',')
        const minY = bounds[0].replace('((', '')
        const minX = bounds[1].replace(')', '')
        const maxY = bounds[2].replace('(', '')
        const maxX = bounds[3].replace('))', '')
        console.log({bounds})

        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
        }
    }
}