import React from "react";
import GoogleMapLocationMarker from "./GoogleMapLocationMarker";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function GoogleMapLocationPicker() {
    const defaultProps = {
      center: {
        lat: 10.99835602,
        lng: 77.01502627
      },
      zoom: 11
    };
  
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDwcUJld3Tdz3hSLI6S9YLFMIOjuGJHKgY" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={<GoogleMapLocationMarker />}
          />
        </GoogleMapReact>
      </div>
    );
  }