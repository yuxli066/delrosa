import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Button, TextField, Box } from '@mui/material';
import { sendEmail, createAppointment } from "../services/appointmentService";
import '../scss/components/_appointment-form.scss';

const userFields = ['Full Name', 'Email', 'Phone Number'];
const massageTypes = [ 
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

const AppointmentForm = props => {
  
  const [ massageType, setMassageType ] = useState('placeholder');
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

  return (
    <>
      <Box className="appointment-form">
        <Box>
          <h2 className="appointments-heading">{ props.massageParlorName }</h2>
        </Box>
        <Box className="massageDate">
          { props.selectedDate }
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
                  <TextField id={`${fieldName}-id`} label={fieldName} variant="standard" />
                ))
              }
            </Box>
            <Box className="timeslot-container">
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
            <Box className="submit-button">
              <a href="#" onClick={ async () => await handleSubmit(clientInfo) }>
                Submit
              </a>
            </Box>
        </form>
      </Box>
    </>
  );
};

export default AppointmentForm;