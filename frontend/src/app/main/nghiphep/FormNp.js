import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "react-select";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import getListUser from "../../axios/user/getListUser";
import {
  setNghiPhepAction,
  setResetFormAction
} from "../../store/actions/fuse/nghiPhepAction.actions";
import { connect, useDispatch } from "react-redux";
import history from "@history";
import ReactSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
const moment = require("moment");
const mapStateToProps = state => {
  return {
    nghiPhepState: state.nghiPhepReducer
  };
};

const mapDispatchToProps = {
  setNghiPhepAction,
  setResetFormAction
};

const FormNP = nghiPhepState => {
  const dispatch = useDispatch();
  const [nghiTuState, setNghiTuState] = useState(
    nghiPhepState.nghiPhepState.nghiTu
  );
  const [nghiDenState, setNghiDenState] = useState(
    nghiPhepState.nghiPhepState.nghiDen
  );
  const [lyDoNghiState, setLyDoNghi] = useState(
    nghiPhepState.nghiPhepState.lyDoNghi
  );
  const [nguoiLienQuanState, setNguoiLienQuan] = useState(
    nghiPhepState.nghiPhepState.nguoiLienQuan
  );
  const [mucDoAnhHuongState, setMucDoAnhHuong] = useState(
    nghiPhepState.nghiPhepState.mucDoAnhHuong
  );
  const [phuongAnKhacPhucState, setPhuongAnKhacPhuc] = useState(
    nghiPhepState.nghiPhepState.phuongAnKhacPhuc
  );
  const [timeNghiTu, setTimeNghiTu] = useState("");
  const [timeNghiDen, setTimeNghiDen] = useState("");

  const [nghiDenError, setNghiDenError] = useState(false);
  const [lyDoNghiError, setLyDoNghiError] = useState(false);
  const [phuongAnKhacPhucError, setPhuongAnKhacPhucError] = useState(false);
  const [mucDoAnhHuongError, setMucDoAnhHuongError] = useState(false);
  const [listNguoiLienQuanState, setListNguoiLienQuanState] = useState([]);
  const [autoComplete, setAutoComplete] = useState("");
  const [timeChange,setTimeChange] = useState(false)
  const [mucDoChange,setMucDoChange] = useState(false)
  const [lyDoChange,setLyDoChange] = useState(false)
  const handleAutoCompleteChange = inputValue => {
    setAutoComplete(inputValue);
  };

  const addNguoiLienQuan = value => {
    setNguoiLienQuan(value);
  };

  const disableWeekends = date => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  useEffect(()=>{
    if (timeChange){
      let nghiDen = moment(nghiDenState).format("MM/DD/YYYY HH:mm");
      let nghiTu = moment(nghiTuState).format("MM/DD/YYYY HH:mm");
      if (
        moment(nghiDen).isSameOrBefore(moment(nghiTu)) ||
        timeNghiTu === "" ||
        timeNghiDen === ""
      ) {
        setNghiDenError(true);
      } else {
        setNghiDenError(false);
      }
    }
  },[nghiTuState,nghiDenState,timeChange,timeNghiTu,timeNghiDen])

  useEffect(() => {
    const listNguoiLienQuan = async () => {
      if (autoComplete !== "") {
        let response = await getListUser({ searchString: autoComplete });
        if (!response) {
          return history.push("/500InternalError");
        }
        if (response.status !== 404) {
          let returnArray = [];
          for (var i = 0; i < response.data.userArray.length; i++) {
            returnArray.push({
              value: response.data.userArray[i].userName,
              label: response.data.userArray[i].userName,
              type: "user",
              uniqueValue: response.data.userArray[i].userEmail
            });
          }
          for (i = 0; i < response.data.teamArray.length; i++) {
            returnArray.push({
              value: response.data.teamArray[i].teamName,
              label: response.data.teamArray[i].teamName,
              type: "team",
              uniqueValue: response.data.teamArray[i].teamID
            });
          }
          setListNguoiLienQuanState(returnArray);
        }
      }
    };

    listNguoiLienQuan();
  }, [autoComplete]);

  useEffect(()=>{
    if(mucDoChange){
      if (mucDoAnhHuongState.length === 0) {
        setMucDoAnhHuongError(true);
      } else {
        setMucDoAnhHuongError(false);
      }
    }
  },[mucDoAnhHuongState,mucDoChange])

  useEffect(()=>{
    if(lyDoChange){
      if ((lyDoNghiState.replace(/ /g, "").length === 0) || (lyDoNghiState.length >= 500)){
        setLyDoNghiError(true);
      } else {
        setLyDoNghiError(false);
      }
    }
  },[lyDoNghiState,lyDoChange])

  useEffect(()=>{
    if (phuongAnKhacPhucState.length >= 500){
      setPhuongAnKhacPhucError(true);
    } else {
      setPhuongAnKhacPhucError(false);
    }
    
  },[phuongAnKhacPhucState])

  const handleRadioButtonChange = event => {
    setMucDoAnhHuong(event.target.value);
    setMucDoChange(true)
  };

  const handleLyDoNghiChange = event => {
    setLyDoNghi(event.target.value);
    setLyDoChange(true)
  };

  const handlePhuongAnKhacPhucChange = event => {
    setPhuongAnKhacPhuc(event.target.value);
  };

  const validateForm = () => {
    let count = 0;
    let nghiDen = moment(nghiDenState).format("MM/DD/YYYY HH:mm");
    let nghiTu = moment(nghiTuState).format("MM/DD/YYYY HH:mm");
    if (
      moment(nghiDen).isSameOrBefore(moment(nghiTu)) ||
      timeNghiTu === "" ||
      timeNghiDen === ""
    ) {
      setNghiDenError(true);
      count++;
    } else {
      setNghiDenError(false);
    }

    if ((lyDoNghiState.replace(/ /g, "").length === 0)||(lyDoNghiState.length >= 500)){
      setLyDoNghiError(true);
      count++;
    } else {
      setLyDoNghiError(false);
    }

    if (mucDoAnhHuongState.length === 0) {
      setMucDoAnhHuongError(true);
      count++;
    } else {
      setMucDoAnhHuongError(false);
    }
    
    if (phuongAnKhacPhucState.length >= 500){
      setPhuongAnKhacPhucError(true)
      count++;
    }
    else{
      setPhuongAnKhacPhucError(false)
    }

    if (count > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      dispatch(
        setNghiPhepAction({
          nghiTuState,
          nghiDenState,
          lyDoNghiState,
          nguoiLienQuanState,
          mucDoAnhHuongState,
          phuongAnKhacPhucState
        })
      );
      history.push("/xinnghi/xacnhannghi");
    }
  };

  const handleBackForm = () => {
    dispatch(setResetFormAction());
    history.push("/nghiphep");
  };

  const timeError = !nghiDenError ? null : (
    <Typography variant="body1" color="error">
      Ngày/giờ không hợp lệ
    </Typography>
  );
  const anhHuongError = !mucDoAnhHuongError ? null : (
    <Typography variant="body1" color="error">
      Mức độ ảnh hưởng không hợp lệ
    </Typography>
  );
  const lyDoError = !lyDoNghiError ? null : (
    <Typography variant="body1" color="error">
      Lý do nghỉ không hợp lệ
    </Typography>
  );
  const phuongAnError = !phuongAnKhacPhucError ? null : (
    <Typography variant="body1" color="error">
      Phương án khắc phục quá dài
    </Typography>
  );

  const handleTimePickerNghiTu = event => {
    setTimeNghiTu(event.target.value);
    const [hour, minute] = event.target.value.split(":");
    let newTime = moment(new Date(nghiTuState))
      .set({ h: parseInt(hour), m: parseInt(minute) })
      .format("MM/DD/YYYY HH:mm");
    setNghiTuState(newTime);
    setTimeChange(true);
  };

  const handleTimePickerNghiDen = event => {
    setTimeNghiDen(event.target.value);
    const [hour, minute] = event.target.value.split(":");
    let newTime = moment(new Date(nghiDenState))
      .set({ h: parseInt(hour), m: parseInt(minute) })
      .format("MM/DD/YYYY HH:mm");
    setNghiDenState(newTime);
    setTimeChange(true);
  };

  const populateTime = () => {
    let hour = 8;
    let minute = 0;
    let timeArray = ["08:00"];
    while (hour < 18) {
      minute += 15;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
      let hourString;
      let minuteString;
      if (minute < 10) {
        minuteString = "0" + minute.toString();
      } else {
        minuteString = minute.toString();
      }
      if (hour < 10) {
        hourString = "0" + hour.toString();
      } else {
        hourString = hour.toString();
      }
      let timeString = hourString + ":" + minuteString;
      timeArray.push(timeString);
    }
    return timeArray;
  };

  const returnSelectTime = isNghiTu => {
    let handleChange;
    let selectId;
    let value;
    if (isNghiTu) {
      handleChange = handleTimePickerNghiTu;
      selectId = "time-picker-nghi-tu-id";
      value = timeNghiTu;
    } else {
      handleChange = handleTimePickerNghiDen;
      selectId = "time-picker-nghi-den-id";
      value = timeNghiDen;
    }

    return (
      <ReactSelect
        className="timeSelectBox"
        id={selectId}
        onChange={handleChange}
        value={value}
        error={nghiDenError}
      >
        {populateTime().map(time => {
          return (
            <MenuItem value={time} key={time}>
              {time}
            </MenuItem>
          );
        })}
      </ReactSelect>
    );
  };

  return (
    <Grid container>
      <Grid container>
        <Grid item xs={12} sm={12}>
          <Typography
            className="titleStyle"
            variant="h4"
            style={{ textAlign: "center" }}
          >
            Nhập thông tin nghỉ phép
          </Typography>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "20px" }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={1} className="contentFormNp">
            <Grid item xs={3} sm={2}>
              <Typography variant="body1">
                <strong>
                  Nghỉ từ<span style={{ color: "red" }}>*</span>
                </strong>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={3}>
              <DatePicker
                className="dateFormStyle"
                label="Ngày"
                format="dd/MM/yyyy"
                error={nghiDenError}
                value={nghiTuState}
                onChange={setNghiTuState}
                shouldDisableDate={disableWeekends}
              />
            </Grid>

            <Grid item xs={4} sm={3} className="timeSelectBox">
              <InputLabel error={nghiDenError} shrink>Giờ</InputLabel>
              {returnSelectTime(true)}
            </Grid>
          </Grid>

          <Grid container spacing={1} className="contentFormNp">
            <Grid item xs={3} sm={2}>
              <Typography variant="body1">
                <strong>
                  Nghỉ đến<span style={{ color: "red" }}>*</span>
                </strong>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={3}>
              <DatePicker
                className="dateFormStyle"
                error={nghiDenError}
                label="Ngày"
                format="dd/MM/yyyy"
                minDate={nghiTuState}
                value={nghiDenState}
                onChange={setNghiDenState}
                shouldDisableDate={disableWeekends}
              />
              <Grid item xs={12} sm={12}>
                {timeError}
              </Grid>
            </Grid>

            <Grid item xs={4} sm={3}>
              <InputLabel error={nghiDenError} shrink>
                Giờ
              </InputLabel>
              {returnSelectTime(false)}
              <Grid item xs={12} sm={12}>
                {timeError}
              </Grid>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>

        <Grid container spacing={1} className="contentFormNp">
          <Grid item xs={3} sm={2}>
            <Typography variant="body1">
              <strong>
                Lý do nghỉ<span style={{ color: "red" }}>*</span>
              </strong>
            </Typography>
          </Grid>

          <Grid item xs={8} sm={6}>
            <TextField
              className="inputStyle"
              required
              id="ly-do-nghi"
              onChange={handleLyDoNghiChange}
              value={lyDoNghiState}
              error={lyDoNghiError}
              variant="outlined"
            />
            <Grid item xs={12} sm={12}>
              {lyDoError}
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} className="contentFormNp">
          <Grid item xs={3} sm={2}>
            <Typography variant="body1">
              <strong>Người liên quan</strong>
            </Typography>
          </Grid>

          <Grid item xs={8} sm={6}>
            <Select
              className="inputStyle"
              isMulti
              cacheOptions
              defaultOptions
              options={listNguoiLienQuanState}
              value={nguoiLienQuanState}
              onInputChange={handleAutoCompleteChange}
              onChange={addNguoiLienQuan}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} className="contentFormNp">
          <Grid item xs={3} sm={2}>
            <Typography variant="body1">
              <strong>
                Mức độ ảnh hưởng<span style={{ color: "red" }}>*</span>
              </strong>
            </Typography>
          </Grid>

          <Grid item xs={8} sm={6}>
            <RadioGroup
              aria-label="position"
              name="position"
              value={mucDoAnhHuongState}
              onChange={handleRadioButtonChange}
              row
            >
              <FormControlLabel
                value="Khắc phục được"
                control={<Radio color="primary" />}
                label="Khắc phục được"
                labelPlacement="end"
              />
              <FormControlLabel
                value="Không khắc phục được"
                control={<Radio color="primary" />}
                label="Không khắc phục được"
                labelPlacement="end"
              />
              <FormControlLabel
                value="Không ảnh hưởng"
                control={<Radio color="primary" />}
                label="Không ảnh hưởng"
                labelPlacement="end"
              />
            </RadioGroup>
            <Grid item xs={12}>
              {anhHuongError}
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} className="contentFormNp">
          <Grid item xs={3} sm={2}>
            <Typography variant="body1">
              <strong>
                Phương án khắc phục
              </strong>
            </Typography>
          </Grid>

          <Grid item xs={8} sm={6}>
            <TextField
              className="inputStyle"
              required
              id="phuong-an-khac-phuc"
              onChange={handlePhuongAnKhacPhucChange}
              value={phuongAnKhacPhucState}
              error={phuongAnKhacPhucError}
              variant="outlined"
            />
            <Grid item xs={12} sm={12}>
              {phuongAnError}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        style={{ marginTop: "50px" }}
        justify="space-evenly"
      >
        <Grid item xs={4} sm={2}>
          <Button
            className="btnFormNp"
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleBackForm}
          >
            Thôi Đi làm
          </Button>
        </Grid>

        <Grid item xs={4} sm={2}>
          <Button
            className="btnFormNp"
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleFormSubmit}
          >
            Nghỉ luôn
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormNP);