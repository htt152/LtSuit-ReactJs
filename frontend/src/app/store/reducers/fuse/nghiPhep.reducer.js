import * as Actions from "../../actions/fuse/index";
let moment = require("moment");
const initialState = {
  nghiTu: moment().format("MM/DD/YYYY HH:mm"),
  nghiDen: moment().format("MM/DD/YYYY HH:mm"),
  lyDoNghi: "",
  nguoiLienQuan: [],
  mucDoAnhHuong: "",
  phuongAnKhacPhuc: ""
};

const nghiPhepReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_STATE:
      return {
        nghiTu: action.payload.nghiTuState,
        nghiDen: action.payload.nghiDenState,
        lyDoNghi: action.payload.lyDoNghiState,
        nguoiLienQuan: action.payload.nguoiLienQuanState,
        mucDoAnhHuong: action.payload.mucDoAnhHuongState,
        phuongAnKhacPhuc: action.payload.phuongAnKhacPhucState
      };
    case Actions.RESET_STATE:
      return {
        nghiTu: new Date(),
        nghiDen: new Date(),
        lyDoNghi: "",
        nguoiLienQuan: [],
        mucDoAnhHuong: "",
        phuongAnKhacPhuc: ""
      };
    default:
      return state;
  }
};

export default nghiPhepReducer;
