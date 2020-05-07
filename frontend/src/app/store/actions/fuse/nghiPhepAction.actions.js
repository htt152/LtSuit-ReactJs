export const SET_STATE = 'SET STATE';
export const RESET_STATE = 'RESET STATE';


export function setNghiPhepAction (value){
    return {
        type: SET_STATE,
        payload: value
    }
}

export function setResetFormAction (){
    return {
        type: RESET_STATE,
    }
}