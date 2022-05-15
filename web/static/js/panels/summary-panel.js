/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from '../base/base-panel.js'
import ExecutionInfo from '../fetchers/execution-info.js'
import TLibAPI from '../apis/tlib-api.js'
import TMapAPI from '../apis/tmap-api.js'

export default class SummaryPanel extends BasePanel {
    static TAG = 'summary'

    static FIELDS_LIST = [
        ExecutionInfo.FIELD_COST,
        ExecutionInfo.FIELD_ETA,
        ExecutionInfo.FIELD_EXEC,
    ]

    // Presents the distance, eta and duration of the executed request
    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.fields = new Map()

        this.initFields()
        this.initElements()
    }

    initFields() {
        SummaryPanel.FIELDS_LIST.forEach(f => {
            this.fields.set(`${TLibAPI.TAG}-${f}`, null)
            this.fields.set(`${TMapAPI.TAG}-${f}`, null)
        })
    }

    initElements() {
        for (const k of this.fields.keys()) {
            const field = document.getElementById(k)
            field.textContent = '-'
            this.fields.set(k, field)
        }
    }

    updateInfo(data) {
        data.forEach(r => this.updateFields(r.api, r.info))
    }

    updateFields(api, info) {
        SummaryPanel.FIELDS_LIST.forEach(f => {
            const field = this.fields.get(`${api}-${f}`)
            field.textContent = info[f] ?? '-'
        })
    }
}