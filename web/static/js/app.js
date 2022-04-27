
let mapElement = document.getElementById('map')
let map

window.onload = () => {
    const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    }

    map = new kakao.maps.Map(mapElement, options)
    console.log('frame completed!')
}