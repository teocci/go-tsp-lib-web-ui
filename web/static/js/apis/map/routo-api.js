/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class RoutoAPI {
    static TAG = 'routo'

    static get instance() {
        this._instance = this._instance ?? new RoutoAPI().vendor

        return this._instance
    }

    constructor() {
        this.vendor = routo.maps
    }
}