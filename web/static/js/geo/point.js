/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-13
 */
export default class Point {
    static PRECISION = 5
    static EPSILON = 0.00001 * Point.PRECISION

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    equals(p) {
        return Math.abs(this.x - p.x) < Point.EPSILON && Math.abs(this.y - p.y) < Point.EPSILON
    }

    toString() {
        return `(x: ${this.x}, y: ${this.y})`
    }
}