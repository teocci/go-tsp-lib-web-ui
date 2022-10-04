/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class KakaoAPI {
    static TAG = 'kakao'

    static get instance() {
        this._instance = this._instance ?? new KakaoAPI().vendor

        return this._instance
    }

    constructor() {
        this.vendor = kakao.maps
    }
}