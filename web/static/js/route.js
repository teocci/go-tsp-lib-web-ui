export default class Route {
    constructor(){        
        this.route = {};

        this.route.lines = [] //original response from tsp or tmap
        this.route.linePath = [] // for route
        this.route.pointPath = [] //for point route, 경유지
        this.route.pointInfos = []

        this.routePolyLine = {}
        this.pointPolyLine = {}
        this.partlyPolyLine = {}
        
        this.routeOverlay = []
        this.pointOverlay = []
    }

    init(){
 
        this.route.lines = [] //original response from tsp or tmap
        this.route.linePath = [] // for route
        this.route.pointPath = [] //for point route, 경유지
        this.route.pointInfos = []

        this.routeOverlay.forEach(element =>{
            element.setMap(null)
        })

        this.pointOverlay.forEach(element =>{
            element.setMap(null)
        })

        this.routePolyLine.setMap(null);
        this.pointPolyLine.setMap(null);
        this.partlyPolyLine.setMap(null);
    }
}