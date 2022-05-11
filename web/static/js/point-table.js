import Point from './point.js'

// Data Structure to map points
export default class PointTable {
    constructor() {
        
        this.points = [];
        this.tlib = false;
        this.tmap = false;
    }
    init(){
        
        this.points = [];
        this.tlib = false;
        this.tmap = false;
    }
    addPoint(id, p) {
        p.id = parseInt(id)
        this.points.push(p)
    }

    findPointByXY(id, x, y) {
        for (const p of this.points) {
            if (p.compareXY(new Point(id, x, y))) return p
        }

        
        return null
    }

    putTLibPoint(id, x, y) {
        const p = this.findPointByXY(id, x, y)
        if(p == null){
            console.error(`[TLIB] NO POINT x : ${x}, y : ${y}`)
            return false;
        }

        if (!p.hasTLibId()) {
            p.tlibId = id
        }
    }

    putTMapPoint(id, x, y) {
        const p = this.findPointByXY(id, x, y)
        if(p == null){
            console.error(`[TMAP] NO POINT x : ${x}, y : ${y}`)
            return false;
        }

        if (!p.hasTMapId()) {
            p.tmapId = id
        }
    }
}