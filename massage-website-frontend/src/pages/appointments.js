import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Box, Avatar } from '@mui/material';
import { DatePickerCalendar } from 'react-nice-dates';
import { enGB } from 'date-fns/locale';
import { graphql } from 'gatsby';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import LocationMapPicker from '../components/GoogleMapLocationPicker';
import { sendEmail, createAppointment, checkAvailability } from "../services/appointmentService";
import '../scss/components/_appointment-form.scss';
import '../scss/style.scss';
import 'react-nice-dates/build/style.css';

const Appointments = props => {

  const [ appointmentDate, setAppointmentDate ] = useState(new Date());
  const [ timesNotAvailable, setTimesNotAvailable ] = useState([]);

  const handleDateChange = (date) => {
    console.log(date);
    setAppointmentDate(date);
  };

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
      <Box className="pContainer">
        <LocationMapPicker />
        <Box className="calendarContainer">
          <DatePickerCalendar
            date={appointmentDate} 
            onDateChange={handleDateChange} 
            locale={enGB}
          />
        </Box>
        <List className="locationContainer" component="nav" aria-label="mailbox folders">
            <Divider />
            <ListItem divider>
              <ListItemText 
                className="selectedDate"
                primary={`${appointmentDate.toDateString()}`}
              />  
            </ListItem> 
            <ListItem button divider className="listItemClass">
              <Avatar 
                alt="Location #1 Thumbnail"  
                variant="square"
                sx={{ width: 70, height: 70 }} 
                src={"https://source.unsplash.com/random/200x200?sig=1"}
              />
              <ListItemText primary="Location #1" />
            </ListItem>
            <ListItem button divider className="listItemClass">
              <Avatar 
                alt="Location #2 Thumbnail"   
                variant="square"
                sx={{ width: 70, height: 70 }} 
                src={"https://source.unsplash.com/random/200x200?sig=1"}
              />
              <ListItemText primary="Location #2" />
            </ListItem>
          </List>
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
