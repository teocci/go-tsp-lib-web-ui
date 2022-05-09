export default class Route {
    constructor(){        
        this.route = {};

        this.route.lines = [] //original response from tsp or tmap
        this.route.linePath = [] // for route
        this.route.pointPath = [] //for point route
        this.route.pointInfos = []

        this.routePolyLine = {}
        this.pointPolyLine = {}
        
        this.routeOverlay = []
        this.pointOverlay = []
    }

    showRoute(isShow, map){
        if(!isShow){
            this.routeOverlay.forEach(element =>{
                element.setMap(null)
            })
            this.routePolyLine.setMap(null)
        }
        else{
            this.routeOverlay.forEach(element =>{
                element.setMap(map)
            })
    
            this.routePolyLine.setPath(this.route.linePath)
            this.routePolyLine.setMap(map)
        }
    }

    // showLabel(name, isShow){
    //     let classname = `overlay-${name}`;
    //     let overlayList = Array.from(document.getElementsByClassName(classname))
    //     if(!isShow){
    //         overlayList.forEach(overlay =>{
    //             overlay.classList.add('hide')
    //         });
    //     }
    //     else{
    //         overlayList.forEach(overlay =>{
    //             overlay.classList.remove('hide')
    //         });
    //     }
    // }

    // showPointRoute(isShow, _map){
    //     if(!isShow){
    //         this.pointPolyLine.setMap(null);
    //     } else{      
    //         this.pointPolyLine.setPath(this.route.pointPath);
    //         this.pointPolyLine.setMap(_map);
    //     }
    // }
}