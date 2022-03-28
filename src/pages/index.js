import React from 'react';
import { graphql, Link } from 'gatsby';
import Helmet from 'react-helmet';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import Call from '../components/Call';

const Home = props => {
  const intro = props.data.intro;
  const site = props.data.site.siteMetadata;
  const services = props.data.services.edges;

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
            <div className="col-12 col-md-7 col-lg-6 order-2 order-md-1">
              <div dangerouslySetInnerHTML={{ __html: intro.html }} />
              <Call showButton />
            </div>
            {intro.frontmatter.intro_image && (
              <div className="col-12 col-md-5 col-lg-6 order-1 order-md-2 position-relative">
                <img alt={intro.frontmatter.title} className={introImageClasses} src={intro.frontmatter.intro_image} />
              </div>
            )}
          </div>
        </div>
      </div>

      {services.length > 0 && (
        <div className="strip">
          <div className="container pt-6 pb-6 pb-md-10">
            <div className="row justify-content-start">
              {services.map(({ node }) => (
                <div key={node.id} className="col-12 col-md-4 mb-1">
                  <div className="service service-summary">
                    <div className="service-content">
                      <h2 className="service-title">
                        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                      </h2>
                      <p>{node.excerpt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
