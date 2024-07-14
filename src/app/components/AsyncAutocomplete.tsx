/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete as MuiAutocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  TypedUseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  useGetCountryChoicesQuery,
} from "app/services/core";
import React, { useEffect, useState } from "react";
import { Country, PaginatedResponse } from "types/apiTypes";

type ChoiceModel = "Country";

interface AsyncAutocompleteProps {
  choiceModel: ChoiceModel;
  error?: boolean;
  fullWidth: boolean;
  helperText?: null | string;
  inputId?: string;
  label?: string;
  onBlur?: () => void;
  onChange: (_: any, value: any) => void;
  required?: boolean;
  value?: any;
}

const CHOICE_QUERY_MAP: {[key in ChoiceModel]: TypedUseQuery<PaginatedResponse<Country>, void, any>} = {
  Country: useGetCountryChoicesQuery,
};

function AsyncAutocomplete({
  choiceModel,
  error,
  fullWidth,
  helperText,
  inputId,
  label,
  onBlur,
  onChange,
  required,
  value,
}: AsyncAutocompleteProps) {
  const {
    data: choiceQueryData,
    error: choiceQueryError,
  } = CHOICE_QUERY_MAP[choiceModel]();
  const [options, setOptions] = useState<{
    id: number;
    name: string;
  }[]>([]);

  useEffect(() => {
    if (choiceQueryData) {
      setOptions(choiceQueryData.results.map((x) => ({ id: x.id, name: x.name })));
    }
  }, [choiceQueryData]);

  return (
    <MuiAutocomplete
      disablePortal
      fullWidth={fullWidth}
      getOptionLabel={(option) => {
        const filtered = options.filter((x) => x.id === option);

        if (filtered.length) {
          return filtered[0].name;
        }

        return "Loading...";
      }}
      id={inputId}
      loading={!choiceQueryData}
      onBlur={onBlur}
      onChange={onChange}
      options={options.map((x) => x.id)}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {!choiceQueryData ? (
                  <CircularProgress
                    color="inherit"
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          label={label}
          margin="normal"
          required={required}
          variant="outlined"
        />
      )}
      value={value}
    />
  );
}

export default AsyncAutocomplete;
