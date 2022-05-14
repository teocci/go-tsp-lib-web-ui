/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-May-12
 */
import MapPanel from './map-panel.js'

export default class MapManager {
    static TAG = 'map'

    constructor(panel) {
        if (!panel) throw 'InvalidPanel: null panel'

        this.panel = panel

        this.map = null
        this.markers = []

        this.initPanel()
        this.initMapListeners()
    }

    initPanel() {
        const placeholder = this.panel.placeholder
        const options = {
            center: new kakao.maps.LatLng(36.4310406, 127.3934052),
            level: 3
        }

        this.map = new kakao.maps.Map(placeholder, options)
    }

    initMapListeners() {
        const map = this.map
        kakao.maps.event.addListener(map, 'rightclick', me => {
            kakao.maps.event.removeListener(map, 'click', this.mapClickListener)
        })
    }

    addDeliveryPoint() {
        const map = this.map
        kakao.maps.event.addListener(map, 'click', this.mapClickListener)
    }

    mapClickListener(mouseEvent) {
        const latLng = mouseEvent.latLng
        this.makeMarkers(latLng)
    }

    loadMarkers(points) {
        points.forEach((p, i) => this.addMarker(p, i, this.map))
    }

    addMarker(p, i, map) {
        const marker = new kakao.maps.Marker({
            map: map,
            position: p.position,
        })
        marker.setTitle(p.label)
        marker.setImage(i === 0 ? MARKERS.start : MARKERS.waypoint)
        this.markers.push(marker)
    }

    // MBR 가져오기
    mapBounds() {
        const bounds = this.map.getBounds().toString().split(',')
        const minX = bounds[0].replace('((', '')
        const minY = bounds[1].replace(')', '')
        const maxX = bounds[2].replace('(', '')
        const maxY = bounds[3].replace('))', '')
        console.log({bounds})

        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
        }
    }

    loadRoutes(data) {
        console.log({data})

    }

    drawTSPLine(lines) {
        let linePath = []
        let pointPath = []
        let pointInfos = []

        lines.SPathList.paths.forEach(paths => {
            let obj = {
                pos: new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x),
                id: paths.id - 1,  //path.id가 1부터 옴.
                cost: paths.cost
            };
            pointInfos.push(obj);

            pointPath.push(new kakao.maps.LatLng(paths.SPoint.y, paths.SPoint.x));

            paths.SLineString.nodes.forEach(element => {
                linePath.push(new kakao.maps.LatLng(element.y, element.x))
            })

            pointTable.putTLibPoint(obj.id, paths.SPoint.x, paths.SPoint.y);

        })

        //trigger tsp complete event
        pointTable.tlib = true

        let overlayPromise = new Promise((resolve, reject) => {
            resolve()
        })

        overlayPromise.then(() => {
            if (pointTable.tlib && pointTable.tmap) {
                console.log('tlib promise..')

                resultsPanel.initOverlay(pointTable, map)
                resultsPanel.initDetailRouteTable(tsp, tmap)

                pointTable.tlib = false;
                pointTable.tmap = false;
            }
        })

        tsp.routePolyLine.setPath(linePath)
        tsp.routePolyLine.setMap(map)

        tsp.route.lines = lines.SPathList.paths
        tsp.route.linePath = linePath

        pointPath.push(pointPath[0]) //경유점 표현시 마지막 포인트로 되돌아가게

        tsp.route.pointPath = pointPath
        tsp.route.pointInfos = pointInfos
    }

    drawTLibLinePartly(id) {
        console.log({drawTLibLinePartly: id})
        let path = []

        tsp.partlyPolyLine.setMap(null);
        tsp.route.lines.forEach(line => {
            if (line.id === id) {
                path.push(new kakao.maps.LatLng(line.SPoint.y, line.SPoint.x))
                line.SLineString.nodes.forEach(node => {
                    path.push(new kakao.maps.LatLng(node.y, node.x))
                })
                path.push(new kakao.maps.LatLng(line.EPoint.y, line.EPoint.x))
            }
        })
        tsp.partlyPolyLine.setPath(path)
        tsp.partlyPolyLine.setMap(map);

    }

    drawTMapLinePartly(id) {
        let path = []
        console.log(`after :  id : ${id}`)
        tmap.route.lines.features.forEach(feature => {

            if (parseInt(feature.properties.index) === id) {
                if (feature.geometry.type === 'Point') {
                    let x = feature.geometry.coordinates[0];
                    let y = feature.geometry.coordinates[1];
                    path.push(new kakao.maps.LatLng(y, x))
                } else {
                    feature.geometry.coordinates.forEach(coord => {
                        let x = coord[0]
                        let y = coord[1]
                        path.push(new kakao.maps.LatLng(y, x))
                    });
                }
            }
        })

        tmap.partlyPolyLine.setPath(path)
        tmap.partlyPolyLine.setMap(map);
    }

    drawTMapLine(lines) {
        let linePath = []
        let pointPath = []
        let pointInfos = []

        lines.features.forEach(feature => {
            if (feature.geometry.type === 'Point') {
                let x = feature.geometry.coordinates[0];
                let y = feature.geometry.coordinates[1];

                let obj = {
                    pos: new kakao.maps.LatLng(y, x),
                    id: parseInt(feature.properties.index),
                    cost: 0,
                }

                pointPath.push(new kakao.maps.LatLng(y, x))

                pointInfos.push(obj)
                if (obj.id < pointTable.points.length) {
                    pointTable.putTMapPoint(obj.id, x, y)
                }

            } else {
                feature.geometry.coordinates.forEach(coord => {
                    let x = coord[0]
                    let y = coord[1]
                    linePath.push(new kakao.maps.LatLng(y, x))
                });
            }
        });

        pointTable.tmap = true;
        // Trigger tmap complete event
        let overlayPromise = new Promise((resolve, reject) => {
            resolve()
        })

        overlayPromise.then(() => {
            if (pointTable.tmap && pointTable.tlib) {
                console.log('tmap promise..')``

                resultsPanel.initOverlay(pointTable, map)
                resultsPanel.initDetailRouteTable(tsp, tmap)

                pointTable.tlib = false;
                pointTable.tmap = false;
            }
        })

        tmap.routePolyLine.setPath(linePath)
        tmap.routePolyLine.setMap(map)

        tmap.route.lines = lines
        tmap.route.linePath = linePath
        tmap.route.pointPath = pointPath
        tmap.route.pointInfos = pointInfos
    }
}