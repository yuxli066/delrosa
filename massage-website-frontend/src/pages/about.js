import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

const About = props => {
  const about = props.data.about;
  const html = about.html;
  const title = about.frontmatter.title;
  return (
    <Layout bodyClass="page-default-single">
      <div className="container pb-6 pt-6 pt-md-10 pb-md-10">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <h1>{title}</h1>
            <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// graphql query used here to pass data into page as prop
export const query = graphql`
    query {
        about: markdownRemark(fileAbsolutePath: {regex: "/(about.md)/"}) {
            frontmatter {
              path
              title
              date
            }
            html
        }
    }
`;

export default About;