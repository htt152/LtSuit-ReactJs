import React, { useEffect, useState } from "react";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import history from "@history";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import getCurrentUserPoint from "app/axios/bangDiem/layDiemUser";
import {
  IsSameOrBetweenDate,
  isSameOrAfter
} from "app/utilities/IsBetweenDate";
import xoaDiemCuaUser from "app/axios/bangDiem/xoaDiemCuaUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Icon,
  Button,
  Paper,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import SplitString from "app/utilities/SplitString";
import suaDiemUser from "app/axios/bangDiem/suaDiemUser";
import getHoatDongCaNhan from "../../axios/hoatDongCaNhan/getHoatDongCaNhan";
let moment = require("moment");
const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  root: {
    "& > span": {
      margin: theme.spacing(2)
    }
  },
  colorError: {
    backgroundColor: "red",
    displayBlock: "true"
  }
}));
const dateFormat = d => {
  let date = new Date(d);
  let year = date.getFullYear();
  let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
  let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
  return `${day}/${month}/${year}`;
};

const year = () => {
  const date = new Date();
  return date.getFullYear();
};
const month = () => {
  const date = new Date();
  return date.getMonth();
};

export default function MyLearningPoints() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [totalPoint, setTotalPoint] = useState(0);
  const [loading, setLoading] = useState(true);
  const [titleState, setTitleState] = useState("");
  const [titleErrorState, setTitleErrorState] = useState(false);
  const [dateState, setDateState] = useState("");
  const [typeState, setTypeState] = useState("");
  const [descriptionState, setDescriptionState] = useState("");
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);
  const [showDialogState, setShowDialogState] = useState(false);
  const [selectedDateTuNgay, setSelectedDateTuNgay] = useState(new Date());
  const [selectedDateDenNgay, setSelectedDateDenNgay] = useState(new Date());
  const [showFixDialog, setShowFixDialog] = useState(false);
  const [dataIDState, setDataIDState] = useState("");
  const [hoatDongIDState, setHoatDongIDState] = useState("");
  const [typeHoatDong, setTypeHoatDong] = useState([]);
  const [dateErrorState, setDateErrorState] = useState(false);
  function createData(
    no,
    id,
    title,
    type,
    hoatDongID,
    description,
    date,
    status,
    point
  ) {
    return {
      no,
      id,
      title,
      type,
      hoatDongID,
      description,
      date,
      status,
      point
    };
  }

  const returnRowsData = async () => {
    let retunArray = [];
    let response = await getCurrentUserPoint(localStorage.getItem("email"));
    if (!response) {
      return history.push("/500InternalError");
    }
    for (var i = 0; i < response.data.length; i++) {
      retunArray.push(
        createData(
          i + 1,
          response.data[i]._id,
          response.data[i].title,
          response.data[i].type,
          response.data[i].hoatDongID,
          response.data[i].description,
          dateFormat(response.data[i].date),
          response.data[i].status,
          response.data[i].point
        )
      );
    }
    setRowsData(retunArray);
  };

  const displayRows = () => {
    let returnArray = [];

    for (var i = 0; i < rowsData.length; i++) {
      let returnData = rowsData[i];
      let returnDate = returnData.date;
      let [date, month, year] = returnDate.split("/");
      let newDate = `${date}/${month}/${year}`;
      if (IsSameOrBetweenDate(tuNgay, denNgay, newDate)) {
        returnArray.push(returnData);
      }
    }
    setDisplayData(returnArray);
    let total = 0;
    for (var j = 0; j < returnArray.length; j++) {
      if (returnArray[j].status === "approved") {
        total += returnArray[j].point;
      }
    }
    setTotalPoint(total);
    setLoading(false);
  };

  useEffect(() => {
    displayRows();
  }, [rowsData]);

  useEffect(() => {
    returnRowsData();
    setTuNgay(dateFormat(new Date(year(), month(), 1)));
    setDenNgay(dateFormat(new Date(year(), month() + 1, 0)));
    setSelectedDateTuNgay(new Date(year(), month(), 1));
    setSelectedDateDenNgay(new Date(year(), month() + 1, 0));
    displayRows();
    getHoatDongCaNhan().then(res => {
      if (!res) {
        history.push("/500InternalError");
      } else if (res.status === 200) {
        setTypeHoatDong(res.data);
      }
    });
  }, []);

  useEffect(() => {
    setTouched(false);
  }, [tuNgay]);

  useEffect(() => {
    setTouched(false);
    setError(false);
  }, [error]);

  useEffect(() => {
    displayRows();
  }, [tuNgay, denNgay]);

  useEffect(() => {
    if (showDialogState) {
      setShowDialogState(true);
      showDialogFix();
    }
  }, [showDialogState]);

  useEffect(() => {
    if (descriptionState.length >= 500) {
      setDescriptionErrorState(true);
    } else {
      setDescriptionErrorState(false);
    }

    if (descriptionState.replace(/ /g, "").length === 0) {
      setDescriptionErrorState(true);
    } else {
      setDescriptionErrorState(false);
    }
  }, [descriptionState]);

  useEffect(() => {
    if (titleState.length >= 500) {
      setTitleErrorState(true);
    } else {
      setTitleErrorState(false);
    }
    if (titleState.replace(/ /g, "").length === 0) {
      setTitleErrorState(true);
    } else {
      setTitleErrorState(false);
    }
  }, [titleState]);

  useEffect(() => {
    let tuNgay = moment(selectedDateTuNgay).format("DD/MM/YYYY");
    let denNgay = moment(selectedDateDenNgay).format("DD/MM/YYYY");
    if (isSameOrAfter(tuNgay, denNgay)) {
      setDateErrorState(false);
    } else {
      setDateErrorState(true);
    }
  }, [selectedDateTuNgay, selectedDateDenNgay]);

  const onSubmit = () => {
    setTouched(true);
  };

  const Cancel = () => {
    setError(true);
    setTouched(false);
  };

  const onSubmitRange = () => {
    let tuNgay = moment(selectedDateTuNgay).format("DD/MM/YYYY");
    let denNgay = moment(selectedDateDenNgay).format("DD/MM/YYYY");
    if (isSameOrAfter(tuNgay, denNgay)) {
      setDateErrorState(false);
      setTuNgay(dateFormat(new Date(selectedDateTuNgay)));
      setDenNgay(dateFormat(new Date(selectedDateDenNgay)));
    } else {
      setDateErrorState(true);
    }
  };

  const handleDateChangeTuNgay = date => {
    setSelectedDateTuNgay(date);
  };
  const handleDateChangeDenNgay = date => {
    setSelectedDateDenNgay(date);
  };

  const showAlertMessage = (alertMessage, type) => {
    dispatch(
      Actions.showMessage({
        message: alertMessage,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        },
        variant: type
      })
    );
  };

  const deleteDiem = async data => {
    let res = await xoaDiemCuaUser({
      email: localStorage.getItem("email"),
      _id: data.id
    });
    returnRowsData();
    return res;
  };

  const ApproveButton = withStyles(theme => ({
    root: {
      color: "#68b74c",
      backgroundColor: "#f4ffe8",
      "&:hover": {
        backgroundColor: "#f4ffe8"
      },
      "&:disabled": {
        color: "#68b74c",
        borderColor: "#BCE5A1",
        backgroundColor: "#f4ffe8"
      },
      borderColor: "#BCE5A1"
    }
  }))(Button);

  const PendingButton = withStyles(theme => ({
    root: {
      color: "#dd8e49",
      backgroundColor: "#fff7e8",
      "&:hover": {
        backgroundColor: "#fff7e8"
      },
      "&:disabled": {
        color: "#dd8e49",
        borderColor: "#f5d5a4",
        backgroundColor: "#fff7e8"
      },
      borderColor: "#f5d5a4"
    }
  }))(Button);

  const DeniedButton = withStyles(theme => ({
    root: {
      color: "#cb343d",
      backgroundColor: "#fff1f1",
      "&:hover": {
        backgroundColor: "#fff1f1"
      },
      "&:disabled": {
        color: "#cb343d",
        borderColor: "#ebaaa4",
        backgroundColor: "#fff1f1"
      },
      borderColor: "#ebaaa4"
    }
  }))(Button);

  const DefaultButton = withStyles(theme => ({
    root: {
      color: "#707070",
      backgroundColor: "#fafafa",
      "&:hover": {
        backgroundColor: "#fafafa"
      },
      "&$buttonDisabled": {
        color: theme.palette.grey[900]
      },
      borderColor: "#d9d9d9"
    }
  }))(Button);

  const getStatusButton = s => {
    const status = s.toLowerCase();
    switch (status) {
      case "pending":
        return (
          <PendingButton
            disabled
            size="small"
            disableRipple={true}
            variant="outlined"
          >
            Pending
          </PendingButton>
        );
      case "approved":
        return (
          <ApproveButton
            disabled
            size="small"
            disableRipple={true}
            variant="outlined"
          >
            Approved
          </ApproveButton>
        );
      case "denied":
        return (
          <DeniedButton
            disabled
            size="small"
            disableRipple={true}
            variant="outlined"
          >
            Denined
          </DeniedButton>
        );
      default:
        return (
          <DefaultButton size="small" disableRipple={true} variant="outlined">
            {status}
          </DefaultButton>
        );
    }
  };

  const showDialogDelete = rowData => {
    dispatch(
      Actions.openDialog({
        children: (
          <Dialog fullWidth={true} maxWidth="sm" open={true}>
            <Grid container>
              <Grid item>
                <DialogTitle id="alert-dialog-title">Xóa dữ liệu</DialogTitle>
              </Grid>
            </Grid>
            <DialogContent>
              <Grid container spacing={1}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong> Bạn có chắc muốn xóa dữ liệu điểm sau: </strong>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container className="dialogBangDiem">
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body1">
                      <strong>Tiêu đề:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    <Typography variant="body1">
                      {SplitString(rowData.title)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container className="dialogBangDiem">
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body1">
                      <strong>Loại:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    <Typography variant="body1">{rowData.type}</Typography>
                  </Grid>
                </Grid>

                <Grid container className="dialogBangDiem">
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body1">
                      <strong>Mô tả:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    <Typography variant="body1">
                      {SplitString(rowData.description)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container className="dialogBangDiem">
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body1">
                      <strong>Ngày tạo:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    <Typography variant="body1">{rowData.date}</Typography>
                  </Grid>
                </Grid>

                <Grid container className="dialogBangDiem">
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body1">
                      <strong>Trạng thái:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    {getStatusButton(rowData.status)}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => dispatch(Actions.closeDialog())}
                color="secondary"
              >
                Không đồng ý
              </Button>
              <Button
                onClick={async () => {
                  let res = await deleteDiem(rowData);
                  if (res.status >= 400) {
                    showAlertMessage("Xóa điểm không thành công", "error");
                  } else {
                    showAlertMessage("Xóa điểm thành công", "success");
                  }
                  dispatch(Actions.closeDialog());
                }}
                color="secondary"
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        )
      })
    );
  };

  const handleTitleChange = event => {
    setTitleState(event.target.value);
  };

  const handleTypeChange = event => {
    setHoatDongIDState(event.target.value);
  };

  const handleDescriptionChange = event => {
    setDescriptionState(event.target.value);
  };

  const handleDateFixChange = date => {
    setDateState(date);
  };

  const tieuDeError = !titleErrorState ? null : (
    <Typography variant="body1" color="error">
      Tiêu đề không hợp lệ
    </Typography>
  );

  const descriptionError = !descriptionErrorState ? null : (
    <Typography variant="body1" color="error">
      Mô tả không hợp lệ
    </Typography>
  );

  const showDialogFix = () => {
    if (showFixDialog) {
      return (
        <Dialog fullWidth={true} maxWidth="sm" open={true}>
          <Grid container>
            <Grid item>
              <DialogTitle id="fix-dialog-title">Sửa dữ liệu</DialogTitle>
            </Grid>
          </Grid>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid container className="dialogBangDiem">
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    <strong>Tiêu đề:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={9}>
                  <TextField
                    margin="dense"
                    label="Tiêu đề/Tên sự kiện"
                    onChange={handleTitleChange}
                    value={titleState}
                    error={titleErrorState}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}></Grid>
                <Grid item xs={6} sm={9}>
                  {tieuDeError}
                </Grid>
              </Grid>

              <Grid container className="dialogBangDiem">
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    <strong>Ngày thực hiện:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={9}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-fix"
                      label="Ngày thực hiện"
                      format="dd/MM/yyyy"
                      value={dateState}
                      onChange={handleDateFixChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>

              <Grid container className="dialogBangDiem">
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    <strong>Loại sự kiện:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={9}>
                  <TextField
                    id="type-select"
                    select
                    label="Loại sự kiện"
                    fullWidth
                    value={hoatDongIDState}
                    onChange={handleTypeChange}
                    SelectProps={{
                      native: true
                    }}
                    variant="outlined"
                  >
                    {typeHoatDong.map(option => (
                      <option
                        key={option._id}
                        value={option._id}
                        style={{ fontSize: "14px" }}
                      >
                        {option.loaiHoatDong} - {option.moTaHoatDong}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container className="dialogBangDiem">
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    <strong>Mô tả:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={9}>
                  <TextField
                    margin="dense"
                    label="Mô tả"
                    onChange={handleDescriptionChange}
                    value={descriptionState}
                    error={descriptionErrorState}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}></Grid>
                <Grid item xs={6} sm={9}>
                  {descriptionError}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setShowFixDialog(false);
              }}
              color="secondary"
            >
              Không đồng ý
            </Button>
            <Button
              onClick={async () => {
                let res = await requestFix();
                if (!res) {
                  showAlertMessage("Sửa điểm không thành công", "error");
                } else {
                  setShowFixDialog(false);
                  showAlertMessage("Sửa điểm thành công", "success");
                  returnRowsData();
                }
              }}
              color="secondary"
            >
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  const requestFix = async () => {
    if (!validateForm) {
      return false;
    }
    let res = await suaDiemUser({
      email: localStorage.getItem("email"),
      id: dataIDState,
      hoatDongID: hoatDongIDState,
      type: typeState,
      title: titleState,
      date: dateState,
      description: descriptionState
    });
    return res;
  };

  const validateForm = () => {
    let count = 0;
    if (titleState.replace(/ /g, "").length === 0) {
      setTitleErrorState(true);
      count++;
    } else {
      setTitleErrorState(false);
    }

    if (titleState.length >= 500) {
      setTitleErrorState(true);
      count++;
    } else {
      setTitleErrorState(false);
    }

    if (descriptionState.replace(/ /g, "").length === 0) {
      setDescriptionErrorState(true);
      count++;
    } else {
      setDescriptionErrorState(false);
    }
    if (descriptionState.length >= 500) {
      setDescriptionErrorState(true);
      count++;
    } else {
      setDescriptionErrorState(false);
    }

    if (count > 0) {
      return false;
    }
    return true;
  };

  const btnDelete = rowData => {
    showDialogDelete(rowData);
  };

  const btnEdit = rowData => {
    setTitleState(rowData.title);
    setTypeState(rowData.type);
    setDescriptionState(rowData.description);
    setDataIDState(rowData.id);
    setHoatDongIDState(rowData.hoatDongID);
    let [day, month, year] = rowData.date.split("/");
    let newDate = `${month}/${day}/${year}`;
    setDateState(new Date(newDate));
    if (rowData.status === "pending") {
      setShowFixDialog(true);
    } else {
      showAlertMessage("Bạn không thể sửa thông tin này", "error");
    }
  };

  const dateError = !dateErrorState ? null : (
    <Typography variant="body1" color="error">
      Ngày không hợp lệ
    </Typography>
  );

  return loading ? (
    <Grid container spacing={3} style={{ marginTop: "30px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <Grid container>
      {showDialogFix()}
      <Grid container className="gridStyle">
        <Typography className="title2">My Learning Points</Typography>
      </Grid>
      <Grid container style={{ padding: "10px" }}>
        <Grid container spacing={1} className="gridStyle">
          <Paper style={{ width: "100vw" }}>
            <Grid item xs={12} sm={12}>
              <Typography className="titleStyle1">
                <InsertChartIcon style={{ marginBottom: "-5px" }} />
                &nbsp; Đăng Ký Điểm Học Tập
              </Typography>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography className="titleStyle1">
                  <Link
                    to="/dang-ky"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      style={{ textTransform: "capitalize" }}
                      color="primary"
                    >
                      <Icon>add_circle</Icon>
                      &nbsp; Thêm Điểm Học Tập
                    </Button>
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={"grid1"}>
                <Grid>
                  <form>
                    <div className="dropdown">
                      <Button
                        variant="contained"
                        size="small"
                        style={{ textTransform: "capitalize" }}
                        onClick={onSubmit}
                        color="primary"
                      >
                        <CalendarTodayIcon />
                        &nbsp;
                        {tuNgay} &nbsp; <TrendingFlatIcon /> &nbsp; {denNgay}{" "}
                        <ArrowDropDownIcon />
                      </Button>
                      {touched === false ? null : (
                        <div className="dropdown-content1">
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <ul>
                              <li>
                                <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog1"
                                  label="Từ Ngày"
                                  format="MM/dd/yyyy"
                                  value={selectedDateTuNgay}
                                  onChange={handleDateChangeTuNgay}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date"
                                  }}
                                />
                              </li>
                              <li>
                                <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog"
                                  label="Đến Ngày"
                                  format="MM/dd/yyyy"
                                  value={selectedDateDenNgay}
                                  onChange={handleDateChangeDenNgay}
                                  minDate={selectedDateTuNgay}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date"
                                  }}
                                />
                              </li>
                              <li>{dateError}</li>
                              <li>
                                <Button
                                  variant="contained"
                                  size="small"
                                  className="btnDate"
                                  onClick={onSubmitRange}
                                  disabled={dateErrorState}
                                >
                                  Apply
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  className="btnDate"
                                  onClick={Cancel}
                                >
                                  Cancel
                                </Button>
                              </li>
                            </ul>
                          </MuiPickersUtilsProvider>
                        </div>
                      )}
                    </div>
                  </form>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Typography className="danhsach">
                Danh Sách Điểm Học Tập: {tuNgay} => {denNgay}
              </Typography>
            </Grid>
            <Grid container>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={"50px"}>Action</TableCell>
                    <TableCell width={"50px"}>No.</TableCell>
                    <TableCell style={{minWidth:"150px"}}>Title</TableCell>
                    <TableCell style={{minWidth:"275px"}}>Type</TableCell>
                    <TableCell style={{minWidth:"150px"}}>Description</TableCell>
                    <TableCell width={"80px"}>Date</TableCell>
                    <TableCell width={"50px"}>Status</TableCell>
                    <TableCell width={"50px"}>Point</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            margin: "5px"
                          }}
                          onClick={() => {
                            btnEdit(row);
                          }}
                          color="primary"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            margin: "5px"
                          }}
                          onClick={() => {
                            btnDelete(row);
                          }}
                          color="primary"
                        >
                          <HighlightOffIcon />
                        </Button>
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{SplitString(row.title, 20)}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{SplitString(row.description, 45)}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{getStatusButton(row.status)}</TableCell>
                      <TableCell>{row.point}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} align="right" height={"50px"}>
                      <b>Total Points:</b>
                    </TableCell>
                    <TableCell align="right">{totalPoint} points</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Grid>
        <Grid container spacing={3} className="gridStyle">
          <Grid item xs={12} sm={6}>
            <Paper>
              <Typography className="title1">
                Chính sách thúc đẩy học tập tại NAL 2017
              </Typography>
              <Grid className="titleStyle2">
                Mục đích chính sách:
                <ul>
                  <li>
                    Thúc đẩy việc học tập trong toàn tổ chức, ở tất cả các cấp
                    độ: cá nhân, nhóm, liên nhóm
                  </li>
                  <li>
                    Làm cơ sở định hướng: hành động, đo đạc dữ liệu, đánh giá
                    hiệu quả, cải tiến; biến việc học trở thành thói quen/kỹ
                    năng bền vững trong chiến lược phát triển tổ chức.
                  </li>
                </ul>
                Nội dung chính sách:
                <ul>
                  <li>
                    Việc học tập là bắt buộc/khuyến khích, được xem xét như là
                    một yếu tố quan trọng (key metric) đánh giá nhóm làm việc và
                    cá nhân, trọng số xem xét yếu tố học tập là 0.2 (so với 0.8
                    là các yếu tố còn lại).
                  </li>
                  <li>
                    Các nhóm làm việc cần phải xem xét việc học như một hạng mục
                    cần quản lý trên bảng công việc của nhóm (Project Backlog),
                    định nghĩa (define) việc học tập, hiển thị chúng ra
                    (visualize) và thúc đẩy nhóm học tập (team learning) để thực
                    hiện các hạng mục này.
                  </li>
                  <li>
                    Tổ chức thiết kế môi trường, văn hóa để thúc đẩy việc học
                    tập:
                    <ul>
                      <li>
                        Xây dựng nhóm và hệ thống quản lý tri thức hiện trong tổ
                        chức (1)
                      </li>
                      <li>Xây dựng khung đo đạc chỉ số học tập cá nhân. (2)</li>
                      <li>
                        Làm lại layout văn phòng (thiết kế góc tập trung, góc
                        tương tác, thư viện … phục vụ việc học tập). (3)
                      </li>
                      <li>
                        Xây dựng khung thời gian để cá nhân, nhóm có thể tập
                        trung vào việc học tập. (4)
                      </li>
                      <li>
                        Xây dựng chính sách thúc đẩy việc đọc sách, thúc đẩy
                        việc tham gia các khóa học (trong và ngoài công ty). (5)
                      </li>
                      <li>Xây dựng chính sách tuyên dương/khen thưởng. (6)</li>
                      <li>
                        Triển khai các tri thức cần thiết thúc đẩy việc học tập
                        (thiết kế chương trình học tập - khoá học nội bộ, kỹ
                        năng thiết kế vận hành Ba, kỹ năng định hướng dẫn dắt
                        việc học tập trong nhóm, kỹ năng quản trị tri thức, kỹ
                        năng quản lý tác vụ cá nhân ..v..v..). (7)
                      </li>
                    </ul>
                  </li>
                </ul>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper>
              <Typography className="title1">
                Khung điểm số cho hoạt động học tập cá nhân
              </Typography>
              <Grid className="titleStyle2">
                <div>
                  Về cơ bản các hoạt động học tập và luân chuyển tri thức sẽ
                  được quy về 4 hình thức chính:
                </div>
                <div>
                  <strong>+ Hoạt động Socialization:</strong> ví dụ hoạt động
                  mentor, tư vấn ...
                </div>
                <div>
                  <strong>+ Hoạt động Externalization:</strong> ví dụ xây dựng
                  gói học tập, viết review …
                </div>
                <div>
                  <strong>+ Hoạt động Combination: </strong> ví dụ hoạt động tổ
                  chức triển khai gói học tập, khóa học ...
                </div>
                <div>
                  <strong>+ Hoạt động Internalization:</strong> ví dụ hoạt động
                  tham gia rèn luyện, tham gia thi ...
                </div>
                <div>
                  Để chính sách trên bắt đầu có thể thực hiện được, liên quan
                  đến (2), có khung điểm số cho hoạt động học tập cá nhân và
                  nhóm như sau:
                </div>
                <ul>
                  <li>
                    <strong>(S-5)</strong> - Tham gia các sự kiện ngoài công ty
                    tổ chức (talkshow, seminar …):
                    <b style={{ color: "blue" }}> 5 điểm</b>
                  </li>
                  <li>
                    <strong>(S-5)</strong> - Tham gia tổ chức các hoạt động rèn
                    luyện với vai trò hướng dẫn, mentor, cùng tổ chức, trọng tài
                    v.v...: <b style={{ color: "blue" }}> 5 điểm</b>
                  </li>
                  <li>
                    <strong>(E-5)</strong> - Đọc sách, viết review sách, tạo bài
                    viết (article) về tri thức, làm nội dung đề thi...:
                    <b style={{ color: "blue" }}> 5 điểm</b>
                  </li>
                  <li>
                    <strong>(E-5)</strong> - Cập nhật bổ sung thêm cho bó học
                    tập:<b style={{ color: "blue" }}>5 điểm</b>
                  </li>
                  <li>
                    <strong>(E-20)</strong> - Cá nhân xây dựng bó học tập:
                    <b style={{ color: "blue" }}>20 điểm </b>
                  </li>
                  <li>
                    <strong>(E-10)</strong> - Nhóm xây dựng bó học tập it hơn
                    hoặc bằng 5 người:
                    <b style={{ color: "blue" }}> 10 điểm / 1 người</b>
                  </li>
                  <li>
                    <strong>(E-5)</strong> - Nhóm xây dựng bó học tập lớn hơn 5
                    người và dưới 10 người:
                    <b style={{ color: "blue" }}> 5 điểm / 1 người</b>
                  </li>
                  <li>
                    <strong>(C-20)</strong> - Diễn các buổi chia sẻ tri thức
                    seminar cho nhiều team:
                    <b style={{ color: "blue" }}>20 điểm</b>
                  </li>
                  <li>
                    <strong>(C-20)</strong> - Cá nhân xây dựng thiết kế hoạt
                    động rèn luyện:<b style={{ color: "blue" }}> 20 điểm</b>
                  </li>
                  <li>
                    <strong>(C-10)</strong> - Nhóm xây dựng thiết kế hoạt động
                    rèn luyện it hơn hoặc bằng 5 người:
                    <b style={{ color: "blue" }}>10 điểm / 1 người</b>
                  </li>
                  <li>
                    <strong>(C-5)</strong> - Nhóm xây dựng thiết kế hoạt động
                    rèn luyện lớn hơn 5 người và dưới 10 người:
                    <b style={{ color: "blue" }}>5 điểm / 1 người</b>
                  </li>
                  <li>
                    <strong>(C-10)</strong> - Diễn các buổi chia sẻ tri thức
                    seminar nội bộ team:<b style={{ color: "blue" }}>10 điểm</b>
                  </li>
                  <li>
                    <strong>(C-5)</strong> - Tổ chức một khóa học (Người đứng ra
                    tổ chức coi như là mentor cho buổi đó.):
                    <b style={{ color: "blue" }}>5 điểm / 1 buổi</b>
                  </li>
                  <li>
                    <strong>(I-1)</strong> - Tham gia các hoạt động rèn luyện kỹ
                    năng trong công ty (code fighter, code smell, hackathon,
                    technical practices, Agile workshop …):{" "}
                    <b style={{ color: "blue" }}>1 điểm</b>
                  </li>
                  <li>
                    <strong>(I-20)</strong> - Hoàn thành khóa học (MOOC, nội bộ
                    công ty, ...):<b style={{ color: "blue" }}>20 điểm</b>
                  </li>
                </ul>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
