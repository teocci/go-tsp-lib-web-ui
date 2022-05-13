/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */

function serialize(o) {
    return JSON.stringify(o)
}

function unserialize(s) {
    return JSON.parse(s)
}

function addPadding(n, length = null) {
    return String(n).padStart(length ?? 2, '0')
}

function serializeDate() {
    const now = new Date()
    return `${now.getFullYear()}${addPadding(now.getMonth() + 1)}${addPadding(now.getDate())}${addPadding(now.getHours())}${addPadding(now.getMinutes())}`
}

function rand(min, max) {
    return Math.random() * (max - min) + min
}