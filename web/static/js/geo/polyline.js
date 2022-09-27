/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-15
 */
export default class Polyline {
    static TYPE_ROUTE = POLYLINE_TYPE_ROUTE
    static TYPE_POINTS = POLYLINE_TYPE_POINTS
    static TYPE_SEGMENT = POLYLINE_TYPE_SEGMENT

    constructor(type, style) {
        this.type = type
        this.style = style

        this.instance = new kakao.maps.Polyline(style)
    }

    set zIndex(v) {
        this.instance.setZIndex(v)
    }

    get zIndex() {
        return this.instance.getZIndex()
    }

    options(style) {
        this.instance.setOptions(style)
    }

    load(path) {
        this.instance.setPath(path)
    }

    render(map) {
        this.instance.setMap(map)
    }

    remove() {
        this.instance.setMap(null)
    }
}