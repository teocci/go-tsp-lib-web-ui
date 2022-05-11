export default class ElementManager {
    constructor(){
    }
    
    static makeRouteTable(id, cost){
        const eachDiv = document.createElement('div')
        eachDiv.className='each-route'

        const container = document.createElement('div')
        container.className ='container'

        const img = document.createElement('img')
        img.src = '../img/display_marker.png'
        const val = document.createElement('div')
        val.textContent = `${id}`
        val.className = 'centered'
        container.appendChild(img)
        container.appendChild(val)

        const costSection = document.createElement('div')
        costSection.className='cost'
        costSection.textContent=`${cost}`

        eachDiv.appendChild(container)
        eachDiv.appendChild(costSection)
        // eachDiv.onclick = ElementManager.process
        // eachDiv.dataset.id = id

        return eachDiv;
    }


    static process(e){
        console.log({e}, {target:e.target})
    }
    
    static makeOverlay(point, tlibCheck, tmapCheck){
        const span = document.createElement('span')
        span.className = 'overlay'

        
        if (tlibCheck) {
            const tlibSpan = document.createElement('span')
            tlibSpan.className = 'overlay-tsp'
            tlibSpan.textContent = `${point.tlibId}`

            span.appendChild(tlibSpan)
        }
        if (tmapCheck) {
            const tmapSpan = document.createElement('span')
            tmapSpan.className = 'overlay-tmap'
            tmapSpan.textContent = `${point.tmapId}`
            span.appendChild(tmapSpan)
        }

        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(point.y + OFFSET_Y, point.x + OFFSET_X),
            content: span
        })

        return customOverlay;
    }
}