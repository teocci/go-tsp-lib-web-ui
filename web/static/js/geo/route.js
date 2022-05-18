/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import Polyline from './polyline.js'

export default class Route {
    constructor(api) {
        this.api = api

        this.baseStep = null

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

    asArrayObjects(){
        return [...this.steps].map(([id, step]) => ({id, step}))
    }

    asArray() {
        return [...this.steps].map(([id, step]) => (step))
    }

    polyline(k) {
        return this.polylines.get(k) ?? null
    }

    clearPolylines() {
        for (const pl of this.polylines.values()) {
            console.log({pl})
            pl.remove()            
        }
    }

    clearSegmentPL() {
        for (const pl of this.polylines.values()) {
            console.log({pl})        
            if(pl.type === Polyline.TYPE_SEGMENT){
                pl.remove()
            }           
        }
    }

    hidePolyline(k) {
        this.polyline(k).setMap(null)
    }

    loadPLPaths() {
        const styles = POLYLINE_STYLES[this.api]
        for (const item of styles) {
            const pl = this.polyline(item.type)
            pl.options(item.style)

            if (item.type ===  Polyline.TYPE_SEGMENT) return

            const path = this.pathByType(item.type)
            pl.load(path)
        }
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
        if (this.baseStep) path.push(this.baseStep.position)
        this.steps.forEach(step => {
            path.push(step.position)
        })
        if (this.baseStep) path.push(this.baseStep.position)

        console.log({path})

        return path
    }

    linePath() {
        if (this.steps.size === 0) throw new Error('InvalidCall: no steps')

        const path = []
        this.steps.forEach(step => {
            if (step.nodes()) path.push(step.nodes())
        })

        return path
    }

    segmentPath(k) {
        return this.steps.get(k).nodes(true)
    }

    has(k) {
        return this.steps.has(k)
    }
}