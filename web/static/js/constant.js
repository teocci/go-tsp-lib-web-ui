const T_MAP_APP_KEY = "l7xxce0f7ed72c234020a6bd5ed566685f97";

/*MARKER*/
const IMG_SIZE = new kakao.maps.Size(24, 26); 
const MARKER_SRC = {
    START : 	"../img/start_marker.png",
    DELIVERY : 	"../img/delivery_marker.png",
    TLIB : 		"../img/tlib_marker.png",
    TMAP :	 	"../img/tmap_marker.png"
};

const MARKERS = {
    START : new kakao.maps.MarkerImage(MARKER_SRC.START, IMG_SIZE),
    DELIVERY : new kakao.maps.MarkerImage(MARKER_SRC.DELIVERY, IMG_SIZE),
    TLIB : new kakao.maps.MarkerImage(MARKER_SRC.TLIB, IMG_SIZE),
    TMAP : new kakao.maps.MarkerImage(MARKER_SRC.TMAP, IMG_SIZE)
};

const TSP_SVR_HOST = "localhost";
const TSP_SVR_PORT = 9080;
const TSP_SVR_ADDR = `${TSP_SVR_HOST}:${TSP_SVR_PORT}`;
const TSP_SVR_URL = `${getProtocol()}//${TSP_SVR_ADDR}`;

/* color */
const TSP_ROUTE_COLOR = "#e04010";
const TMAP_ROUTE_COLOR = "#007196";
const PARTLY_ROUTE_COLOR = "#eaed1a";

const TSP_ROUTE_POLYLINE = {
    endArrow: true,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TSP_ROUTE_COLOR, // 빨간색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const TSP_POINT_POLYLINE = {
    endArrow: true,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TSP_ROUTE_COLOR, // 빨간색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
};

const TMAP_ROUTE_POLYLINE = {
    endArrow: true,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
};

const TMAP_POINT_POLYLINE = {
    endArrow: true,
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: TMAP_ROUTE_COLOR, // 선의 파란색
    strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
}

const PARTLY_POLYLINE = {
    endArrow: true,
    strokeWeight: 6, // 선의 두께 입니다
    strokeColor: PARTLY_ROUTE_COLOR, // 빨간색
    strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'dash' // 선의 스타일입니다
}

function getProtocol() {
    return location.protocol
}

const OFFSET_Y = -0.0001;
const OFFSET_X = 0;//-0.0001;

const TEST_TSP_API = "https://gist.githubusercontent.com/amissu89/c61ad8fb4a0bb20ea0e29265f90a9dc9/raw/1087c483622bb54ccc4d0f1280015223d91237d3/tsp_response.json";
const TEST_TMAP_API = "https://gist.githubusercontent.com/amissu89/be5fc038dc559dadb28d47320b6862cb/raw/16976cc88db4a74b006cdab81a3c36ac4da5a05d/tmap2_response.json";
