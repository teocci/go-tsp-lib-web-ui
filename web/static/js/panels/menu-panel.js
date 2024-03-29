/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from '../base/base-panel.js'

export default class MenuPanel extends BasePanel {
    static TAG = 'menu'

    static SUPPORTED_PL_TYPES = [
        POLYLINE_TYPE_ROUTE,
        POLYLINE_TYPE_POINTS,
    ]

    static LISTENER_SHOW_CHANGED = 'on-show-changed'
    static LISTENER_SHOW_MARKER_CHANGED = 'on-show-marker-changed'
    static LISTENER_CLEAR_CLICKED = 'on-clear-map'
    static LISTENER_LIST_CLICKED = 'on-list-points'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.showPathCBGroup = new Map()

        this.initElements()
        this.initHandlers()
    }

    initElements() {
        this.btnMenu = document.getElementById('menu-btn')
        this.options = document.getElementById('menu-options')

        APIS.forEach(api => {
            MenuPanel.SUPPORTED_PL_TYPES.forEach(type => {
                const id = `show-${api}-${type}`
                const cb = document.getElementById(id)
                cb.value = type
                cb.checked = type === POLYLINE_TYPE_ROUTE
                cb.disabled = true
                cb.dataset.api = api

                this.showPathCBGroup.set(id, cb)
            })
        })

        this.cbShowMarkerLabels = document.getElementById('show-marker-labels')

        //배달점 새로고침
        this.btnCleanMap = document.getElementById('clear-map')
        this.btnListPoints = document.getElementById('list-points')
        
        this.reset()
    }

    initCBs() {
        APIS.forEach(api => {
            MenuPanel.SUPPORTED_PL_TYPES.forEach(type => {
                const id = `show-${api}-${type}`
                const cb = document.getElementById(id)
                cb.value = type
                cb.checked = type === POLYLINE_TYPE_ROUTE
                cb.disabled = true
                cb.dataset.api = api
            })
        })
    }

    initHandlers() {
        this.btnMenu.onclick = e => this.handleToggleMenu(e)

        this.showPathCBGroup.forEach(cb => cb.onchange = e => this.handleShowPath(e))
        this.cbShowMarkerLabels.onchange = e => this.handleShowMarkerLabels(e)

        this.btnCleanMap.onclick = e => this.handleCleanMap(e)
        this.btnListPoints.onclick = e => this.handleListPoints(e)
    }

    reset() {
        this.initCBs()
        this.closeMenu()
    }

    closeMenu() {
        this.options.classList.add('hidden')
    }

    openMenu() {
        this.options.classList.toggle('hidden')
    }

    handleToggleMenu(e) {
        this.openMenu()
    }

    handleShowPath(e) {
        mainModule.onShowPathChanged(e)
    }

    handleShowMarkerLabels(e){
        mainModule.onShowMarkerLabelsChanged(e)
    }

    handleCleanMap(e) {
        mainModule.onClearMapClicked(e)
    }

    handleListPoints(e) {
        mainModule.onListPointsClicked(e)
    }

    disableCBByAPI(api) {
        MenuPanel.SUPPORTED_PL_TYPES.forEach(type => {
            const id = `show-${api}-${type}`
            this.showPathCBGroup.get(id).disabled = true
        })
    }

    disableCBGroup() {
        this.showPathCBGroup.forEach(cb => cb.disabled = true)
    }

    enableCBGroup() {
        this.showPathCBGroup.forEach(cb => cb.disabled = false)
    }

    enableCBByData(data) {
        this.disableCBGroup()
        data.forEach(r => this.enableCBByAPI(r.api))
    }

    enableCBByAPI(api) {
        MenuPanel.SUPPORTED_PL_TYPES.forEach(type => {
            const id = `show-${api}-${type}`
            this.showPathCBGroup.get(id).disabled = false
        })
    }

    activateRouteBy(api) {
        const id = `show-${api}-${POLYLINE_TYPE_ROUTE}`
        this.showPathCBGroup.get(id).checked = true
    }

    deactivateRouteBy(api) {
        const id = `show-${api}-${POLYLINE_TYPE_ROUTE}`
        this.showPathCBGroup.get(id).checked = false
    }

    isAPIOff(api) {
        let isOff = true

        for (const type of MenuPanel.SUPPORTED_PL_TYPES) {
            const id = `show-${api}-${type}`
            const cb = this.showPathCBGroup.get(id)
            if (!cb.disabled && cb.checked) return false
        }

        return isOff
    }
}