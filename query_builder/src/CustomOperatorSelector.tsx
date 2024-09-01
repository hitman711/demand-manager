// src/components/CustomOperatorSelector.tsx
import { TextField } from '@mui/material';
import React from 'react';
import { OperatorSelectorProps } from 'react-querybuilder';

const CustomOperatorSelector: React.FC<OperatorSelectorProps> = ({ value, handleOnChange }) => {
  return (
    <div>
      {/* Render the selected operator or a disabled field */}
      <TextField
        value={value || 'Select an operator'}
        variant="outlined"
        InputProps={{
          readOnly: true, // Makes the TextField non-editable
        }}
      />
    </div>
  );
};

export default CustomOperatorSelector;
