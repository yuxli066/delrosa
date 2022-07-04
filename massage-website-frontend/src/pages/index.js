import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';

const Home = props => {
  const intro = props.data.intro;
  const site = props.data.site.siteMetadata;

  // eslint-disable-next-line max-len
  const introImageClasses = `intro-image ${intro.frontmatter.intro_image_absolute && 'intro-image-absolute'} ${intro.frontmatter.intro_image_hide_on_mobile && 'intro-image-hide-mobile'}`;

  return (
    <Layout bodyClass="page-home">
      <SiteSEO title={site.title} />
      <Helmet>
        <meta
          name="description"
          content="Del Rosa Massage Website"
        />
      </Helmet>

      <div className="intro">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-sm-12 col-lg-5">
              <div dangerouslySetInnerHTML={{ __html: intro.html }} />
            </div>
            <div className="col-sm-12 col-lg-5">
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
        intro: markdownRemark(fileAbsolutePath: {regex: "/(home.md)/"}) {
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
