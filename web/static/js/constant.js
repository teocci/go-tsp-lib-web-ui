/*MARKER*/
const IMG_SIZE = new kakao.maps.Size(24, 26)
const MARKER_IMAGE_SRC = {
    start: '../img/start_marker.png',
    waypoint: '../img/delivery_marker.png',
    tlib: '../img/tlib_marker.png',
    tmap: '../img/tmap_marker.png'
}

const MARKERS = {
    start: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.start, IMG_SIZE),
    waypoint: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.waypoint, IMG_SIZE),
    tlib: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.tlib, IMG_SIZE),
    tmap: new kakao.maps.MarkerImage(MARKER_IMAGE_SRC.tmap, IMG_SIZE)
}

/* color */
const TLIB_ROUTE_COLOR = '#ff323d'
const TMAP_ROUTE_COLOR = '#0079c4'
const SEGMENT_COLOR = '#73ca14'
// const SEGMENT_COLOR = '#ff4900'
// const SEGMENT_COLOR = '#ffC400'

const TLIB_ROUTE_POLYLINE = {
    endArrow: true, strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TLIB_ROUTE_COLOR, // 빨간색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const TLIB_POINT_POLYLINE = {
    endArrow: true, strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TLIB_ROUTE_COLOR, // 빨간색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const TMAP_ROUTE_POLYLINE = {
    endArrow: true, strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const TMAP_POINT_POLYLINE = {
    endArrow: true, strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const PARTLY_POLYLINE = {
    endArrow: true, strokeWeight: 6, // 선의 두께 입니다
    strokeColor: SEGMENT_COLOR, // 빨간색
    strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
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
    {type: POLYLINE_TYPE_SEGMENT, style: PARTLY_POLYLINE},
]

const TMAP_POLYLINE_STYLES = [
    {type: POLYLINE_TYPE_ROUTE, style: TMAP_ROUTE_POLYLINE},
    {type: POLYLINE_TYPE_POINTS, style: TMAP_POINT_POLYLINE},
    {type: POLYLINE_TYPE_SEGMENT, style: PARTLY_POLYLINE},
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

const RANDOM_MODE_PROD = 'prod'
const RANDOM_MODE_TEST = 'test'
const RANDOM_MODE = RANDOM_MODE_TEST

const FETCH_MODE_PROD = 'prod'
const FETCH_MODE_TEST = 'test'
const FETCH_MODE = FETCH_MODE_TEST

let kakaoMap = null

const TLIB_SVR_HOST = '192.168.100.58'
const TLIB_SVR_PORT = 9080
const TLIB_SVR_ADDR = `${TLIB_SVR_HOST}:${TLIB_SVR_PORT}`
const TLIB_SVR_URL = `${getProtocol()}//${TLIB_SVR_ADDR}`

const TMAP_APP_KEY = 'l7xxce0f7ed72c234020a6bd5ed566685f97'
const TMAP_SVR_URL = 'https://apis.openapi.sk.com/tmap/routes/routeOptimization#?version=1&format=json'

const FIX_POINTS_TEST_URL = 'https://gist.githubusercontent.com/teocci/180bc86336acc07232f4ccf393b067e1/raw/b572daa885d0cfb0d73cf2ac18ef283b68f74406/fixed-points-response.json'
const FIND_ROUTE_TEST_URL = 'https://gist.githubusercontent.com/teocci/2d4ee306546b46b06fe94afc9fa0dbef/raw/64c56ffdd5edc7fd385304c42863559e91abaf5a/tlib-find-route.js'

const TLIB_TEST_API = 'https://gist.githubusercontent.com/amissu89/c61ad8fb4a0bb20ea0e29265f90a9dc9/raw/1087c483622bb54ccc4d0f1280015223d91237d3/tsp_response.json'
const TMAP_TEST_API = 'https://gist.githubusercontent.com/amissu89/be5fc038dc559dadb28d47320b6862cb/raw/16976cc88db4a74b006cdab81a3c36ac4da5a05d/tmap2_response.json'

const RANDOM_TEST_POINTS = [
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

function getProtocol() {
    return location.protocol
}
