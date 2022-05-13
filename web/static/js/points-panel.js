/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from './base-panel.js'

export default class PointsPanel extends BasePanel {
    static TAG = 'points-panel'

    static LISTENER_ADD_CLICKED = 'on-add-points'
    static LISTENER_GEN_CLICKED = 'on-gen-points'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
        this.initHandlers()
    }

    initElements() {
        this.btnAddPoints = document.getElementById('add-points')
        this.btnGenPath = document.getElementById('gen-points')

        this.radioGroup = document.getElementsByName('path-length')
    }

    initHandlers() {
        this.btnAddPoints.onclick = e => this.handleAddPoints(e)
        this.btnGenPath.onclick = e => this.handleGenPoints(e)
    }

    radioGroupValue() {
        for (const r of this.radioGroup) {
            if (r.checked) return r.value
        }
    }

    handleAddPoints(e) {
        this.disablePanelElements()
        this.callListener(PointsPanel.LISTENER_ADD_CLICKED, e)
    }

    handleGenPoints(e) {
        this.disablePanelElements()
        this.callListener(PointsPanel.LISTENER_GEN_CLICKED, e, this.radioGroupValue())
    }

    disablePanelElements(){
        this.disableBtnAddPoints()
        this.disableBtnGenPoints()
        this.disableRadioGroup()
    }

    enablePanelElements(){
        console.log('enablePanelElements')
        this.enableBtnAddPoints()
        this.enableBtnGenPoints()
        this.enableRadioGroup()
    }

    disableBtnAddPoints() {
        this.btnAddPoints.disabled = true
    }

    disableBtnGenPoints() {
        this.btnGenPath.disabled = true
    }

    disableRadioGroup() {
        for (const r of this.radioGroup) {
            r.disabled = true
        }
    }

    enableBtnAddPoints() {
        this.btnAddPoints.disabled = false
    }

    enableBtnGenPoints() {
        this.btnGenPath.disabled = false
    }

    enableRadioGroup() {
        for (const r of this.radioGroup) {
            r.disabled = false
        }
    }
}