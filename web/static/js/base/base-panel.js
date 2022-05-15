/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-11
 */
import BaseListener from './base-listener.js'

export default class BasePanel extends BaseListener {
    static CHAR_UNDERSCORE = '_'
    static CHAR_HYPHEN = '-'

    static EMPTY_VALUE = BasePanel.CHAR_HYPHEN

    static replaceUnderscoreToHyphen(tag) {
        return tag.replaceAll(BasePanel.CHAR_UNDERSCORE, BasePanel.CHAR_HYPHEN)
    }

    static replaceHyphenToUnderscore(tag) {
        return tag.replaceAll(BasePanel.CHAR_HYPHEN, BasePanel.CHAR_UNDERSCORE)
    }

    constructor(element) {
        super()

        this.placeholder = element
    }

    get placeholder() {
        return this.element
    }

    set placeholder(element) {
        this.element = element
    }

    toggle(val) {
        this.placeholder.classList.toggle('hidden', val)
    }

    show() {
        this.placeholder.classList.remove('hidden')
    }

    hide() {
        this.placeholder.classList.add('hidden')
    }

    destroyChildren(element) {
        element = element ?? this.placeholder
        while (element.firstChild) {
            const lastChild = element.lastChild ?? false
            if (lastChild) element.removeChild(lastChild)
        }
    }
}