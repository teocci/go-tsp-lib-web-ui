/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import API from './api.js'

export default class TMapAPI extends API {
    static TAG = TMAP_API_NAME

    constructor(mode) {
        super(mode)

        this.url = TMAP_SVR_URL
        this.key = TMAP_APP_KEY

        this.addRequest(REQUEST_FIND_ROUTE, 'POST', TMAP_TEST_30)
    }

    static instance() {
        this._instance = this._instance ?? new TMapAPI()

        return this._instance
    }
}