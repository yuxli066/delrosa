import React, { useEffect, useState } from 'react';
import { List, ListItem, Divider, Box } from '@mui/material';
import { DatePickerCalendar } from 'react-nice-dates';
import { enGB } from 'date-fns/locale';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import LocationMapPicker from '../components/GoogleMapLocationPicker';
import { checkAvailability } from "../services/appointmentService";
import AniLink from "gatsby-plugin-transition-link/AniLink";
import '../scss/components/_appointment-form.scss';
import '../scss/style.scss';
import 'react-nice-dates/build/style.css';

const DelRosaTimes = [
  "9:30 AM", 
  "10:00 AM", 
  "10:30 AM", 
  "11:00 AM", 
  "11:30 AM", 
  "12:00 PM", 
  "12:30 PM", 
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM", 
  "6:00 PM", 
  "6:30 PM",
  "7:00 PM", 
  "7:30 PM", 
  "8:00 PM", 
  "8:30 PM",
  "9:00 PM", 
  "9:30 PM"
]; 

const AsterTimes = [
  "9:30 AM", 
  "10:00 AM", 
  "10:30 AM", 
  "11:00 AM", 
  "11:30 AM", 
  "12:00 PM", 
  "12:30 PM", 
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM", 
  "6:00 PM", 
  "6:30 PM",
  "7:00 PM", 
  "7:30 PM", 
  "8:00 PM", 
  "8:30 PM",
  "9:00 PM"
];

const Appointments = props => {

  const [ appointmentDate, setAppointmentDate ] = useState(new Date());
  const [ timesNotAvailable, setTimesNotAvailable ] = useState(null);

  const handleDateChange = (date) => {
    setAppointmentDate(date);
  };

  useEffect(() => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
        console.log(timesAvailable)
      });
  }, []);

  return timesNotAvailable !== null && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="Appointments" />
      <Box className="pContainer">
        <LocationMapPicker />
        <Box className="calendarContainer">
          <DatePickerCalendar
            date={appointmentDate} 
            onDateChange={handleDateChange} 
            locale={enGB}
            className="calendar"
          />
          {/* <Box className="selectedDate" >
            {appointmentDate.toDateString()}
          </Box> */}
        </Box>
        <List 
          className="locationContainer" 
          component="nav" 
          aria-label="massage parlor location selections"
        >
            <Divider />
            <AniLink 
              to="/makeappointment/" 
              state={{ 
                location: "Del Rosa Massage",  
                timeslots: DelRosaTimes, 
                selectedDate: appointmentDate.toDateString()
              }}
            >
              <ListItem 
                button 
                className="delRosaMassage" 
              />
            </AniLink>
            <AniLink 
              to="/makeappointment/" 
              state={{ 
                location: "Aster Massage", 
                timeslots: AsterTimes,
                selectedDate: appointmentDate.toDateString()
              }}
            >
              <ListItem 
                button
                className="asterMassage" 
              />
            </AniLink>
          </List>
      </Box>
    </Layout>
  );
};

export default Appointments;
