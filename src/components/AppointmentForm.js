import React, { useState } from 'react';
import DatePickerWithTimeInputExample from './DatePicker';
import '../scss/components/_appointment-form.scss';

const AppointmentForm = () => {
  const [clientInfo, setClientInfo] = useState({
    'First Name': '',
    'Last Name': '',
    'Email': '',
    'Phone Number': '',
    'Appointment Date': ''
  });
  const userFields = ['First Name', 'Last Name', 'Email', 'Phone Number'];

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
          <DatePickerWithTimeInputExample onDateChange={onDateChange} />
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