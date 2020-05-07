import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import history from "@history";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import getHoatDongCaNhan from "../../axios/hoatDongCaNhan/getHoatDongCaNhan";
import createBangDiemCaNhan from "../../axios/bangDiem/createBangDiemCaNhan";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    "& > span": {
      margin: theme.spacing(2),
    },
  },
}));

const deepClone = (o) => {
  const output = Array.isArray(o) ? [] : {};
  for (let i in o) {
    const value = o[i];
    output[i] =
      value !== null && typeof value === "object" ? deepClone(value) : value;
  }
  return output;
};

const dateFormat = (d) => {
  let date = new Date(d);
  let year = date.getFullYear();
  let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
  let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
  return `${year}-${month}-${day}`;
};

export default function DangKyPoint() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [row, setRow] = useState([
    {
      hoatDongID: "",
      title: "",
      date: dateFormat(new Date()),
      description: "",
    },
  ]);

  const [errors, setErrors] = useState([
    { hoatDongID: "", title: "", date: "", description: "" },
  ]);

  const [loaiSuKien, setLoaiSuKien] = useState([]);

  const btnXoa = (index) => {
    if (row.length > 1) {
      const a = [...row];
      const error = [...errors];
      a.splice(index, 1);
      error.splice(index, 1);
      setRow(a);
      setErrors(error);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Còn gì nữa đâu mà xóa !!!",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        })
      );
    }
  };

  const btnThem = () => {
    const a = deepClone(row);
    const error = deepClone(errors);
    a.push(a[a.length - 1]);
    error.push(error[error.length - 1]);
    setRow(a);
    setErrors(error);
  };

  const handleChangeTitle = (e, index) => {
    const a = deepClone(row);
    const error = deepClone(errors);
    a[index].title = e.target.value;
    if (a[index].title === "") {
      error[index].title = "Error";
    } else {
      error[index].title = "";
    }
    setRow(a);
    setErrors(error);
  };

  const handleChangeDate = (e, index) => {
    const a = deepClone(row);
    const error = deepClone(errors);
    a[index].date = e.target.value;
    if (a[index].date === "") {
      error[index].date = "Error";
    } else {
      error[index].date = "";
    }
    setRow(a);
    setErrors(error);
  };

  const handleChangeType = (e, index) => {
    const a = deepClone(row);
    const error = deepClone(errors);
    a[index].hoatDongID = e.target.value;
    if (a[index].hoatDongID === "") {
      error[index].hoatDongID = "Error";
    } else {
      error[index].hoatDongID = "";
    }
    setRow(a);
    setErrors(error);
  };

  const handleChangeDescription = (e, index) => {
    const a = deepClone(row);
    const error = deepClone(errors);
    a[index].description = e.target.value;
    if (a[index].description === "") {
      error[index].description = "Error";
    } else {
      error[index].description = "";
    }
    setRow(a);
    setErrors(error);
  };

  const handleSubmit = async (e) => {
    const error = deepClone(errors);
    var bool = false;
    for (var i in row) {
      if (row[i].hoatDongID === "") {
        bool = true;
        error[i].hoatDongID = "Error";
      }
      if (row[i].title === "") {
        bool = true;
        error[i].title = "Error";
      }
      if (row[i].date === "" || new Date(row[i].date) > new Date()) {
        bool = true;
        error[i].date = "Error";
      }
      if (row[i].description === "") {
        bool = true;
        error[i].description = "Error";
      }
    }
    setErrors(error);
    if (bool) {
      dispatch(
        Actions.showMessage({
          message: "Do not leave any fields blank!",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        })
      );
      return;
    } else {
      const data = {
        userName: localStorage.getItem("username"),
        userEmail: localStorage.getItem("email"),
        name: localStorage.getItem("name"),
        learningPoints: 0,
        basedPoints: 0,
        danhSach: row,
      };
      createBangDiemCaNhan(data).then((res) => {
        if (!res) {
          history.push("/500InternalError");
        } else if (res.status === 400) {
          dispatch(
            Actions.showMessage({
              message: "Registration of points failed!",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
              variant: "error",
            })
          );
        } else if (res.status === 201) {
          dispatch(
            Actions.showMessage({
              message: "Registration of points successfully!",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
              variant: "success",
            })
          );
          history.push("/learning-point");
        }
      });
    }
  };

  const showConfirmDialog = () => {
    dispatch(
      Actions.openDialog({
        children: (
          <Dialog fullWidth={true} maxWidth="sm" open={true}>
            <Grid container>
              <Grid item>
                <DialogTitle id="alert-dialog-title">
                  Dữ liệu bạn nhập vào đã đúng chưa?
                </DialogTitle>
              </Grid>
            </Grid>
            <DialogContent>
              <Grid container spacing={1}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>
                        Xin hãy kiểm tra lại thông tin của bạn, admin có quyền
                        từ chối điểm của bạn nếu thông tin sai hoặc không hợp lệ
                      </strong>
                    </Typography>
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
                onClick={() => {
                  handleSubmit();
                  dispatch(Actions.closeDialog());
                }}
                color="secondary"
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        ),
      })
    );
  };

  useEffect(() => {
    getHoatDongCaNhan().then((res) => {
      if (!res) {
        history.push("/500InternalError");
      } else if (res.status === 200) {
        setLoaiSuKien(res.data);
      }
    });
  }, []);

  return (
    <Grid container>
      <Grid container style={{ padding: "10px", paddingBottom: "50px" }}>
        <Paper style={{ width: "100vw" }}>
          <Grid container justify="center">
            <Typography className="danhsach">
              Thêm điểm học tập cá nhân
            </Typography>
          </Grid>
          <Grid container>
            <form>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={"10px"}>No.</TableCell>
                    <TableCell width={"150px"}>Tên sự kiện</TableCell>
                    <TableCell width={"140px"}>Thời điểm diễn ra</TableCell>
                    <TableCell width={"200px"}>Loại sự kiện</TableCell>
                    <TableCell width={"300px"}>Mô tả</TableCell>
                    <TableCell width={"30px"}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.map((rows, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          label="Tên sự kiện"
                          type="text"
                          name="title"
                          variant="outlined"
                          error={errors[index].title === "" ? false : true}
                          required
                          fullWidth
                          value={rows.title}
                          className={classes.textField}
                          onChange={(e) => handleChangeTitle(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          id="date"
                          label="Date"
                          type="date"
                          name="date"
                          variant="outlined"
                          error={errors[index].date === "" ? false : true}
                          required
                          fullWidth
                          value={rows.date}
                          className={classes.textField}
                          onChange={(e) => handleChangeDate(e, index)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          id="outlined-select-currency-native"
                          select
                          label="Loại sự kiện"
                          name="type"
                          error={errors[index].hoatDongID === "" ? false : true}
                          required
                          fullWidth
                          value={rows.type}
                          onChange={(e) => handleChangeType(e, index)}
                          SelectProps={{
                            native: true,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        >
                          <option value="" style={{ fontSize: "13px" }}>
                            Select a type
                          </option>
                          {loaiSuKien.map((option, i) => (
                            <option
                              key={i}
                              value={option._id}
                              style={{ fontSize: "13px" }}
                            >
                              {option.loaiHoatDong} - {option.moTaHoatDong}
                            </option>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Mô tả"
                          multiline
                          autoFocus
                          rows="2"
                          variant="outlined"
                          error={
                            errors[index].description === "" ? false : true
                          }
                          required
                          fullWidth
                          value={rows.description}
                          onChange={(e) => handleChangeDescription(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => btnXoa(index)}>
                          <IndeterminateCheckBoxIcon fontSize={"small"} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan="2">
                      <Button
                        variant="contained"
                        size="medium"
                        style={{ textTransform: "capitalize" }}
                        onClick={showConfirmDialog}
                      >
                        Đăng ký
                      </Button>
                    </TableCell>
                    <TableCell colSpan="4" align="right">
                      <Button
                        variant="contained"
                        size="small"
                        style={{ textTransform: "capitalize" }}
                        onClick={btnThem}
                      >
                        <Icon>add_circle</Icon>
                        &nbsp; Thêm Hàng
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </form>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
