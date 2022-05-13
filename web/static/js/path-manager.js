/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import Point from './point.js'
import Step from './step.js'
import Path from './path.js'
import BaseListener from './base-listener.js'

// Data Structure to map points
export default class PathManager extends BaseListener {
    static TAG = 'path-manager'

    static LISTENER_POINTS_LOADED = 'on-points-loaded'

    constructor() {
        super()

        this.path = null

        this.init()
    }

    init() {
        this.points = new Map()
        this.steps = new Map()

        this.tlib = false
        this.tmap = false
    }

    genPoints(n, bounds) {
        const randomPoints = this.isTestMode() ? RANDOM_TEST_POINTS : this.genRandomInBounds(n, bounds)
        const [start, ...rest] = randomPoints

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
            this.loadPoints(body)
        })
    }

    // Random 좌표 n개 생성
    loadPoints(data) {
        const list = [data.FixPoint.SPoint, ...data.FixPoint.pts, data.FixPoint.EPoint]
        list.forEach((p, i) => {
            const label = i === 0 ? '시작점' : `${i}`
            const point = new Point(p.x, p.y)
            const step = new Step(i, label)
            step.point = point
            step.position = new kakao.maps.LatLng(p.y, p.x)
            this.addPoint(i, point)
            this.addStep(i, step)
        })
        this.steps.get(list.length - 1).label = '도착지'

        this.loadPath()

        this.callListener(PathManager.LISTENER_POINTS_LOADED, this.path.steps())
    }

    loadPath() {
        console.log({steps: this.steps})
        this.path = new Path(this.steps.values())
    }

    genRandomInBounds(n, bounds) {
        return Array.from({length: n}).map(() => {
            const x = rand(parseFloat(bounds.minX), parseFloat(bounds.maxX))
            const y = rand(parseFloat(bounds.minY), parseFloat(bounds.maxY))

            return {'x': x, 'y': y}
        })
    }

    addPoint(id, p) {
        this.points.set(id, p)
    }

    addStep(id, s) {
        this.steps.set(id, s)
    }

    findPointByXY(id, x, y) {
        for (const p of this.steps) {
            if (p.compareXY(new Step(id, x, y))) return p
        }

        return null
    }

    putTLibPoint(id, x, y) {
        const p = this.findPointByXY(id, x, y)
        if (p == null) {
            console.error(`[TLIB] NO POINT x : ${x}, y : ${y}`)
            return false;
        }

        if (!p.hasTLib()) p.tlibPoint = new Step(id, id, x, y)
    }

    putTMapPoint(id, x, y) {
        const p = this.findPointByXY(id, x, y)
        if (p == null) {
            console.error(`[TMAP] NO POINT x : ${x}, y : ${y}`)
            return false;
        }

        if (!p.hasTMap()) p.tmapPoint = new Step(id, id, x, y)
    }

    pathLength() {
        return this.path.length()
    }

    isTestMode() {
        return RANDOM_MODE === RANDOM_MODE_TEST
    }
}