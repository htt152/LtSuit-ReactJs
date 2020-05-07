import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import getAllUserPoint from "app/axios/bangDiem/layToanBoDanhSachDiem";
import history from "@history";
import { CircularProgress } from "@material-ui/core";
import { ExportToCsv } from "export-to-csv";

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
  { id: "no", numeric: false, disablePadding: false, label: "No." },
  { id: "userName", numeric: false, disablePadding: true, label: "Tài Khoản" },
  { id: "name", numeric: true, disablePadding: false, label: "Họ Tên" },
  {
    id: "learningPoints",
    numeric: true,
    disablePadding: false,
    label: "Learning Points"
  },
  {
    id: "basedPoints",
    numeric: true,
    disablePadding: false,
    label: "Based Points"
  }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={"left"}
            width={"100px"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function Learning() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);

  function createData(no, userName, name, learningPoints, basedPoints) {
    return { no, userName, name, learningPoints, basedPoints };
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rowsData.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const options = {
    fieldSeparator: ",",
    filename: "bangDiem",
    quoteStrings: '"',
    decimalSeparator: ".",
    useKeysAsHeaders: true
  };

  const exportCSV = () => {
    const csvExporter = new ExportToCsv(options);
    return csvExporter.generateCsv(rowsData);
  };

  useEffect(() => {
    const returnRowsData = async () => {
      let retunArray = [];
      let response = await getAllUserPoint();
      if (!response) {
        return history.push("/500InternalError");
      }
      for (var i = 0; i < response.data.length; i++) {
        retunArray.push(
          createData(
            i + 1,
            response.data[i].userName,
            response.data[i].name,
            response.data[i].learningPoint,
            response.data[i].basePoint
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
    <Grid container style={{ paddingLeft: "20px", paddingRight: "30px" }}>
      <Grid container spacing={1} justify="center" alignItems="center">
        <h1>THÔNG TIN ĐIỂM HỌC TẬP</h1>
      </Grid>
      <Grid container spacing={1} justify="center" alignItems="center">
        <p>
          Điểm học tập được ghi nhận trên website{" "}
          <a href="http://hubcode.nal.vn">hubcode.nal.vn</a>. Tính từ 15-07-2019
          đến 15-01-2020
        </p>
      </Grid>
      <Grid container justify="flex-end">
        <Grid item container justify="flex-end" xs={3} sm={5}>
          <Button
            className="btnListNp"
            variant="contained"
            size="medium"
            style={{ textTransform: "capitalize", margin: "20px" }}
          >
            <Link
              to="/learning-point"
              style={{ color: "black", textDecoration: "none" }}
            >
              Đăng ký
            </Link>
          </Button>
          <Button
            className="btnListNp"
            variant="contained"
            size="medium"
            style={{ textTransform: "capitalize", margin: "20px" }}
            onClick={exportCSV}
          >
            Export to CSV
          </Button>
        </Grid>
      </Grid>
      <Paper className={classes.paper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={"small"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rowsData.length}
          />
          <TableBody>
            {stableSort(rowsData, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.no);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.no}
                    selected={isItemSelected}
                  >
                    <TableCell id={labelId} scope="row">
                      {row.no}
                    </TableCell>
                    <TableCell align="left">{row.userName}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.learningPoints}</TableCell>
                    <TableCell align="left">{row.basedPoints}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  );
}
