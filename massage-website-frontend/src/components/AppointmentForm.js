import React, { useState, useDebugValue } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, Box } from '@mui/material';
import { sendEmail, createAppointment } from "../services/appointmentService";
import '../scss/components/_appointment-form.scss';

const AppointmentForm = ({ timesNotAvailable }) => {

  const [massageType, setMassageType] = useState("Full Body Massage");
  
  const [clientInfo, setClientInfo] = useState({
    'Full Name': '',
    'Email': '',
    'Phone Number': '',
    'Appointment Date': '',
    'Massage Type': massageType,
  });

  const userFields = ['Full Name', 'Email', 'Phone Number'];
  const massageTypes = [ 
    {
      massage: "Foot Massage", 
      price: 20
    }, 
    { 
      massage: "Full Body Massage", 
      price: 20
    }, 
    { 
      massage: "Hot Stones Massage",
      price: 20 
    }
  ];

  const [ selectedTimeslot, setSelectedTimeslot ] = useState(null);

  const availableTimeSlots = [
    1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8
  ];
  
  const [ tStates, setTStates ] = useState(() => {
    const timeSlotButtonStates = {};
    availableTimeSlots.forEach((t,i) => timeSlotButtonStates[`timeSlotState_${i}`] = false );
    return timeSlotButtonStates;
  });

  const onTimeslotClick = (event) => {

    setTStates(() => {
      Object.keys(tStates).forEach((k) => tStates[k] = false );
      return tStates
    });

    setTStates({
      ...tStates,
      [event.target.value]: true
    });

    setSelectedTimeslot(event.target.textContent);
  }

  const onMassageChange = (event) => {
    setMassageType(event.target.value)
    setClientInfo({
      ...clientInfo,
      'Massage Type': event.target.value
    });
  }

  const getClient = e => {
    const eType = e.target.name;
    setClientInfo({
      ...clientInfo,
      [eType]: e.target.value
    });
  };
  
  const handleSubmit = async (clientInfo) => {
    console.log(clientInfo)
    await sendEmail({
      "subject": `Appointment for ${clientInfo["Full Name"]}`,
      "message": {
        "name": `${clientInfo["Full Name"]}`,
        "date": clientInfo["Appointment Date"],
        "time": clientInfo["Appointment Date"],
        "type": massageType,
        "price": 20
      } 
    });

    await createAppointment({
      'Full Name': clientInfo["Full Name"],
      'Email': clientInfo["Email"],
      'Phone Number': clientInfo["Phone Number"],
      'Appointment Date': "2022-07-10T19:00:00-07:00",
      'Massage Type': massageType
    });
  };

  useDebugValue(timesNotAvailable); // used for debugging purposes

  return (
    <>
      <div className="login-box">
        <div>
          <h2 className="appointments-heading">Appointments</h2>
        </div>
        <form className="login-form">
          {
            userFields.map(fieldName => (
              <div className="user-box" key={fieldName}>
                <input
                  onChange={e => getClient(e)}
                  className="input-box"
                  type="text"
                  name={fieldName}
                  required
                />
                <label className="input-label" style={{ display: clientInfo[fieldName] === '' ? '' : 'none'}}>{fieldName}*</label>
              </div>
            ))
          }
          <Box className="timeslot-container">
            {
              availableTimeSlots.map((time,i) => (
                <Box className="timeslot" key={`timeSlotState_${i}`}>
                  <Button 
                    variant={tStates[`timeSlotState_${i}`] ? 'contained' : 'outlined' } 
                    onClick={e => onTimeslotClick(e) }
                    value={ `timeSlotState_${i}` }
                  >
                    11:00 PM
                  </Button>
                </Box>
              ))
            }
          </Box>
          <FormControl fullWidth sx={{ marginTop: "2em" }}>
            <InputLabel id="massage-label-id">Massage Type*</InputLabel>
            <Select
              labelId="massage-label-id"
              id="massage-type-select"
              value={massageType}
              label="Massage Type*"
              onChange={ onMassageChange }
            >
              {
                massageTypes.map((m, i) => (
                  <MenuItem value={`${m.massage}`} key={`${m.massage}-${i}`}>
                      <em> { m.massage } </em>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <div className="submit-button">
            <a href="#" onClick={ async () => await handleSubmit(clientInfo) }>
              Submit
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;