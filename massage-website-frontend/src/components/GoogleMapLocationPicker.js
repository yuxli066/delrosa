import React from "react";
import GoogleMapLocationMarker from "./GoogleMapLocationMarker";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function GoogleMapLocationPicker() {
    const defaultProps = {
      center: {
        lat: 34.14559740125316,
        lng: -117.25257937220307
      },
      zoom: 15
    };
  
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '91vh', width: '50%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDwcUJld3Tdz3hSLI6S9YLFMIOjuGJHKgY" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={34.14559740125316}
            lng={-117.25257937220307}
            text={<GoogleMapLocationMarker />}
          />
          <AnyReactComponent
            lat={34.145331020819654}
            lng={-117.25061599522215}
            text={<GoogleMapLocationMarker />}
          />
        </GoogleMapReact>
      </div>
    );
  }