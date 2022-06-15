import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import SEO from '../components/SEO';
import Layout from '../components/Layout';

const Home = props => {
  const intro = props.data.intro;
  const site = props.data.site.siteMetadata;

  // eslint-disable-next-line max-len
  const introImageClasses = `intro-image ${intro.frontmatter.intro_image_absolute && 'intro-image-absolute'} ${intro.frontmatter.intro_image_hide_on_mobile && 'intro-image-hide-mobile'}`;

  return (
    <Layout bodyClass="page-home">
      <SEO title={site.title} />
      <Helmet>
        <meta
          name="description"
          content="Del Rosa Massage Website"
        />
      </Helmet>

      <div className="intro">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-5">
              <div 
                dangerouslySetInnerHTML={{ __html: intro.html }} 
                />
            </div>
            <div className="col-5">
              <img 
                alt={intro.frontmatter.title} 
                className={introImageClasses} 
                src={intro.frontmatter.intro_image} 
                />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// graphql query used here to pass data into page as prop
export const query = graphql`
    query IndexQuery {
        features: allFeaturesJson {
            nodes {
                id
                title
                description
                image
            }
        }
        site {
            siteMetadata {
                title
            }
        }
        services: allMarkdownRemark(
            filter: {fileAbsolutePath: {regex: "/services\/.*/"}}
            limit: 20
        ) {
            edges {
                node {
                    frontmatter {
                        title
                        intro_image
                        intro_image_absolute
                        intro_image_hide_on_mobile
                        date(formatString: "DD MMMM YYYY")
                    }
                    fields {
                        slug
                    }
                    excerpt
                }
            }
        }
        intro: markdownRemark(fileAbsolutePath: {regex: "/index.md/gm"}) {
            frontmatter {
                title
                intro_image
                intro_image_absolute
                intro_image_hide_on_mobile
            }
            html
        }
    }
`;

export default Home;
