import Route from './route.js'
import TmapMgr from './tmap.js'
import PointTable from './point-table.js'
import Point from './point.js'

let mapElement = document.getElementById('map')
let map
let pointList = [];
let deliveryMarkers = [];

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

    tsp.routePolyLine = new kakao.maps.Polyline({
        endArrow: true,
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: TSP_ROUTE_COLOR, // 빨간색
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    tsp.pointPolyLine = new kakao.maps.Polyline({
        endArrow: true,
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: TSP_ROUTE_COLOR, // 빨간색
        strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    })

    tmap.routePolyLine = new kakao.maps.Polyline({
        endArrow: true,
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    tmap.pointPolyLine = new kakao.maps.Polyline({
        endArrow: true,
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
        strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    menu.onclick = showDialog;

    tlibShowRoute.onchange = () => {
        tsp.showRoute(tlibShowRoute.checked, map)
        //showRoute(tmap, tspShowRoute.checked)
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
}

function addDeliveryPoint() {
    kakao.maps.event.addListener(map, 'click', mapClickListener);
}

function openTabContent(tabName) {
    //모든 탭의 컨텐츠 안보이게 우선 만들고
    let tabcontent = Array.from(document.getElementsByClassName('tab-content'));
    console.log({tabcontent})
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

// 용림아 use toggle instead
// function showDialog() {
//     if (controlBox.classList.contains('hide')) {
//         controlBox.classList.remove('hide')
//     } else {
//         controlBox.classList.add('hide')
//     }
// }
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

    if (pointList.length === 0) {
        marker.setTitle('시작점')
        marker.setImage(MARKERS.START)
    } else if (pointList.length > 0) {
        marker.setTitle(`${pointList.length}`)
        marker.setImage(MARKERS.DELIVERY)
    }
    const iwContent = `${pointList.length}`

    deliveryMarkers.push(marker)
    //lat = y ~180
    //lon = x ~90
    pointList.push({'x': latLng.La, 'y': latLng.Ma})

    pointTable.addPoint(iwContent, new Point(iwContent, latLng.La, latLng.Ma))
}


function findRoute() {
    if (pointList.length <= 0) {
        alert('배달점이 없습니다. 배달점을 등록해주세요.');
        return;
    }

    let routeRequest = {
        SPoint: pointList[0],
        EPoint: pointList[0],
        SPointList: {
            nodes: pointList.slice(1, pointList.length)
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
            let cost = {
                'cost': (body.SPathList.total_cost / 1000).toFixed(2),
                'eta': (body.SPathList.use_time / 60).toFixed(2),
                'time': body.TSP_time.toFixed(5),
            };
            fillCostTable(cost, true);
            drawTSPLine(body);

            //makeOverlaysForTSP(tsp.route.pointInfos);
        });
}

function callTMapLib(routeRequest) {
    let num = routeRequest.SPointList.nodes.length + 1
    if (num < 10) {
        alert('TMap 경로탐색 요청은 배송지 갯수가 10,20,30,100 일 경우 가능합니다.')
        return
    }

    // let url = TEST_TMAP_API;
    // fetch(url, {
    //     method:"GET",
    // })

    let url = `https://apis.openapi.sk.com/tmap/routes/routeOptimization${num}?version=1&format=json`
    fetch(url, {
        method: 'POST',
        headers: {
            'appKey': T_MAP_APP_KEY,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(TmapMgr.makeTmapReqObject(routeRequest))
    }).then(response => response.json()).then(body => {
        let cost = {
            'cost': (parseFloat(body.properties.totalDistance) / 1000).toFixed(2),
            'eta': (parseFloat(body.properties.totalTime) / 60).toFixed(2),
            'time': '',
        }

        fillCostTable(cost, false)
        drawTMapLine(body)
        // makeOverlaysForTMAP(tmap.route.pointInfos);
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
        const tlibSpan = document.createElement('span')
        tlibSpan.className = 'overlay-tsp'
        tlibSpan.textContent = `${point.tlibId}`

        const tmapSpan = document.createElement('span')
        tmapSpan.className = 'overlay-tmap'
        tmapSpan.textContent = `${point.tmapId}`

        const span = document.createElement('span')
        span.className = 'overlay'
        span.appendChild(tlibSpan)
        span.appendChild(tmapSpan)

        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(point.y + OFFSET_Y, point.x + OFFSET_X),
            content: span
        })
        arr.push(customOverlay)
        customOverlay.setMap(map)
    })
}

function makeOverlaysForTSP(lines) {
    const arr = []
    lines.forEach(element => {
        const span = document.createElement('span')
        span.className = 'overlay-tsp'
        span.textContent = element.id

        let customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(element.pos.Ma + OFFSET_Y, element.pos.La + OFFSET_X),
            content: span
        })
        arr.push(customOverlay)
        customOverlay.setMap(map)
    })

    tsp.routeOverlay = arr
}

function makeOverlaysForTMAP(lines) {
    console.log({lines})
    let arr = []
    lines.forEach(feature => {
        const span = document.createElement('span')
        span.className = 'overlay-tmap'
        span.textContent = feature.id

        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(feature.pos.Ma + OFFSET_Y, feature.pos.La - OFFSET_X),
            content: span
        })
        arr.push(customOverlay)
    })

    // 마지막에 시작점이 또 들어깄음
    arr.pop()
    arr.forEach(elem => {
        elem.setMap(map)
    })

    tmap.routeOverlay = arr
}

function drawTSPLine(lines) {
    let linePath = []
    let pointPath = []
    let pointInfos = []

    lines.SPathList.paths.forEach(paths => {
        let obj = {
            pos: new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x),
            id: paths.id,
            cost: paths.cost
        };
        pointInfos.push(obj);

        pointPath.push(new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x));

        paths.SLineString.nodes.forEach(element => {
            linePath.push(new kakao.maps.LatLng(element.y, element.x))
        })

        pointTable.putTLibPoint(paths.id, paths.SPoint.x, paths.SPoint.y);
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
        }
    })

    //시작점까지 다시 오기 위해 시작점 포인트 마지막에 추가
    //pointPath.push(pointPath[0]);
    tsp.routePolyLine.setPath(linePath)
    tsp.routePolyLine.setMap(map)

    tsp.route.lines = lines
    tsp.route.linePath = linePath
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
                id: parseInt(feature.properties.index) + 1,
                cost: 0,
            }

            pointPath.push(new kakao.maps.LatLng(y, x))

            pointInfos.push(obj)

            pointTable.putTMapPoint(obj.id, x, y)
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
        if (pointTable.tlib && pointTable.tmap) {
            console.log('tmap promise..')
            makeOverlay()
        }
    })

    //경유점 polyline
    tmap.pointPolyLine.setPath(pointPath)

    tmap.routePolyLine.setPath(linePath)
    tmap.routePolyLine.setMap(map)

    tmap.route.lines = lines
    tmap.route.linePath = linePath
    tmap.route.pointPath = pointPath
    tmap.route.pointInfos = pointInfos
}


function getRandomPoints() {
    const radioList = document.getElementsByName('random-points')

    let randomPoints
    let cnt = 0
    radioList.forEach((node) => {
        if (node.checked) {
            cnt = parseInt(node.value);
        }
    })
    randomPoints = getMBR(cnt);

    const url = `${TSP_SVR_URL}/fix_points`
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain'
        },
        body: JSON.stringify({
            SPoint: randomPoints[0],
            EPoint: randomPoints[0],
            SPointList: {
                nodes: randomPoints.slice(1, cnt)
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

    pointList = []
    deliveryMarkers = []
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

