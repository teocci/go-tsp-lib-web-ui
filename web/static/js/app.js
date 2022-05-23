import TLibAPI from './apis/tlib-api.js'
import TMapAPI from './apis/tmap-api.js'
import MainModule from './main-module.js'

TLibAPI.instance()
TMapAPI.instance()

window.onload = () => {
    mainModule = MainModule.instance
    kakaoMap = mainModule.mapManager.map
}