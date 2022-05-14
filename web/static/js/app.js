import TLibAPI from './tlib-api.js'
import TMapAPI from './tmap-api.js'
import MainModule from './main-module.js'

TLibAPI.instance()
TMapAPI.instance()

let mainModule

window.onload = () => {
    mainModule = new MainModule()
}