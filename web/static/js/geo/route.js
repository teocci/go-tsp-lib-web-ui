/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import Polyline from './polyline.js'

export default class Route {
    constructor(api) {
        this.api = api
        this.steps = new Map()

        this.polylines = new Map()

        POLYLINE_TYPES.forEach(t => this.addPolyline(t, new Polyline(t)))
    }

    addStep(k, v) {
        this.steps.set(k, v)
    }

    addPolyline(k, v) {
        this.polylines.set(k, v)
    }

    step(k) {
        return this.steps.get(k)
    }

    asArray() {
        return this.steps.values()
    }

    polyline(k) {
        return this.polylines.get(k) ?? null
    }

    clearPolylines() {
        for (const pl of this.polylines.values()) {
            pl.setMap(null)
        }
    }

    hidePolyline(k) {
        this.polyline(k).setMap(null)
    }

    pathByType(type, k) {
        switch (type) {
            case POLYLINE_TYPE_ROUTE:
                return this.linePath()
            case POLYLINE_TYPE_POINTS:
                return this.pointPath()
            case POLYLINE_TYPE_SEGMENT:
                if (!k) throw new Error('InvalidStepIndex: null step index')
                return this.segmentPath(k)
            default:
                throw new Error('InvalidType: type not supported')
        }
    }

    pointPath() {
        if (this.steps.size === 0) throw new Error('InvalidCall: no steps')

        const path = []
        this.steps.forEach(step => {
            console.log({step})
            path.push(step.position)
        })

        return path
    }

    linePath() {
        if (this.steps.size === 0) throw new Error('InvalidCall: no steps')

        const path = []
        this.steps.forEach(step => {
            console.log({step})
            if (step.nodes()) path.push(step.nodes())
        })

        return path
    }

    segmentPath(k) {
        this.steps.get(k).allNodes()
    }

    has(k) {
        return this.steps.has(k)
    }
}