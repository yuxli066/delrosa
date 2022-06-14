import React, { useState } from 'react';
import DatePickerWithTimeInput from './DatePicker';
import '../scss/components/_appointment-form.scss';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const AppointmentForm = () => {
  const [age, setAge] = useState('');
  
  const [clientInfo, setClientInfo] = useState({
    'First Name': '',
    'Last Name': '',
    'Email': '',
    'Phone Number': '',
    'Appointment Date': ''
  });

  const userFields = ['First Name', 'Last Name', 'Email', 'Phone Number'];
  const massageTypes = ["Foot Massage", "Full Body Massage", "Hot Stones Massage"];

  const onMassageChange = (event) => {
    setAge(event.target.value);
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
      'Appointment Date': newDate
    });
  };

  console.log(clientInfo);

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
              id="demo-simple-select"
              value={age}
              label="Massage Type*"
              onChange={ onMassageChange }
            >
              {
                massageTypes.map(type => (
                  <MenuItem value={`${type}`} >
                      <em> { type } </em>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <div className="submit-button">
            <a href="#">
              Submit
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;