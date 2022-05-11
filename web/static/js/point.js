export default class Point {

    static  EPSILON = 0.00001

    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.tlibId = ''
        this.tmapId = ''
    }

    compareXY(pt) {
        return Math.abs(this.x - pt.x) < Point.EPSILON && Math.abs(this.y - pt.y) < Point.EPSILON
    }

    hasTLibId() {
        return this.tlibId != ''
    }

    hasTMapId() {
        return this.tmapId != ''
    }
}