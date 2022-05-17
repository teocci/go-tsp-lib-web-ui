/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-16
 */
import BasePanel from '../base/base-panel.js'

export default class Overlay extends BasePanel {
    constructor(element) {
        super(element)

        this.createElement()
    }

    makeOverlay() {
        const overlay = document.createElement('div')
        overlay.className = 'tag-overlay'

        APIS.forEach(api => {
            const tag = document.createElement('span')
            tag.classList.add(`tag-${api}`, 'hidden')
            tag.textContent = '-'

            overlay.appendChild(tag)
        })
    }
}