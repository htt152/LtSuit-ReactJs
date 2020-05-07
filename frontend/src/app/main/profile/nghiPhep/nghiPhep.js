import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import getListNghiPhep from "../../../axios/nghiPhep/listNghiPhep";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import history from "@history";
import SplitString from "app/utilities/SplitString";
import { CircularProgress } from "@material-ui/core";

export default function ListNghiPhep(props) {
  const [listNghiPhep, setListNghiPhep] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const layListNghi = async () => {
      const response = await getListNghiPhep({ userEmail: props.email });
      if (!response) {
        return history.push("/500InternalError");
      }

      if (response.data.length !== 0) {
        let date = new Date(selectedDate);
        let returnDate = [];
        for (let i = 0; i < response.data.length; i++) {
          let responseDate = new Date(response.data[i].nghiTu);
          let year = responseDate.getFullYear();
          let month = responseDate.getMonth();
          if (year === date.getFullYear() && month === date.getMonth()) {
            returnDate.push(response.data[i]);
          }
        }
        setListNghiPhep(returnDate);
      }
      setLoading(false);
    };
    layListNghi();
  }, []);

  const dateFormat = (d) => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
    let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
    let hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    let minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  const listItems = listNghiPhep.map((nghiPhep, index) => (
    <ListItem key={nghiPhep._id}>
      <Card className="itemFullWidth" xs={12} justify="center">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Lần {index + 1}
          </Typography>
          <Typography variant="body2" component="p">
            Từ: {dateFormat(nghiPhep.nghiTu)}
          </Typography>
          <Typography variant="body2" component="p">
            Đến: {dateFormat(nghiPhep.nghiDen)}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Lý do nghỉ:
          </Typography>
          <Typography variant="body2" component="p">
            {SplitString(nghiPhep.lyDoNghi)}
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  ));

  const danhSachNghiPhep = <List>{listItems}</List>;

  const returnDisplay = () => {
    if (listNghiPhep.length > 0) {
      return danhSachNghiPhep;
    } else {
      return null;
    }
  };

  const handleDateAccept = async () => {
    setLoading(true);
    const response = await getListNghiPhep({ userEmail: props.email });
    if (!response) {
      return history.push("/500InternalError");
    }

    if (response.data.length !== 0) {
      let date = new Date(selectedDate);
      let returnDate = [];
      for (let i = 0; i < response.data.length; i++) {
        let responseDate = new Date(response.data[i].nghiTu);
        let year = responseDate.getFullYear();
        let month = responseDate.getMonth();
        if (year === date.getFullYear() && month === date.getMonth()) {
          returnDate.push(response.data[i]);
        }
      }
      setListNghiPhep(returnDate);
    }
    setLoading(false);
  };

  return loading ? (
    <Grid container spacing={3} style={{ marginTop: "30px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <Grid container>
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={4} sm={3} className="itemFullWidth">
          <h2 className="textStyle">
            Tháng này bạn đã nghỉ {listNghiPhep.length} lần
          </h2>
        </Grid>

        <Grid
          item
          xs={4}
          sm={2}
          className="itemFullWidth"
          style={{ marginRight: "15px" }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              views={["year", "month"]}
              format="MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              onAccept={handleDateAccept}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>

      <Grid container spacing={1} justify="center">
        <Grid item xs={12} sm={6}>
          {returnDisplay()}
        </Grid>
      </Grid>
    </Grid>
  );
}
