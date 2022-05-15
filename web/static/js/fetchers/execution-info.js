/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
export default class ExecutionInfo {
    static FIELD_COST = 'cost'
    static FIELD_ETA = 'eta'
    static FIELD_EXEC = 'exec'

    constructor(distance, eta, duration) {
        this.cost = parseFloat(distance)
        this.eta = parseFloat(eta)
        this.duration = duration
    }

    distanceInMeter() {
        return (this.cost / 1e3).toFixed(2)
    }

    etaInSeconds() {
        return (this.eta / 1e2).toFixed(2)
    }

    durationInSeconds() {
        return (this.duration / 1e3).toFixed(2)
    }

    toObject() {
        const info = {}
        info[ExecutionInfo.FIELD_COST] = this.distanceInMeter()
        info[ExecutionInfo.FIELD_ETA] = this.etaInSeconds()
        info[ExecutionInfo.FIELD_EXEC] = this.durationInSeconds()

        return info
    }

    toJSON() {
        return serialize(this.toObject())
    }
}