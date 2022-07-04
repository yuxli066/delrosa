import React from 'react';
import { graphql } from 'gatsby';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import AppointmentForm from '../components/AppointmentForm';

const Appointments = props => {
  const { intro } = props.data;
  // eslint-disable-next-line max-len
  // const introImageClasses = `intro-image ${intro.frontmatter.intro_image_absolute && 'intro-image-absolute'} ${intro.frontmatter.intro_image_hide_on_mobile && 'intro-image-hide-mobile'}`;

  return (
    <Layout bodyClass="page-teams">
      <SiteSEO title="Appointments" />

      <div className="intro">
          <div className="container">
            <div className="row justify-content-start">
              <div className="col-md-12 col-lg-5 order-1 order-md-1">
                <h1 dangerouslySetInnerHTML={{ __html: intro.html }} />
              </div>
              <div className="col-md-12 col-lg-7 order-2 order-md-1">
                <AppointmentForm />
              </div>
            </div>
          </div>
      </div>
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
