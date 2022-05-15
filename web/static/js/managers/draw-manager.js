import ElementManager from './element-manager.js'

export default class DrawManager{
    consturctor(){
    }

    clearCostTable(){
        let tblCost = document.getElementById('cost')
        let rows = tblCost.getElementsByTagName('tr');

        rows[1].getElementsByTagName('td')[1].innerHTML = ''
        rows[1].getElementsByTagName('td')[2].innerHTML = ''
        rows[2].getElementsByTagName('td')[1].innerHTML = ''
        rows[2].getElementsByTagName('td')[2].innerHTML = ''
        rows[3].getElementsByTagName('td')[1].innerHTML = ''
        rows[3].getElementsByTagName('td')[2].innerHTML = ''
    }

    clearRouteTable(){
        let contents = Array.from(document.getElementsByClassName('tab-content'));
        contents.forEach(content =>{
            content.innerHTML = ''
        })
    }
    
    removeMarkers(markers){
        markers.forEach(marker => {
            marker.setMap(null)
        })
    }

    showRoute(route, isShow, map){
        if(!isShow){
            route.routeOverlay.forEach(element =>{
                element.setMap(null)
            })
            route.routePolyLine.setMap(null)
        }
        else{
            route.routeOverlay.forEach(element =>{
                element.setMap(map)
            })
    
            route.routePolyLine.setPath(route.route.linePath)
            route.routePolyLine.setMap(map)
        }
    }

    showPointRoute(route, shown, map) {
        if (!shown) {
            route.pointPolyLine.setMap(null)
        } else {
            route.pointPolyLine.setPath(route.route.pointPath)
            route.pointPolyLine.setMap(map)
        }
    }

    showLabel(name, shown){
        const classname = `overlay-${name}`
        const overlayList = Array.from(document.getElementsByClassName(classname))
    
        if (!shown) {
            overlayList.forEach(overlay => overlay.classList.add('hide'))
        } else {
            overlayList.forEach(overlay => overlay.classList.remove('hide'))
        }
    }

    removeLabel(){
        let overlayList= [];
        overlayList = Array.from(document.getElementsByClassName('overlay-tsp'))
        overlayList.forEach(overlay => overlay.remove())

        overlayList = Array.from(document.getElementsByClassName('overlay-tmap'))
        overlayList.forEach(overlay => overlay.remove())
    }

    openTabContent(tabName){
        //모든 탭의 컨텐츠 안보이게 우선 만들고
        let tabcontent = Array.from(document.getElementsByClassName('tab-content'));
        tabcontent.forEach(content => {
            content.style.display = 'none';
        });

        //해당되는 탭만 보이게 
        document.getElementById(tabName).style.display = 'block';
    }

    drawOverlay(pointTable, map) {
        console.log({table: pointTable})
        let tlibCheck = document.getElementById('tsp')
        let tmapCheck = document.getElementById('tmap')

        const arr = []
        pointTable.points.forEach(point => {
            let customOverlay = ElementManager.makeOverlay(point, tlibCheck.checked, tmapCheck.checked);
            arr.push(customOverlay)
            customOverlay.setMap(map)
        })
    }
    
    drawTspLinePartly(id, route, map){
        let path = []
        
        route.partlyPolyLine.setMap(null);
        route.route.lines.forEach(line =>{
            if(line.id === id){
                path.push(new kakao.maps.LatLng(line.SPoint.y, line.SPoint.x))
                line.SLineString.nodes.forEach(node =>{
                    path.push(new kakao.maps.LatLng(node.y, node.x))
                })
                path.push(new kakao.maps.LatLng(line.EPoint.y, line.EPoint.x))
            }
        })
        route.partlyPolyLine.setPath(path)
        route.partlyPolyLine.setMap(map);
    }

    fillCostTable(data, isTSPLib) {
        let tblCost = document.getElementById('cost')
        let rows = tblCost.getElementsByTagName('tr');
    
        let cost = isTSPLib ? rows[1].getElementsByTagName('td')[2] : rows[1].getElementsByTagName('td')[1];
        let eta = isTSPLib ? rows[2].getElementsByTagName('td')[2] : rows[2].getElementsByTagName('td')[1];
        let ttime = isTSPLib ? rows[3].getElementsByTagName('td')[2] : rows[3].getElementsByTagName('td')[1];
    
        cost.innerText = data.cost;
        eta.innerText = data.eta;
        ttime.innerText = data.time;
    }


    showDialog() {
        let controlBox = document.getElementById('control-box')
        controlBox.classList.toggle('hide')
    }

    showPointListDialog(list){
        let str = ''
        list.forEach(point =>{
            str += `${point.x}, ${point.y},` 
        })
     
        alert(str)
    }
}