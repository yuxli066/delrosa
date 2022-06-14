import React, { useState } from 'react';
import { enGB } from 'date-fns/locale';
import { DatePicker, useDateInput } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import '../scss/components/_appointment-form.scss';

function DatePickerWithTimeInput({onDateChange}) {
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
    <div style={{ 
      
      display: 'flex' 
    }}>
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
          <input className={'date-input' + (focused ? ' -focused' : '')} 
          style={{ 
            width: 180, 
            height: 60,
            marginTop: "-2em" 
          }} {...inputProps} />
        )}
      </DatePicker>
      <input className='date-input' 
        style={{ 
          marginLeft: 16, 
          width: 120, 
          height: 60,
          marginTop: "-2em"  
        }} {...timeInputProps} />
    </div>
  );
}

export default DatePickerWithTimeInput;