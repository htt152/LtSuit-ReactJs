import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Avatar, Grid, Typography, Button } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import getListTeam from "app/axios/user/getListTeam";
import getTotalTeams from "app/axios/user/getTotalTeams";
import history from "@history";
import { CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const columns = [
  {
    id: "avatar",
    label: "Avatar",
  },
  {
    id: "teamName",
    label: "Tên nhóm",
  },
  {
    id: "skill",
    label: "Phân loại",
  },
  {
    id: "info",
    label: "Giới thiệu",
  },
  {
    id: "members",
    label: "Thành viên",
  },
  {
    id: "status",
    label: "Trạng thái",
  },
  {
    id: "button",
    label: "",
  },
];

const OffButton = withStyles((theme) => ({
  root: {
    color: "#cb343d",
    backgroundColor: "#fff1f1",
    "&:hover": {
      backgroundColor: "#fff1f1",
    },
    "&:disabled": {
      color: "#cb343d",
      borderColor: "#ebaaa4",
      backgroundColor: "#fff1f1",
    },
    borderColor: "#ebaaa4",
  },
}))(Button);

const OnButton = withStyles((theme) => ({
  root: {
    color: "#68b74c",
    backgroundColor: "#f4ffe8",
    "&:hover": {
      backgroundColor: "#f4ffe8",
    },
    "&:disabled": {
      color: "#68b74c",
      borderColor: "#BCE5A1",
      backgroundColor: "#f4ffe8",
    },
    borderColor: "#BCE5A1",
  },
}))(Button);

function createData(teamObject) {
  return {
    id: teamObject.teamID,
    avatar: teamObject.teamAvatar,
    email: teamObject.teamEmail,
    name: teamObject.teamName,
    phanLoai: teamObject.phanLoai,
    gioiThieu: teamObject.gioiThieu,
    thanhVien: teamObject.thanhVien,
    trangThai: teamObject.trangThai,
  };
}

export default function ListTeam() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState("");
  const [total, setTotal] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSubmit = (e, index) => {
    e.preventDefault();
    localStorage.setItem("_id", rowsData[index].id);
    history.push(`/profile/${rowsData[index].id}`);
  };

  const handleSearchChange = (event) => {
    setSearchState(event.target.value);
  };

  // Check data
  const check = (element) => {
    if (!element || element.replace(/ /g, "").length === 0) {
      return (
        <Typography className="thong-tin-error">Chưa cập nhật...</Typography>
      );
    }
    return <Typography>{element}</Typography>;
  };

  const team = (element) => {
    if (!element || element.length === 0) {
      return (
        <Typography className="thong-tin-error">Chưa cập nhật...</Typography>
      );
    } else {
      return element.length;
    }
  };

  const status = (element) => {
    if (element != null) {
      return (
        <OffButton
          disabled
          size="small"
          disableRipple={true}
          variant="outlined"
        >
          Off
        </OffButton>
      );
    } else {
      return (
        <OnButton disabled size="small" disableRipple={true} variant="outlined">
          ON
        </OnButton>
      );
    }
  };

  // Get Data
  useEffect(() => {
    const returnRowsData = async () => {
      let retunArray = [];
      let res;
      if (searchState.length > 0) {
        res = await getListTeam({
          searchString: searchState,
          rows: rowsPerPage,
          page: 1,
        });
        let totalTeams = await getTotalTeams({ searchString: searchState });
        setTotal(totalTeams);
        setPage(0);
      } else {
        res = await getListTeam({ rows: rowsPerPage, page: page + 1 });
      }
      if (!res) {
        return history.push("/500InternalError");
      }
      let response = res.returnArray;
      for (var i = 0; i < response.length; i++) {
        retunArray.push(
          createData({
            teamID: response[i].teamID,
            teamAvatar: "",
            teamName: response[i].teamName,
            teamEmail: response[i].teamEmail,
            phanLoai: response[i].loaiTeam,
            gioiThieu: response[i].gioiThieu,
            thanhVien: response[i].teamMembers,
            trangThai: response[i].deletedAt,
          })
        );
      }
      setRowsData(retunArray);
      setLoading(false);
    };
    returnRowsData();
  }, [searchState]);

  useEffect(() => {
    const returnRowsData = async () => {
      let totalTeams = await getTotalTeams();
      setTotal(totalTeams);
      let retunArray = [];
      let res = await getListTeam({ rows: rowsPerPage, page: page + 1 });
      if (!res) {
        return history.push("/500InternalError");
      }
      let response = res.returnArray;
      for (var i = 0; i < response.length; i++) {
        retunArray.push(
          createData({
            teamID: response[i].teamID,
            teamAvatar: "",
            teamName: response[i].teamName,
            teamEmail: response[i].teamEmail,
            phanLoai: response[i].loaiTeam,
            gioiThieu: response[i].gioiThieu,
            thanhVien: response[i].teamMembers,
            trangThai: response[i].deletedAt,
          })
        );
      }
      setRowsData(retunArray);
      setLoading(false);
    };
    returnRowsData();
  }, []);

  useEffect(() => {
    const returnRowsData = async () => {
      let retunArray = [];
      let response;
      let res;
      if (searchState.length > 0) {
        res = await getListTeam({
          searchString: searchState,
          rows: rowsPerPage,
          page: page + 1,
        });
        let totalTeams = await getTotalTeams({ searchString: searchState });
        setTotal(totalTeams);
      } else {
        res = await getListTeam({ rows: rowsPerPage, page: page + 1 });
      }
      if (!res) {
        return history.push("/500InternalError");
      }
      response = res.returnArray;
      for (var i = 0; i < response.length; i++) {
        retunArray.push(
          createData({
            teamID: response[i].teamID,
            teamAvatar: "",
            teamName: response[i].teamName,
            teamEmail: response[i].teamEmail,
            phanLoai: response[i].loaiTeam,
            gioiThieu: response[i].gioiThieu,
            thanhVien: response[i].teamMembers,
            trangThai: response[i].deletedAt,
          })
        );
      }
      setRowsData(retunArray);
      setLoading(false);
    };
    returnRowsData();
  }, [page, rowsPerPage]);

  return loading ? (
    <Grid container spacing={3} style={{ marginTop: "30px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <div>
      <Grid container className="container-tv">
        <Grid item xs={3} sm={2}>
          <Typography variant="h5" className="tvien-title">
            Nhóm làm việc
          </Typography>
        </Grid>

        <Grid item xs={3} sm={3}>
          <Paper className="search-tv">
            <IconButton aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Tìm theo tên"
              inputProps={{ "aria-label": "Search" }}
              style={{ justifyContent: "right" }}
              onChange={handleSearchChange}
            />
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={5}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData.map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>
                    <Avatar
                      alt="Avatar"
                      src="/static/images/avatar/2.jpg"
                    ></Avatar>
                  </TableCell>
                  <TableCell>{check(row.name)}</TableCell>
                  <TableCell>{check(row.phanLoai)}</TableCell>
                  <TableCell>{check(row.gioiThieu)}</TableCell>
                  <TableCell width="120px">{team(row.thanhVien)}</TableCell>
                  <TableCell>{status(row.trangThai)}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={(e) =>
                        handleSubmit(e, page * rowsPerPage + index)
                      }
                    >
                      <AccountBoxIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
