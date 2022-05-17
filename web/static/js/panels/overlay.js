/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-16
 */
import BasePanel from '../base/base-panel.js'

export default class Overlay extends BasePanel {
    constructor() {
        super()

        this.tags = {}

        this.element = this.createElement()

        this._pos = null
    }

    createElement() {
        const overlay = document.createElement('div')
        overlay.className = 'overlay-tags'

        APIS.forEach(api => {
            const tag = document.createElement('div')
            tag.classList.add(`tag-${api}`, 'tag', 'hidden')
            tag.textContent = '-'
            tag.dataset.id = null
            tag.dataset.api = api
            tag.activeTag = false

            overlay.appendChild(tag)

            this.tags[api] = tag
        })

        this.instance = new kakao.maps.CustomOverlay({
            content: overlay,
        })

        return overlay
    }

    updateTagByAPI(api, id, label) {
        this.tags[api].dataset.id = id
        this.tags[api].textContent = label
    }

    activateTagByAPI(api) {
        this.tags[api].activeTag = true
        this.tags[api].classList.remove('hidden')
    }

    deactivateTagByAPI(api) {
        this.tags[api].activeTag = false
        this.tags[api].classList.add('hidden')
    }

    set position(pos) {
        this._pos = pos
        this.instance.setPosition(pos)
    }

    get position() {
        return this._pos ?? (this.instance.getPosition() ?? null)
    }

    render(map) {
        this.instance.setMap(map)
        this.instance.setVisible(true)
    }

    remove() {
        this.instance.setMap(null)
    }
}