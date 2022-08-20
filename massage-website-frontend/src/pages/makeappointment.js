import React, { useEffect, useState } from 'react';
import SiteSEO from '../components/SiteSEO';
import Layout from '../components/Layout';
import { checkAvailability } from "../services/appointmentService";
import AppointmentForm from '../components/AppointmentForm';

const MakeAppointment = ({location}) => {
  
  const [ timesNotAvailable, setTimesNotAvailable ] = useState([]);

  useEffect(() => {
    checkAvailability()
      .then((timesAvailable) => {
        setTimesNotAvailable(timesAvailable);
        console.log(timesAvailable)
      });
  }, []);

  return timesNotAvailable.length >= 1 && (
    <Layout bodyClass="page-teams">
      <SiteSEO title="AppointmentForm" />
      <AppointmentForm />
    </Layout>
  );
};

export default MakeAppointment;
