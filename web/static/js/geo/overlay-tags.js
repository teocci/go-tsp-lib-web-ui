import Overlay from './overlay.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-06
 */
export default class OverlayTags extends Overlay {
    constructor() {
        super()

        this.tags = {}
        this.initElement()
    }

    createElement() {
        const $overlay = document.createElement('div')
        $overlay.className = 'overlay-tags'

        APIS.forEach(api => {
            const $tag = document.createElement('div')
            $tag.classList.add(`tag-${api}`, 'tag', 'hidden')
            $tag.textContent = '-'
            $tag.dataset.api = api
            $tag.routeId = null
            $tag.activeTag = false

            $overlay.appendChild($tag)

            this.tags[api] = $tag
        })

        return $overlay
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
        const tag = this.tags[api]
        tag.activeTag = false
        tag.classList.add('hidden')
    }
}