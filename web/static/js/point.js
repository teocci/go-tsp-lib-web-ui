/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-13
 */
export default class Point {
    static  EPSILON = 0.00001

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    equals(p) {
        return Math.abs(this.x - p.x) < Point.EPSILON && Math.abs(this.y - p.y) < Point.EPSILON
    }
}