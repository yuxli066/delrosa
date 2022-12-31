import React, { useEffect, useState } from 'react';
import { List, ListItem, Divider, Box } from '@mui/material';
import { DatePickerCalendar } from 'react-nice-dates';
import { enGB } from 'date-fns/locale';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import LocationMapPicker from '../components/GoogleMapLocationPicker';
import { getAvailability } from "../services/appointmentService";
import AniLink from "gatsby-plugin-transition-link/AniLink";
import '../scss/components/_appointment-form.scss';
import '../scss/style.scss';
import 'react-nice-dates/build/style.css';

const Appointments = props => {

  const [ appointment_date, set_appointment_date ] = useState(new Date());
  const [ appointment_date_string, set_appointment_date_string ] = useState(null);
  const [ times_not_available, set_times_not_available ] = useState(null);

  const handleDateChange = (date) => {
    set_appointment_date(date);
    set_appointment_date_string(new Date(date).toISOString().split('T')[0]);
  };

  const modifiers = {
    disabled: (date) => new Date(date).setHours(22) < new Date(times_not_available.TODAY),
    highlight: (date) => new Date(date).setHours(22) < new Date(times_not_available.TODAY)
  }

  const modifiersClassNames = {
    highlight: '-highlight'
  }

  useEffect(() => {
    const appt_date = appointment_date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(',')[0];
    const appt_date_els = appt_date.split('/'); 
    set_appointment_date_string(`${appt_date_els[2]}-${appt_date_els[0]}-${appt_date_els[1]}`);
  }, [appointment_date])

  useEffect(() => {
    getAvailability()
      .then((times) => {
        set_times_not_available(times);
      });
  }, []);

  return ( times_not_available && appointment_date_string) &&  (
    <Layout bodyClass="page-teams">
      <SiteSEO title="Appointments" />
      <Box className="pContainer">
        <LocationMapPicker />
        <Box className="calendarContainer">
          <DatePickerCalendar
            date={appointment_date} 
            onDateChange={handleDateChange} 
            locale={enGB}
            className="calendar"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
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
                name: "Del Rosa Massage",  
                selected_date: appointment_date.toISOString(),
                todays_date: times_not_available.TODAY,
                slots_not_available: times_not_available.SCHEDULE[appointment_date_string]
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
                name: "Aster Massage",
                selected_date: appointment_date.toISOString(),
                todays_date: times_not_available.TODAY,
                slots_not_available: times_not_available.SCHEDULE[appointment_date_string]
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
