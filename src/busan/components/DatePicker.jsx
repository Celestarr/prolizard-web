/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable arrow-body-style */

import { DatePicker as MuiDatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import React from "react";

const DEFAULT_FORMAT = "yyyy-MM-DD";
const DEFAULT_MASK = "____-__-__";
// const DEFAULT_PLACEHOLDER = "YYYY-MM-DD";

const DatePicker = ({
  clearable,
  error,
  format,
  fullWidth,
  helperText,
  id,
  label,
  margin,
  mask,
  onBlur,
  onChange,
  // placeholder,
  required,
  value,
  variant,
}) => {
  return (
    <MuiDatePicker
      inputFormat={format}
      clearable={clearable}
      label={label}
      onChange={onChange}
      // InputProps={{
      //   placeholder: placeholder || DEFAULT_PLACEHOLDER,
      // }}
      mask={mask}
      renderInput={(props) => (
        <TextField
          {...props}
          onBlur={onBlur}
          fullWidth={fullWidth}
          margin={margin}
          error={error}
          helperText={helperText}
          id={id}
          required={required}
          variant={variant}
        />
      )}
      value={value}
    />
  );
};

DatePicker.defaultProps = {
  clearable: true,
  format: DEFAULT_FORMAT,
  fullWidth: true,
  margin: "normal",
  mask: DEFAULT_MASK,
  required: false,
  variant: "outlined",
  // placeholder: DEFAULT_PLACEHOLDER,
};

export default DatePicker;
