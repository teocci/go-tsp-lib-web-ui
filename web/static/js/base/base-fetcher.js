/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import BaseListener from './base-listener.js'

export default class BaseFetcher extends BaseListener {
    static LISTENER_DATA_FETCHED = 'on-data-fetched'

    constructor(info) {
        super()

        this.apiInfo = info
    }

    get apiURL() {
        return this.apiInfo.url
    }

    get apiKey() {
        return this.apiInfo.key
    }

    testResponse(k) {
        return this.apiInfo.testResponse(k)
    }

    async fetch(config) {
        if (!config) throw new Error('InvalidConfig: null config')

        const sTime = performance.now()
        const body = await (await fetch(config.url, config.options)).json()
        const duration = performance.now() - sTime

        return {
            'body': body,
            'duration': duration,
        }
    }

    isRequestTestMode(k) {
        return this.apiInfo.isRequestTestMode(k)
    }

    isAPITestMode() {
        return this.apiInfo.isTestMode()
    }
}