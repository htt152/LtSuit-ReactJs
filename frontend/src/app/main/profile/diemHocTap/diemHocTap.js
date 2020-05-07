import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import clsx from "clsx";
import { lighten } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import getBangDiemCaNhan from "app/axios/bangDiem/getBangDiemCaNhan";
import history from "@history";
import SplitString from "app/utilities/SplitString";
import { CircularProgress } from "@material-ui/core";
import {
  IsSameOrBetweenDate,
  isSameOrAfter
} from "app/utilities/IsBetweenDate";
let moment = require("moment");

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
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: "100%",
    maxHeight: "100%"
  }
}));

const year = () => {
  const date = new Date();
  return date.getFullYear();
};
const month = () => {
  const date = new Date();
  return date.getMonth();
};

export default function ConfirmPoints(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTouched(false);
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(false);
  const [dateErrorState, setDateErrorState] = useState(false);

  const [selectedDateTuNgay, setSelectedDateTuNgay] = useState(new Date());
  const [selectedDateDenNgay, setSelectedDateDenNgay] = useState(new Date());

  useEffect(() => {
    setTuNgay(dateFormat(new Date(year(), month(), 1)));
    setSelectedDateTuNgay(new Date(year(), month(), 1));
    setDenNgay(dateFormat(new Date(year(), month() + 1, 0)));
    setSelectedDateDenNgay(new Date(year(), month() + 1, 0));
    const startDate = new Date(year(), month(), 1);
    const endDate = new Date(year(), month() + 1, 0);
    returnRowsData(startDate, endDate);
    setLoading(false);
  }, []);

  useEffect(() => {
    setTouched(false);
  }, [tuNgay]);

  useEffect(() => {
    setTouched(false);
    setError(false);
  }, [error]);

  const onSubmit = () => {
    setTouched(true);
  };

  const Cancel = () => {
    setError(true);
    setTouched(false);
  };

  const handleDateChangeTuNgay = date => {
    setSelectedDateTuNgay(date);
  };
  const handleDateChangeDenNgay = date => {
    setSelectedDateDenNgay(date);
  };

  useEffect(() => {
    let startDate = moment(selectedDateTuNgay).format("DD/MM/YYYY");
    let endDate = moment(selectedDateDenNgay).format("DD/MM/YYYY");
    if (isSameOrAfter(startDate, endDate)) {
      setDateErrorState(false);
    } else {
      setDateErrorState(true);
    }
  }, [selectedDateTuNgay, selectedDateDenNgay]);

  const onSubmitRange = () => {
    if (isSameOrAfter(tuNgay, denNgay)) {
      setDateErrorState(false);
      setTuNgay(dateFormat(new Date(selectedDateTuNgay)));
      setDenNgay(dateFormat(new Date(selectedDateDenNgay)));
      returnDisplayData();
    } else {
      setDateErrorState(true);
    }
  };

  const dateError = !dateErrorState ? null : (
    <Typography variant="body1" color="error">
      Ngày không hợp lệ
    </Typography>
  );

  const dateFormat = d => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
    let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
    return `${day}/${month}/${year}`;
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const headCells = [
    {
      id: "no",
      numeric: true,
      disablePadding: true,
      label: "No"
    },
    {
      id: "user",
      numeric: false,
      disablePadding: true,
      label: "User"
    },
    { id: "title", numeric: true, disablePadding: false, label: "Title" },
    { id: "type", numeric: true, disablePadding: false, label: "Type" },
    {
      id: "description",
      numeric: true,
      disablePadding: false,
      label: "Description"
    },
    {
      id: "date",
      numeric: true,
      disablePadding: false,
      label: "Date"
    },
    {
      id: "status",
      numeric: true,
      disablePadding: false,
      label: "Status"
    },
    {
      id: "point",
      numeric: true,
      disablePadding: false,
      label: "Point"
    }
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ textAlign: "center" }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  function EnhancedTableHead2(props) {
    return (
      <TableHead>
        <TableRow>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ textAlign: "center" }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead2.propTypes = {
    classes: PropTypes.object.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  function EnhancedTableHead3(props) {
    return (
      <TableHead>
        <TableRow>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ textAlign: "center" }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead3.propTypes = {
    classes: PropTypes.object.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    }
  }));

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Điểm học tập
          </Typography>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const EnhancedTableToolbar2 = props => {
    const classes = useToolbarStyles();

    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Điểm học tập
        </Typography>
      </Toolbar>
    );
  };

  EnhancedTableToolbar2.propTypes = {
    numSelected2: PropTypes.number.isRequired
  };

  const EnhancedTableToolbar3 = props => {
    const classes = useToolbarStyles();

    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Điểm học tập
        </Typography>
      </Toolbar>
    );
  };

  EnhancedTableToolbar3.propTypes = {
    numSelected3: PropTypes.number.isRequired
  };

  const [selected] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [selected2] = React.useState([]);
  const [selected3] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [rows2, setRows2] = React.useState([]);
  const [rows3, setRows3] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(1);
  const [changeState, setChangeState] = useState(false);

  function createData(
    id,
    no,
    user,
    email,
    title,
    type,
    description,
    date,
    status,
    point
  ) {
    return {
      id,
      no,
      user,
      email,
      title,
      type,
      description,
      date,
      status,
      point
    };
  }

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

  const returnRowsData = async (startDate, endDate) => {
    let response = await getBangDiemCaNhan({ email: props.email });
    if (!response || response.status >= 400) {
      return history.push("/500InternalError");
    }
    await setAllData(response.data);
    returnDisplayData(response.data, startDate, endDate);
  };

  const returnDisplayData = (a, d1, d2) => {
    let pending = [];
    let approved = [];
    let denied = [];
    let data = a;
    let startDate = d1;
    let endDate = d2;
    if (!data) {
      data = allData;
    }
    if (!startDate || !endDate) {
      startDate = moment(selectedDateTuNgay).format("DD/MM/YYYY");
      endDate = moment(selectedDateDenNgay).format("DD/MM/YYYY");
    } else {
      startDate = moment(d1).format("DD/MM/YYYY");
      endDate = moment(d2).format("DD/MM/YYYY");
    }
    const pendingData = data.pending;
    const approvedData = data.approve;
    const deniedData = data.denied;
    for (let i = 0; i < pendingData.length; i++) {
      const descriptionSplit = SplitString(pendingData[i].description, 20);
      const titleSplit = SplitString(pendingData[i].title, 20);
      if (
        IsSameOrBetweenDate(startDate, endDate, dateFormat(pendingData[i].date))
      ) {
        pending.push(
          createData(
            pendingData[i].id,
            i + 1,
            pendingData[i].userName,
            pendingData[i].email,
            titleSplit,
            pendingData[i].type,
            descriptionSplit,
            dateFormat(pendingData[i].date),
            pendingData[i].status,
            pendingData[i].point
          )
        );
      }
    }
    setRows(pending);

    for (let i = 0; i < approvedData.length; i++) {
      const descriptionSplit = SplitString(approvedData[i].description, 20);
      const titleSplit = SplitString(approvedData[i].title, 20);
      if (
        IsSameOrBetweenDate(
          startDate,
          endDate,
          dateFormat(approvedData[i].date)
        )
      ) {
        approved.push(
          createData(
            approvedData[i].id,
            i + 1,
            approvedData[i].userName,
            approvedData[i].email,
            titleSplit,
            approvedData[i].type,
            descriptionSplit,
            dateFormat(approvedData[i].date),
            approvedData[i].status,
            approvedData[i].point
          )
        );
      }
    }
    setRows2(approved);

    for (let i = 0; i < deniedData.length; i++) {
      const descriptionSplit = SplitString(deniedData[i].description, 20);
      const titleSplit = SplitString(deniedData[i].title, 20);
      if (
        IsSameOrBetweenDate(startDate, endDate, dateFormat(deniedData[i].date))
      ) {
        denied.push(
          createData(
            deniedData[i].id,
            i + 1,
            deniedData[i].userName,
            deniedData[i].email,
            titleSplit,
            deniedData[i].type,
            descriptionSplit,
            dateFormat(deniedData[i].date),
            deniedData[i].status,
            deniedData[i].point
          )
        );
      }
    }
    setRows3(denied);
  };

  const dispatch = useDispatch();

  // Reload state khi rows thay đổi
  useEffect(() => {
    setChangeState(true);
  }, [rows]);

  const deepClone = o => {
    const output = Array.isArray(o) ? [] : {};
    for (let i in o) {
      const value = o[i];
      output[i] =
        value !== null && typeof value === "object" ? deepClone(value) : value;
    }
    return output;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const changeDate =
    touched === false ? null : (
      <div className="dropdown-content">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ul>
            <li>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
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
    );

  let pendingForm = (
    <TabPanel value={value} index={0} dir={theme.direction}>
      <Grid container>
        <Grid container style={{ padding: "10px" }}>
          <Grid container spacing={1} className="gridStyle">
            <Paper style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={12} sm={12} className={"grid1"}>
                  <Grid container>
                    <Grid item xs={2} sm={9}>
                      <Typography className="danhsach">
                        Danh Sách Điểm Học Tập: {tuNgay} => {denNgay}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={3}>
                      <form>
                        <div className="dropdown">
                          <Button
                            variant="contained"
                            size="small"
                            style={{ textTransform: "capitalize" }}
                            onClick={onSubmit}
                          >
                            <CalendarTodayIcon />
                            &nbsp;
                            {tuNgay} &nbsp; <TrendingFlatIcon /> &nbsp;{" "}
                            {denNgay} <ArrowDropDownIcon />
                          </Button>
                          {changeDate}
                        </div>
                      </form>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.root}>
                <Paper className={classes.paper} style={{ padding: "15px" }}>
                  <EnhancedTableToolbar numSelected={selected.length} />
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead2
                      classes={classes}
                      numSelected={selected.length}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {stableSort(rows, getComparator())
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.no}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.user}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.title}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.type}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.description}
                              </TableCell>
                              <TableCell align="center">{row.date}</TableCell>
                              <TableCell align="right">
                                {getStatusButton(row.status)}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "center" }}
                              >
                                {row.point}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </TabPanel>
  );

  let approvedForm = (
    <TabPanel value={value} index={1} dir={theme.direction}>
      <Grid container>
        <Grid container style={{ padding: "10px" }}>
          <Grid container spacing={1} className="gridStyle">
            <Paper style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={12} sm={12} className={"grid1"}>
                  <Grid container>
                    <Grid item xs={2} sm={9}>
                      <Typography className="danhsach">
                        Danh Sách Điểm Học Tập: {tuNgay} => {denNgay}
                      </Typography>
                    </Grid>

                    <Grid item xs={2} sm={3}>
                      <form>
                        <div className="dropdown">
                          <Button
                            variant="contained"
                            size="small"
                            style={{ textTransform: "capitalize" }}
                            onClick={onSubmit}
                          >
                            <CalendarTodayIcon />
                            &nbsp;
                            {tuNgay} &nbsp; <TrendingFlatIcon /> &nbsp;{" "}
                            {denNgay} <ArrowDropDownIcon />
                          </Button>
                          {changeDate}
                        </div>
                      </form>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.root}>
                <Paper className={classes.paper} style={{ padding: "15px" }}>
                  <EnhancedTableToolbar2 numSelected2={selected2.length} />
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead2
                      classes={classes}
                      numSelected2={selected2.length}
                      rowCount={rows2.length}
                    />
                    <TableBody>
                      {stableSort(rows2, getComparator())
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.no}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.user}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.title}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.type}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.description}
                              </TableCell>
                              <TableCell align="center">{row.date}</TableCell>
                              <TableCell align="right">
                                {getStatusButton(row.status)}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "center" }}
                              >
                                {row.point}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows2.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </TabPanel>
  );

  let deniedForm = (
    <TabPanel value={value} index={2} dir={theme.direction}>
      <Grid container>
        <Grid container style={{ padding: "10px" }}>
          <Grid container spacing={1} className="gridStyle">
            <Paper style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={12} sm={12} className={"grid1"}>
                  <Grid container>
                    <Grid item xs={2} sm={9}>
                      <Typography className="danhsach">
                        Danh Sách Điểm Học Tập: {tuNgay} => {denNgay}
                      </Typography>
                    </Grid>

                    <Grid item xs={2} sm={3}>
                      <form>
                        <div className="dropdown">
                          <Button
                            variant="contained"
                            size="small"
                            style={{ textTransform: "capitalize" }}
                            onClick={onSubmit}
                          >
                            <CalendarTodayIcon />
                            &nbsp;
                            {tuNgay} &nbsp; <TrendingFlatIcon /> &nbsp;{" "}
                            {denNgay} <ArrowDropDownIcon />
                          </Button>
                          {changeDate}
                        </div>
                      </form>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.root}>
                <Paper className={classes.paper} style={{ padding: "15px" }}>
                  <EnhancedTableToolbar3 numSelected3={selected3.length} />
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead3
                      classes={classes}
                      numSelected3={selected3.length}
                      rowCount={rows3.length}
                    />
                    <TableBody>
                      {stableSort(rows3, getComparator())
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.no}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.user}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "start" }}
                              >
                                {row.title}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.type}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "justify" }}
                              >
                                {row.description}
                              </TableCell>
                              <TableCell align="center">{row.date}</TableCell>
                              <TableCell align="right">
                                {getStatusButton(row.status)}
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ textAlign: "center" }}
                              >
                                {row.point}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows3.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </TabPanel>
  );

  return loading ? (
    <Grid container spacing={3} style={{ marginTop: "30px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <div className={classes.root}>
      <Typography variant="h5" style={{ padding: "20px", textAlign: "center" }}>
        Điểm học tập cá nhân
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Pending" style={{ color: "#ecd305" }} {...a11yProps(0)} />
          <Tab
            label="Approved"
            style={{ color: "#05ac05" }}
            {...a11yProps(1)}
          />
          <Tab label="Denied" style={{ color: "#f42020" }} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {pendingForm}

        {approvedForm}

        {deniedForm}
      </SwipeableViews>
    </div>
  );
}
