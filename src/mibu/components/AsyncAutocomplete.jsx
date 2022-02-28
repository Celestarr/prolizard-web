/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete as MuiAutocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const AsyncAutocomplete = ({
  disabled,
  error,
  fetchOptions,
  fullWidth,
  helperText,
  inputId,
  label,
  onBlur,
  onChange,
  required,
  value,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!hasLoaded && isLoading) {
      (async () => {
        const response = await fetchOptions();
        setOptions([...response.results]);
        setHasLoaded(true);
        setIsLoading(false);
        setIsDisabled(false);
      })();
    }
  }, [fetchOptions, hasLoaded, isLoading]);

  useEffect(() => {
    if (!hasLoaded && !isLoading && isOpen) {
      setIsLoading(true);
    }
  }, [hasLoaded, isLoading, isOpen]);

  useEffect(() => {
    if (value) {
      setIsDisabled(true);
      setIsLoading(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MuiAutocomplete
      fullWidth={fullWidth}
      id={inputId}
      loading={isLoading}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      onOpen={() => {
        setIsOpen(true);
      }}
      options={options.map((x) => x.id)}
      getOptionLabel={(option) => {
        const filtered = options.filter((x) => x.id === option);

        if (filtered.length) {
          return filtered[0].name;
        }

        return "Loading...";
      }}
      disabled={isDisabled || disabled}
      onBlur={onBlur}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          label={label}
          required={required}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      value={value}
    />
  );
};

export default AsyncAutocomplete;
