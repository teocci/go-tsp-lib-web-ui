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
}