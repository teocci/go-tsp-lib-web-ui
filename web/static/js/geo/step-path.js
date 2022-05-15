/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-13
 */
export default class StepPath {
    constructor(steps) {
        if (!steps) throw new Error('InvalidSteps: null steps')

        const [start, ...rest] = steps
        const end = rest.pop()

        this.start = start
        this.waypoints = rest
        this.end = end
    }

    // Omits end step if is a looped path
    asPoints() {
        const rest = this.isLooped() ? this.waypoints : [...this.waypoints, this.end]
        return [this.start, ...rest]
    }

    allSteps() {
        return [this.start, ...this.waypoints, this.end]
    }

    length() {
        const length = this.waypoints.length
        return length + (this.isLooped() ? 1 : 2)
    }

    waypointsPoints() {
        const points = []
        this.waypoints.forEach(wp => points.push(wp.point))
        return points
    }

    toRequest() {
        return {
            SPoint: this.start.point,
            EPoint: this.end.point,
            SPointList: {
                nodes: this.waypointsPoints()
            }
        }
    }

    toJSONRequest() {
        return serialize(this.toRequest())
    }

    isLooped() {
        return this.end.equalPosition(this.start)
    }
}