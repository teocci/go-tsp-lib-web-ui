import BasePanel from '../base/base-panel.js'
import TLibAPI from '../apis/tlib-api.js'
import TMapAPI from '../apis/tmap-api.js'

export default class ResultsPanel extends BasePanel {
    static TAG = 'results'

    static LISTENER_SHOW_SEGMENT = 'on-show-segment'

    static TABS_LIST = [
        {id: TLibAPI.TAG, label: 'TLib'},
        {id: TMapAPI.TAG, label: 'TMap'},
    ]

    //탐색 결과 표출하는 부분
    // let tabTLib = document.getElementById('tab-tlib')
    // let tabTMap = document.getElementById('tab-tmap')
    //
    // let tabTLibContent = document.getElementById('tab-result-tlib')
    // let tabTMapContent = document.getElementById('tab-result-tmap')


    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.tabs = new Map()

        this.mainTab = null

        this.createPanel()
    }

    createPanel() {
        const ctx = this
        const tabs = document.createElement('div')
        tabs.classList.add('tabs', 'effect')

        const content = document.createElement('div')
        content.classList.add('tabs-content')

        ResultsPanel.TABS_LIST.forEach(t => {
            const tab = document.createElement('div')
            tab.classList.add('tab')

            const tabId = `tab-${t.id}`
            const radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = 'result-tabs'
            radio.id = tabId
            radio.dataset.baseId = t.id
            radio.onchange = e => this.handleOnChange(e, ctx)

            const label = document.createElement('label')
            label.setAttribute('for', tabId)
            label.className = 'checkbox-label'
            label.textContent = t.label

            const sectionId = `tab-result-${t.id}`
            const section = document.createElement('section')
            section.id = sectionId

            tab.append(radio)
            tab.append(label)

            tabs.append(tab)

            content.append(section)

            this.tabs.set(t.id, {
                'id': t.id,
                'label': t.label,
                'tab': radio,
                'section': section,
                'listener': null,
            })
        })

        this.placeholder.append(tabs)
        this.placeholder.append(content)
    }

    handleOnChange(e, ctx) {
        const element = e.target
        console.log({element})
        if (element.dataset.baseId) ctx.toggleTabContentById(element.dataset.baseId)
    }

    sectionById(id) {
        console.log({id})
        return this.tabs.get(id).section
    }

    toggleTabContentById(id) {
        console.log({id})
        this.hideAllTabContentElements()
        this.sectionById(id).classList.add('active')
    }

    hideAllTabContentElements() {
        this.tabs.forEach(t => {
            t.section.classList.remove('active')
        })
    }

    renderTimelines(data, start) {
        this.mainTab = null
        this.disableTabs()
        data.forEach(r => this.renderTimeline(r.api, r.route, start))
        this.toggleTabContentById(this.mainTab)
        this.show()
    }

    renderTimeline(api, route, start) {
        const section = this.sectionById(api)
        const nodes = route.asArray()

        this.setMainTab(api)
        this.enableTabByAPI(api)


        const steps = [start, ...nodes]
        steps.forEach(step => {
            const elem = this.createWaypoint(api, step)
            section.append(elem)
        })
    }

    createWaypoint(api, step) {
        const stepElement = document.createElement('div')
        stepElement.className = 'step'

        const container = document.createElement('div')
        container.className = 'tag'

        const img = document.createElement('img')
        img.src = '../img/display_marker.png'

        const val = document.createElement('div')
        val.textContent = step.id === 0 ? 'S' : `${step.label}`
        val.className = 'centered'

        container.appendChild(img)
        container.appendChild(val)

        const costSection = document.createElement('div')
        costSection.className = 'cost'
        costSection.textContent = step.id === 0 ? step.label : `${step.distance}`

        stepElement.appendChild(container)
        stepElement.appendChild(costSection)

        stepElement.dataset.api = api
        stepElement.dataset.stepId = step.id
        stepElement.onclick = e => this.handleOnShowSegmentClicked(e)

        return stepElement
    }

    disableTabs() {
        this.tabs.forEach(item => this.disableTab(item.tab))
    }

    disableTab(tab) {
        tab.disabled = true
    }

    disableTabByAPI(api) {
        const tabId = `tab-${api}`
        const tabElement = document.getElementById(tabId)
        tabElement.disabled = true
    }

    enableTabs() {
        this.tabs.forEach(item => this.enableTab(item.tab))
    }

    enableTab(tab) {
        tab.disabled = false
    }

    enableTabByAPI(api) {
        const tabId = `tab-${api}`
        const tabElement = document.getElementById(tabId)
        tabElement.disabled = false
    }

    handleOnShowSegmentClicked(e) {
        this.callListener(ResultsPanel.LISTENER_SHOW_SEGMENT, e)
    }

    // // Point path를 가지고 overlay마커만 찍어줌
    // initOverlay(points, map) {
    //     console.log({table: points})
    //     const arr = []
    //     points.points.forEach(point => {
    //         const customOverlay = this.makeOverlay(point, true, true)
    //         customOverlay.setMap(map)
    //
    //         arr.push(customOverlay)
    //     })
    // }
    //
    // initDetailRouteTable(tlibData, tmapData) {
    //     const tlibContent = this.sectionById(TLibAPI.TAG)
    //     tlibContent.append(this.makeRouteTable('S', ''))
    //
    //     tlibData.route.lines.forEach(line => {
    //         const elem = this.makeRouteTable(line.id, line.cost);
    //         // elem.onclick = () => {
    //         //     const callback = this.listener(TLibAPI.TAG)
    //         //     callback(line.id)
    //         // }
    //
    //         tlibContent.append(elem)
    //     })
    //
    //     const tmapContent = this.sectionById(TMapAPI.TAG)
    //     tmapContent.append(this.makeRouteTable('S', ''))
    //
    //     let id = 1;
    //     tmapData.route.lines.features.forEach(feature => {
    //         if (parseInt(feature.properties.index) === id) {
    //             let elem = this.makeRouteTable(id, feature.properties.distance);
    //             elem.onclick = () => {
    //                 const callback = this.getListener(TMapAPI.TAG)
    //                 callback(elem.dataset.pointId)
    //             }
    //             tmapContent.append(elem)
    //             id++
    //         }
    //     })
    // }
    //
    // makeOverlay(point, tlibCheck, tmapCheck) {
    //     const overlay = document.createElement('span')
    //     overlay.className = 'overlay'
    //
    //     if (tlibCheck) {
    //         const tlibSpan = document.createElement('span')
    //         tlibSpan.className = 'overlay-tsp'
    //         tlibSpan.textContent = `${point.tlibId}`
    //
    //         overlay.appendChild(tlibSpan)
    //     }
    //
    //     if (tmapCheck) {
    //         const tmapSpan = document.createElement('span')
    //         tmapSpan.className = 'overlay-tmap'
    //         tmapSpan.textContent = `${point.tmapId}`
    //
    //         overlay.appendChild(tmapSpan)
    //     }
    //
    //     return new kakao.maps.CustomOverlay({
    //         position: new kakao.maps.LatLng(point.y + OFFSET_Y, point.x + OFFSET_X),
    //         content: overlay
    //     })
    // }
    //
    // makeRouteTable(id, cost) {
    //     const eachDiv = document.createElement('div')
    //     eachDiv.className = 'step'
    //
    //     const container = document.createElement('div')
    //     container.className = 'container'
    //
    //     const img = document.createElement('img')
    //     img.src = '../img/display_marker.png'
    //
    //     const val = document.createElement('div')
    //     val.textContent = `${id}`
    //     val.className = 'centered'
    //
    //     container.appendChild(img)
    //     container.appendChild(val)
    //
    //     const costSection = document.createElement('div')
    //     costSection.className = 'cost'
    //     costSection.textContent = `${cost}`
    //
    //     eachDiv.appendChild(container)
    //     eachDiv.appendChild(costSection)
    //
    //     console.log('i putttttttt')
    //
    //     // eachDiv.onclick = e => this.handleOnPointClicked(e)
    //     eachDiv.dataset.pointId = id
    //
    //     return eachDiv
    // }


    static makeRouteTableForTMap(id, cost) {

    }

    setMainTab(api) {
        this.mainTab = this.mainTab ?? api
    }
}