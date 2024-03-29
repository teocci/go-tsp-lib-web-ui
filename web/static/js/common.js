/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
const REGEX_SNAKE_CASE = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
const REGEX_CAMEL_CASE = /[^a-zA-Z0-9]+(.)/g
const REGEX_PASCAL_CASE = /\w\S*/g

const isArray = a => a instanceof Array
const isDate = d => d instanceof Date
const isFunction = f => f instanceof Function
const isObject = o => 'object' === typeof o
const isBoolean = b => 'boolean' === typeof b
const isNumber = n => 'number' === typeof n && !isNaN(n)
const isString = s => 'string' === typeof s
const isNull = a => a == null
const isUndefined = a => a === undefined

const serialize = o => JSON.stringify(o)
const unserialize = s => JSON.parse(s)

const trimSpaces = s => s && s.replace(/\s+/g, ' ').trim()
const toSnakeCase = s => s && trimSpaces(s).match(REGEX_SNAKE_CASE).map(x => x.toLowerCase()).join('_')
const toKebabCase = s => s && trimSpaces(s).match(REGEX_SNAKE_CASE).map(x => x.toLowerCase()).join('-')
const toCamelCase = s => s && toSnakeCase(s).toLowerCase()
    .replace(REGEX_CAMEL_CASE, (m, chr) => chr.toUpperCase())
const toPascalCase = s => s && trimSpaces(s).toLowerCase()
    .replace(REGEX_PASCAL_CASE, m => `${m.charAt(0).toUpperCase()}${m.substring(1).toLowerCase()}`)

const cloner = (o) => {
    let idx = 1
    const process = v => {
        if (isArray(v)) return cloneArray(v)
        else if (isObject(v)) return cloneObject(v)
        else return v
    }
    const register = (old, o) => {
        old.__idx = idx
        oldObjects[idx] = old
        newObjects[idx] = o
        idx++
    }
    const cloneObject = o => {
        if (!isUndefined(o.__idx)) return newObjects[o.__idx]

        const obj = {}
        for (const prop in o) {
            if (prop === '__idx') continue
            obj[prop] = process(o[prop])
        }
        register(o, obj)

        return obj
    }
    const cloneArray = a => {
        if (!isUndefined(a.__idx)) return newObjects[a.__idx]

        const arr = a.map((v) => process(v))
        register(a, arr)

        return arr
    }
    const oldObjects = {}
    const newObjects = {}

    let tmp
    if (isArray(o)) tmp = cloneArray(o)
    else if (isObject(o)) tmp = cloneObject(o)
    else return o

    for (const id in oldObjects) delete oldObjects[id].__idx

    return tmp
}

const simpleMerge = (...os) => os.reduce((p, o) => ({...p, ...o}), {})
const merger = (...os) => {
    const merged = {}
    const length = os.length
    let [deep] = os

    deep = isBoolean(deep) ? deep : false
    let i = deep ? 1 : 0

    // Loop through each object and conduct a merge
    for (; i < length; i++) mergeObject(merged, os[i], deep)

    return merged
}

// Merge the object into the extended object
const mergeObject = (merged, o, deep) => {
    for (const prop in o) {
        if (!o.hasOwnProperty(prop)) continue
        const v = o[prop]
        if (!deep) {
            merged[prop] = v
            continue
        }

        switch (true) {
            case isDate(v):
                console.log({v})
                merged[prop] = new Date(v.getTime())
                break
            case isArray(v):
                merged[prop] = v.reduce((arr, e, i) => {
                    arr[i] = isDate(e) || isArray(e) || isObject(e) ? merger(true, e) : e
                    return arr
                }, [])
                break
            case isObject(v):
                merged[prop] = merger(true, merged[prop], v)
                break
            default:
                merged[prop] = v
        }
        // If deep merge and property is an object, merge properties
        // merged[prop] = deep && isObject(o[prop]) ? merger(true, merged[prop], o[prop]) : o[prop]
    }
}

const rand = (min, max) => Math.random() * (max - min) + min
const truncate = (n, p) => Math.trunc(n * Math.pow(10, p)) / Math.pow(10, p)
const round = (n, p) => Math.trunc((n + Number.EPSILON) * Math.pow(10, p)) / Math.pow(10, p)

const addPadding = (n, length = null) => String(n).padStart(length ?? 2, '0')

const fnv32a = (str, asString = true) => {
    let h = 0x811c9dc5
    for (let i = 0; i < str.length; ++i) {
        h ^= str.charCodeAt(i)
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }

    h = h >>> 0

    return asString ? (h).toString(16) : h
}

const hash53 = (str, seed = 0, asString = true) => {
    const len = str.length
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed
    for (let i = 0, ch; i < len; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    const h = 4294967296 * (2097151 & h2) + (h1 >>> 0)

    return asString ? h.toString(16) : h
}

function serializeDate() {
    const now = new Date()
    return `${now.getFullYear()}${addPadding(now.getMonth() + 1)}${addPadding(now.getDate())}${addPadding(now.getHours())}${addPadding(now.getMinutes())}`
}

function distanceFormatter(d, precision = 2) {
    const rx = /\.0+$|(\.\d*[1-9])0+$/
    const lookup = [
        {value: 1, symbol: ''},
        {value: 1e3, symbol: 'k'},
        {value: 1e6, symbol: 'M'},
        {value: 1e9, symbol: 'G'},
        {value: 1e12, symbol: 'T'},
        {value: 1e15, symbol: 'P'},
        {value: 1e18, symbol: 'E'},
    ]
    const item = lookup.slice().reverse().find(item => d >= item.value) ?? {value: 1, symbol: ''}
    const val = (d / item.value).toFixed(precision).replace(rx, '$1')

    return `${val} ${item.symbol}m`
}

function wait(ms, fn) {
    const start = performance.now()
    let end = start
    while (end < start + ms) end = performance.now()
    if (fn instanceof Function) fn()
}