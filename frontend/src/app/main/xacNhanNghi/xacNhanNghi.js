import React, { useEffect, useState } from "react";
import getPhepTon from "../../axios/nghiPhep/layPhepTon";
import "date-fns";
import { setResetFormAction } from "../../store/actions/fuse/nghiPhepAction.actions";
import { connect, useDispatch } from "react-redux";
import xacNhanNghiPhepAPI from "../../axios/nghiPhep/xacNhanNghiPhep";
import { Grid, Typography, Button } from "@material-ui/core";
import history from "@history";
import TinhPhepTon from "app/utilities/TinhPhepTon";
import * as Actions from "app/store/actions";
import { CircularProgress } from '@material-ui/core';
import SplitString from 'app/utilities/SplitString'

const mapStateToProps = state => {
  return {
    xacNhanNghiState: state.nghiPhepReducer
  };
};

const mapDispatchToProps = {
  setResetFormAction
};

const XacNhanNghi = xacNhanNghiState => {
  const dispatch = useDispatch();

  let xacNhanNghiData = xacNhanNghiState.xacNhanNghiState;
  const nghiTu = xacNhanNghiData.nghiTu;
  const nghiDen = xacNhanNghiData.nghiDen;
  const lyDoNghi = xacNhanNghiData.lyDoNghi;
  const mucDoAnhHuong = xacNhanNghiData.mucDoAnhHuong;
  const phuongAnKhacPhuc = xacNhanNghiData.phuongAnKhacPhuc;
  const nguoiLienQuan = xacNhanNghiData.nguoiLienQuan;
  let x = [];
  for (var i = 0; i < nguoiLienQuan.length; i++) {
    x.push(nguoiLienQuan[i].value);
  }

  const [phepTonState, setPhepTonState] = useState(0);
  const [xinNghiState, setXinNghiState] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const layPhepTon = async () => {
      setLoading(true)
      let res = await getPhepTon(localStorage.getItem("email"));
      if (!res) {
        setLoading(false)
        return history.push("/500InternalError");
      }
      if (res.status === 200) {
        setPhepTonState(res.data.phepTon);
        setLoading(false)
      }
    };

    layPhepTon()
  }, [phepTonState])

  const calculateTime = (nghiTu, nghiDen) => {
    var result = phepTonState - TinhPhepTon(nghiTu, nghiDen);
    return result;
  };

  const handleFormSubmit = async () => {
    setXinNghiState(true);
    let res = await xacNhanNghiPhepAPI({
      userEmail: localStorage.getItem("email"),
      userName: localStorage.getItem("username"),
      nghiTu,
      nghiDen,
      lyDoNghi,
      mucDoAnhHuong,
      phuongAnKhacPhuc,
      nguoiLienQuan
    });
    if (!res) {
      return history.push("/500InternalError");
    }
    if (res.status >= 400) {
      dispatch(
        Actions.showMessage({
          message: "Đăng ký nghỉ không thành công",
          autoHideDuration: 3000, //ms
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right" //left center right
          },
          variant: "error"
        })
      );
      setXinNghiState(false);
    } else {
      setXinNghiState(false);
      dispatch(setResetFormAction());
      dispatch(
        Actions.showMessage({
          message: "Đăng ký nghỉ thành công",
          autoHideDuration: 3000, //ms
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "center" //left center right
          },
          variant: "success"
        })
      );
      history.push("/nghiphep");
    }
  }
  const dateFormat = d => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
    let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
    let hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    let minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  const editForm = () => {
    history.push("/xinnghi");
  };

  return (
    <div>
      {loading ?
        <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        </Grid> :
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography className="titleConfirmNP" variant="h4">
              Xác nhận thông tin nghỉ phép
          </Typography>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Nghỉ từ</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {dateFormat(xacNhanNghiData.nghiTu.toString())}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Nghỉ đến</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {dateFormat(xacNhanNghiData.nghiDen.toString())}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Lý do nghỉ</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {SplitString( xacNhanNghiData.lyDoNghi.toString())}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Người liên quan</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">{x.toString()}</Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Mức độ ảnh hưởng</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {xacNhanNghiData.mucDoAnhHuong.toString()}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Phương án khắc phục</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {SplitString(xacNhanNghiData.phuongAnKhacPhuc.toString())}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Phép tồn trước khi nghỉ</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">{phepTonState}</Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="body1">
                <strong>Phép tồn sau khi nghỉ</strong>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1">
                {calculateTime(nghiTu, nghiDen)}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container spacing={1} justify="center" alignItems="center">
            <Grid item xs={5} sm={2}>
              <Button
                className="btnFormNp"
                variant="contained"
                color="primary"
                type="submit"
                onClick={editForm}
              >
                Sửa thông tin
            </Button>
            </Grid>
            <Grid item xs={5} sm={2}>
              <Button
                className="btnFormNp"
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleFormSubmit}
                disabled={xinNghiState}
              >
                Xõa luôn
            </Button>
            </Grid>
          </Grid>
        </Grid>}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(XacNhanNghi);
