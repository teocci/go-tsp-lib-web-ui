/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-15
 */
export default class Position {
    constructor(x, y) {
        this.geo = new kakao.maps.LatLng(y, x)
    }

    get lat() {
        return this.geo.getLat()
    }

    get lng() {
        return this.geo.getLng()
    }

    equals(p) {
        return this.geo.equals(p.geo)
    }
}