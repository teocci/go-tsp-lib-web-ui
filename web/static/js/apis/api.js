/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import Request from '../fetchers/request.js'

export default class API {
    constructor() {
        this.url = null
        this.key = null
        this.mode = FETCH_MODE
        this.requests = {}
    }

    addRequest(k, method, response, mode) {
        this.requests[k] = new Request(method, response, mode ?? this.mode)
    }

    testResponse(k) {
        return this.requests[k]?.response ?? null
    }

    isRequestTestMode(k) {
        return this.requests[k]?.isTestMode()
    }

    isTestMode() {
        return this.mode === FETCH_MODE_TEST
    }
}