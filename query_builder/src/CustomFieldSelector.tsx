// src/components/CustomFieldSelector.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { FieldSelectorProps } from 'react-querybuilder';

const CustomFieldSelector: React.FC<FieldSelectorProps> = ({
  options,
  value,
  handleOnChange,
}) => {
  return (
    <TextField
      style={{ width: '100px', padding: '2px', margin: '2px' }}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      label="Field"
      variant="outlined"
      InputProps={{
        readOnly: true, // Makes the TextField non-editable
      }}
    />
  );
};

export default CustomFieldSelector;
