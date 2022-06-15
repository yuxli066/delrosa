import React from 'react';
import { graphql } from 'gatsby';
import Call from '../components/Call';
import Layout from '../components/Layout';

const ContactPage = props => {
  const contact = props.data.contact;
  const { title } = contact.frontmatter;
  const { html } = contact;

  return (
    <Layout bodyClass="page-default-single">
      <div className="container pb-6 pt-6 pt-md-10 pb-md-10">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <h1 className="title">{title}</h1>
            <Call showButton={false} />
            <div className="content mt-4" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// graphql query used here to pass data into page as prop
export const query = graphql`
    query {
      contact: markdownRemark(fileAbsolutePath: {regex: "/(contact.md)/"}) {
        frontmatter {
          path
          title
          date
        }
        html
    }
    }
`;


export default ContactPage;