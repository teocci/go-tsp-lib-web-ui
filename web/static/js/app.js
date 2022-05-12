import RouteManager from './routeManager.js'
import TmapMgr from './tmap.js'
import PointTable from './point-table.js'
import Point from './point.js'
import ResultsPanel from './results-panel.js'
import DrawManager from './draw-manager.js'

let mapElement = document.getElementById('map')
let map
let markers = []

let resultsPanel

let tsp = new RouteManager()
let tmap = new RouteManager()

let pointTable = new PointTable()
let drawManager = new DrawManager()

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

const resultContent = document.getElementById('results-content')

//배달점 새로고침
let btnInitMap = document.getElementById('initMap')
let btnPointList = document.getElementById('pointList')


window.onload = () => {
    const options = {
        center: new kakao.maps.LatLng(36.4310406, 127.3934052),
        level: 3
    }

    map = new kakao.maps.Map(mapElement, options)

    resultsPanel = new ResultsPanel(resultContent)
    resultsPanel.addListener(ResultsPanel.TLIB, drawTLibLinePartly)
    resultsPanel.addListener(ResultsPanel.TMAP, drawTMapLinePartly)

    btnAddPointsElement.onclick = addDeliveryPoint
    btnAddRandomPoints.onclick = getRandomPoints

    kakao.maps.event.addListener(map, 'rightclick', me => {
        kakao.maps.event.removeListener(map, 'click', mapClickListener)
    })

    btnFindRoute.onclick = findRoute;

    tsp.routePolyLine = new kakao.maps.Polyline(TSP_ROUTE_POLYLINE)
    tsp.pointPolyLine = new kakao.maps.Polyline(TSP_POINT_POLYLINE)
    tsp.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)

    tmap.routePolyLine = new kakao.maps.Polyline(TMAP_ROUTE_POLYLINE)
    tmap.pointPolyLine = new kakao.maps.Polyline(TMAP_POINT_POLYLINE)
    tmap.partlyPolyLine = new kakao.maps.Polyline(PARTLY_POLYLINE)

    menu.onclick = drawManager.showDialog

    tlibShowRoute.onchange = () => {
        drawManager.showRoute(tsp, tlibShowRoute.checked, map)
        drawManager.showLabel('tsp', tlibShowRoute.checked)
    }

    tlibShowPointRoute.onchange = () => {
        drawManager.showPointRoute(tsp, tlibShowPointRoute.checked, map)
    }

    tmapShowRoute.onchange = () => {
        drawManager.showRoute(tmap, tmapShowRoute.checked, map)
        drawManager.showLabel('tmap', tmapShowRoute.checked)
    }

    tmapShowPointRoute.onchange = () => {
        drawManager.showPointRoute(tmap, tmapShowPointRoute.checked, map)
    }

    btnInitMap.onclick = () =>{
        pointTable.init()
        tsp.init()
        tmap.init()
        drawManager.removeLabel()
        drawManager.removeMarkers(markers)
        drawManager.clearCostTable()
        drawManager.clearRouteTable()
    }

    btnPointList.onclick = () =>{
        drawManager.showPointListDialog(pointTable.points)
    }
}

function addDeliveryPoint() {
    kakao.maps.event.addListener(map, 'click', mapClickListener);
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

    markers.push(marker)

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
            drawManager.fillCostTable(cost, true);
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

        drawManager.fillCostTable(cost, false)
        drawTMapLine(body)
    })
}

function drawTLibLinePartly(id){
    console.log({drawTLibLinePartly: id})
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

function drawTMapLinePartly(id){
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

                resultsPanel.initOverlay(pointTable, map)
                resultsPanel.initDetailRouteTable(tsp, tmap)

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

            resultsPanel.initOverlay(pointTable, map)
            resultsPanel.initDetailRouteTable(tsp, tmap)

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

