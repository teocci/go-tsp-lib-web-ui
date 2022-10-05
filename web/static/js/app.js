import TLibAPI from './apis/route/tlib-api.js'
import TMapAPI from './apis/route/tmap-api.js'
import MainModule from './main-module.js'

TLibAPI.instance()
TMapAPI.instance()

window.onload = () => {
    mainModule = MainModule.instance
    kakaoMap = mainModule.mapManager.map
}