import React, { useState } from 'react';
import { Button, Container, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { Rule } from './types';
import { PERCENT } from './constant';


const defaultRule = {
  id: 0,
  name: '',
  network: 1,
  condition: '',
  bidScore: 0,
  bidScoreType: PERCENT,
  status: true,
};

interface SimpleDataTableProps {
  rules: Rule[];
  columns: any[];
  onEditClick: (row: Rule) => void;
  onCreateClick: () => void;
}

const SimpleDataTable: React.FC<SimpleDataTableProps> = (
  {
    rules,
    columns,
    onEditClick,
    onCreateClick,
  }
) => {

  return (
    <Container maxWidth={false}>
      <h1>Auction Rules</h1>
      <Box mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={onCreateClick}>
          Create
        </Button>
      </Box>
      <DataGrid rows={rules} columns={columns} />
    </Container>
  );
};

export default SimpleDataTable;
