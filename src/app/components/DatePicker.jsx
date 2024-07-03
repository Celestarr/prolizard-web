/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable arrow-body-style */

import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import React from "react";

const DEFAULT_FORMAT = "yyyy-MM-DD";
const DEFAULT_MASK = "____-__-__";
// const DEFAULT_PLACEHOLDER = "YYYY-MM-DD";

function DatePicker({
  clearable = true,
  error,
  format = DEFAULT_FORMAT,
  fullWidth = true,
  helperText,
  id,
  label,
  margin = "normal",
  mask = DEFAULT_MASK,
  onBlur,
  onChange,
  // placeholder,
  required = false,
  value,
  variant = "outlined",
}) {
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
      slotProps={{
        textField: {
          error,
          fullWidth,
          helperText,
          id,
          margin,
          onBlur,
          required,
          variant,
        },
      }}
      value={value}
    />
  );
}

export default DatePicker;
