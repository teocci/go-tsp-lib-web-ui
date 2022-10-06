import Overlay from './overlay.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-06
 */
export default class OverlayLabel extends Overlay {
    constructor() {
        super()

        this.index = null
        this.$label = null
        this.initElement()
    }

    createElement() {
        const $overlay = document.createElement('div')
        $overlay.classList.add('marker-label')

        const $label = document.createElement('div')
        $label.classList.add('label')
        $label.textContent = '-'

        $overlay.appendChild($label)

        this.$label = $label

        return $overlay
    }

    updateLabel(label) {
        this.$label.textContent = label
    }

    show() {
        this.$label.active = true
        this.$label.classList.remove('hidden')
    }

    deactivateTagByAPI() {
        this.$label.active = false
        this.$label.classList.add('hidden')
    }
}