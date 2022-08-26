import React, { useEffect, useState } from 'react';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import { graphql } from 'gatsby';
import { checkAvailability } from "../services/appointmentService";
import AppointmentForm from '../components/AppointmentForm';
import { Box } from '@mui/material';
import '../scss/components/_appointment-form.scss';

const MakeAppointment = ({location, data }) => {
  
  const formData = data.formData; 
  // eslint-disable-next-line max-len
  const formImgClasses = `intro-image ${formData.frontmatter.image_absolute && 'intro-image-absolute'} ${formData.frontmatter.image_hide_on_mobile && 'intro-image-hide-mobile'}`;
  console.log(location)
  const [ timesNotAvailable, setTimesNotAvailable ] = useState(null);

  useEffect(() => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
        console.log(timesAvailable)
      });
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
        <AppointmentForm timeslots={location.state.timeslots}/>
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
