/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BaseListener from '../base/base-listener.js'
import Point from '../geo/point.js'
import Step from '../geo/step.js'

// Data Structure to map points
export default class StepManager extends BaseListener {
    static TAG = 'step-manager'

    constructor() {
        super()

        this.init()
    }

    init() {
        this.points = new Map()
        this.steps = new Map()
    }

    reset() {
        this.init()
    }

    // Random 좌표 n개 생성
    loadSteps(data) {
        console.log({data})
        const list = [data.FixPoint.SPoint, ...data.FixPoint.pts, data.FixPoint.EPoint]

        let last = null
        list.forEach((p, id) => {
            const label = id === 0 ? '시작점' : `${id}`
            const point = new Point(p.x, p.y)
            const step = new Step(id, label)
            step.type = id === 0 ? Step.TYPE_START : Step.TYPE_WAYPOINT
            step.point = point
            step.position = new kakao.maps.LatLng(p.y, p.x)
            this.addPoint(id, point)
            this.addStep(id, step)
            last = id
        })

        if (last) {
            this.steps.get(last).label = '도착지'
            this.steps.get(last).type = Step.TYPE_END
        }
    }

    appendPoint(p) {
        const id = this.pointsSize()
        this.addPoint(id, p)

        return id
    }

    addPoint(id, p) {
        this.points.set(id, p)
    }

    pointsSize() {
        return this.points?.size ?? 0
    }

    pointsAsArray(n, bounds) {
        if (n && bounds) {
            const points = this.isRandomTestMode() ? RANDOM_TEST_POINTS : this.genRandomInBounds(n, bounds)
            points.forEach(p => this.appendPoint(p))
            return points
        }
        if (this.points.size < 1) throw new Error('InvalidPoints: null points')

        return [...this.points].map(([k, v]) => (v))
    }

    appendStep(s) {
        const id = this.stepsSize()
        this.addStep(id, s)

        return id
    }

    addStep(id, s) {
        this.steps.set(id, s)
    }

    stepsSize() {
        return this.steps?.size ?? 0
    }

    stepByAPI(api, stepId) {
        for (const s of this.steps.values()) {
            const step = s.apiStep(api)
            if (step?.id === stepId) return step
        }

        console.log({steps: this.steps})

        console.error(`[${api}] step id not found ${stepId}`)
    }

    startStep() {
        for (const step of this.steps.values()) {
            if (step == null) continue
            if (step.isStart()) return step
        }
        return null
    }

    endStep() {
        for (const step of this.steps.values()) {
            if (step == null) continue
            if (step.isEnd()) return step
        }
        return null
    }

    waypointSteps() {
        const nodes = []
        for (const step of this.steps.values()) {
            if (step == null) continue
            if (step.isWaypoint()) nodes.push(step)
        }

        return nodes
    }

    waypointsAsPoints() {
        const points = []
        for (const step of this.steps.values()) {
            if (step == null) continue
            if (step.isWaypoint()) points.push(step.point)
        }

        return points
    }

    genRandomInBounds(n, bounds) {
        return Array.from({length: n}).map(() => {
            const x = rand(parseFloat(bounds.minX), parseFloat(bounds.maxX))
            const y = rand(parseFloat(bounds.minY), parseFloat(bounds.maxY))

            return {'x': x, 'y': y}
        })
    }

    matchRoutes(data) {
        data.forEach(r => this.matchRoute(r.api, r.route))
    }

    matchRoute(api, route) {
        if (!route) throw 'InvalidRoute: null route'

        if (!route.baseStep) route.baseStep = this.startStep()
        route?.steps.forEach(s => this.matchStep(api, s))
        console.log({steps: this.steps})
    }

    matchStep(api, step) {
        for (const s of this.steps.values()) {
            if (s.isStart()) continue

            if (step.equalPoint(s)) {
                s.update(api, step)
                return
            }
        }

        console.error(`[${api}] step not found ${step.position.toString()}`)
    }

    asStepArray(noStart, noEnd) {
        const nodes = []
        for (const step of this.steps.values()) {
            if (step == null) continue
            if (step.isStart() && noStart) continue
            if (step.isEnd() && noEnd) continue

            nodes.push(step)
        }

        return nodes
    }

    toRequest() {
        return {
            SPoint: this.startStep().point,
            EPoint: this.endStep().point,
            SPointList: {
                nodes: this.waypointsAsPoints(),
            },
        }
    }

    toJSONRequest() {
        return serialize(this.toRequest())
    }

    isRandomTestMode() {
        return RANDOM_MODE === RANDOM_MODE_TEST
    }
}