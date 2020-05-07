let moment = require('moment')

const calculateTimeForStartDay = (time) =>{
    let currentTime = moment(time)
    if (moment(currentTime).day()===6 || moment(currentTime).day()===0){
        return 0
    }
    let returnTime = 0;
    let endOfDay = moment(currentTime).set({'hour':18,'minute':0})
    let startOfLunchBreak = moment(currentTime).set({'hour':11,'minute':30})
    let endOfLunchBreak = moment(currentTime).set({'hour':13,'minute':0})
    if (moment(currentTime).isBefore(moment(startOfLunchBreak))){
        returnTime = Math.abs(moment.duration(currentTime.diff(startOfLunchBreak)).asHours()) + 5
    }
    else if (moment(currentTime).isAfter(endOfLunchBreak)){
        returnTime = Math.abs(moment.duration(currentTime.diff(endOfDay)).asHours())
    }
    else{
        returnTime = 5;
    }
    return returnTime;
}

const calculateTimeForEndDay = (time) =>{
    let currentTime = moment(time)
    if (moment(currentTime).day()===6 || moment(currentTime).day()===0){
        return 0
    }
    let returnTime = 0;
    let startOfDay = moment(currentTime).set({'hour':8,'minute':0})
    let startOfLunchBreak = moment(currentTime).set({'hour':11,'minute':30})
    let endOfLunchBreak = moment(currentTime).set({'hour':13,'minute':0})
    if (moment(currentTime).isBefore(moment(startOfLunchBreak))){
        returnTime = Math.abs(moment.duration(currentTime.diff(startOfDay)).asHours())
    }
    else if (moment(currentTime).isAfter(endOfLunchBreak)){
        returnTime = Math.abs(moment.duration(currentTime.diff(endOfLunchBreak)).asHours()) + 3.5
    }
    else{
        returnTime = 3.5;
    }
    return returnTime;
}

const isSameDay = (day1,day2) =>{
    let d1 = moment(day1)
    let d2 = moment(day2)
    if ((moment(d1).isSame(moment(d2),'day')) && (moment(d1).isSame(moment(d2),'month')) && (moment(d1).isSame(moment(d2),'year'))){
        return true
    }
    return false
}

const calculateTimeForSameDay = (day1,day2) =>{
    let d1 = moment(day1)
    let d2 = moment(day2)
    let startTime = moment(d1)
    let endTime = moment(d2)
    let startOfLunchBreak = moment(d1).set({'hour':11,'minute':30})
    let endOfLunchBreak = moment(d1).set({'hour':13,'minute':0})

    if ((startTime.isBefore(startOfLunchBreak) && endTime.isSameOrBefore(startOfLunchBreak)) 
        || (startTime.isSameOrAfter(endOfLunchBreak) && endTime.isAfter(endOfLunchBreak))){
        return Math.abs(moment.duration(startTime.diff(endTime)).asHours())
    }
    else if ((startTime.isBefore(startOfLunchBreak) && endTime.isBetween(startOfLunchBreak,endOfLunchBreak))||
            (startTime.isBefore(startOfLunchBreak) && endTime.isSame(endOfLunchBreak))) {
        return Math.abs(moment.duration(startTime.diff(startOfLunchBreak)).asHours())
    }
    else if ((startTime.isBetween(startOfLunchBreak,endOfLunchBreak) && endTime.isAfter(endOfLunchBreak))||
            (startTime.isSame(startOfLunchBreak) && endTime.isAfter(endOfLunchBreak))||
            (startTime.isSame(endOfLunchBreak) && endTime.isAfter(endOfLunchBreak))) {
        return Math.abs(moment.duration(endTime.diff(endOfLunchBreak)).asHours())
    }
    else if (startTime.isBefore(startOfLunchBreak) && endTime.isAfter(endOfLunchBreak)){
        return Math.abs(moment.duration(startTime.diff(endTime)).asHours()) - 1.5
    }
    else{
        return 0
    }
}

const TinhPhepTon = (d1,d2) =>{
    let counter = 0;
    let newValue = moment(d1).format("MM/DD/YYYY HH:mm")
    let compareValue = moment(d2).format("MM/DD/YYYY HH:mm")
    if (isSameDay(newValue,compareValue)){
        return calculateTimeForSameDay(newValue,compareValue)
    }

    let timeLeftFromDay1 = calculateTimeForStartDay(newValue)
    let timeLeftFromDay2 = calculateTimeForEndDay(compareValue)
    var loopDuration = Math.floor(Math.abs(moment.duration(moment(newValue).diff(compareValue)).asDays())) - 1
    for (var i = 0; i < loopDuration;i++){
        newValue = moment(newValue).add(1,'d')
        if(newValue.day()!==6 && newValue.day()!==0){
            counter++;
        }
    }
    let timeDifferent = (counter * 8.5) + timeLeftFromDay1 + timeLeftFromDay2
    return timeDifferent
}

module.exports = TinhPhepTon;