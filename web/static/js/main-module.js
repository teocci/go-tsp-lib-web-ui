/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import StepManager from './managers/step-manager.js'
import FetcherManager from './managers/fetcher-manager.js'
import MapPanel from './panels/map-panel.js'
import PointsPanel from './panels/points-panel.js'
import GeneratorsPanel from './panels/generators-panel.js'
import ResultsPanel from './panels/results-panel.js'
import MapManager from './managers/map-manager.js'
import SummaryPanel from './panels/summary-panel.js'
import MenuPanel from './panels/menu-panel.js'
import Point from './geo/point.js'

export default class MainModule {
    constructor() {
        this.stepManager = new StepManager()
        this.fetcherManager = new FetcherManager()

        this.initPanels()

        this.mapManager = new MapManager(this.mapPanel)

        this.initHandlers()
    }

    initPanels() {
        const mapElement = document.getElementById('map')

        const pointsElement = document.querySelector('section.points .controls')
        const generatorsElement = document.querySelector('section.generators .generate')
        const resultElement = document.getElementById('results-content')

        const summaryElement = document.getElementById('summary')
        const menuElement = document.getElementById('menu')

        this.mapPanel = new MapPanel(mapElement)

        this.pointsPanel = new PointsPanel(pointsElement)
        this.generatorPanel = new GeneratorsPanel(generatorsElement)
        this.resultsPanel = new ResultsPanel(resultElement)

        this.summaryPanel = new SummaryPanel(summaryElement)
        this.menuPanel = new MenuPanel(menuElement)
    }

    initHandlers() {
        // Map click and right click
        this.mapManager.addListener(MapManager.LISTENER_ADD_CLICKED, e => this.onMapClicked(e))
        this.mapManager.addListener(MapManager.LISTENER_FINISH_CLICKED, e => this.onMapClickFinished(e))

        // Add or generate points
        this.pointsPanel.addListener(PointsPanel.LISTENER_ADD_CLICKED, e => this.onAddPointClicked(e))
        this.pointsPanel.addListener(PointsPanel.LISTENER_GEN_CLICKED, (e, params) => this.onGenPointsClicked(e, params[0]))

        this.fetcherManager.addListener(FetcherManager.LISTENER_FIX_POINTS_FETCHED, p => this.onFixPointsFetched(p))
        this.fetcherManager.addListener(FetcherManager.LISTENER_ALL_DATA_FETCHED, d => this.onAllDataFetched(d))

        // Request for fetching routes
        this.generatorPanel.addListener(GeneratorsPanel.LISTENER_FETCH_CLICKED, (e, params) => this.onFetchRoutesClicked(e, params[0]))

        this.menuPanel.addListener(MenuPanel.LISTENER_SHOW_CHANGED, e => this.onShowPathChanged(e))
        this.menuPanel.addListener(MenuPanel.LISTENER_CLEAR_CLICKED, e => this.onClearMapClicked(e))
        this.menuPanel.addListener(MenuPanel.LISTENER_LIST_CLICKED, e => this.onListPointsClicked(e))

        this.resultsPanel.addListener(ResultsPanel.LISTENER_SHOW_SEGMENT, e => this.onShowSegmentClicked(e))
    }

    reset() {
        this.mapManager.reset()
        this.stepManager.reset()
        this.pointsPanel.reset()
        this.generatorPanel.reset()
        this.resultsPanel.reset()
        this.summaryPanel.reset()
        this.menuPanel.reset()
    }

    onAddPointClicked(e) {
        this.reset()
        this.mapManager.activateClickListener()
    }

    onMapClicked(e) {
        const pos = e.latLng
        const point = new Point(pos.getLng(), pos.getLat())
        const index = this.stepManager.appendPoint(point)

        this.mapManager.loadMarker(pos, index)
    }

    onMapClickFinished(e) {
        this.pointsPanel.enablePanelElements()
        this.generatorPanel.enablePanelElements()
        this.mapManager.resetMarkers()

        const points = this.stepManager.pointsAsArray()
        this.fetcherManager.fetchFixPoints(points)
    }

    onGenPointsClicked(e, n) {
        this.reset()

        const bounds = this.mapManager.mapBounds()
        const points = this.stepManager.pointsAsArray(n, bounds)
        this.fetcherManager.fetchFixPoints(points)
    }

    onFixPointsFetched(data) {
        this.stepManager.loadSteps(data)
        this.mapManager.loadMarkers(this.stepManager.asStepArray(false, true))
        this.pointsPanel.enablePanelElements()
        this.generatorPanel.enablePanelElements()
    }

    onFetchRoutesClicked(e, libs) {
        if (this.stepManager.stepsSize() < 1) {
            alert('배달점이 없습니다. 배달점을 등록해주세요.')
            return
        }

        this.fetcherManager.fetchRoutes(this.stepManager.toRequest(), libs)
    }

    onAllDataFetched(data) {
        this.menuPanel.enableCBByData(data)
        this.stepManager.matchRoutes(data)
        this.summaryPanel.updateInfo(data)

        this.resultsPanel.renderTimelines(data)

        this.mapManager.loadRoutes(data)
        this.mapManager.loadOverlays(data)
        this.mapManager.renderRoutes(POLYLINE_TYPE_ROUTE)
    }

    onShowPathChanged(e) {
        const type = e.target.value
        const api = e.target.dataset.api
        if (e.target.checked) {
            this.mapManager.renderRouteByAPI(api, type)
            this.mapManager.activateOTagByAPI(api)
        } else {
            this.mapManager.removeRouteByAPI(api, type)
            this.mapManager.removeRouteByAPI(api, POLYLINE_TYPE_SEGMENT)
            this.resultsPanel.removeActiveByAPI(api)

            console.log({isAPIOff: this.menuPanel.isAPIOff(api)})
            if (this.menuPanel.isAPIOff(api)) {
                this.mapManager.deactivateOTagByAPI(api)
            }
        }
    }

    onClearMapClicked(e) {
        this.reset()
    }

    onListPointsClicked(e) {
        let str = ''
        const points = this.stepManager.pointsAsArray()
        points.forEach(p => str += `${p.toString()},`)
        str = str.slice(0, -1)
        alert(str)
    }

    onShowSegmentClicked(e) {
        const target = e.currentTarget
        const api = target.dataset.api
        const stepId = parseInt(target.dataset.stepId)
        console.log({target, api, stepId})

        this.resultsPanel.activateStep(api, target)

        if (stepId === 0) {
            this.mapManager.moveMapToStep(api)
        } else {
            this.menuPanel.activateRouteBy(api)

            this.mapManager.renderRouteByAPI(api, POLYLINE_TYPE_ROUTE)

            this.mapManager.clearAllSegment()
            this.mapManager.renderSegment(api, stepId)
            this.mapManager.moveMapToStep(api, stepId)
        }
    }
}