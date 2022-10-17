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
        this.inputFile.accept = 'text/csv'

        this.loadOutput = document.getElementById('load-output')
        this.loadOutput.classList.add('output')

        this.radioGroup = document.getElementsByName('path-length')

        this.initRadioGroup()
    }

    initHandlers() {
        this.btnAddPoints.onclick = e => this.handleAddPoints(e)
        this.btnGenPath.onclick = e => this.handleGenPoints(e)

        this.inputFile.onchange = e => this.handleLoadPoints(e)
    }

    reset() {
        this.initRadioGroup()
        this.initLoadPoints()
    }

    initRadioGroup() {
        this.radioGroup.forEach((r, i) => {
            r.disabled = false
        })
    }

    initLoadPoints() {
        this.inputFile.value = ''
        this.loadOutput.textContent = ''
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

        this.readFileAsync(first).then(text => {
            this.processFile(text)
        })
    }

    async readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = reject

            if (file) reader.readAsText(file, DEFAULT_CSV_ENCODING)
        })
    }

    processFile(text) {
        const lines = text.split(/\r?\n/gm)
        const points = lines.reduce((acc, line) => {
            let [x, y, name] = line.split(',')
            x = Number(x)
            y = Number(y)
            return isNumber(x) && isNumber(y) /*&& this.isContained({x, y})*/ ? [...acc, {x, y, name}] : acc
        }, [])

        const inBoundPoints = points.slice(0, FILE_LOAD_MAX_CNT)

        mainModule.onLoadPointsClicked(inBoundPoints)
    }

    isContained(point) {
        return MAP_BOUNDARY.isContained(point)
    }

    textLoadOutput(msg) {
        this.loadOutput.textContent = msg
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