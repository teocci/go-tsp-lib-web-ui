import BasePanel from '../base/base-panel.js'
import TLibAPI from '../apis/route/tlib-api.js'
import TMapAPI from '../apis/route/tmap-api.js'

export default class ResultsPanel extends BasePanel {
    static TAG = 'results'

    static LISTENER_SHOW_SEGMENT = 'on-show-segment'

    static TABS_LIST = [
        {api: TLibAPI.TAG, label: 'TLib'},
        {api: TMapAPI.TAG, label: 'TMap'},
    ]

    constructor(element) {
        if (!element) throw 'InvalidElement: null element'
        super(element)

        this.tabs = new Map()

        this.mainTabId = null

        this.createPanel()

        this.reset()
    }

    createPanel() {
        const tabs = document.createElement('div')
        tabs.classList.add('tabs', 'effect')

        const content = document.createElement('div')
        content.classList.add('tabs-content')

        ResultsPanel.TABS_LIST.forEach(t => {
            const api = t.api
            const tab = document.createElement('div')
            tab.classList.add('tab')

            const tabId = `tab-${api}`
            const radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = 'result-tabs'
            radio.id = tabId
            radio.dataset.api = api
            radio.onchange = e => this.handleOnChange(e)

            const label = document.createElement('label')
            label.setAttribute('for', tabId)
            label.className = 'checkbox-label'
            label.textContent = t.label

            const sectionId = `tab-result-${api}`
            const section = document.createElement('section')
            section.className = 'tab-content'
            section.id = sectionId

            const timeline = document.createElement('div')
            timeline.className = 'timeline'

            tab.append(radio, label)

            tabs.appendChild(tab)

            section.appendChild(timeline)

            content.appendChild(section)

            this.tabs.set(api, {
                'api': api,
                'label': t.label,
                'tab': radio,
                'section': section,
                'timeline': timeline,
                'listener': null,
            })
        })

        this.placeholder.append(tabs, content)
    }

    reset() {
        this.hide()
        this.tabs.forEach(t => {
            this.hideSection(t.section)
            this.disableTab(t.tab)
            this.destroyChildren(t.timeline)
        })
    }

    setMainTab(api) {
        this.mainTabId = this.mainTabId ?? api
    }

    tabByAPI(api) {
        return this.tabs.get(api)?.tab ?? null
    }

    sectionByAPI(api) {
        return this.tabs.get(api)?.section ?? null
    }

    timelineByAPI(api) {
        return this.tabs.get(api)?.timeline ?? null
    }

    checkTabByAPI(api) {
        const tab = this.tabByAPI(api)
        if (tab) tab.checked = true
    }

    openTabContentByAPI(api) {
        console.log({api})
        this.hideAllTabContentElements()
        this.checkTabByAPI(api)
        this.showSection(this.sectionByAPI(api))
    }

    hideAllTabContentElements() {
        this.tabs.forEach(t => this.hideSection(t.section))
    }

    showSection(section) {
        section.classList.add('active')
    }

    hideSection(section) {
        section.classList.remove('active')
    }

    renderTimelines(data) {
        this.mainTabId = null
        this.disableTabs()
        data.forEach(r => this.renderTimeline(r.api, r.route))
        this.openTabContentByAPI(this.mainTabId)
        this.show()
    }

    renderTimeline(api, route) {
        const timeline = this.timelineByAPI(api)
        const nodes = route.asArray

        this.setMainTab(api)
        this.enableTabByAPI(api)

        const steps = [route.baseStep, ...nodes]
        console.log({steps})

        steps.forEach(step => {
            const elem = this.createWaypoint(api, step)
            timeline.appendChild(elem)
        })
    }

    createWaypoint(api, step) {
        const stepElem = document.createElement('div')
        stepElem.className = 'step'
        stepElem.dataset.api = api
        stepElem.dataset.stepId = step.id
        stepElem.activeStep = false
        stepElem.onclick = e => this.handleOnShowSegmentClicked(e)

        const tag = document.createElement('div')
        tag.className = 'tag'
        tag.textContent = step.id === 0 ? 'S' : `${step.label}`

        const info = document.createElement('div')
        info.className = 'info'

        const cost = document.createElement('div')
        cost.className = 'cost'
        cost.textContent = step.id === 0 ? step.label : distanceFormatter(step.distance)

        info.appendChild(cost)

        stepElem.append(tag, info)

        return stepElem
    }

    disableTabByAPI(api) {
        const tab = this.tabByAPI(api)
        this.disableTab(tab)
    }

    disableTabs() {
        this.tabs.forEach(item => this.disableTab(item.tab))
    }

    disableTab(tab) {
        if (tab) tab.disabled = true
    }

    enableTabByAPI(api) {
        const tab = this.tabByAPI(api)
        this.enableTab(tab)
    }

    enableTabs() {
        this.tabs.forEach(item => this.enableTab(item.tab))
    }

    enableTab(tab) {
        if (tab) tab.disabled = false
    }

    activateStep(api, step) {
        this.removeActiveByAPI(api)
        step.activeStep = true
        step.classList.add('active')

        // const tag = step.querySelector('.tag')
        // if (tag) tag.classList.add('active')
    }

    removeActiveByAPI(api) {
        const timeline = this.timelineByAPI(api)
        const steps = timeline.querySelectorAll('.step')
        const tags = timeline.querySelectorAll('.step .tag')

        for (const step of steps) {
            step.activeStep = false
            step.classList.remove('active')
        }

        // for (const tag of tags) {
        //     tag.classList.remove('active')
        // }
    }

    handleOnChange(e) {
        const element = e.target
        const api = element.dataset.api
        console.log({this: this})
        if (api) this.openTabContentByAPI(api)
    }

    handleOnShowSegmentClicked(e) {
        const target = e.currentTarget
        if (target.activeStep) return

        mainModule.onShowSegmentClicked(e)
    }
}