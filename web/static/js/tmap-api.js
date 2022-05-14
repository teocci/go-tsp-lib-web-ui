/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-14
 */
import API from './api.js'

export default class TMapAPI extends API {
    constructor() {
        super()

        this.url = TMAP_SVR_URL
        this.key = TMAP_APP_KEY
        this.mode = FETCH_MODE_TEST

        this.addRequest('fix-points', 'POST', TMAP_TEST_API)
    }

    static instance() {
        this._instance = this._instance ?? new TMapAPI()

        return this._instance
    }
}