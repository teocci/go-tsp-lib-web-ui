import Point from './point.js'

// Data Structure to map points
export default class PointTable {
    constructor() {
        this.points = []
        this.tlib = false
        this.tmap = false
    }

    addPoint(id, p) {
        p.id = parseInt(id) + 1
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
        if (!p.hasTLibId()) {
            p.tlibId = id
            // console.log(`tlib same : ${p.x} , ${x}, and ${p.y} ${y}`)
        }
    }

    putTMapPoint(id, x, y) {
        const p = this.findPointByXY(id, x, y)
        if (!p.hasTMapId()) {
            p.tmapId = id
            //console.log(`tmap same : ${p.x} , ${x}, and ${p.y} ${y}`)
        }
    }
}