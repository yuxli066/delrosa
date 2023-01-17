import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IMaskInput, IMask } from 'react-imask';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const get_mask = {
      "Full_Name": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "Email": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "Phone_Number": "+1 (###) ###-####" 
    }
    const { onChange, name, lazy_flag, ...other } = props;
    const [ val, set_val ] = useState('');

    return (
      <IMaskInput
        {...other}
        mask={get_mask[name]}
        definitions={{
          '#': /[1-9]/,
          'b': /[a-zA-Z\s]/,
          'e': /[1-9a-zA-Z\s@.]/
        }} 
        inputRef={ref}
        onAccept={(value) => {
            set_val(value) 
            onChange({ target: { name: props.name, value } })}
        }
        overwrite
        value={val}
        lazy={true}
      />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export { TextMaskCustom }