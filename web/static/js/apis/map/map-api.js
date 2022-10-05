/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
import KakaoAPI from './kakao-api.js'
import RoutoAPI from './routo-api.js'

export default class MapAPI {
    static get instance() {
        this._instance = this._instance ?? new MapAPI()

        return this._instance
    }

    /**
     *
     * @param {Number} y
     * @param {Number} x
     * @returns {LatLng}
     */
    static newLatLng(y, x) {
        return API_MAP_VENDOR === KakaoAPI.TAG ? new KakaoAPI.instance.LatLng(y, x) : { lat: y, lng: x }
    }

    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @returns {Size}
     */
    static newSize(width, height) {
        return new KakaoAPI.instance.Size(width, height)
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @returns {Point}
     */
    static newPoint(x, y) {
        return new KakaoAPI.instance.Point(x, y)
    }

    /**
     *
     * @param {Image} img
     * @param {Size} size
     * @param {Point|Object|null} [offset]
     * @returns {Marker}
     */
    static newMarkerImage(img, size, offset) {
        return new KakaoAPI.instance.MarkerImage(img, size, offset)
    }

    /**
     *
     * @param options
     * @returns {CustomOverlay}
     */
    static newOverlay(options) {
        const vendor = MapAPI.instance.vendor
        return new vendor.CustomOverlay(options)
    }

    /**
     * @param {?Object} [options]
     * @return {Marker}
     */
    static newMarker(options = null) {
        const vendor = MapAPI.instance.vendor
        return new vendor.Marker(options)
    }

    /**
     *
     * @param {?Object} [style]
     * @return {Polyline}
     */
    static newPolyline(style) {
        const vendor = MapAPI.instance.vendor
        return new vendor.Polyline(style)
    }

    /**
     * @param {HTMLElement} holder
     * @param {?Object} [options]
     * @return {Map}
     */
    static newMap(holder, options) {
        const vendor = MapAPI.instance.vendor
        return new vendor.Map(holder, options)
    }

    /**
     *
     * @param {!Map} map
     * @param {!String} name
     * @param {!Function} callback
     */
    static addEvent(map, name, callback) {
        const vendor = MapAPI.instance.vendor
        const adder = this.isKakao() ? vendor.event.addListener : map.addListener
    
        adder(map, name, callback)
    }

    /**
     *
     * @param {!Map} map
     * @param {!String} name
     * @param {!Function} callback
     */
    static removeEvent(map, name, callback) {
        const vendor = MapAPI.instance.vendor
        vendor.event.removeListener(map, name, callback)
    }

    static isKakao() {
        return MapAPI.instance.name === KakaoAPI.TAG
    }

    constructor() {
        this.name = API_MAP_VENDOR
        this.vendor = API_MAP_VENDOR === KakaoAPI.TAG ? KakaoAPI.instance : RoutoAPI.instance
    }
}
