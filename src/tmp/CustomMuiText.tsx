import React, { useState } from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import {
  IconButton,
  Input,
  InputAdornment,
  InputBaseComponentProps,
  InputProps,
  OutlinedInput,
  TextField,
  useTheme
} from '@mui/material';
import merge from 'lodash/merge';
import Close from '@mui/icons-material/Close';
import { JsonFormsTheme, useDebouncedChange } from '@jsonforms/material-renderers';
import { showAsRequired } from '@jsonforms/core';

interface MuiTextInputProps {
  muiInputProps?: InputProps['inputProps'];
  inputComponent?: InputProps['inputComponent'];
}

const eventToValue = (ev: any) => (ev.target.value === '' ? undefined : ev.target.value);

export const MuiInputText = React.memo((props: CellProps & WithClassname & MuiTextInputProps) => {
  const [showAdornment, setShowAdornment] = useState(false);
  const {
    // @ts-ignore
    required,

    // @ts-ignore
    label,
    data,
    config,
    className,
    id,
    enabled,
    uischema,
    isValid,
    path,
    handleChange,
    schema,
    muiInputProps,
    inputComponent
  } = props;
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  let inputProps: InputBaseComponentProps;
  if (appliedUiSchemaOptions.restrict) {
    inputProps = { maxLength: maxLength };
  } else {
    inputProps = {};
  }

  inputProps = merge(inputProps, muiInputProps);

  if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
    inputProps.size = maxLength;
  }

  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue);
  const onPointerEnter = () => setShowAdornment(true);
  const onPointerLeave = () => setShowAdornment(false);

  const theme: JsonFormsTheme = useTheme();

  const closeStyle = {
    background: theme.jsonforms?.input?.delete?.background || theme.palette.background.default,
    borderRadius: '50%'
  };

  return (
    <>
      <TextField
        // {...field}
        required={showAsRequired(required, appliedUiSchemaOptions.hideRequiredAsterisk)}
        // disabled={disabled}
        fullWidth
        label={label}
        type={appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              style={{
                display: !showAdornment || !enabled || data === undefined ? 'none' : 'flex',
                position: 'absolute',
                right: 0
              }}
            >
              <IconButton aria-label="Clear input field" onClick={onClear} size="large">
                <Close style={closeStyle} />
              </IconButton>
            </InputAdornment>
          )
        }}
        // autoComplete="current-password"
        error={!isValid}
        value={inputText}
        onChange={onChange}
        InputLabelProps={{
          shrink: true
        }}
        // InputProps={{
        //   endAdornment: (
        //     <InputAdornment position="end">
        //       <IconButton onClick={handleClickShowPassword} edge="end">
        //         {showPassword ? <VisibilityOff /> : <Visibility />}
        //       </IconButton>
        //     </InputAdornment>
        //   )
        // }}
      />

      {/*
    <OutlinedInput
      type={
        appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'
      }
      value={inputText}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      multiline={appliedUiSchemaOptions.multi}
      fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
      inputProps={inputProps}
      error={!isValid}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      endAdornment={
        <InputAdornment
          position='end'
          style={{
            display:
              !showAdornment || !enabled || data === undefined ? 'none' : 'flex',
            position: 'absolute',
            right: 0
          }}
        >
          <IconButton
            aria-label='Clear input field'
            onClick={onClear}
            size='large'
          >
            <Close style={closeStyle}/>
          </IconButton>
        </InputAdornment>
      }
      inputComponent={inputComponent}
    />*/}
    </>
  );
});
