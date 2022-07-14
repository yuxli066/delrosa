import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import AppointmentForm from '../components/AppointmentForm';
import LocationMapPicker from '../components/GoogleMapLocationPicker';
import { sendEmail, createAppointment, checkAvailability } from "../services/appointmentService";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import  ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import  ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// TODO: clean up css, too messy to keep in 1 file

const mapContainer = {
  display: 'flex',
  flexDirection: 'row',
};

const style = {
  width: "100%",
  bgcolor: 'background.paper',
  paddingTop: "0px !important"
};

const Appointments = props => {

  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [ timesNotAvailable, setTimesNotAvailable ] = useState([]);
  const incrementDate = () => {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    setDate(newDate);
  }
  const decrementDate = () => {
    const newDate = new Date(date.setDate(date.getDate() - 1))
    setDate(newDate);
  }
  useEffect(async () => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
        console.log(timesAvailable)
      });
  }, []);

  return timesNotAvailable.length >= 1 && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="Appointments" />
      {/* <div className="intro">
          <div className="container">
            <div className="row justify-content-start">
              <div className="col-md-12 col-lg-5 order-1 order-md-1">
                <h1 dangerouslySetInnerHTML={{ __html: intro.html }} />
              </div>
              <div className="col-md-12 col-lg-7 order-2 order-md-1">
                <AppointmentForm timesNotAvailable={timesNotAvailable} />
              </div>
            </div>
          </div>
      </div> */}
      <Box sx={mapContainer}>
          <LocationMapPicker />
          {
            /* <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Item One" />
            </Tabs> */
          }
          <Box sx={style}>
            <List sx={style} component="nav" aria-label="mailbox folders">
                <Divider />
                <ListItem style={{
                    "textAlign": "center",
                    "font-size": "34x",
                    "minHeight": "4em",
                    "display": "flex",
                    "flexDirection": "row",
                    "alignItems": "stretch",
                  }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIosIcon />}
                    onClick={decrementDate}
                  >Prev
                  </Button>
                  <ListItemText sx={{ 
                    "paddingBlockStart": "0.5em",
                    "font-weight": "900 !important",
                    "font-family": "BlinkMacSystemFont,Helvetica,Arial,sans-serif",
                    "font-size": "34x",
                  }} 
                    primary={`${date.toDateString()}`} />
                  <Button 
                    variant="outlined" 
                    startIcon={<ArrowForwardIosIcon />}
                    onClick={incrementDate}
                  >Next
                  </Button>
                </ListItem>
                <Divider />
                <ListItem button style={{
                    "textAlign": "center",
                    "font-family": "BlinkMacSystemFont,Helvetica,Arial,sans-serif",
                    "font-size": "34x"
                  }}>
                  <ListItemText primary="Location #1" />
                </ListItem>
                <Divider />
                <ListItem button divider style={{
                    "textAlign": "center",
                    "font-family": "BlinkMacSystemFont,Helvetica,Arial,sans-serif",
                    "font-size": "34px"
                  }}>
                  <ListItemText primary="Location #2" />
                </ListItem>
              </List>
          </Box>
      </Box>
    </Layout>
  );
};

export const query = graphql`
  query TeamQuery {
    intro: markdownRemark(fileAbsolutePath: {regex: "/(appointments.md)/"}) {
      html
      frontmatter {
        intro_image
        intro_image_absolute
        intro_image_hide_on_mobile
        title
      }
    }
  }
`;

export default Appointments;
