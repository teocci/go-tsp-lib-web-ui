import Route from './route.js'
import TmapMgr from './tmap.js'
import PointTable from './point-table.js'
import Point from './point.js'
import ElementManager from './element-manager.js'

let mapElement = document.getElementById('map')
let map

let tsp = new Route();
let tmap = new Route();

let pointTable = new PointTable();

//add points btn
let btnAddPointsElement = document.getElementById('add-points')

// Add random points btn
let btnAddRandomPoints = document.getElementById('add-random-points');

// Run tsp-lib
let btnFindRoute = document.getElementById('findRoute');

// Presents the cost and time of the executed request
let tblCost = document.getElementById('cost')

// Checkboxes
let tlibCheck = document.getElementById('tsp')
let tmapCheck = document.getElementById('tmap')

let controlBox = document.getElementById('control-box')

let menu = document.getElementById('menu-btn')

// Show route
let tlibShowRoute = document.getElementById('show-tsp-route')
let tlibShowPointRoute = document.getElementById('show-tsp-points-route')
let tmapShowRoute = document.getElementById('show-tmap-route')
let tmapShowPointRoute = document.getElementById('show-tmap-points-route')

//탐색 결과 표출하는 부분
let tabTLib = document.getElementById('tab-tlib')
let tabTMap = document.getElementById('tab-tmap')

let tabTLibContent = document.getElementById('tlib-result-content')
let tabTMapContent = document.getElementById('tmap-result-content')

//배달점 새로고침
let btnInitMap = document.getElementById('initMap')

window.onload = () => {
    const options = {
        center: new kakao.maps.LatLng(36.4310406, 127.3934052),
        level: 3
    }

    map = new kakao.maps.Map(mapElement, options)

    btnAddPointsElement.onclick = addDeliveryPoint
    btnAddRandomPoints.onclick = getRandomPoints

    kakao.maps.event.addListener(map, 'rightclick', me => {
        kakao.maps.event.removeListener(map, 'click', mapClickListener)
    })

    btnFindRoute.onclick = findRoute;

    tsp.routePolyLine = new kakao.maps.Polyline(TSP_ROUTE_POLYLINE);

    tsp.pointPolyLine = new kakao.maps.Polyline(TSP_POINT_POLYLINE)

    tsp.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)

    tmap.routePolyLine = new kakao.maps.Polyline(TMAP_ROUTE_POLYLINE);

    tmap.pointPolyLine = new kakao.maps.Polyline(TMAP_POINT_POLYLINE);

    tmap.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)

    menu.onclick = showDialog;

    tlibShowRoute.onchange = () => {
        tsp.showRoute(tlibShowRoute.checked, map)
        showLabel('tsp', tlibShowRoute.checked)
    }

    tlibShowPointRoute.onchange = () => {
        showPointRoute(tsp, tlibShowPointRoute.checked)
    }

    tmapShowRoute.onchange = () => {
        showRoute(tmap, tmapShowRoute.checked)
        showLabel('tmap', tmapShowRoute.checked)
    }

    tmapShowPointRoute.onchange = () => {
        showPointRoute(tmap, tmapShowPointRoute.checked)
    }

    tabTLib.onclick = () => {
        openTabContent('tlib-result-content')
    }

    tabTMap.onclick = () => {
        openTabContent('tmap-result-content')
    }

    showLabel('tmap', tmapShowRoute.checked)

    btnInitMap.onclick = () =>{
        pointTable.init()
        
    }
}

function addDeliveryPoint() {
    kakao.maps.event.addListener(map, 'click', mapClickListener);
}

function openTabContent(tabName) {
    //모든 탭의 컨텐츠 안보이게 우선 만들고
    let tabcontent = Array.from(document.getElementsByClassName('tab-content'));
    tabcontent.forEach(content => {
        content.style.display = 'none';
    });

    //해당되는 탭만 보이게 
    document.getElementById(tabName).style.display = 'block';
}

function showPointRoute(route, shown) {
    if (!shown) {
        route.pointPolyLine.setMap(null)
    } else {
        route.pointPolyLine.setPath(route.route.pointPath)
        route.pointPolyLine.setMap(map)
    }
}

function showLabel(name, shown) {
    const classname = `overlay-${name}`
    const overlayList = Array.from(document.getElementsByClassName(classname))

    if (!shown) {
        overlayList.forEach(overlay => overlay.classList.add('hide'))
    } else {
        overlayList.forEach(overlay => overlay.classList.remove('hide'))
    }
}

function showRoute(route, shown) {
    if (!shown) {
        route.routeOverlay.forEach(element => element.setMap(null))

        route.routePolyLine.setMap(null)
    } else {
        route.routeOverlay.forEach(element => element.setMap(map))

        route.routePolyLine.setPath(route.route.linePath)
        route.routePolyLine.setMap(map)
    }
}

function showDialog() {
    controlBox.classList.toggle('hide')
}

function mapClickListener(mouseEvent) {
    const latLng = mouseEvent.latLng
    makeMarkers(latLng)
}

function makeMarkers(latLng) {
    const marker = new kakao.maps.Marker({
        map: map,
        position: latLng,
    })

    if (pointTable.points.length === 0) {
        marker.setTitle('시작점')
        marker.setImage(MARKERS.START)
    } else if (pointTable.points.length > 0) {
        marker.setTitle(`${pointTable.points.length}`)
        marker.setImage(MARKERS.DELIVERY)
    }

    const iwContent = `${pointTable.points.length}`

    pointTable.addPoint(iwContent, new Point(iwContent, latLng.La, latLng.Ma))
}


function findRoute() {
    if (pointTable.points.length <= 0) {
        alert('배달점이 없습니다. 배달점을 등록해주세요.');
        return;
    }

    let [start, ...rest] = pointTable.points;

    let routeRequest = {
        SPoint: start,
        EPoint: start,
        SPointList: {
            nodes: rest
        }
    };

    if (tlibCheck.checked) {
        callTSPLib(routeRequest);
    }
    if (tmapCheck.checked) {
        callTMapLib(routeRequest);
    }

    document.getElementById('results-content').classList.remove('hide');
}

function callTSPLib(routeRequest) {
    const url = `${TSP_SVR_URL}/TSP_find_shortest4`;
    
    let sTime = new Date();
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain'
        },
        body: JSON.stringify(routeRequest)
    })
        .then(response => response.json())
        .then(body => {
            //DrawLine2(body);
            let eTime = new Date();
            let cost = {
                'cost': (body.SPathList.total_cost / 1000).toFixed(2),
                'eta': (body.SPathList.use_time / 60).toFixed(2),
                'time':(eTime - sTime)/1000,//body.TSP_time.toFixed(5),
            };
            fillCostTable(cost, true);
            drawTSPLine(body);
        });
}

function callTMapLib(routeRequest) {
    let num = routeRequest.SPointList.nodes.length + 1
    if (num < 10) {
        alert('TMap 경로탐색 요청은 배송지 갯수가 10,20,30,100 일 경우 가능합니다.')
        return
    }
    let sTime = new Date();
    // let url = `https://apis.openapi.sk.com/tmap/routes/routeOptimization${num}?version=1&format=json`
    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'appKey': T_MAP_APP_KEY,
    //         'Content-type': 'application/json'
    //     },

    //     body: JSON.stringify(TmapMgr.makeTmapReqObject(routeRequest))
    // })
    let url = TEST_TMAP_API;
    fetch(url, {
        method:"GET",
    })
    .then(response => response.json()).then(body => {
        let eTime = new Date();
        let cost = {
            'cost': (parseFloat(body.properties.totalDistance) / 1000).toFixed(2),
            'eta': (parseFloat(body.properties.totalTime) / 60).toFixed(2),
            'time': (eTime - sTime)/1000,
        }

        fillCostTable(cost, false)
        drawTMapLine(body)
    })
}


function fillCostTable(data, isTSPLib) {
    let rows = tblCost.getElementsByTagName('tr');

    let cost = isTSPLib ? rows[1].getElementsByTagName('td')[2] : rows[1].getElementsByTagName('td')[1];
    let eta = isTSPLib ? rows[2].getElementsByTagName('td')[2] : rows[2].getElementsByTagName('td')[1];
    let ttime = isTSPLib ? rows[3].getElementsByTagName('td')[2] : rows[3].getElementsByTagName('td')[1];

    cost.innerText = data.cost;
    eta.innerText = data.eta;
    ttime.innerText = data.time;
}


// Point path를 가지고 overlay마커만 찍어줌
function makeOverlay() {
    console.log({table: pointTable})
    const arr = []
    pointTable.points.forEach(point => {
        let customOverlay = ElementManager.makeOverlay(point, tlibCheck.checked, tmapCheck.checked);
        arr.push(customOverlay)
        customOverlay.setMap(map)
    })
}

function makeDetailRouteTable(){
    tabTLibContent.appendChild(ElementManager.makeRouteTable('S', ''))

    tsp.route.lines.forEach(line =>{
        let elem = ElementManager.makeRouteTable(line.id, line.cost);
        // elem.onclick = () => {
        //     drawTspLinePartly(line.id)
        // }

        tabTLibContent.appendChild(elem)
    })

    tabTMapContent.appendChild(ElementManager.makeRouteTable('S', ''))
    
    let id = 1;
    tmap.route.lines.features.forEach(feature =>{
        if(parseInt(feature.properties.index) === id){
            let elem = ElementManager.makeRouteTable(id, feature.properties.distance);
     
            elem.onclick = () => {
                drawTmapLinePartly(id)
            }
            tabTMapContent.appendChild(elem);
            id = id+1
        }    
    })
}

function drawTspLinePartly(id){
    let path = []
    
    tsp.partlyPolyLine.setMap(null);
    tsp.route.lines.forEach(line =>{
        if(line.id === id){
            path.push(new kakao.maps.LatLng(line.SPoint.y, line.SPoint.x))
            line.SLineString.nodes.forEach(node =>{
                path.push(new kakao.maps.LatLng(node.y, node.x))
            })
            path.push(new kakao.maps.LatLng(line.EPoint.y, line.EPoint.x))
        }
    })
    tsp.partlyPolyLine.setPath(path)
    tsp.partlyPolyLine.setMap(map);
}

function drawTmapLinePartly(id){
    let path = []
    console.log(`after :  id : ${id}`)
    tmap.route.lines.features.forEach(feature =>{
       
        if(parseInt(feature.properties.index) === id){
            if (feature.geometry.type === 'Point') {
                let x = feature.geometry.coordinates[0];
                let y = feature.geometry.coordinates[1];
                path.push(new kakao.maps.LatLng(y, x))
            } else {
                feature.geometry.coordinates.forEach(coord => {
                    let x = coord[0]
                    let y = coord[1]
                    path.push(new kakao.maps.LatLng(y, x))
                });
            }       
        }    
    })
   
    tmap.partlyPolyLine.setPath(path)
    tmap.partlyPolyLine.setMap(map);
}


function drawTSPLine(lines) {
    let linePath = []
    let pointPath = []
    let pointInfos = []
    console.log({lines})

    lines.SPathList.paths.forEach(paths => {

        let obj = {
            pos: new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x),
            id: paths.id-1,  //path.id가 1부터 옴.
            cost: paths.cost
        };
        pointInfos.push(obj);

        pointPath.push(new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x));

        paths.SLineString.nodes.forEach(element => {
            linePath.push(new kakao.maps.LatLng(element.y, element.x))
        })

        pointTable.putTLibPoint(obj.id, paths.SPoint.x, paths.SPoint.y);
       
    })

    //trigger tsp complete event
    pointTable.tlib = true

    let overlayPromise = new Promise((resolve, reject) => {
        resolve()
    })

    overlayPromise.then(() => {
        if (pointTable.tlib && pointTable.tmap) {
                console.log('tlib promise..')
                makeOverlay()
                makeDetailRouteTable()
                pointTable.tlib = false;
                pointTable.tmap = false;
        }
    })

    tsp.routePolyLine.setPath(linePath)
    tsp.routePolyLine.setMap(map)

    tsp.route.lines = lines.SPathList.paths
    tsp.route.linePath = linePath
    

    pointPath.push(pointPath[0]) //경유점 표현시 마지막 포인트로 되돌아가게

    tsp.route.pointPath = pointPath
    tsp.route.pointInfos = pointInfos
}

function drawTMapLine(lines) {
    console.log(lines)
    let linePath = []
    let pointPath = []
    let pointInfos = []

    lines.features.forEach(feature => {
        if (feature.geometry.type === 'Point') {
            let x = feature.geometry.coordinates[0];
            let y = feature.geometry.coordinates[1];

            let obj = {
                pos: new kakao.maps.LatLng(y, x),
                id: parseInt(feature.properties.index),
                cost: 0,
            }

            pointPath.push(new kakao.maps.LatLng(y, x))

            pointInfos.push(obj)
            if(obj.id < pointTable.points.length){
                pointTable.putTMapPoint(obj.id, x, y)
            }
            
        } else {
            feature.geometry.coordinates.forEach(coord => {
                let x = coord[0]
                let y = coord[1]
                linePath.push(new kakao.maps.LatLng(y, x))
            });
        }
    });

    pointTable.tmap = true;
    // Trigger tmap complete event
    let overlayPromise = new Promise((resolve, reject) => {
        resolve()
    })

    overlayPromise.then(() => {
        if (pointTable.tmap && pointTable.tlib) {
            console.log('tmap promise..')
            makeOverlay()
            makeDetailRouteTable()
            pointTable.tlib = false;
            pointTable.tmap = false;
        }
    })

    tmap.routePolyLine.setPath(linePath)
    tmap.routePolyLine.setMap(map)

    tmap.route.lines = lines
    tmap.route.linePath = linePath
    tmap.route.pointPath = pointPath
    tmap.route.pointInfos = pointInfos
}


function getRandomPoints() {
    const radioList = document.getElementsByName('random-points')

    let randomPoints = [
        {
            "x": 127.386293,
            "y": 36.430404
        },
        {
            "x": 127.391044,
            "y": 36.427786
        },
        {
            "x": 127.402162,
            "y": 36.433517
        },
        {
            "x": 127.394424,
            "y": 36.428918
        },
        {
            "x": 127.394077,
            "y": 36.434694
        },
        {
            "x": 127.395467,
            "y": 36.430548
        },
        {
            "x": 127.392639,
            "y": 36.428671
        },
        {
            "x": 127.387393,
            "y": 36.431525
        },
        {
            "x": 127.397108,
            "y": 36.429471
        },
        {
            "x": 127.390705,
            "y": 36.431421
        }
    ]
    
    // let cnt = 0
    // radioList.forEach((node) => {
    //     if (node.checked) {
    //         cnt = parseInt(node.value);
    //     }
    // })
    // let randomPoints = getMBR(cnt);
    let [start, ...rest] = randomPoints;

    const url = `${TSP_SVR_URL}/fix_points`
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain'
        },
        body: JSON.stringify({
            SPoint: start,
            EPoint: start,
            SPointList: {
                nodes: rest
            },
        }),
    }).then(response => response.json()).then(body => {
        makeRandom(body)
    })
}

function makeRandom(data) { //Random 좌표 n개 생성
    let list = []
    console.log({data})
    list.push(data.FixPoint.SPoint)
    data.FixPoint.pts.forEach(element => {
            list.push(element)
        }
    )
    list.push(data.FixPoint.EPoint)

    for (let i = 0; i < list.length - 1; i++) {
        let position = new kakao.maps.LatLng(list[i].y, list[i].x);
        makeMarkers(position);
    }
}

function getMBR(num) { //MBR 가져오기
    let MBR = map.getBounds()
    let strMBR = MBR.toString()
    let arrMBR = strMBR.split(',')
    let MinX = arrMBR[0].replace('((', '')
    let MinY = arrMBR[1].replace(')', '')
    let MaxX = arrMBR[2].replace('(', '')
    let MaxY = arrMBR[3].replace('))', '')
    let randomAry = [];
    for (let i = 0; i < num; i++) {
        let x = rand(parseFloat(MinY), parseFloat(MaxY))
        let y = rand(parseFloat(MinX), parseFloat(MaxX))

        randomAry.push({'x': x, 'y': y})
    }

    return randomAry
}

function rand(min, max) {
    return Math.random() * (max - min) + min
}

