import React from 'react';
import SiteSEO from './SiteSEO';
import Header from './Header';
import '../scss/style.scss';

const Layout = props => (
  <>
    <SiteSEO />
    <div className={`page${props.bodyClass ? ` ${props.bodyClass}` : ''}`}>
      <div id="wrapper" className="wrapper">
        <Header />
        {props.children}
      </div>
    </div>
  </>
);

export default Layout;
