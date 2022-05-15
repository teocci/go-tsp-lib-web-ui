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

export default class MainModule {
    constructor() {
        this.stepManager = new StepManager()
        this.fetcherManager = new FetcherManager()

        this.initPanels()

        this.mapManager = new MapManager(this.mapPanel)

        this.pointsPanel.addListener(PointsPanel.LISTENER_ADD_CLICKED, e => this.onAddPointClicked(e))
        this.pointsPanel.addListener(PointsPanel.LISTENER_GEN_CLICKED, (e, params) => this.onGenPointsClicked(e, params[0]))

        this.stepManager.addListener(StepManager.LISTENER_POINTS_LOADED, p => this.onPointsLoaded(p))
        this.fetcherManager.addListener(FetcherManager.LISTENER_ALL_DATA_FETCHED, d => this.onAllDataFetched(d))

        this.generatorPanel.addListener(GeneratorsPanel.LISTENER_FETCH_CLICKED, (e, params) => this.onFetchRoutesClicked(e, params[0]))

        this.menuPanel.addListener(MenuPanel.LISTENER_SHOW_CHANGED, e => this.onShowPathChanged(e))
        this.menuPanel.addListener(MenuPanel.LISTENER_CLEAR_CLICKED, e => this.onClearMapClicked(e))
        this.menuPanel.addListener(MenuPanel.LISTENER_LIST_CLICKED, e => this.onListPointsClicked(e))

        this.resultsPanel.addListener(ResultsPanel.LISTENER_SHOW_SEGMENT, e => this.onShowSegmentClicked(e))
        // this.resultsPanel.addListener(TmapFetcher.TAG, drawTMapLinePartly)
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

    onAddPointClicked(e) {
        this.stepManager.addStep(e)
    }

    onGenPointsClicked(e, n) {
        this.stepManager.init()

        const bounds = this.mapManager.mapBounds()
        this.stepManager.genPoints(n, bounds)
    }

    onPointsLoaded(points) {
        this.mapManager.loadMarkers(points)
        this.pointsPanel.enablePanelElements()
        this.generatorPanel.enablePanelElements()
    }

    onFetchRoutesClicked(e, libs) {
        if (this.stepManager.pathLength() < 1) {
            alert('배달점이 없습니다. 배달점을 등록해주세요.')
            return
        }

        this.fetcherManager.executeRequest(this.stepManager.stepPath, libs)
    }

    onAllDataFetched(data) {
        this.menuPanel.enableCBByData(data)
        this.stepManager.matchRoutes(data)
        this.summaryPanel.updateInfo(data)

        this.resultsPanel.renderTimelines(data, this.stepManager.startStep())

        this.mapManager.loadRoutes(data)
        this.mapManager.renderRoutes(POLYLINE_TYPE_ROUTE)
    }

    onShowPathChanged(e) {
        const type = e.target.value
        const api = e.target.dataset.api
        if (e.target.checked) {
            this.mapManager.renderRouteByAPI(api, type)
        } else {
            this.mapManager.removeRouteByAPI(api, type)
        }
    }

    onClearMapClicked(e) {
        console.log({e})
    }

    onListPointsClicked(e) {
        console.log({e})
    }

    onShowSegmentClicked(e) {
        const target = e.currentTarget
        console.log({target, id: target.dataset.stepId, api: target.dataset.api})
    }
}