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
const TSP_SVR_PORT = 8080;
const TSP_SVR_ADDR = `${TSP_SVR_HOST}:${TSP_SVR_PORT}`;
const TSP_SVR_URL = `${getProtocol()}//${TSP_SVR_ADDR}`;

/* color */
const TSP_ROUTE_COLOR = "#e04010";
const TMAP_ROUTE_COLOR = "#007196";

function getProtocol() {
    return location.protocol
}

const OFFSET_Y = -0.0001;
const OFFSET_X = 0;//-0.0001;

const TEST_TSP_API = "https://gist.githubusercontent.com/amissu89/c61ad8fb4a0bb20ea0e29265f90a9dc9/raw/1087c483622bb54ccc4d0f1280015223d91237d3/tsp_response.json";
const TEST_TMAP_API = "https://gist.githubusercontent.com/amissu89/7b7893c790fb18d93c7c9dd30870eada/raw/437f0db382fe8b2869aae3e77329933b28b40901/tmap1_response.json";
