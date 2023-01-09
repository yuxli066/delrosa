import React, { useState, useRef } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, TextField, Box } from '@mui/material';
import { sendEmail, createAppointment } from "../services/appointmentService";
// import { graphql } from 'gatsby';

import '../scss/components/_appointment-form.scss';

const user_fields = ['Full Name', 'Email', 'Phone Number'];
const massage_types = [ 
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

const massage_prices = {
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
  return new Date(date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    diff + pad(tzOffset / 60) +
    ':' + pad(tzOffset % 60));
};

const AppointmentForm = props => {
  const massage_type_form = useRef(null);

  /** Massage Details & Client Info states */
  const [ massage_details, set_massage_details ] = useState({
    'Massage Type': '',
    'Appointment Length': '',
    'Price': '',
  });

  const [ client_info, set_client_info ] = useState({
    'Full Name': '',
    'Email': '',
    'Phone Number': '',
  });

  const [ tStates, setTStates ] = useState(() => {
    const timeSlotButtonStates = {};
    props.timeslots.forEach((t,i) => timeSlotButtonStates[`timeSlotState_${i}`] = false );
    return timeSlotButtonStates;
  });

  const [ selected_timeslot, set_selected_timeslot ] = useState(null);
  const [ prices, set_prices ] = useState([]);

  /** Input change handlers */
  const onTimeslotClick = (event) => {
    event.preventDefault();
    setTStates(() => {
      Object.keys(tStates).forEach((k) => tStates[k] = false );
      return tStates
    });
    setTStates({
      ...tStates,
      [event.target.value]: true
    });
    set_selected_timeslot(event.target.textContent);
  };

  const onMassageChange = (event) => {
    event.preventDefault();
    set_massage_details({
      ...massage_details, 
      'Massage Type': event.target.value,
      'Appointment Length': massage_prices[event.target.value].time,
      'Price': massage_prices[event.target.value].price
    });
    set_prices(massage_prices[event.target.value]);
  };

  const onPriceChange = (event) => {
    event.preventDefault();
    set_massage_details({
      ...massage_details, 
      'Price': event.target.value
    });
  };

  const on_input_change = async (event) => {
    event.preventDefault();
    switch (event.target.id) {
      case 'FULL_NAME_ID':
        set_client_info({
          'Full Name': event.target.value,
        });
        break;
      case 'EMAIL_ID':
        set_client_info({
          'Email': event.target.value,
        });
        break;
      case 'PHONE_NUMBER_ID':
        set_client_info({
          'Phone Number': event.target.value,
        });
        break;
      default: 
        break;
    }
  };
  
  const handleSubmit = async () => {
    
    /** Handle Error Checking Here */
    const current_date = props.selectedDate.split('T')[0];
    const in_time = toISOStringWithTimezone(new Date(`${current_date} ${selected_timeslot}`));
    const out_time = toISOStringWithTimezone(new Date(new Date(in_time).setMinutes(in_time.getMinutes() + massage_details['Appointment Length'])));

    // await sendEmail({
    //   "subject": `Appointment for ${client_info["Full Name"]}`,
    //   "message": {
    //     "name": `${client_info["Full Name"]}`,
    //     "date": client_info["Appointment Date"],
    //     "time": client_info["Appointment Date"],
    //     "type": massageType,
    //     "price": 20
    //   } 
    // });

    await createAppointment({
      "INTIME": in_time,
      "OUTTIME": out_time,
      "DETAILS": {
          "FULL_NAME": client_info["Full Name"],
          "LOCATION": props.store_location, 
          "EMAIL": client_info["Email"], 
          "PHONE_NUMBER": client_info["Phone Number"],
          "MASSAGE_TYPE": massage_details['Massage Type'],
          'PRICE': massage_details['Price']
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
        <Box className="appointment-form-sub">
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
                user_fields.map(fieldName => (
                  <TextField 
                    onChange={ on_input_change }
                    key={ `${fieldName}-id` } 
                    id={ String(`${fieldName}_ID`).toUpperCase() } 
                    label={fieldName} 
                    variant="standard" 
                  />
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
                  value={ massage_details['Massage Type'] }
                  label="Massage Type*"
                  onChange={ onMassageChange }
                  className="select-class"
                >
                  {
                    massage_types.map((m, i) => (
                      m.massage && (
                      <MenuItem value={`${m.massage}`} key={`${m.massage}-${i}`}>
                          <em> { m.massage } </em>
                      </MenuItem> )
                    ))
                  }
                  </Select>
                  {
                    massage_details['Massage Type'] !== '' ? (
                      <FormControl required fullWidth>
                        <InputLabel id="massage-prices-id">Massage Prices*</InputLabel>
                        <Select
                          labelId="massage-prices-id"
                          id="massage-prices-select"
                          value={ massage_details['Price'] }
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
                    ) : null
                  }
              </FormControl>
            </Box>
            <Box className="submit-button" onClick={ async () => await handleSubmit() } >
              <a href="#">
                Submit
              </a>
            </Box>
        </Box>
      </Box>
    </>
  );
};

export default AppointmentForm;