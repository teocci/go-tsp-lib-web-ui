/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from '../base/base-panel.js'

export default class PointsPanel extends BasePanel {
    static TAG = 'points-panel'

    static LISTENER_ADD_CLICKED = 'on-add-points'
    static LISTENER_GEN_CLICKED = 'on-gen-points'
    static LISTENER_FILELOAD_CLICKED = 'on-file-points'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
        this.initHandlers()
    }

    initElements() {
        this.btnAddPoints = document.getElementById('add-points')
        this.btnGenPath = document.getElementById('gen-points')
        this.btnFilePoints = document.getElementById('file-points')
        this.inputFileUpload = document.getElementById('fileupload')

        this.radioGroup = document.getElementsByName('path-length')

        this.initRadioGroup()
    }

    initHandlers() {
        this.btnAddPoints.onclick = e => this.handleAddPoints(e)
        this.btnGenPath.onclick = e => this.handleGenPoints(e)
        this.btnFilePoints.onclick = e => this.handleFilePoints(e)

        this.inputFileUpload.onchange = () => {
            this.processFile(this.inputFileUpload.files[0])
        }

        this.fileText = ''
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

    handleFilePoints(e) {
        this.disablePanelElements()
        this.inputFileUpload.click()
    }

    processFile(file) {
        const reader = new FileReader()
        reader.onload = function () {
            const arr = reader.result.split(/\r?\n/gm)
            this.posArr = []
            arr.forEach(item =>{
                const pos = item.split(',')
                const obj = {
                    x : Number(pos[1]),
                    y : Number(pos[0]),
                }
                this.posArr.push(obj)
            })

            mainModule.onFilePointsClicked(this.posArr)
        }
        reader.readAsText(file, "UTF-8")
    }

  
    disablePanelElements() {
        this.disableBtnAddPoints()
        this.disableBtnGenPoints()
        this.disableRadioGroup()
    }

    enablePanelElements() {
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