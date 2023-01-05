import React, { useEffect, useState } from 'react';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import AppointmentForm from '../components/AppointmentForm';
import { Box } from '@mui/material';
import '../scss/components/_appointment-form.scss';
import { graphql } from 'gatsby';

const round_nearest_30 = (date) => {
  const minutes = 30;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

const get_massage_times = (name, date) => {

    if (name === 'Aster Massage') {
      return {
        'start_time': `${date} 9:00 AM PST`,
        'end_time': `${date} 9:00 PM PST`
      }
    }
    
    if (name === 'Del Rosa Massage') {
      return {
        'start_time': `${date} 9:00 AM PST`,
        'end_time': `${date} 9:00 PM PST`
      }
    }
}

const get_available_slots = (todays_date, selected_date, parolor_name, booked_slots) => {
  console.log('booked slots', booked_slots);
  const available_slots = [];
  const intlFormatOptions = { hour: "numeric", minute: "numeric", hourCycle: "h12" };
  const todays_date_string = new Date(todays_date).toLocaleDateString();
  const selected_date_string = new Date(selected_date).toLocaleDateString();

  let current_time = todays_date_string === selected_date_string ? new Date(todays_date) : new Date(`${selected_date_string} 9:00 AM PST`),
      massage_parlor_times = todays_date_string === selected_date_string ? 
                                    get_massage_times(parolor_name, todays_date_string) : get_massage_times(parolor_name, selected_date_string);

  const start_time = new Date(massage_parlor_times['start_time']), 
        end_time = new Date(massage_parlor_times['end_time']); 
  
  let time_runner = start_time < current_time ? round_nearest_30(current_time) : round_nearest_30(start_time);
  let slot_index = 0;

  if (booked_slots && booked_slots.length > 0) {
    while (slot_index < booked_slots.length) {
      const current_start_time = new Date(booked_slots[slot_index].STARTTIME);
      const current_end_time = new Date(booked_slots[slot_index].ENDTIME);
      
      if (current_end_time < round_nearest_30(start_time)) {
        ++slot_index;
      } else {
        if (time_runner < current_start_time) {
          available_slots.push(new Intl.DateTimeFormat('en-GB', intlFormatOptions).format(time_runner).toUpperCase());
          time_runner.setMinutes(time_runner.getMinutes() + 30);
        } else if (time_runner >= current_start_time && time_runner < current_end_time) {
          ++slot_index;
          time_runner = new Date(current_end_time);
        }
      }
    }
  }

  while (time_runner < end_time) {
    available_slots.push(new Intl.DateTimeFormat('en-GB', intlFormatOptions).format(time_runner).toUpperCase());
    time_runner.setMinutes(time_runner.getMinutes() + 30);
  }
  
  return available_slots;
}

const MakeAppointment = ({ location, data }) => {
  
  const formData = data.formData; 
  // eslint-disable-next-line max-len
  const formImgClasses = `intro-image ${formData.frontmatter.image_absolute && 'intro-image-absolute'} ${formData.frontmatter.image_hide_on_mobile && 'intro-image-hide-mobile'}`;
  const [ location_state, set_location_state ] = useState(null);
  const [ timeslots, set_timeslots ] = useState(null); 

  useEffect(() => {
    set_location_state(location.state);
  }, [location.state]);

  useEffect(() => {
    if (location_state) {
      const ts = get_available_slots(
        location_state.todays_date, 
        location_state.selected_date, 
        location_state.name,
        location_state.slots_not_available
      );
      set_timeslots(ts);
    }
  }, [location_state])

  return timeslots !== null && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="AppointmentForm" />
      <Box className="AppointmentFormContainer">
        <Box className="AppointmentFormImage">
          <img 
            alt={ formData.frontmatter.image_alt } 
            className={ formImgClasses } 
            src={ formData.frontmatter.image } 
          />
        </Box>
        <AppointmentForm 
          massageParlorName={ location_state.name }
          timeslots={ timeslots } 
          selectedDate={ location_state.selected_date } 
        />
      </Box>
    </Layout>
  )
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
