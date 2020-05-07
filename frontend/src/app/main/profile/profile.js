import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TextField,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import history from "@history";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import ThongTinChiTiet from "app/main/profile/thongTinChiTiet/thongTinChiTiet";
import NghiPhep from "app/main/profile/nghiPhep/nghiPhep";
import DiemHocTap from "app/main/profile/diemHocTap/diemHocTap";
import findUserById from "../../axios/user/findUserById";
import { CircularProgress } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
// import changeAvatar from '../../axios/user/changeAvatar'
// import axios from 'axios'

import suaThongTin from "app/axios/user/suaThongTin";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: "100%",
  }
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

export default function FullWidthTabs() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState([]);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorName, setErrorName] = useState(false);
  // const [avatar, setAvatar] = useState([])
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const showAlertMessage = (alertMessage, type) => {
    dispatch(
      Actions.showMessage({
        message: alertMessage,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: type,
      })
    );
  };

  const returnData = () => {
    const email = localStorage.getItem('email')
    if(!email){
      history.push("/500InternalError");
    }
    let path = window.location.pathname.split("/");
    setLoading(true);
    let id = path[2];
    if (!id) {
      id = localStorage.getItem("id");
    }
    if (!id) {
      history.push("/500InternalError");
    }
    findUserById({ id })
      .then((res) => {
        if (!res || res.status >= 400) {
          history.push("/500InternalError");
        } else if (res.status === 400) {
          showAlertMessage(res.error, "error");
        } else if (res.status === 200) {
          setData(res.data);
          setEditData(res.data);
        }
      })
      .catch((res) => {
        showAlertMessage(res.error, "error");
      });
    setLoading(false);
  }

  useEffect(() => {
    returnData()
  }, [localStorage.getItem("_id")]);

  useEffect(() => {
    setError(true);
  }, [data]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChangeData = (e) => {
    setEditData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeName = (e) => {
    const a = deepClone(editData);
    a.name = e.target.value;
    if (a.name === "" || a.name.length > 32) {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
    setEditData(a);
  };

  const handleChangeEmail = (e) => {
    const a = deepClone(editData);
    a.email = e.target.value;
    const filter = /^[a-z][a-z0-9_\.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
    if (a.email === "" || filter.test(a.email) === false) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    setEditData(a);
  };

  const handleChangePassword = e => {
    const pass = e.target.value
    if((pass.length < 6 && pass.length > 0) || pass.length > 32){
      setPasswordError(true)
    }else{
      setPasswordError(false)
    }
    setPassword(pass)
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    if (errorEmail || errorName || passwordError) {
      showAlertMessage("Sửa thông tin không thành công!", "error")
    }else{
      let res = await suaThongTin({ editData, password });
        if (!res) {
          history.push("/500InternalError");
        } else if (res.status === 400) {
          showAlertMessage("Sửa thông tin không thành công!", "error");
        } else {
          setShowEditDialog(false);
          showAlertMessage("Sửa thông tin thành công!", "success");
          // const email = localStorage.getItem('email')
          // const formData = new FormData();
          // formData.append('avatar', avatar);
          // formData.append('email', email);
          // const config = {
          //     headers: {
          //         'content-type': 'multipart/form-data'
          //     }
          // };
          // const url = "http://localhost:4000"
          // // const url = "https://hubcode-api.nal.vn"
          // let filePaths
          // await axios.post(`${url}/users/avatar`,formData,config)
          //   .then((res) => {
          //       let filePath = res.data.fileNameInServer
          //       if (filePath) {
          //           filePath = filePath.split('\\')[1]
          //       }
          //       filePaths = filePath
          //       setData((data) => ({
          //         ...data,
          //         avatar: `${url}/avatar/${filePath}`
          //       }))
          //   })
          // await changeAvatar({email,avatar: `${url}/avatar/${filePaths}`})
          returnData()
        }
    }
  };

  const showDialogEdit = (
    <Dialog fullWidth={true} maxWidth="sm" open={true}>
      <form encType="multipart/form-data" >
      <Grid container>
        <Grid item>
          <DialogTitle id="fix-dialog-title">Sửa Thông Tin</DialogTitle>
        </Grid>
      </Grid>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} sm={12} className="grid-thong-tin-style1">
            <Paper>
              <Grid
                className="thongTinStyle"
                style={{ backgroundColor: "#0099FF" }}
              >
                <Typography className="typographyStyle1">
                  Thông Tin Cơ Bản
                </Typography>
              </Grid>
              {/* <Grid className="thongTinStyle">                
                <Typography className="typographyStyle">Avatar</Typography>
                <TextField
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  name="avatar"
                  type="file"
                  onChange={(e) => {
                    e.preventDefault();
                    setAvatar(e.target.files[0])
                }}
                />
              </Grid> */}
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Mật Khẩu mới</Typography>
                <TextField
                  type="password"
                  name="password"
                  error={passwordError === true ? true : false}
                  fullWidth
                  value={password || ""}
                  className={classes.textField}
                  onChange={handleChangePassword}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Tên đầy đủ</Typography>
                <TextField
                  type="text"
                  name="name"
                  error={errorName === true ? true : false}
                  required
                  fullWidth
                  value={editData.name || ""}
                  className={classes.textField}
                  onChange={handleChangeName}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Giới tính</Typography>
                <TextField
                  id="outlined-select-currency-native"
                  select
                  name="gioiTinh"
                  fullWidth
                  value={editData.gioiTinh || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </TextField>
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Ngày sinh</Typography>
                <TextField
                  id="date"
                  type="date"
                  name="ngaySinh"
                  fullWidth
                  value={editData.ngaySinh || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Giới thiệu</Typography>
                <TextField
                  type="text"
                  name="gioiThieu"
                  fullWidth
                  value={editData.gioiThieu || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
            </Paper>
            <Paper style={{ marginTop: "20px" }}>
              <Grid
                className="thongTinStyle"
                style={{ backgroundColor: "#0099FF" }}
              >
                <Typography className="typographyStyle1">Liên hệ</Typography>
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Địa chỉ</Typography>
                <TextField
                  type="text"
                  name="diaChi"
                  fullWidth
                  value={editData.diaChi || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">
                  Số điện thoại
                </Typography>
                <TextField
                  type="number"
                  name="phone"
                  fullWidth
                  value={editData.phone || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Email</Typography>
                <TextField
                  type="text"
                  name="email"
                  error={errorEmail === true ? true : false}
                  required
                  fullWidth
                  value={editData.email || ""}
                  className={classes.textField}
                  onChange={handleChangeEmail}
                />
              </Grid>
            </Paper>
            <Paper style={{ marginTop: "20px" }}>
              <Grid
                className="thongTinStyle"
                style={{ backgroundColor: "#0099FF" }}
              >
                <Typography className="typographyStyle1">Công Việc</Typography>
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Phân loại</Typography>
                <TextField
                  type="text"
                  name="phanLoai"
                  fullWidth
                  value={editData.phanLoai || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Nghiệp vụ</Typography>
                <TextField
                  type="text"
                  name="nghiepVu"
                  fullWidth
                  value={editData.nghiepVu || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
              <Grid className="thongTinStyle">
                <Typography className="typographyStyle">Kỹ năng</Typography>
                <TextField
                  type="text"
                  name="kyNang"
                  required
                  fullWidth
                  value={editData.kyNang || ""}
                  className={classes.textField}
                  onChange={handleChangeData}
                />
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setShowEditDialog(false);
          }}
          color="secondary"
        >
          Thôi không sửa nữa
        </Button>
        <Button
          color="secondary"
          type="submit"
          onClick={handleEdit}
        >
          Sửa thông tin
        </Button>
      </DialogActions>
      </form>
    </Dialog>
  );

  return loading ? (
    <Grid container spacing={3} style={{ marginTop: "30px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <div className={classes.root}>
      {showEditDialog === false ? null : showDialogEdit}
      <Grid container className="headerStyle">
        <Grid item xs={12} sm={9}>
          <Grid item xs={12} sm={3}>
            {(!data.avatar || data.avatar === "") ?
            <img
              alt="user"
              src="assets/images/avatars/Velazquez.jpg"
              className="img-profile"
            /> :
            <img
              alt="user"
              src={data.avatar}
              className="img-profile"
            />
          }
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography className="content">{data.name}</Typography>
          </Grid>
        </Grid>
        {data._id !== localStorage.getItem("id") ? null : (
          <Grid item xs={12} sm={3} className="edit-thong-tin-style">
            <Button
              variant="contained"
              size="small"
              style={{ textTransform: "capitalize" }}
              color="secondary"
              onClick={() => setShowEditDialog(true)}
            >
               <EditIcon fontSize="inherit"/>

              Sửa Thông Tin 
             
            </Button>
          </Grid>
        )}
      </Grid>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Thông Tin Chi Tiết" {...a11yProps(0)} />
          <Tab label="Nghỉ Phép" {...a11yProps(1)} />
          <Tab label="Điểm học tập" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <ThongTinChiTiet data={data} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <NghiPhep email={data.email} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <DiemHocTap email={data.email} />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
