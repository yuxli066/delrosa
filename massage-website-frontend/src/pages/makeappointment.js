import React, { useEffect, useState } from 'react';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import { graphql } from 'gatsby';
import { checkAvailability } from "../services/appointmentService";
import AppointmentForm from '../components/AppointmentForm';

const MakeAppointment = ({location, data }) => {
  
  const formData = data.formData; 
  // eslint-disable-next-line max-len
  const formImgClasses = `intro-image ${formData.frontmatter.image_absolute && 'intro-image-absolute'} ${formData.frontmatter.image_hide_on_mobile && 'intro-image-hide-mobile'}`;
  
  const [ timesNotAvailable, setTimesNotAvailable ] = useState([]);

  useEffect(() => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
        console.log(timesAvailable)
      });
  }, []);

  return timesNotAvailable.length >= 1 && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="AppointmentForm" />
      <div className="col-sm-12 col-lg-5">
              <img 
                alt={formData.frontmatter.image_alt} 
                className={formImgClasses} 
                src={formData.frontmatter.image} 
              />
      </div>
      <div className="col-sm-12 col-lg-5">
        <AppointmentForm />
      </div>
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
