/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import TLibAPI from '../apis/route/tlib-api.js'
import TMapAPI from '../apis/route/tmap-api.js'

export default class Step {
    static TYPE_START = 'start'
    static TYPE_END = 'end'
    static TYPE_WAYPOINT = 'waypoint'

    constructor(id, label) {
        this.id = id
        this.label = label
        this.type = Step.TYPE_WAYPOINT

        this.distance = null

        this.point = null
        this.position = null
        this.path = null

        this.tlibStep = null
        this.tmapStep = null
    }

    update(api, step) {
        switch (api) {
            case TLibAPI.TAG:
                this.tlibStep = step
                break
            case TMapAPI.TAG:
                this.tmapStep = step
                break
            default:
                throw new Error(`InvalidAPI: ${api} not supported`)
        }
        this.path = step.nodes
    }

    apiStep(api) {
        switch (api) {
            case TLibAPI.TAG:
                return this.tlibStep
            case TMapAPI.TAG:
                return this.tmapStep
            default:
                throw new Error(`InvalidAPI: ${api} not supported`)
        }
    }

    get nodes() {
        return this.path?.asNodes(true) ?? null
    }

    get allNodes() {
        return this.path?.asNodes() ?? null
    }

    get lat() {
        return this.position?.getLat() ?? null
    }

    get lng() {
        return this.position?.getLng() ?? null
    }

    hasTLib() {
        return this.tlibStep !== null
    }

    hasTMap() {
        return this.tmapStep !== null
    }

    equalPoint(p) {
        return this.point?.equals(p.point)
    }

    equalPosition(s) {
        return this.position?.equals(s.position)
    }

    isStart() {
        return this.type === Step.TYPE_START
    }

    isEnd() {
        return this.type === Step.TYPE_END
    }

    isWaypoint() {
        return this.type === Step.TYPE_WAYPOINT
    }

    clone() {
        return JSON.parse(JSON.stringify(this))
    }
}