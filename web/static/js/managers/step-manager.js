/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import Point from '../geo/point.js'
import Step from '../geo/step.js'
import StepPath from '../geo/step-path.js'
import BaseListener from '../base/base-listener.js'

// Data Structure to map points
export default class StepManager extends BaseListener {
    static TAG = 'step-manager'

    static LISTENER_POINTS_LOADED = 'on-points-loaded'

    constructor() {
        super()

        this.stepPath = null

        this.init()
    }

    init() {
        this.points = new Map()
        this.steps = new Map()

        this.tlib = false
        this.tmap = false
    }

    genPoints(n, bounds) {
        const points = this.isTestMode() ? RANDOM_TEST_POINTS : this.genRandomInBounds(n, bounds)
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
        const list = [data.FixPoint.SPoint, ...data.FixPoint.pts, data.FixPoint.EPoint]
        list.forEach((p, i) => {
            const label = i === 0 ? '시작점' : `${i}`
            const point = new Point(p.x, p.y)
            const step = new Step(i, label)
            step.type = i === 0 ? Step.TYPE_START : Step.TYPE_WAYPOINT
            step.point = point
            step.position = new kakao.maps.LatLng(p.y, p.x)
            this.addPoint(i, point)
            this.addStep(i, step)
        })
        const last = list.length - 1
        this.steps.get(last).label = '도착지'
        this.steps.get(last).type = Step.TYPE_END

        this.loadPath()

        this.callListener(StepManager.LISTENER_POINTS_LOADED, this.stepPath.asPoints())
    }

    loadPath() {
        console.log({steps: this.steps})
        this.stepPath = new StepPath(this.steps.values())
    }

    addPoint(id, p) {
        this.points.set(id, p)
    }

    addStep(id, s) {
        this.steps.set(id, s)
    }

    startStep() {
        return this.stepPath.start;
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
        route.steps.forEach(s => this.matchStep(api, s))
        console.log({steps: this.steps})
        console.log({path: this.stepPath})
    }

    matchStep(api, step) {
        for (const s of this.steps.values()) {
            if (s.isStart()) continue

            if (step.equalPosition(s)) {
                s.update(api, step)
                return
            }
        }

        console.error(`[${api}] step not found ${step.position.toString()}`)
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

    pathLength() {
        return this.stepPath.length()
    }

    isTestMode() {
        return RANDOM_MODE === RANDOM_MODE_TEST
    }
}