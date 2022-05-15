/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-13
 */

export default class RouteResponse {
    constructor(api, info, route) {
        this.api = api
        this.info = info
        this.route = route
    }

    toObject() {
        return {
            api: this.api,
            info: this.info.toObject(),
            route: this.route,
        }
    }

    toJSON() {
        return serialize(this.toObject())
    }
}