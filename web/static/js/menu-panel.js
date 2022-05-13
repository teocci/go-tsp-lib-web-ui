/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BasePanel from './base-panel.js'

export default class MenuPanel extends BasePanel {
    static TAG = 'map'

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.initElements()
    }

    initElements() {
        let menu = document.getElementById('menu-btn')

        let controlBox = document.getElementById('control-box')
        // Show route
        let tlibShowRoute = document.getElementById('show-tsp-route')
        let tlibShowPointRoute = document.getElementById('show-tsp-points-route')
        let tmapShowRoute = document.getElementById('show-tmap-route')
        let tmapShowPointRoute = document.getElementById('show-tmap-points-route')

        //배달점 새로고침
        let btnInitMap = document.getElementById('initMap')
        let btnPointList = document.getElementById('pointList')
    }
}