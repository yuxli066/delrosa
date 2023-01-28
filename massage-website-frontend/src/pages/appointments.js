import React, { useEffect, useState } from 'react';
import { List, ListItem, Divider, Box, Skeleton, Stack  } from '@mui/material';
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
  const [ times_not_available, set_times_not_available ] = useState(null);
  const [ booked_times, set_booked_times ] = useState(null);
  const marginBlocks = '1.5em';
  const SkeletonStyleObject = {
    borderRadius: "0.75em",
    border: "0px",
    marginBlockStart: marginBlocks,
    marginBlockEnd: marginBlocks,
    marginInlineStart: marginBlocks,
    marginInlineEnd: marginBlocks
  };

  const handleDateChange = (date) => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const apt_date_string = new Date(new Date(date).getTime() - tzoffset).toISOString().split('T')[0];
    const booked_times = times_not_available.SCHEDULE[apt_date_string] ? times_not_available.SCHEDULE[apt_date_string] : [];
    set_appointment_date(date);
    set_booked_times(booked_times);
  };

  const modifiers = {
    disabled: (date) => new Date(date).setHours(22) < new Date(times_not_available.TODAY),
    highlight: (date) => new Date(date).setHours(22) < new Date(times_not_available.TODAY)
  }

  const modifiersClassNames = {
    highlight: '-highlight'
  }

  useEffect(() => {
    getAvailability()
      .then((times) => {
        if (times && times.status === 200) {
          set_times_not_available(times.data);
          const appt_date = appointment_date.toLocaleString('en-US', { 
            timeZone: 'America/Los_Angeles',
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric",
            hourCycle: "h12"
          }).split(',')[0];
          const appt_date_els = appt_date.split('/'); 
          const appt_date_string = `${appt_date_els[2]}-${appt_date_els[0]}-${appt_date_els[1]}`;
          console.log(appt_date_string)
          const booked_times = times.data.SCHEDULE[appt_date_string] ? times.data.SCHEDULE[appt_date_string] : [];
          set_booked_times(booked_times);
          console.log(booked_times);
        };
      });
  }, []);

  return ( times_not_available && booked_times !== null ) ? (
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
                slots_not_available: booked_times
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
                slots_not_available: booked_times
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
  ) : (
    <Layout bodyClass="page-teams">
      <SiteSEO title="Appointments" />
        <Box className="pContainer">
          <Box component="div" style={{ minWidth: '24%'}}>
            <Skeleton 
              variant="rounded"
              height={"95%"}
              style={SkeletonStyleObject}
            />
          </Box>
          <Box 
            className="calendarContainer" 
            style={{border: '0px'}}
          >
            <Skeleton 
              variant="rounded" 
              animation="wave"
              height={"100%"} 
              className="calendarContainer"
              style={SkeletonStyleObject}
            />
          </Box>
        <Divider />
        <List 
            className="locationContainer" 
            component="nav" 
            aria-label="massage parlor location selections"
        >
          <Skeleton 
            variant="rounded"
            height={"100%"} 
            style={SkeletonStyleObject}
          />
          <Divider />
          <Skeleton 
            variant="rounded" 
            animation="wave"
            height={"100%"} 
            style={SkeletonStyleObject}
          />
        </List>
      </Box>
    </Layout>
  )
};

export default Appointments;
