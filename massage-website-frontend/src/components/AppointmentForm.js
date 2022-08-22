import React, { useState, useDebugValue } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, TextField, Box } from '@mui/material';
import { sendEmail, createAppointment } from "../services/appointmentService";
import '../scss/components/_appointment-form.scss';

const userFields = ['Full Name', 'Email', 'Phone Number'];
const massageTypes = [ 
  {
    massage: "Body/Foot Massage", 
    price: 20
  }, 
  { 
    massage: "Body Oil Massage", 
    price: 20
  }, 
];
const pricesObject = {
  "Body Oil Massage": [ " 120 minutes - $90 ", " 105 minutes - $80 ", " 90 minutes - $70 ", " 75 minutes - $60 ", " 60 minutes - $45 ", " 30 minutes - $30 " ],
  "Body/Foot Massage" : [ " 60 minutes - $40 " ]
};

const AppointmentForm = ({ timesNotAvailable }) => {

  const [ massageType, setMassageType ] = useState('placeholder');
  const [ selectedTimeslot, setSelectedTimeslot ] = useState();
  const [ prices, setPrices ] = useState([]);
  const [ selectedPrice, setSelectedPrice ] = useState();
  const availableTimeSlots = [
    1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8
  ];
  const [ tStates, setTStates ] = useState(() => {
    const timeSlotButtonStates = {};
    availableTimeSlots.forEach((t,i) => timeSlotButtonStates[`timeSlotState_${i}`] = false );
    return timeSlotButtonStates;
  });
  const [clientInfo, setClientInfo] = useState({
    'Full Name': '',
    'Email': '',
    'Phone Number': '',
    'Appointment Date': '',
    'Massage Type': massageType,
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
  };

  const onMassageChange = (event) => {
    setMassageType(event.target.value)
    setClientInfo({
      ...clientInfo,
      'Massage Type': event.target.value
    });
    setPrices(pricesObject[event.target.value]);
  };

  const onPriceChange = (event) => {
    setSelectedPrice(event.target.value);
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
        <Box
          component="form"
          sx={{
            '& > :not(style)': { 
                m: 1, 
                width: '50ch' 
            }
          }}
          className="client-info-inputs"
          noValidate
          autoComplete="off"
        >
            {
              userFields.map(fieldName => (
                <TextField id={`${fieldName}-id`} label={fieldName} variant="standard" />
              ))
            }
          </Box>
          <Box className="timeslot-container">
            {
              availableTimeSlots.map((time,i) => (
                <Box className="timeslot" key={`timeSlotState_${i}`}>
                  <Button 
                    variant={tStates[`timeSlotState_${i}`] ? 'contained' : 'outlined' } 
                    onClick={e => onTimeslotClick(e) }
                    value={ `timeSlotState_${i}` }
                    size="large"
                  >
                    11:00 PM
                  </Button>
                </Box>
              ))
            }
          </Box>
          <Box >
            <FormControl required className="selection-container" fullWidth sx={{ marginTop: "2em" }}>
              <InputLabel id="massage-type-id">Massage Type*</InputLabel>
              <Select
                labelId="massage-type-id"
                id="massage-type-select"
                value={ massageType }
                label="Massage Type*"
                onChange={ onMassageChange }
                className="select-class"
              >
                {
                  massageTypes.map((m, i) => (
                    <MenuItem value={`${m.massage}`} key={`${m.massage}-${i}`}>
                        <em> { m.massage } </em>
                    </MenuItem>
                  ))
                }
              </Select>
              <br />
              <br />
              {
                massageType !== 'placeholder' && (
                  <FormControl required fullWidth>
                    <InputLabel id="massage-prices-id">Massage Prices*</InputLabel>
                    <Select
                      labelId="massage-prices-id"
                      id="massage-prices-select"
                      value={ selectedPrice }
                      label="Massage Prices*"
                      onChange={ onPriceChange }
                      className="select-class"
                    >
                      {
                        prices.length > 0 && 
                          ( 
                            prices.map((m, i) => (
                              <MenuItem value={`${m}`} key={`${m}-${i}`}>
                                <em> { m } </em>
                              </MenuItem>
                            ))
                          )
                      }
                    </Select>
                  </FormControl>
                )
              }
            </FormControl>
          </Box>
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