/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
export default class ExecutionInfo {
    constructor(distance, eta, duration) {
        this.distance = parseFloat(distance)
        this.eta = parseFloat(eta)
        this.duration = duration
    }

    distanceInMeter() {
        return (this.distance / 1e3).toFixed(2)
    }

    etaInSeconds() {
        return (this.eta / 1e2).toFixed(2)
    }

    durationInSeconds() {
        return (this.duration / 1e3).toFixed(2)
    }

    toObject() {
        return {
            distance: this.distanceInMeter(),
            eta: this.etaInSeconds(),
            duration: this.durationInSeconds(),
        }
    }

    toJSON() {
        return serialize(this.toObject())
    }
}