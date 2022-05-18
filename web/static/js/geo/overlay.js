/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-16
 */

export default class Overlay {
    constructor() {
        this.tags = {}

        this.initElement()
    }

    initElement() {
        this.instance = new kakao.maps.CustomOverlay({
            content: this.createElement(),
        })
    }

    createElement() {
        const overlay = document.createElement('div')
        overlay.className = 'overlay-tags'

        APIS.forEach(api => {
            const tag = document.createElement('div')
            tag.classList.add(`tag-${api}`, 'tag', 'hidden')
            tag.textContent = '-'
            tag.dataset.api = api
            tag.routeId = null
            tag.activeTag = false

            overlay.appendChild(tag)

            this.tags[api] = tag
        })

        return overlay
    }

    updateTagByAPI(api, id, label) {
        this.tags[api].routeId = id
        this.tags[api].textContent = label
    }

    activateTagByAPI(api) {
        const tag = this.tags[api]
        if (tag.routeId == null) return
        tag.activeTag = true
        tag.classList.remove('hidden')
    }

    deactivateTagByAPI(api) {
        this.tags[api].activeTag = false
        this.tags[api].classList.add('hidden')
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