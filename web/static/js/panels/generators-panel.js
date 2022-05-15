/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */

import BasePanel from '../base/base-panel.js'

export default class GeneratorsPanel extends BasePanel {
    static TAG = 'generators'

    static LISTENER_FETCH_CLICKED = 'on-fetch-routes'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
        this.initHandlers()
    }

    initElements() {
        this.btnFetchRoutes = document.getElementById('fetch-routes')

        this.cbTLib = document.getElementById('cb-tlib')
        this.cbTMap = document.getElementById('cb-tmap')

        this.checkGroup = [this.cbTLib, this.cbTMap]

        this.disablePanelElements()
    }

    initHandlers() {
        this.btnFetchRoutes.onclick = e => this.handleFetchRoutes(e)
    }

    handleFetchRoutes(e) {
        if (!this.isTLibChecked() && !this.isTMapChecked()) throw 'InvalidSelection: please select at least one.'

        this.disablePanelElements()

        const data = {
            tlib: this.isTLibChecked(),
            tmap: this.isTMapChecked(),
        }
        this.callListener(GeneratorsPanel.LISTENER_FETCH_CLICKED, e, data)
    }

    disablePanelElements() {
        this.disableBtnFetchRoutes()
        this.disableCBGroup()
    }

    enablePanelElements() {
        this.enableBtnFetchRoutes()
        this.enableCBGroup()
    }

    disableBtnFetchRoutes() {
        this.btnFetchRoutes.disabled = true
    }

    disableCBGroup() {
        for (const r of this.checkGroup) {
            r.disabled = true
        }
    }

    enableBtnFetchRoutes() {
        this.btnFetchRoutes.disabled = false
    }

    enableCBGroup() {
        for (const r of this.checkGroup) {
            r.disabled = false
        }
    }

    isTLibChecked() {
        return this.cbTLib.checked
    }

    isTMapChecked() {
        return this.cbTMap.checked
    }
}