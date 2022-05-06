export default class Point {

    static  EPSILON = 0.00001;

    constructor(_id, _x, _y) {
        this.id = _id;
        this.x  = _x;
        this.y  = _y;
        this.tlibId = ''; 
        this.tmapId = '';
    }

    compareXY(pt) {
        return Math.abs(this.x - pt.x) < Point.EPSILON && Math.abs(this.y - pt.y) < Point.EPSILON;
    }
}