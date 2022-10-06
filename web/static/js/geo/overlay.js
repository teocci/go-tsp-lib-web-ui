/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-16
 */
export default class Overlay {
    constructor() {}

    initElement() {
        this.instance = new kakao.maps.CustomOverlay({
            content: this.createElement(),
            zIndex: Z_INDEX_OVERLAYS,
        })
    }

    createElement() {
        return document.createElement('div')
    }

    set position(pos) {
        this.instance.setPosition(pos)
    }

    get position() {
        return this.instance.getPosition() ?? null
    }

    render(map) {
        this.instance.setMap(map)
    }

    remove() {
        this.instance.setMap(null)
    }
}