/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import BasePanel from './base-panel.js'

export default class MapPanel extends BasePanel {
    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)
    }
}