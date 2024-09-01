import React, { useState } from 'react';
import { Button, Container, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { Rule } from './types';
import { INCREASE } from './constant';


const defaultRule = {
  id: 0,
  name: '',
  network: 1,
  condition: '',
  bidScore: 0,
  bidScoreType: INCREASE,
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
    <Container maxWidth="false">
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


//   const parser = new Parser();
//   const [rules, setRules] = useState<Rule[]>(initialRules);
//   const [bidData, setBidData] = useState<rawBid[]>(defaultBidData);
//   const [open, setOpen] = useState(false);
//   const [newRule, setNewRule] = useState(defaultRule);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleSaveRule = (updatedRule: Rule) => {
//     setRules((prev) => {
//       if (updatedRule.id === 0) {
//         updatedRule.id = prev.length + 1;
//         return [...prev, updatedRule];
//       } else {
//         return prev.map((rule) => rule.id === updatedRule.id ? updatedRule : rule);
//       }
//     });
//     handleClose();
//   }

//   const handleOpenDialog = (rule?: Rule) => {
//     if (rule) {
//       setNewRule(rule);
//     } else {
//       setNewRule(defaultRule);
//     }
//     setOpen(true);
//   }

//   const handleCloseDialog = () => {
//     setNewRule(defaultRule);
//     setOpen(false);
//   }

//   const evaludateRule = (rules: Rule[], bid: rawBid) => {
//     bid.match = 'No';
//     bid.newScore = bid.BidScore || 0;
//     for(let i = 0; i < rules.length; i++) {
//       let rule = rules[i]; 
//       if (bid.network === rule.network) {
//         // Since expr-eval does not support && and ||, we need to replace them with `and` and `or`
//         let exprEvalExpression = rule.condition
//           .replaceAll('&&', 'and')
//           .replaceAll('||', 'or');
//         const expr = parser.parse(exprEvalExpression);
//         const result = expr.evaluate(bid);
//         if (!result) {
//           continue;
//         }
//         bid.match = 'Yes';
//         if (rule.bidScoreType === 'fix') {
//           bid.newScore = rule.bidScore;
//           break;
//         }else {
//           if (rule.bidScoreType === 'increase') {
//             bid.newScore *= (1 + (rule.bidScore/100));
//           }else if (rule.bidScoreType === 'decrease') {
//             bid.newScore *= (1 - (rule.bidScore/100));
//           }            
//         }
//       }      
//     }
//     return bid;
//   }

//   const handleEvaluateRule = (rule: Rule) => {
//     bidData.forEach((bid) => {
//       setBidData((prev) => prev.map((b) => b.id === bid.id ? evaludateRule([rule], b) : b));
//     });
//   }
//   const evaludateEachBidData = () => {
//     let sortRules = [...rules];
//     sortRules.sort((a, b) => b.bidScore - a.bidScore);
    
//     // Evaluate fix score rules first
//     bidData.forEach((bid) => {
//       let evaluatedBid = evaludateRule(sortRules, bid);
//       setBidData((prev) => prev.map((b) => b.id === evaluatedBid.id ? evaluatedBid : b));
//     });
//   }

//   return (
//     <>
//     <Container maxWidth="lg">
//       <h1>Auction Rules</h1>
//       <Box mb={2}>
//         <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>
//           Create
//         </Button>
//       </Box>
//       <Box mb={2}>
//         <Button variant="contained" color="primary" onClick={evaludateEachBidData}>
//           Evaluate All
//         </Button>
//       </Box>
//       <DataGrid rows={rules} columns={columns} />
//       <CreateDialog
//         open={open}
//         onClose={handleClose}
//         onCreate={handleSaveRule}
//         rule={newRule}
//       />      
//     </Container>
//     </>
//   );