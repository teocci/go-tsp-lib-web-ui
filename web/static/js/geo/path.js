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

    loadFrom(list) {
        if (!list) throw new Error('InvalidList: null list')

        const [start, ...nodes] = list
        const end = nodes.pop()

        this.start = start
        this.end = end
        this.nodes = nodes
    }

    asNodes(noStart, noEnd) {
        const nodes = this.nodes == null ? [] : [...this.nodes]
        if (this.start != null && !noStart) nodes.unshift(this.start)
        if (this.end != null && !noEnd) nodes.push(this.end)

        return nodes
    }
}