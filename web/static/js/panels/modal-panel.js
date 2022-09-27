/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-19
 */
import Draggable from '../base/base-draggable.js'

export default class ModalPanel extends Draggable {
    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.content = null
        this.table = null

        this.createPanel()
        this.createEmptyTable()
        this.startDragEvent(this.header)
    }

    createPanel() {
        const section = document.createElement('section')
        section.classList.add('modal-section')

        const header = document.createElement('div')
        header.classList.add('modal-header')

        const title = document.createElement('div')
        title.classList.add('title')
        title.textContent = '경로 비교'

        const close = document.createElement('div')
        close.classList.add('close')
        close.role = 'button'
        close.onclick = e => this.close(e)
        close.isCloseBtn = true

        const icon = document.createElement('i')
        icon.classList.add('fa', 'fa-times')
        icon.ariaHidden = 'true'

        const content = document.createElement('div')
        content.classList.add('modal-content')

        // const trigger = document.createElement('div')
        // trigger.classList.add('outside-trigger')
        // trigger.onclick = e => this.close(e)

        this.header = header
        this.content = content

        close.appendChild(icon)
        header.append(title, close)

        section.append(header, content)

        this.placeholder.appendChild(section)
    }

    createEmptyTable() {
        const table = document.createElement('table')
        table.classList.add('modal-table')

        const thead = document.createElement('thead')
        const tr = document.createElement('tr')
        const thIndex = document.createElement('th')
        thIndex.textContent = '#'
        const thPoints = document.createElement('th')
        thPoints.textContent = '배달점'
        const thTLib = document.createElement('th')
        thTLib.textContent = 'Tlib'
        const thTMap = document.createElement('th')
        thTMap.textContent = 'TMap'

        const tbody = document.createElement('tbody')
        tbody.classList.add('modal-tbody')

        tr.append(thIndex, thPoints, thTLib, thTMap)
        thead.appendChild(tr)
        table.append(thead, tbody)

        this.table = tbody
        this.content.appendChild(table)
    }

    close(e) {
        console.log({target: e.target, current: e.currentTarget})
        e.preventDefault()
        e.stopPropagation()
        if (e.target === e.currentTarget || e.target.parentNode.isCloseBtn) this.hide()
    }

    reset() {
        this.hide()
        this.destroyChildren(this.content)
        this.createEmptyTable()
    }

    loadFixedPoints(steps) {
        console.log({steps})
        steps.forEach(step => this.createTD(step))
    }

    createTD(step) {
        const id = step.id
        const td = document.createElement('tr')
        td.dataset.index = id

        const tdIndex = document.createElement('td')
        tdIndex.textContent = id

        const tdPoints = document.createElement('td')
        tdPoints.textContent = step.point.toString()

        const tdTLib = document.createElement('td')
        tdTLib.dataset.api = 'tlib'
        tdTLib.textContent = ModalPanel.EMPTY_VALUE

        const tdTMap = document.createElement('td')
        tdTMap.dataset.api = 'tmap'
        tdTMap.textContent = ModalPanel.EMPTY_VALUE

        td.append(tdIndex, tdPoints, tdTLib, tdTMap)
        this.table.append(td)
    }

    // TODO 용림아 do your magic here
    updateTDbyAPI(api, route) {
        const rows = this.table.getElementsByTagName('tr')
        const TLIB_COL = 2
        const TMAP_COL = 3

        let column = api === 'tlib' ? TLIB_COL : TMAP_COL

        route.steps.forEach(step => {
            [...rows].forEach(row => {
                if (step.id === parseInt(row.dataset.index)) {
                    let item = row.getElementsByTagName('td')[column]
                    item.textContent = step.point.toString()
                }

            })
        })
    }

    loadRoutes(data) {
        console.log({data})
        data.forEach(r => this.updateTDbyAPI(r.api, r.route))
    }

    show() {
        super.show()
    }
}