export const isSameOrAfter = (s, d) =>{
    let [sDate,sMonth,sYear] = s.split('/')
    let [dDate,dMonth,dYear] = d.split('/')
    if (sYear < dYear){
        return true;
    }
    else if (sYear === dYear){
        if (sMonth < dMonth){
            return true;
        }
        else if (sMonth === dMonth){
            if (sDate <= dDate){
                return true;
            }
        }
    }
    return false;
}

export const isAfter = (s, d) =>{
    let [sDate,sMonth,sYear] = s.split('/')
    let [dDate,dMonth,dYear] = d.split('/')
    if (sYear < dYear){
        return true;
    }
    else if (sYear === dYear){
        if (sMonth < dMonth){
            return true;
        }
        else if (sMonth === dMonth){
            if (sDate < dDate){
                return true;
            }
        }
    }
    return false;
}

export const isSameOrBefore = (e, d) =>{
    let [eDate,eMonth,eYear] = e.split('/')
    let [dDate,dMonth,dYear] = d.split('/')
    if (eYear > dYear){
        return true;
    }
    else if (eYear === dYear){
        if (eMonth > dMonth){
            return true;
        }
        else if (eMonth === dMonth){
            if (eDate >= dDate){
                return true;
            }
        }
    }
    return false;
}

export const isBefore = (e, d) =>{
    let [eDate,eMonth,eYear] = e.split('/')
    let [dDate,dMonth,dYear] = d.split('/')
    if (eYear > dYear){
        return true;
    }
    else if (eYear === dYear){
        if (eMonth > dMonth){
            return true;
        }
        else if (eMonth === dMonth){
            if (eDate > dDate){
                return true;
            }
        }
    }
    return false;
}

export const IsBetweenDate = (startDate,endDate,date) => {
    if (isAfter(startDate,date) && isBefore(endDate,date)){
        return true
    }
    else{
        return false
    }
};

export const IsSameOrBetweenDate = (startDate,endDate,date) => {
    if (isSameOrAfter(startDate,date) && isSameOrBefore(endDate,date)){
        return true
    }
    else{
        return false
    }
};