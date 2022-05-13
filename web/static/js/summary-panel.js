/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from './base-panel.js'

export default class SummaryPanel extends BasePanel {
    static TAG = 'table'

    // Presents the distance, eta and duration of the executed request
    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
    }

    initElements() {

    }
}