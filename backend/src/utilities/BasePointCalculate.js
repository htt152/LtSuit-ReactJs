const BasePointCalculate = (arr) =>{
    arr.sort((a,b)=>{
        return b.learningPoint-a.learningPoint
    })
    arr[0].basePoint = 10;
    const pointPerBasedPoint = arr[0].learningPoint/10;
    for (var i = 1; i < arr.length; i++){
        let currentPoint = arr[i].learningPoint;
        let bp = Math.round( currentPoint/pointPerBasedPoint * 10) / 10;
        arr[i].basePoint = bp;
    }
    return arr;
}

module.exports = BasePointCalculate;