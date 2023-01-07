import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, TextField, Box } from '@mui/material';
import { sendEmail, createAppointment } from "../services/appointmentService";
import { graphql } from 'gatsby';

import '../scss/components/_appointment-form.scss';

const userFields = ['Full Name', 'Email', 'Phone Number'];
const massageTypes = [ 
  {
    massage: null
  },
  {
    massage: "Body/Foot Massage", 
  }, 
  { 
    massage: "Body Oil Massage", 
  }, 
];

const pricesObject = {
  "Body Oil Massage": [ 
    {
      txt:  " 120 minutes - $90 ", 
      time: 120, 
      price: 90,
    }, 
    { 
      txt: " 105 minutes - $80 ", 
      time: 105, 
      price: 80
    }, 
    {
      txt: " 90 minutes - $70 ", 
      time: 90, 
      price: 70
    }, 
    {
      txt: " 75 minutes - $60 ", 
      time: 75, 
      price: 60
    }, 
    {
      txt: " 60 minutes - $45 ", 
      time: 60, 
      price: 45
    }, 
    {
      txt: " 30 minutes - $30 ", 
      time: 30, 
      price: 30 
    }
  ],
  "Body/Foot Massage" : [ 
    {
      txt: " 60 minutes - $40 ", 
      time: 60, 
      price: 40 
    }
  ]
};


/* Shamelessly stolen from the following page:  
 * https://www.30secondsofcode.org/js/s/to-iso-string-with-timezone 
**/

const toISOStringWithTimezone = date => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    diff + pad(tzOffset / 60) +
    ':' + pad(tzOffset % 60);
};

const AppointmentForm = props => {
  
  const [ massageType, setMassageType ] = useState(null);
  const [ num_minutes, set_num_minutes ] = useState(null);
  const [ selectedTimeslot, setSelectedTimeslot ] = useState();
  const [ prices, setPrices ] = useState([]);
  const [ selectedPrice, setSelectedPrice ] = useState();
  const [ tStates, setTStates ] = useState(() => {
    const timeSlotButtonStates = {};
    props.timeslots.forEach((t,i) => timeSlotButtonStates[`timeSlotState_${i}`] = false );
    return timeSlotButtonStates;
  });
  const [clientInfo, setClientInfo] = useState({
    'Full Name': '',
    'Email': '',
    'Phone Number': '',
    'Massage Type': '',
    'Massage Date/Time': ''
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
  };
  
  const handleSubmit = async (clientInfo) => {
    const current_date = props.selectedDate.split('T')[0];
    const in_time = toISOStringWithTimezone(new Date(`${current_date} ${selectedTimeslot}`));
    const out_time = new Date(in_time).setMinutes(in_time.getMinutes() + 30);
    console.log(`${current_date} ${selectedTimeslot}`);
    console.log("Selected Time Slot", in_time);

    // await sendEmail({
    //   "subject": `Appointment for ${clientInfo["Full Name"]}`,
    //   "message": {
    //     "name": `${clientInfo["Full Name"]}`,
    //     "date": clientInfo["Appointment Date"],
    //     "time": clientInfo["Appointment Date"],
    //     "type": massageType,
    //     "price": 20
    //   } 
    // });

    await createAppointment({
      "INTIME": "2023-01-07T18:00:00-07:00",
      "OUTTIME": "2023-01-07T19:00:00-07:00",
      "DETAILS": {
          "FULL_NAME": clientInfo["Full Name"],
          "LOCATION": "Testing Location", 
          "EMAIL": clientInfo["Email"], 
          "PHONE_NUMBER": clientInfo["Phone Number"],
          "MASSAGE_TYPE": massageType
      }
    });

  };

  return (
    <>
      <Box className="appointment-form">
        <Box>
          <h2 className="appointments-heading">{ props.massageParlorName }</h2>
        </Box>
        <Box className="massageDate">
          { new Date(props.selectedDate).toDateString() }
        </Box>
        <form className="appointment-form-sub">
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
                  <TextField key={`${fieldName}-id`} id={`${fieldName}-id`} label={fieldName} variant="standard" />
                ))
              }
            </Box>
            { props.timeslots.length > 0 ? ( <Box className="timeslot-container">
              {
                props.timeslots.map((time,i) => (
                  <Box className="timeslot" key={`timeSlotState_${i}`}>
                    <Button 
                      variant={tStates[`timeSlotState_${i}`] ? 'contained' : 'outlined' } 
                      onClick={e => onTimeslotClick(e) }
                      value={ `timeSlotState_${i}` }
                      size="medium"
                    >
                      { time }
                    </Button>
                  </Box>
                ))
              }
            </Box> ) : 
            ( <Box className="no-availability-container"> 
                <h5> No Available Timeslots at this location! </h5>
              </Box> )
            }
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
                      m.massage && (
                      <MenuItem value={`${m.massage}`} key={`${m.massage}-${i}`}>
                          <em> { m.massage } </em>
                      </MenuItem> )
                    ))
                  }
                </Select>
                <br />
                <br />
                {
                  massageType && (
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
                          prices && 
                            ( 
                              prices.map((m, i) => (
                                <MenuItem value={`${m}`} key={`${m.txt}-${i}`}>
                                  <em> { m.txt } </em>
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
            <Box className="submit-button" onClick={ async () => await handleSubmit(clientInfo) } >
              <a href="#">
                Submit
              </a>
            </Box>
        </form>
      </Box>
    </>
  );
};

export default AppointmentForm;