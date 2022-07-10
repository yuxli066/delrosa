import React, { useState, useDebugValue } from 'react';
import DatePickerWithTimeInput from './DatePicker';
import '../scss/components/_appointment-form.scss';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { sendEmail, createAppointment } from "../services/appointmentService";

const AppointmentForm = ({ timesNotAvailable }) => {

  const [massageType, setMassageType] = useState("Full Body Massage");
  
  const [clientInfo, setClientInfo] = useState({
    'First Name': '',
    'Last Name': '',
    'Email': '',
    'Phone Number': '',
    'Appointment Date': '',
    'Massage Type': massageType,
  });

  const userFields = ['First Name', 'Last Name', 'Email', 'Phone Number'];
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

  const onDateChange = newDate => {
    setClientInfo({
      ...clientInfo,
      'Appointment Date': new Date(newDate).toISOString()
    });
  };

  const handleSubmit = async (clientInfo) => {
    console.log(clientInfo)
    await sendEmail({
      "subject": `Appointment for ${clientInfo["First Name"]} ${clientInfo["Last Name"]}`,
      "message": {
        "name": `${clientInfo["First Name"]} ${clientInfo["Last Name"]}`,
        "date": clientInfo["Appointment Date"],
        "time": clientInfo["Appointment Date"],
        "type": massageType,
        "price": 20
      } 
    });

    await createAppointment({
      'First Name': clientInfo["First Name"],
      'Last Name': clientInfo["Last Name"],
      'Email': clientInfo["Email"],
      'Phone Number': clientInfo["Phone Number"],
      'Appointment Date': "2022-07-10T19:00:00-07:00",
      'Massage Type': massageType
    });
    // 2022-07-10T19:00:00-07:00
    // Tue Feb 25 2020 10:03:00 GMT-0800
    // const apptDateISOString = new Date(clientInfo["Appointment Date"]).toISOString();
    // console.log(apptDateISOString)

  };

  useDebugValue(timesNotAvailable); // used for debugging purposes

  return (
    <>
      <div className="login-box">
        <div>
          <h2 className="appointments-heading">Appointments</h2>
        </div>
        <form>
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
          <div className="date-wrapper">
            <DatePickerWithTimeInput onDateChange={onDateChange} />
          </div>
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