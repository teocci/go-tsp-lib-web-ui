import Point from './point.js'

export default class Table{
    static EPSILON = 0.00001;

    constructor(){
        this.point = [];
        this.tlib = false;
        this.tmap = false;
    }

    addPoint(_id, pt){
        pt.id = parseInt(pt.id)+1;
        this.point.push(pt);
    }

    putTlibPoint(_id, _x, _y){
        let obj = new Point(_id, _x, _y);
        this.point.forEach(pt =>{
            if(pt.compareXY(obj)){
                if(pt.tlibId == ''){
                    pt.tlibId = _id;
                   // console.log(`tlib same : ${pt.x} , ${_x}, and ${pt.y} ${_y}`)
                }   
            }
        })
    }

    putTmapPoint(_id, _x, _y){
        let obj = new Point(_id, _x, _y);
        this.point.forEach(pt =>{
            if(pt.compareXY(obj)){
                if(pt.tmapId == ''){
                    pt.tmapId = _id;
                    //console.log(`tmap same : ${pt.x} , ${_x}, and ${pt.y} ${_y}`)
                }
            }
         })
    }
}