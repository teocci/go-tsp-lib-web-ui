/*MARKER*/
const START_SIZE = new kakao.maps.Size(50, 45)
const START_OFFSET = new kakao.maps.Point(15, 43)
const MARKER_SIZE = new kakao.maps.Size(48, 48)
const MARKER_IMAGE_SRC = {
    start: '../img/green_flag_marker.png',
    waypoint: '../img/yellow-pin-marker.png',
    tlib: '../img/tlib_marker.png',
    tmap: '../img/tmap_marker.png'
}

const MARKERS = {
    start: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.start, START_SIZE, START_OFFSET),
    waypoint: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.waypoint, MARKER_SIZE),
    tlib: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.tlib, MARKER_SIZE),
    tmap: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.tmap, MARKER_SIZE)
}

/* color */
const TLIB_ROUTE_COLOR = '#ff323d'
const TMAP_ROUTE_COLOR = '#0079c4'
const SEGMENT_COLOR = '#10AA18'
// const SEGMENT_COLOR = '#73ca14'
// const SEGMENT_COLOR = '#ff4900'
// const SEGMENT_COLOR = '#ffC400'

const Z_INDEX_MAKERS = 1
const Z_INDEX_POLYLINES = Z_INDEX_MAKERS + 1
const Z_INDEX_OVERLAYS = Z_INDEX_POLYLINES + 1

const TLIB_ROUTE_POLYLINE = {
    endArrow: false,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TLIB_ROUTE_COLOR, // 빨간색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    zIndex: Z_INDEX_POLYLINES,
}

const TLIB_POINT_POLYLINE = {
    endArrow: false,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TLIB_ROUTE_COLOR, // 빨간색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    zIndex: Z_INDEX_POLYLINES,
}

const TMAP_ROUTE_POLYLINE = {
    endArrow: false,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    zIndex: Z_INDEX_POLYLINES,
}

const TMAP_POINT_POLYLINE = {
    endArrow: false,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    zIndex: Z_INDEX_POLYLINES,
}

const SEGMENT_POLYLINE = {
    endArrow: true, strokeWeight: 6, // 선의 두께 입니다
    strokeColor: SEGMENT_COLOR, // 빨간색
    strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    zIndex: Z_INDEX_POLYLINES,
}

const POLYLINE_TYPE_ROUTE = 'route'
const POLYLINE_TYPE_POINTS = 'points'
const POLYLINE_TYPE_SEGMENT = 'segment'
const POLYLINE_TYPES = [
    POLYLINE_TYPE_ROUTE,
    POLYLINE_TYPE_POINTS,
    POLYLINE_TYPE_SEGMENT,
]

const TLIB_POLYLINE_STYLES = [
    {type: POLYLINE_TYPE_ROUTE, style: TLIB_ROUTE_POLYLINE},
    {type: POLYLINE_TYPE_POINTS, style: TLIB_POINT_POLYLINE},
    {type: POLYLINE_TYPE_SEGMENT, style: SEGMENT_POLYLINE},
]

const TMAP_POLYLINE_STYLES = [
    {type: POLYLINE_TYPE_ROUTE, style: TMAP_ROUTE_POLYLINE},
    {type: POLYLINE_TYPE_POINTS, style: TMAP_POINT_POLYLINE},
    {type: POLYLINE_TYPE_SEGMENT, style: SEGMENT_POLYLINE},
]

const TLIB_API_NAME = 'tlib'
const TMAP_API_NAME = 'tmap'

const APIS = [
    TLIB_API_NAME,
    TMAP_API_NAME,
]

const REQUEST_FIX_POINTS = 'fix-points'
const REQUEST_FIND_ROUTE = 'find-route'

const POLYLINE_STYLES = {}
POLYLINE_STYLES[TLIB_API_NAME] = TLIB_POLYLINE_STYLES
POLYLINE_STYLES[TMAP_API_NAME] = TMAP_POLYLINE_STYLES

const OFFSET_Y = -0.0001
const OFFSET_X = 0 //-0.0001



let kakaoMap = null

const TLIB_SVR_HOST = '192.168.100.58'
const TLIB_SVR_PORT = 9080
const TLIB_SVR_ADDR = `${TLIB_SVR_HOST}:${TLIB_SVR_PORT}`
const TLIB_SVR_URL = `${getProtocol()}//${TLIB_SVR_ADDR}`

const TMAP_APP_KEY = 'l7xxce0f7ed72c234020a6bd5ed566685f97'
const TMAP_SVR_URL = 'https://apis.openapi.sk.com/tmap/routes/routeOptimization#?version=1&format=json'

const FIX_POINTS_TEST_URL = 'https://gist.githubusercontent.com/teocci/180bc86336acc07232f4ccf393b067e1/raw/b572daa885d0cfb0d73cf2ac18ef283b68f74406/fixed-points-response.json'
const FIND_ROUTE_TEST_URL = 'https://gist.githubusercontent.com/teocci/2d4ee306546b46b06fe94afc9fa0dbef/raw/64c56ffdd5edc7fd385304c42863559e91abaf5a/tlib-find-route.js'

const TLIB_TEST_30 = 'https://gist.githubusercontent.com/amissu89/ffa178803b1fd3a573d7454e82e0cedb/raw/c23aeb28df6b0dd30e9c279f1c1604dbd394926c/rp_30_tlib_route.json'
const TMAP_TEST_30 = 'https://gist.githubusercontent.com/amissu89/3a4da31c9928808c0fd49b289496f0f5/raw/21e3d5e9c4b4efb261b9ece782cdbc6747729ef0/rp_30_tmap_route.json'

const TLIB_TEST_API = 'https://gist.githubusercontent.com/amissu89/c61ad8fb4a0bb20ea0e29265f90a9dc9/raw/1087c483622bb54ccc4d0f1280015223d91237d3/tsp_response.json'
const TMAP_TEST_API = 'https://gist.githubusercontent.com/amissu89/be5fc038dc559dadb28d47320b6862cb/raw/16976cc88db4a74b006cdab81a3c36ac4da5a05d/tmap2_response.json'

const RTT = {x: 127.3934052, y: 36.4310406}
const RANDOM_30_CENTER = {x: 127.3877229, y: 36.3590841}


const RANDOM_10_TEST_POINTS = [
    {'x': 127.386293, 'y': 36.430404},
    {'x': 127.391044, 'y': 36.427786},
    {'x': 127.402162, 'y': 36.433517},
    {'x': 127.394424, 'y': 36.428918},
    {'x': 127.394077, 'y': 36.434694},
    {'x': 127.395467, 'y': 36.430548},
    {'x': 127.392639, 'y': 36.428671},
    {'x': 127.387393, 'y': 36.431525},
    {'x': 127.397108, 'y': 36.429471},
    {'x': 127.390705, 'y': 36.431421},
]

const RANDOM_30_TEST_POINTS = [
    {x: 127.40316323901139, y: 36.34745526785475,},
    {x: 127.3744303555594, y: 36.349569689958805},
    {x: 127.38976398341718, y: 36.35830191640296},
    {x: 127.39081753194847, y: 36.347312315410356},
    {x: 127.39942238792594, y: 36.353901142047576},
    {x: 127.37764038042943, y: 36.366154662643076},
    {x: 127.40265089975641, y: 36.34980101793189},
    {x: 127.39179142444551, y: 36.36331605083988},
    {x: 127.38318049801559, y: 36.36357622075673},
    {x: 127.38687623638867, y: 36.34970688360828},
    {x: 127.38381616156941, y: 36.354009318301024},
    {x: 127.37458188414863, y: 36.34600427516835},
    {x: 127.40121317486792, y: 36.34637759722435},
    {x: 127.37325387606974, y: 36.35694989789288},
    {x: 127.4089271208538, y: 36.360294036643175},
    {x: 127.371573410245, y: 36.36049766310235},
    {x: 127.38980902437058, y: 36.35244243844257},
    {x: 127.40645092410368, y: 36.360901803937296},
    {x: 127.37219468329423, y: 36.34708233488505},
    {x: 127.40760260888935, y: 36.350164219331056},
    {x: 127.3737539431508, y: 36.36175910623276},
    {x: 127.37476972992094, y: 36.35493539248008},
    {x: 127.38713656704387, y: 36.36365439532264},
    {x: 127.38931876142374, y: 36.34612771216083},
    {x: 127.39546743656004, y: 36.36477996579415},
    {x: 127.39319615146246, y: 36.354341528258765},
    {x: 127.3752692328333, y: 36.356609103169},
    {x: 127.40962553515027, y: 36.36191008821624},
    {x: 127.4023008481491, y: 36.3603745812103},
    {x: 127.39986184662077, y: 36.36240796422763},
]

const RANDOM_MODE_PROD = 'prod'
const RANDOM_MODE_TEST = 'test'
const RANDOM_MODE = RANDOM_MODE_TEST

const FETCH_MODE_PROD = 'prod'
const FETCH_MODE_TEST = 'test'
const FETCH_MODE = FETCH_MODE_TEST

const RANDOM_TEST_POINTS = RANDOM_30_TEST_POINTS


function getProtocol() {
    return location.protocol
}
