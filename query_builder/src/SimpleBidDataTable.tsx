import React from 'react';
import { Button, Container, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Bid } from './types';


interface BidDataTableProps {
    bids: Bid[];
    columns: any[];
    onEvaluateClick: () => void;
}


const SimpleDataTable: React.FC<BidDataTableProps> = (
    {
        bids,
        columns,
        onEvaluateClick,
    }
) => {

    return (
        <Container maxWidth="false">
            <h1>Bid Data</h1>
            <Box mb={2}>
                <Button variant="contained" color="primary" onClick={onEvaluateClick}>
                    Evaluate all rules
                </Button>
            </Box>
            <DataGrid rows={bids} columns={columns} />
        </Container>
    );
}

export default SimpleDataTable;
