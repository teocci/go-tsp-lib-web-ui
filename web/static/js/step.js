/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */

export default class Step {
    constructor(id, label) {
        this.id = id
        this.label = label

        this.distance = null

        this.previous = null
        this.next = null

        this.nodes = null

        this.point = null
        this.position = null

        this.tlibStep = null
        this.tmapStep = null
    }

    compareXY(s) {
        return this.point.equals(s.point)
    }

    equalPosition(s) {
        return this.position.equals(s.position)
    }

    lat() {
        return this.position.getLat()
    }

    lng() {
        return this.position.getLng()
    }

    hasTLib() {
        return this.tlibStep !== null
    }

    hasTMap() {
        return this.tmapStep !== null
    }
}