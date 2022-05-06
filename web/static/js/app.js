import Route from './route.js'
import TmapMgr from './tmap.js'
import Table from './table.js'
import Point from './point.js'

let mapElement = document.getElementById('map')
let map
let pointList = [];
let delivery_markers = [];

let tsp = new Route();
let tmap = new Route();

let table = new Table();


//add points btn
let btnAddPointsElement = document.getElementById('add-points')
function addDeliveryPoint(){
    kakao.maps.event.addListener(map, "click", mapClickListener);
}

//add random points btn
let btnAddRandomPoints = document.getElementById('add-random-points');
//run tsp lib
let btnFindRoute = document.getElementById('findRoute');

//Cost and time table
let tblCost = document.getElementById('cost')

//checkboxes
let tspCheck = document.querySelector('#tsp')
let tmapCheck = document.querySelector('#tmap')

let controlBox = document.getElementById('control-box')

let menu = document.getElementById('menu-btn')
//show route 
let tspShowRoute = document.getElementById('show-tsp-route')
let tspShowPointRoute = document.getElementById('show-tsp-points-route')
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

    kakao.maps.event.addListener(map, "rightclick",  function(mouseEvent) {
        kakao.maps.event.removeListener(map, "click", mapClickListener);
    });

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

    menu.onclick = showDiaglog;

    tspShowRoute.onchange = () =>{
        tsp.showRoute( tspShowRoute.checked, map)
        //showRoute(tmap, tspShowRoute.checked)
        showLabel("tsp", tspShowRoute.checked)
    }

    tspShowPointRoute.onchange = () =>{
        showPointRoute(tsp, tspShowPointRoute.checked)
    }

    tmapShowRoute.onchange = () =>{
        showRoute(tmap, tmapShowRoute.checked)
        showLabel("tmap", tmapShowRoute.checked)
    }

    tmapShowPointRoute.onchange = () =>{
        showPointRoute(tmap, tmapShowPointRoute.checked)
    }

    tabTLib.onclick = () => {
        openTabContent('tlib-result-content')
    }

    tabTMap.onclick = () => {
        openTabContent('tmap-result-content')
    }
}

function openTabContent(tabName){
  
    //모든 탭의 컨텐츠 안보이게 우선 만들고
    let tabcontent = Array.from(document.getElementsByClassName("tabcontent"));
    console.log({tabcontent})
    tabcontent.forEach(content =>{
        content.style.display = "none";
    });

    //해당되는 탭만 보이게 
    document.getElementById(tabName).style.display = "block";
}

function showPointRoute(routeObj, isShow)
{
     if(!isShow){
        routeObj.pointPolyLine.setMap(null);
    } else{      
        routeObj.pointPolyLine.setPath(routeObj.route.pointPath);
        routeObj.pointPolyLine.setMap(map);
    }
}

showLabel("tmap", tmapShowRoute.checked)

function showLabel(name, isShow){
    let classname = `overlay-${name}`;
    let overlayList = Array.from(document.getElementsByClassName(classname))
    if(!isShow){

        overlayList.forEach(overlay =>{
            overlay.classList.add('hide')
        });
    }
    else{
         overlayList.forEach(overlay =>{
            overlay.classList.remove('hide')
        });
    }
}


function showRoute(routeObj, isShow){
   
    if(!isShow){
        routeObj.routeOverlay.forEach(element =>{
            element.setMap(null);
        });

        routeObj.routePolyLine.setMap(null);


    }
    else{
        routeObj.routeOverlay.forEach(element =>{
            element.setMap(map);
        });

        routeObj.routePolyLine.setPath(routeObj.route.linePath);
        routeObj.routePolyLine.setMap(map);

       
    }
}

function showDiaglog() {
    if(controlBox.classList.contains('hide')){
        controlBox.classList.remove('hide')
    } else{
        controlBox.classList.add('hide')
    }
}

let mapClickListener = function(mouseEvent){
    let latlng = mouseEvent.latLng;
    makeMarkers(latlng);
};

function makeMarkers(latlng_){
    let marker_ = new kakao.maps.Marker({
            map:map,
            position:latlng_,
        });
    
    let iwContent = "";
    if(pointList.length == 0)
    {
        marker_.setTitle("시작점");
        marker_.setImage(MARKERS.START);
        iwContent = "0"
    }
    else if(pointList.length > 0){
        marker_.setTitle( "" + pointList.length);
        marker_.setImage(MARKERS.DELIVERY);
        iwContent = "" + pointList.length;
    }

    delivery_markers.push(marker_);
    //lat = y ~180
    //lon = x ~90
    pointList.push({"x" : latlng_.La, "y" : latlng_.Ma});

    table.addPoint(iwContent, new Point(iwContent, latlng_.La, latlng_.Ma));
    
}


function findRoute() {
    
    if(pointList.length <= 0)
    {
        alert("배달점이 없습니다. 배달점을 등록해주세요.");
        return;
    }
    
    let obj = {
        SPoint: pointList[0],
        EPoint: pointList[0],
        SPointList:{
            nodes:pointList.slice(1, pointList.length)
        }
    };

    if(tspCheck.checked) {
        callTSPLib(obj);
    }
    if(tmapCheck.checked){
        callTmapLib(obj);
    }

    document.getElementById('results-content').classList.remove('hide');
}

function callTSPLib(obj_){
    let url = `${TSP_SVR_URL}/TSP_find_shortest4`;
    fetch(url, {
        method:"POST",
        headers : {
            "Content-type":"text/plain"
        },
        body : JSON.stringify(obj_)
    })
    .then(response => response.json())
    .then(body => {
        //DrawLine2(body);
        let cost = {
            "cost" : (body.SPathList.total_cost/1000).toFixed(2),
            "eta" : (body.SPathList.use_time/60).toFixed(2),
            "time" : body.TSP_time.toFixed(5),
        };
        fillCostTable(cost, true);
        drawTSPLine(body);
        
        //makeOverlaysForTSP(tsp.route.pointInfos);
    });
}

function callTmapLib(obj_){

    let num = obj_.SPointList.nodes.length+1; 

    
    if( num < 10){
        alert(`TMap 경로탐색 요청은 배송지 갯수가 10,20,30,100 일 경우 가능합니다.`)
        return;
    }

    // let url = TEST_TMAP_API;
    // fetch(url, {
    //     method:"GET",
         
    // })
    let url = `https://apis.openapi.sk.com/tmap/routes/routeOptimization${num}?version=1&format=json`;
   
    fetch(url, {
        method:"POST",
        headers : {
            "appKey":T_MAP_APP_KEY,
            "Content-type":"application/json"
        },
        body : JSON.stringify(TmapMgr.makeTmapReqObject(obj_))
    })
    .then(response => response.json())
    .then(body => {
        let cost = {
            "cost" : (parseFloat(body.properties.totalDistance)/1000).toFixed(2),
            "eta" : (parseFloat(body.properties.totalTime)/60).toFixed(2),
            "time" : "",
        };

        fillCostTable(cost, false);
        drawTmapLine(body);
        //makeOverlaysForTMAP(tmap.route.pointInfos);
    });
}


function fillCostTable(data, isTSPLib){
    let rows = tblCost.getElementsByTagName("tr");
    
    let cost = isTSPLib ? rows[1].getElementsByTagName("td")[2] : rows[1].getElementsByTagName("td")[1];
    let eta  = isTSPLib ? rows[2].getElementsByTagName("td")[2] : rows[2].getElementsByTagName("td")[1];
    let ttime= isTSPLib ? rows[3].getElementsByTagName("td")[2] : rows[3].getElementsByTagName("td")[1];
  
    cost.innerText  = data.cost;
    eta.innerText   = data.eta;
    ttime.innerText = data.time;
}


//point path를 가지고 overlay마커만 찍어줌
function makeOverlay(){
    console.log({table})
    let arr = [];
    table.point.forEach( element => {
        const tlibSpan = document.createElement('span')
        tlibSpan.className = 'overlay-tsp';
        tlibSpan.textContent = element.tlibId;

        const tmapSpan = document.createElement('span')
        tmapSpan.className = 'overlay-tmap';
        tmapSpan.textContent = element.tmapId;

        const span = document.createElement('span');
        span.className ='overlay'
        span.appendChild(tlibSpan);
        span.appendChild(tmapSpan);

        let customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(element.y+OFFSET_Y, element.x+OFFSET_X),
            content: span   
        });
        arr.push(customOverlay);
        customOverlay.setMap(map);
    })
}

function makeOverlaysForTSP(lines){

    let arr = [];
    lines.forEach(element => {
        const span = document.createElement('span')
        span.className = 'overlay-tsp';
        span.textContent = element.id;

        let customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(element.pos.Ma+OFFSET_Y, element.pos.La+OFFSET_X),
            content: span   
        });
        arr.push(customOverlay);
        customOverlay.setMap(map);

    });

    tsp.routeOverlay = arr;
}

function makeOverlaysForTMAP(lines){
    console.log({lines})
    let arr = [];
    lines.forEach(feature=>{
        const span = document.createElement('span')
        span.className = 'overlay-tmap';
        span.textContent = feature.id;

        let customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(feature.pos.Ma + OFFSET_Y, feature.pos.La - OFFSET_X),
            content: span   
        });
        arr.push(customOverlay);
    })

    //마지막에 시작점이 또 들어깄음
    arr.pop();
    arr.forEach(elem=>{
        elem.setMap(map);
    });

    tmap.routeOverlay = arr;
}

function drawTSPLine(lines){
    let linePath = [];
    let pointPath = [];
    let pointInfos = [];

    lines.SPathList.paths.forEach(paths => {
        let obj = {
            pos : new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x),
            id : paths.id,
            cost : paths.cost
        };
        pointInfos.push(obj);
    
        pointPath.push(new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x));

        paths.SLineString.nodes.forEach(element =>{
            linePath.push(new kakao.maps.LatLng(element.y, element.x))
        })

        table.putTlibPoint(paths.id, paths.SPoint.x, paths.SPoint.y);
    });

    //trigger tsp complete event
    table.tlib = true;

    let overlayPromise = new Promise((resolve, reject) =>{
        resolve()
    })

    overlayPromise.then(()=>{
        if(table.tlib && table.tmap)
        {
            console.log("tlib promise..");
            makeOverlay();
        }
    })
   
    //시작점까지 다시 오기 위해 시작점 포인트 마지막에 추가
    //pointPath.push(pointPath[0]);
    tsp.routePolyLine.setPath(linePath);
    tsp.routePolyLine.setMap(map);

    tsp.route.lines = lines;
    tsp.route.linePath = linePath;
    tsp.route.pointPath = pointPath;
    tsp.route.pointInfos = pointInfos;   
}

function drawTmapLine(lines){

    console.log(lines);
    let linePath = [];
    let pointPath = [];
    let pointInfos = [];

    lines.features.forEach(feature => {
        if(feature.geometry.type == "Point")
        {
            let x = feature.geometry.coordinates[0];
            let y = feature.geometry.coordinates[1];
          
            let obj = {
                pos : new kakao.maps.LatLng(y, x),
                id : parseInt(feature.properties.index)+1,
                cost : 0,
            };
            pointPath.push(new kakao.maps.LatLng(y, x));

            pointInfos.push(obj);

            table.putTmapPoint(obj.id, x, y);
        }
        else{
            feature.geometry.coordinates.forEach(coord =>{
                let x = coord[0];
                let y = coord[1];
                linePath.push(new kakao.maps.LatLng(y, x));
            });
        }        
    });

    table.tmap = true;
    //trigger tmap complete event
    let overlayPromise = new Promise((resolve, reject) =>{
        resolve()
    })

    overlayPromise.then(()=>{
        if(table.tlib && table.tmap)
        {
            console.log("tmap promise..");
            makeOverlay();
        }
    })
   
    //경유점 polyline
    tmap.pointPolyLine.setPath(pointPath);
    
    tmap.routePolyLine.setPath(linePath);
    tmap.routePolyLine.setMap(map);

    tmap.route.lines = lines;
    tmap.route.linePath = linePath;
    tmap.route.pointPath = pointPath;
    tmap.route.pointInfos = pointInfos;
}


function getRandomPoints(){
    const radioList = document.getElementsByName('random-points');
    let randomPoints = [];
    let cnt  = 0;
    radioList.forEach((node) => {
        if(node.checked)  {
            cnt = parseInt(node.value);
        }
    }) 

    randomPoints = getMBR(cnt);
  
    let url = `${TSP_SVR_URL}/fix_points`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "text/plain"
        },
        body: JSON.stringify({
            SPoint: randomPoints[0],
            EPoint: randomPoints[0],
            SPointList:{
                nodes:randomPoints.slice(1, cnt)
            },
        }),
    })
    .then(response => response.json())
    .then(body => {
        makeRandom(body);
    });
   
}

function makeRandom(data) { //Random 좌표 n개 생성
    let list = [];
    list.push(data.FixPoint.SPoint);
    data.FixPoint.pts.forEach(element =>{
        list.push(element);
        }
    );
    list.push(data.FixPoint.EPoint);
  
    pointList = [];
    delivery_markers = [];
    for (let i = 0; i < list.length-1; i++) {
        let position = new kakao.maps.LatLng(list[i].y, list[i].x);
        makeMarkers(position);
    }
}

function getMBR(num) { //MBR 가져오기
    let MBR = map.getBounds();
    let strMBR = MBR.toString()
    let arrMBR = strMBR.split(',');
    let MinX = arrMBR[0].replace("((", "");
    let MinY = arrMBR[1].replace(")", "");
    let MaxX = arrMBR[2].replace("(", "");
    let MaxY = arrMBR[3].replace("))", "");
    let randomAry = [];
    for (let i = 0; i < num; i++) {
        let x = rand(parseFloat(MinY), parseFloat(MaxY));
        let y = rand(parseFloat(MinX), parseFloat(MaxX));

        randomAry.push({"x":x, "y":y});
    }

    return randomAry;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

