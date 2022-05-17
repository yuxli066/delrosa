import React, { useState } from 'react';
import { enGB } from 'date-fns/locale';
import { DatePicker, useDateInput } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';

function DatePickerWithTimeInputExample({onDateChange}) {
  const [date, setDate] = useState(new Date(2020, 1, 24, 18, 15));
  const timeInputProps = useDateInput({
    date,
    format: 'HH:mm',
    locale: enGB,
    onDateChange: newDate => {
      onDateChange(newDate);
      setDate(newDate);
    }
  });
  return (
    <div style={{ display: 'flex' }}>
      <DatePicker 
        date={date} 
        onDateChange={newDate => {
          onDateChange(newDate);
          setDate(newDate);
        }}
        locale={enGB}
        format='dd/MM/yyyy'
      >
        {({ inputProps, focused }) => (
          <input className={'input' + (focused ? ' -focused' : '')} style={{ width: 150 }} {...inputProps} />
        )}
      </DatePicker>
      <input className='input' style={{ marginLeft: 16, width: 80 }} {...timeInputProps} />
    </div>
  );
}

export default DatePickerWithTimeInputExample;