import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SplitString from "app/utilities/SplitString";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  root: {
    "& > span": {
      margin: theme.spacing(2)
    }
  }
}));

const dateFormat = d => {
  let date = new Date(d);
  let year = date.getFullYear();
  let month = (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1);
  let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
  return `${day}-${month}-${year}`;
};

export default function ThongTinChiTiet(props) {
  const classes = useStyles();
  const [data, setData] = useState(props.data);

  const check = element => {
    if (!element || element.replace(/ /g, "").length === 0) {
      return (
        <Typography className="thong-tin-error">Chưa cập nhật...</Typography>
      );
    }
    return <Typography>{element}</Typography>;
  };

  const role = element => {
    if (element === 1) {
      return (
        <Button
          variant="contained"
          color="inherit"
          style={{
            textTransform: "capitalize",
            backgroundColor: "#FF3333",
            color: "white"
          }}
        >
          Admin
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ textTransform: "capitalize" }}
        >
          User
        </Button>
      );
    }
  };

  const team = element => {
    const teamName = [];
    if (!element || element.length === 0) {
      return (
        <Typography>
          Bạn chưa được thêm vào Team nào, vui lòng liên hệ quản trị viên để đảm
          bảo quyền lợi và nghĩa vụ của bạn!
        </Typography>
      );
    } else {
      for (let i = 0; i < element.length; i++) {
        teamName.push(element[i].teamName);
      }
      return teamName.join(',');
    }
  };

  return (
    <Grid container justify="space-evenly">
      <Grid item xs={12} sm={7} className="grid-thong-tin-style1">
        <Paper elevation = {5} >
          <Grid
            className="thongTinStyle"
            style={{ backgroundColor: "#0099FF" }}
          >
            <Typography className="typographyStyle1">
              Thông Tin Cơ Bản
            </Typography>
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Tên đầy đủ</Typography>
            {check(SplitString(data.name,80))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Giới tính</Typography>
            {check(SplitString(data.gioiTinh,80))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Ngày sinh</Typography>
            {check(dateFormat(data.ngaySinh))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Giới thiệu</Typography>
            {check(SplitString(data.gioiThieu,80))}
          </Grid>
        </Paper>
        <Paper style={{ marginTop: "20px" }} elevation = {5}>
          <Grid
            className="thongTinStyle"
            style={{ backgroundColor: "#0099FF" }}
          >
            <Typography className="typographyStyle1">Liên hệ</Typography>
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Địa chỉ</Typography>
            {check(SplitString(data.diaChi,80))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Số điện thoại</Typography>
            {check(SplitString(data.phone,80))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Email</Typography>
            {check(SplitString(data.email,80))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} className="grid-thong-tin-style">
        <Paper elevation = {5}>
          <Grid
            className="thongTinStyle"
            style={{ backgroundColor: "#0099FF" }}
          >
            <Typography className="typographyStyle1">Công Việc</Typography>
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Phân loại</Typography>
            {check(SplitString(data.phanLoai,40))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Nghiệp vụ</Typography>
            {check(SplitString(data.nghiepVu,40))}
          </Grid>
          <Grid className="thongTinStyle">
            <Typography className="typographyStyle">Kỹ năng</Typography>
            {check(SplitString(data.kyNang,40))}
          </Grid>
        </Paper>
        <Paper style={{ marginTop: "20px" }} elevation = {5}>
          <Grid
            className="thongTinStyle"
            style={{ backgroundColor: "#0099FF" }}
          >
            <Typography className="typographyStyle1">Team tham gia</Typography>
          </Grid>
          <Grid className="thongTinStyle">{team(data.teams)}</Grid>
        </Paper>
        <Paper style={{ marginTop: "20px" }} elevation = {5}>
          <Grid
            className="thongTinStyle"
            style={{ backgroundColor: "#0099FF" }}
          >
            <Typography className="typographyStyle1">Vai trò</Typography>
          </Grid>
          <Grid className="thongTinStyle">{role(data.role)}</Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
