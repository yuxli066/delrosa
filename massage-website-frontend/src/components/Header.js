import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Menu from './Menu';
import Hamburger from './Hamburger';
import MenuMobile from './MenuMobile';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuActive: false
    };
  }

  toggleMenu = menuActive => {
    this.setState(prevState => ({
      menuActive: !prevState.menuActive
    }));
  };

  render() {
    return (
      <div className="header">
        <div className="container">
          <MenuMobile active={this.state.menuActive} />
          <Menu />
          <Hamburger toggleMenu={this.toggleMenu} />
        </div>
      </div>
    );
  }
}

const props = () => (
  <StaticQuery
    query={graphql`
      query HeaderQuery {
        configJson {
          logo {
            alt
            desktop
            mobile
            desktop_height
          }
        }
      }
    `}
    render={data => <Header data={data} />}
  />
);

export default props;
