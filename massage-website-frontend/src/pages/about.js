import React from 'react';
import Layout from '../components/Layout';

const About = props => {
  const content = props.data.about.edges.html;
  return (
    <Layout bodyClass="page-teams">
      <p>{content}</p>
    </Layout>
  );
};

export default About;