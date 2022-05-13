export default class TmapMgr {
    static makeTmapReqObject(obj_) {
        const now = new Date();
        let date = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`

        let newObj = {
            "reqCoordType": "WGS84GEO",
            "resCoordType": "WGS84GEO",
            "startName": "출발",
            "startX": obj_.SPoint.x.toString(),
            "startY": obj_.SPoint.y.toString(),
            "startTime": date,
            "endName": "도착",
            "endX": obj_.EPoint.x.toString(),
            "endY": obj_.EPoint.y.toString(),
            "searchOption": "0",
        }

        let arr = [];
        let nodes = obj_.SPointList.nodes;
        for (let i = 0; i < nodes.length; ++i) {
            let str = i.toString();
            let point = {
                "viaPointId": "test" + str.padStart(2, '0'),
                "viaPointName": "test" + str.padStart(2, '0'),
                "viaX": nodes[i].x.toString(),
                "viaY": nodes[i].y.toString(),
            }
            arr.push(point);
        }

        newObj["viaPoints"] = arr;

        return newObj;

    }
}