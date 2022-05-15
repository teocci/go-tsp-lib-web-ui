/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-15
 */
export default class Path {
    constructor() {
        this.start = null
        this.end = null
        this.nodes = null
    }

    // Omits end point if is a looped path
    asNodes() {
        const nodes = this.isLooped() ? this.nodes : [...this.nodes, this.end]
        return [this.start, ...nodes]
    }

    length() {
        const length = this.nodes.length
        return length + (this.isLooped() ? 1 : 2)
    }

    isLooped() {
        return this.end.equals(this.start)
    }
}