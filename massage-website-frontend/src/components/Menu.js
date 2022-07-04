import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import AniLink from "gatsby-plugin-transition-link/AniLink";

const Menu = props => {
  const data = useStaticQuery(graphql`
    query MainMenuQuery {
      allMainMenuJson {  
        edges {
          node {
            name
            url
            weight
          }
        }
      }
    }
  `);
  return (
    <div id="main-menu" className="main-menu">
      <ul>
        {data.allMainMenuJson.edges.map(({ node }) => (
          <li key={node.name}>
            <AniLink 
              cover
              bg="#8036ca"
              duration={0.5}
              to={node.url} 
              activeClassName="active"
            >{node.name}</AniLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
