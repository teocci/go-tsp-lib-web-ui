/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import Point from '../geo/point.js'
import Step from '../geo/step.js'
import BaseListener from '../base/base-listener.js'

// Data Structure to map points
export default class StepManager extends BaseListener {
    static TAG = 'step-manager'

    static LISTENER_POINTS_LOADED = 'on-points-loaded'

    constructor() {
        super()

        this.init()
    }

    init() {
        this.points = new Map()
        this.steps = new Map()
    }

    genPoints(points) {
        //const points = this.isTestMode() ? RANDOM_TEST_POINTS : this.genRandomInBounds(n, bounds)
        console.log({points})
        const [start, ...rest] = points

        const url = `${TLIB_SVR_URL}/fix_points`
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'text/plain'
            },
            body: serialize({
                SPoint: start,
                EPoint: start,
                SPointList: {
                    nodes: rest
                },
            }),
        }).then(r => r.json()).then(body => {
            this.loadSteps(body)
        })
    }

    // Random 좌표 n개 생성
    loadSteps(data) {
        let last = 0

        const list = [data.FixPoint.SPoint, ...data.FixPoint.pts, data.FixPoint.EPoint]
        list.forEach((p, id) => {
            const label = id === 0 ? '시작점' : `${id}`
            const point = new Point(p.x, p.y)
            const step = new Step(id, label)
            step.type = id === 0 ? Step.TYPE_START : Step.TYPE_WAYPOINT
            step.point = point
            step.position = new kakao.maps.LatLng(p.y, p.x)
            this.addPointWithId(id, point)
            this.addStepWithId(id, step)
            last = id
        })
        this.steps.get(last).label = '도착지'
        this.steps.get(last).type = Step.TYPE_END

        this.callListener(StepManager.LISTENER_POINTS_LOADED, this.asPoints(false, true))
    }

    addPoint(p) {
        this.addPointWithId(this.points.size, p)
        console.log({points: this.points})
    }

    addPointWithId(id, p) {
        this.points.set(id, p)
    }

    addStep(s) {
        this.addStepWithId(this.points.size, s)
    }

    addStepWithId(id, s) {
        this.steps.set(id, s)
    }

    stepsLength() {
        return this.steps.size ?? 0
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
        route.steps.forEach(s => this.matchStep(api, s))
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

    // Omits end step if is a looped path
    asPoints(noStart, noEnd) {
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
                nodes: this.waypointsAsPoints()
            }
        }
    }

    toJSONRequest() {
        return serialize(this.toRequest())
    }

    // findPointByXY(id, x, y) {
    //     for (const p of this.steps) {
    //         if (p.compareXY(new Step(id, x, y))) return p
    //     }
    //
    //     return null
    // }
    //
    // putTLibPoint(id, x, y) {
    //     const p = this.findPointByXY(id, x, y)
    //     if (p == null) {
    //         console.error(`[TLIB] NO POINT x : ${x}, y : ${y}`)
    //         return false
    //     }
    //
    //     if (!p.hasTLib()) p.tlibPoint = new Step(id, id, x, y)
    // }
    //
    // putTMapPoint(id, x, y) {
    //     const p = this.findPointByXY(id, x, y)
    //     if (p == null) {
    //         console.error(`[TMAP] NO POINT x : ${x}, y : ${y}`)
    //         return false;
    //     }
    //
    //     if (!p.hasTMap()) p.tmapPoint = new Step(id, id, x, y)
    // }

    isTestMode() {
        return RANDOM_MODE === RANDOM_MODE_TEST
    }
}