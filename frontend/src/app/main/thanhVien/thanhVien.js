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
import getListThanhVien from "app/axios/user/listThanhVien";
import history from "@history";
import { CircularProgress } from "@material-ui/core";

const columns = [
  { id: "avatar", label: "Avatar" },
  { id: "email", label: "Email" },
  {
    id: "name",
    label: "Họ tên"
  },
  {
    id: "team",
    label: "Nhóm làm việc"
  },
  {
    id: "lang",
    label: "Kỹ năng"
  },
  {
    id: "permission",
    label: "Phân quyền"
  },
  {
    id: "button",
    label: ""
  }
];

function createData(id, avatar, email, name, team, lang, permission) {
  return { id, avatar, email, name, team, lang, permission };
}

export default function ThanhVien() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSubmit = (e, index) => {
    e.preventDefault();
    localStorage.setItem("_id", rowsData[index].id);
    history.push(`/profile/${rowsData[index].id}`);
  };

  const handleSearchChange = (event) =>{
    setSearchState(event.target.value);
  }

  // Check data
  const check = element => {
    if (!element || element.replace(/ /g, "").length === 0) {
      return (
        <Typography className="thong-tin-error">Chưa cập nhật...</Typography>
      );
    }
    return <Typography>{element}</Typography>;
  };

  const team = element => {
    const teamName = [];
    if (!element || element.length === 0) {
      return (
        <Typography className="thong-tin-error">Chưa cập nhật...</Typography>
      );
    } else {
      for (let i = 0; i < element.length; i++) {
        teamName.push(element[i].teamName);
      }
      return teamName.join(",");
    }
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

  // Get Data
  useEffect(() => {
    const returnRowsData = async () => {
      let retunArray = [];
      let response;
      if (searchState.length > 0){
        response = await getListThanhVien({searchString: searchState});
      }
      else{
        response = await getListThanhVien();
      }
      if (!response) {
        return history.push("/500InternalError");
      }
      for (var i = 0; i < response.length; i++) {
        retunArray.push(
          createData(
            response[i]._id,
            "",
            response[i].email,
            response[i].name,
            response[i].teams,
            response[i].lang,
            response[i].role
          )
        );
      }
      setRowsData(retunArray);
      setLoading(false);
    };
    returnRowsData();
  }, [searchState]);

  useEffect(() => {
    const returnRowsData = async () => {
      let retunArray = [];
      let response = await getListThanhVien();
      if (!response) {
        return history.push("/500InternalError");
      }
      for (var i = 0; i < response.length; i++) {
        retunArray.push(
          createData(
            response[i]._id,
            "",
            response[i].email,
            response[i].name,
            response[i].teams,
            response[i].lang,
            response[i].role
          )
        );
      }
      setRowsData(retunArray);
      setLoading(false);
    };
    returnRowsData();
  }, []);

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
            Thành Viên
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
              {columns.map(column => (
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
            {rowsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      ></Avatar>
                    </TableCell>
                    <TableCell>{check(row.email)}</TableCell>
                    <TableCell>{check(row.name)}</TableCell>
                    <TableCell>{team(row.team)}</TableCell>
                    <TableCell width="120px">{check(row.lang)}</TableCell>
                    <TableCell>{role(row.permission)}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={e =>
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
