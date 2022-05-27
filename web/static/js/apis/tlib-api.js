/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import API from './api.js'

export default class TLibAPI extends API {
    static TAG = TLIB_API_NAME

    constructor(mode = null) {
        super(mode)

        this.url = TLIB_SVR_URL

        this.addRequest(REQUEST_FIX_POINTS, 'POST', FIX_POINTS_TEST_URL)
        this.addRequest(REQUEST_FIND_ROUTE, 'POST', TLIB_TEST_30)
    }

    static instance() {
        this._instance = this._instance ?? new TLibAPI()

        return this._instance
    }
}