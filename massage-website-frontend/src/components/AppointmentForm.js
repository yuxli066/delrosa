import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, TextField, Box, Alert, Link } from '@mui/material';
import { createAppointment, sendEmail } from "../services/appointmentService";
import { TextMaskCustom } from '../components/InputMask';
import '../scss/components/_appointment-form.scss';

const user_fields = [ 
  { 
    input_label: 'Full Name', 
    input_pattern: '[0-9]*',
    name: 'Full_Name',
    error_msg: 'Please enter a valid name into the field',
  }, 
  { 
    input_label: 'Email', 
    input_pattern: '[0-9]*',
    name: 'Email',
    error_msg: 'Please enter a valid Email into the field',
  }, 
  { 
    input_label: 'Phone Number',
    input_pattern: '[0-9]*',
    name: 'Phone_Number',
    error_msg: 'Please enter a valid Phone Number into the field'
  }
];
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
  /** Massage Details & Client Info states */
  const [ massage_details, set_massage_details ] = useState({
    'Massage Type': '',
    'Price': '',
  });

  const [ client_info, set_client_info ] = React.useState(() => ({ 
    Full_Name: {
      value: '',
      error: false,
    },
    Email: {
      value: '',
      error: false
    },
    Phone_Number: {
      value: '', 
      error: false
    } 
  }));
  const [ tStates, setTStates ] = useState(() => {
    const timeSlotButtonStates = {};
    props.timeslots.forEach((t,i) => timeSlotButtonStates[`timeSlotState_${i}`] = false );
    return timeSlotButtonStates;
  });
  const [ selected_timeslot, set_selected_timeslot ] = useState(null);
  const [ prices, set_prices ] = useState([]);
  const onTimeslotClick = (event) => {
    // event.preventDefault();
    setTStates(() => {
      Object.keys(tStates).forEach((k) => tStates[k] = false );
      return {
        ...tStates,
        [event.target.value]: true
      }
    });
    set_selected_timeslot(event.target.textContent);
  };
  const handle_input_change = (event) => {
    let is_input_valid;
    switch(event.target.name) {
      case 'Full_Name':
        is_input_valid = /[a-zA-Z\s]+/gm.test(event.target.value) && event.target.value.length > 0;
        break;
      case 'Email':
        is_input_valid = /[a-zA-Z0-9]+@[a-zA-Z0-9]+.com/gm.test(event.target.value) && event.target.value.length > 0;
        break;
      case 'Phone_Number': 
        is_input_valid = /\+1 \(\d{3}\) \d{3}-\d{4}/gm.test(event.target.value) && event.target.value.length > 0;
        break;
      default:
        break;
    }
    set_client_info(() => ({
      ...client_info,
      [event.target.name]: {
          value: event.target.value, 
          error: !is_input_valid
      }
    }));
  };
  const onMassageChange = (event) => {
    event.preventDefault();
    set_prices(massage_prices[event.target.value]);
    set_massage_details({
      ...massage_details, 
      'Massage Type': event.target.value,
    });
  };
  const onPriceChange = (event) => {
    event.preventDefault();
    set_massage_details({
      ...massage_details, 
      'Description': event.target.value,
      'Appointment Length': prices.find(m => String(m.txt).trim() === String(event.target.value).trim()).time,
      'Price': prices.find(m => String(m.txt).trim() === String(event.target.value).trim()).price,
    });
  };
  const [ fields_with_errors, set_fields_with_errors ] = useState([]);
  const handleSubmit = async () => {

    /** Handle Error Checking Here */
    const current_date = props.selectedDate.split('T')[0];
    const in_time = toISOStringWithTimezone(new Date(`${current_date} ${selected_timeslot}`));
    const out_time = toISOStringWithTimezone(new Date( new Date(in_time).setMinutes(in_time.getMinutes() + massage_details['Appointment Length']) ));
    
    /** Check if any field contains errors */
    const errors = [];
    let new_client_info = client_info;
    Object.entries(client_info).forEach(c_info => {
      if (c_info[1].error === true || client_info[c_info[0]].value === '') {
        errors.push(c_info[0].replace('_',' '));
        new_client_info = {
          ...new_client_info,
          [c_info[0]]: {
              value: client_info[c_info[0]].value,
              error: true
          }
        }
        set_client_info(new_client_info);
      }
    });

    if (String(in_time) === 'Invalid Date' || String(out_time) === 'Invalid Date') {
      errors.push('Appointment Time Slot');
    }
    if (massage_details['Massage Type'] === '') {
      errors.push('Massage Type');
    }
    if (massage_details['Price'] === '') {
      errors.push('Massage Price/Duration');
    }

    set_fields_with_errors(errors);
    
    if (errors.length === 0) {
      const date_options = { weekday: 'long', month: 'long', day: 'numeric' };
      const time_options = { hour: 'numeric', minute: '2-digit' };

      const store_email = 'paulli@delrosamassage.com';
      const in_date_formatted = new Date(in_time).toLocaleDateString('en-US', date_options);
      const in_time_formatted = new Date(in_time).toLocaleTimeString('en-US', time_options);
      const out_time_formatted = new Date(out_time).toLocaleTimeString('en-US', time_options);

      // send email notification to store/us
      await sendEmail({
        "email_type": "massage", 
        "subject": `Appointment for ${client_info.Full_Name.value}`,
        "toemail": store_email,
        "message": {
          "name": `${client_info.Full_Name.value}`,
          "massage_parlor": props.massageParlorName,
          "date": current_date,
          "time": `From ${in_time_formatted} to ${out_time_formatted}`,
          "type": massage_details['Massage Type'],
          "price": massage_details['Price']
        } 
      });

      // send email notification to client
      await sendEmail({
        "email_type": "client", 
        "subject": `Hello ${client_info.Full_Name.value}, Your appointment on ${in_date_formatted}`,
        "toemail": client_info.Email.value,
        "message": {
          "name": `${client_info.Full_Name.value}`,
          "massage_parlor": props.massageParlorName,
          "date": in_date_formatted,
          "time": in_time_formatted,
          "type": massage_details['Massage Type'],
          "price": massage_details['Price']
        } 
      });

      await createAppointment({
        "INTIME": in_time,
        "OUTTIME": out_time,
        "DETAILS": {
            "FULL_NAME": client_info.Full_Name.value,
            "LOCATION": props.store_location, 
            "EMAIL": client_info.Email.value, 
            "PHONE_NUMBER": client_info.Phone_Number.value,
            "MASSAGE_TYPE": massage_details['Massage Type'],
            'PRICE': massage_details['Price']
        }
      }); 
    }
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
                user_fields.map(fieldName => {
                  return (
                    <TextField
                      key={ `${fieldName.input_label}-id` } 
                      label={ fieldName.input_label } 
                      value={ client_info[fieldName.name].value }
                      onChange={ handle_input_change }
                      name={ fieldName.name }
                      id={ String(fieldName.input_label).toUpperCase() } 
                      InputProps={{
                        inputComponent: TextMaskCustom,
                      }}
                      error={ client_info[fieldName.name].error }
                      helperText={ String(fieldName.error_msg) }
                      variant="standard"
                    />
                  );
                })
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
                    ( massage_details['Massage Type'] !== '' ) ? (
                      <FormControl required fullWidth>
                        <InputLabel id="massage-prices-id">Massage Prices*</InputLabel>
                        <Select
                          labelId="massage-prices-id"
                          id="massage-prices-select"
                          value={ massage_details['Description'] }
                          label="Massage Prices*"
                          onChange={ onPriceChange }
                          className="select-class"
                        >
                          {
                            prices && 
                              ( 
                                prices.map((m, i) => (
                                  <MenuItem value={`${m.txt}`} key={`${m.txt}-${i}`}>
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
            {
              fields_with_errors.length > 0 ? 
                ( 
                  <Box className="invalid-input">
                    <Alert severity="error">{`Invalid input for ${fields_with_errors.join(', ')}`}</Alert>
                  </Box>
                ) : (<></>)
            }
            <Link onClick={ handleSubmit } >
              <Box className="submit-button" >
                Submit
              </Box>
            </Link>
        </Box>
      </Box>
    </>
  );
};

export default AppointmentForm;