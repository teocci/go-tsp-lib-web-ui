/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
export default class Request {
    static METHOD_GET = 'GET'
    static METHOD_POST = 'POST'

    constructor(method, request, mode) {
        this._method = method ?? Request.METHOD_GET
        this.response = request
        this.mode = mode ?? FETCH_MODE
    }

    method() {
        return this.isTestMode() ? this._method : Request.METHOD_GET
    }

    isTestMode() {
        return this.mode === FETCH_MODE_TEST
    }
}