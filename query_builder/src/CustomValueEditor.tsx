// src/components/CustomValueEditor.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { ValueEditorProps } from 'react-querybuilder';

const CustomValueEditor: React.FC<ValueEditorProps> = ({ value, handleOnChange }) => {
  return (
    <TextField
      style={{ width: '100px' }}
      value={value || ''} // Ensure it handles empty values
      onChange={(e) => handleOnChange(e.target.value)}
      label="Value"
      variant="outlined"
    />
  );
};

export default CustomValueEditor;