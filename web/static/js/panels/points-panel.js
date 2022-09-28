/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from '../base/base-panel.js'

export default class PointsPanel extends BasePanel {
    static TAG = 'points-panel'

    static LISTENER_ADD_CLICKED = 'on-add-points'
    static LISTENER_GEN_CLICKED = 'on-gen-points'
    static LISTENER_LOAD_CLICKED = 'on-load-points'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
        this.initHandlers()
    }

    initElements() {
        this.btnAddPoints = document.getElementById('add-points')
        this.btnGenPath = document.getElementById('gen-points')
        this.btnLoadPoints = document.getElementById('load-points')

        this.inputFile = document.getElementById('input-file')

        this.radioGroup = document.getElementsByName('path-length')

        this.initRadioGroup()
    }

    initHandlers() {
        this.btnAddPoints.onclick = e => this.handleAddPoints(e)
        this.btnGenPath.onclick = e => this.handleGenPoints(e)
        // this.btnLoadPoints.onclick = e =>

        this.inputFile.onchange = e => this.handleLoadPoints(e)
    }

    reset() {
        this.initRadioGroup()
    }

    initRadioGroup() {
        this.radioGroup.forEach((r, i) => {
            r.disabled = false
        })
    }

    radioGroupValue() {
        for (const r of this.radioGroup) {
            if (r.checked) return r.value
        }
    }

    handleAddPoints(e) {
        this.disablePanelElements()
        mainModule.onAddPointClicked(e)
    }

    handleGenPoints(e) {
        this.disablePanelElements()
        mainModule.onGenPointsClicked(e, this.radioGroupValue())
    }

    handleLoadPoints(e) {
        this.disablePanelElements()

        const input = e.target
        if (!input) throw new Error('null input')
        const [first] = input.files

        this.processFile(first)
    }

    processFile(file) {
        const reader = new FileReader()
        reader.onload = () => {
            const lines = reader.result.split(/\r?\n/gm)
            const points = lines.map(line => {
                let [y, x] = line.split(',')
                return {x: Number(x), y: Number(y)}
            })

            mainModule.onLoadPointsClicked(points)
        }
        reader.readAsText(file)
    }

    disablePanelElements() {
        this.disableBtnAddPoints()
        this.disableBtnGenPoints()
        this.disableBtnLoadPoints()
        this.disableRadioGroup()
    }

    enablePanelElements() {
        this.enableBtnAddPoints()
        this.enableBtnGenPoints()
        this.enableBtnLoadPoints()
        this.enableRadioGroup()
    }

    disableBtnAddPoints() {
        this.btnAddPoints.disabled = true
    }

    disableBtnGenPoints() {
        this.btnGenPath.disabled = true
    }

    disableBtnLoadPoints() {
        this.btnLoadPoints.classList.add('disabled')
        this.inputFile.disabled = true
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

    enableBtnLoadPoints() {
        this.btnLoadPoints.classList.remove('disabled')
        this.inputFile.disabled = false
    }

    enableRadioGroup() {
        for (const r of this.radioGroup) {
            r.disabled = false
        }
    }
}