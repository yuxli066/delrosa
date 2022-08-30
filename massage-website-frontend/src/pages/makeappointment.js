import React, { useEffect, useState } from 'react';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import { graphql } from 'gatsby';
import { checkAvailability } from "../services/appointmentService";
import AppointmentForm from '../components/AppointmentForm';
import { Box } from '@mui/material';
import '../scss/components/_appointment-form.scss';

const createDateObject = (dateStr) => {
  const timeZone = 'America/Los_Angeles';
  const date = new Date(dateStr);
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
  const offset = utcDate.getTime() - tzDate.getTime();

  date.setTime( date.getTime() + offset );
  return date;
};

const formatTimeslots = (date, bookedTimeslots, massageParlor) => {
  const closeTime = massageParlor === 'Del Rosa Massage' ? createDateObject(`${date.selectedDate} 9:30 PM`) : createDateObject(`${date.selectedDate} 9:00 PM`);
  if (!bookedTimeslots) 
    return [];
  
  const intlFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12",
  };
  
  let startTime = createDateObject(`${date.selectedDate} 9:30 AM`);
  console.log(date.todaysDate, date.selectedDate)
  if (date.todaysDate === date.selectedDate) {
    startTime = new Date();
    startTime.setMinutes(0,0,0);
    const minsToAdd = startTime.getMinutes > 30 ? 60 : 30;
    startTime.setMinutes(startTime.getMinutes() + minsToAdd);
  }
  
  console.log("Start Time: ", startTime, "Booked Timeslots", bookedTimeslots);
  const availableTimeslots = [];
  for (let i = 0; i < bookedTimeslots.length; ++i) {
    const bookedStartTime = bookedTimeslots[i].STARTTIME;
    const bookedEndTime = bookedTimeslots[i].ENDTIME; 
    const bsTime = createDateObject(`${date.selectedDate} ${bookedStartTime}`);
    while (startTime.getTime() < bsTime.getTime() && startTime.getTime() < closeTime.getTime()) {
      console.log('Current Time:', startTime, 'Closing Time:', closeTime);
      availableTimeslots.push(new Intl.DateTimeFormat('en-GB', intlFormatOptions).format(startTime).toUpperCase());
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    startTime = createDateObject(`${date.selectedDate} ${bookedEndTime}`)
    startTime.setMinutes(startTime.getMinutes() + 30);
    console.log("Final Time: ", startTime);
  }
  // console.log("Returning timeslots: ", availableTimeslots);
  return availableTimeslots;
}; 

const MakeAppointment = ({location, data }) => {
  
  const formData = data.formData; 
  // eslint-disable-next-line max-len
  const formImgClasses = `intro-image ${formData.frontmatter.image_absolute && 'intro-image-absolute'} ${formData.frontmatter.image_hide_on_mobile && 'intro-image-hide-mobile'}`;
  console.log(location)
  const [ timesNotAvailable, setTimesNotAvailable ] = useState(null);
  const [ timeslots, setTimeslots ] = useState(null); 

  useEffect(() => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
      });
  }, []);

  useEffect(() => {
    const options = {year: "numeric", month: "2-digit", day: "2-digit"};
    const ts = formatTimeslots(
        {
          todaysDate: location.state.todaysDate, 
          selectedDate: new Intl.DateTimeFormat("fr-CA", options).format(createDateObject(location.state.selectedDate))
        }, 
        location.state.bookedSlots,
        location.state.location
      );
    setTimeslots(ts);
  }, []);

  return timesNotAvailable && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="AppointmentForm" />
      <Box className="AppointmentFormContainer">
        <Box className="AppointmentFormImage">
          <img 
            alt={formData.frontmatter.image_alt} 
            className={formImgClasses} 
            src={formData.frontmatter.image} 
          />
        </Box>
        <AppointmentForm 
          massageParlorName={location.state.location}
          timeslots={ timeslots.length === 0 ? location.state.default_timeslots : timeslots} 
          selectedDate={location.state.selectedDate} 
        />
      </Box>
    </Layout>
  );
};

export const query = graphql`
  query {
    formData: markdownRemark(fileAbsolutePath: {regex: "/(form.md)/"}) {
      frontmatter {
          image
          image_alt
      }
    }
  }
`;

export default MakeAppointment;
