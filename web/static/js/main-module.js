/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import PathManager from './path-manager.js'
import FetcherManager from './fetcherManager.js'
import PointsPanel from './points-panel.js'
import GeneratorsPanel from './generators-panel.js'
import ResultsPanel from './results-panel.js'
import MapPanel from './map-panel.js'
import SummaryPanel from './summary-panel.js'
import MenuPanel from './Menu-panel.js'

export default class MainModule {
    constructor() {
        this.pathManager = new PathManager()
        this.fetcherManager = new FetcherManager()

        this.initElements()

        this.pointsPanel.addListener(PointsPanel.LISTENER_ADD_CLICKED, e => this.onAddPointClicked(e))
        this.pointsPanel.addListener(PointsPanel.LISTENER_GEN_CLICKED, (e, params) => this.onGenPointsClicked(e, params[0]))

        this.pathManager.addListener(PathManager.LISTENER_POINTS_LOADED, p => this.onPointsLoaded(p))
        this.fetcherManager.addListener(FetcherManager.LISTENER_ALL_DATA_FETCHED, d => this.onAllDataFetched(d))

        this.generatorPanel.addListener(GeneratorsPanel.LISTENER_FETCH_CLICKED, (e, params) => this.onFetchRoutesClicked(e, params[0]))

        // this.resultsPanel.addListener(TlibFetcher.TAG, drawTLibLinePartly)
        // this.resultsPanel.addListener(TmapFetcher.TAG, drawTMapLinePartly)
    }

    initElements() {
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
        this.pathManager.addStep(e)
    }

    onGenPointsClicked(e, n) {
        const bounds = this.mapPanel.mapBounds()
        this.pathManager.genPoints(n, bounds)
    }

    onPointsLoaded(points) {
        this.mapPanel.loadMarkers(points)
        this.pointsPanel.enablePanelElements()
        this.generatorPanel.enablePanelElements()
    }

    onFetchRoutesClicked(e, libs) {
        if (this.pathManager.pathLength() < 1) {
            alert('배달점이 없습니다. 배달점을 등록해주세요.')
            return
        }

        this.fetcherManager.executeRequest(this.pathManager.path, libs)
    }

    onAllDataFetched(d) {
        console.log(d)

    }
}