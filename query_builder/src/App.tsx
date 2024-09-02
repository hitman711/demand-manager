import React, { useState } from 'react';
import './App.css';
import SimpleDataTable from './SimpleDataTable';
import BidDataTable from './SimpleBidDataTable';
import { Rule, Bid } from './types';
import { INCREASE, DECREASE, FIXED } from './constant';
import { ACTIVE } from './constant';
import sampleBidData from './data/sampleBidData.json';
import { 
  Button
} from '@mui/material';

import { Field, RuleGroupType } from 'react-querybuilder';
import EditRuleDialog from './EditRuleDialog';
import { Parser } from 'expr-eval';

// Sample data for the table
const initialRules: Rule[] = [
  { id: 1, name: 'Rule 1 (DealID)', network: 1, condition: 'DealID == 1', bidScore: 50, bidScoreType: INCREASE, status: ACTIVE },
  { id: 2, name: 'Rule 2 (SeatID)', network: 1, condition: 'SeatID == 2', bidScore: 50, bidScoreType: DECREASE, status: ACTIVE },
  { id: 3, name: 'Rule 3 (DealID)', network: 1, condition: 'DealID == 1', bidScore: 10, bidScoreType: FIXED, status: ACTIVE },
  { id: 4, name: 'Rule 4 (SeatID)', network: 1, condition: 'SeatID == 1', bidScore: 40, bidScoreType: FIXED, status: ACTIVE },
  { id: 5, name: 'Rule 5 (DealID & SeatID)', network: 1, condition: 'DealID == 1 && SeatID == 1', bidScore: 100, bidScoreType: FIXED, status: ACTIVE },
  { id: 6, name: 'Rule 6 (DealID & SeatID)', network: 3, condition: 'DealID == 2 && SeatID == 1 && CampaignID == 2', bidScore: 110, bidScoreType: FIXED, status: ACTIVE },
];

const bidColumns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'network', headerName: 'Network', flex: 1 },
  { field: 'DealID', headerName: 'Deal ID', flex: 1 },
  { field: 'SeatID', headerName: 'Seat ID', flex: 1 },
  { field: 'Bidder', headerName: 'Bidder', flex: 1 },
  { field: 'Advertiser', headerName: 'Advertiser', flex: 1 },
  { field: 'CampaignID', headerName: 'Campaign ID', flex: 1 },
  { field: 'BidScore', headerName: 'Bid Score', flex: 1 },
  { field: 'match', headerName: 'Match', flex: 1, renderCell: (param) => {
    return (
      <div style={{ color: param.value === 'No' ? 'red' : 'green' }}>
        {param.value}
      </div>
    );
  }},
  { field: 'newScore', headerName: 'New Score', width: 150 },
  { field: 'ruleIDs', headerName: 'Rule IDs', flex: 1 },
];

// React query bparseruilder query field
const queryFields: Field[] = [
  { name: 'DealID', label: 'Deal ID' },
  { name: 'SeatID', label: 'Seat ID' },
  { name: 'Bidder', label: 'Bidder' },
  { name: 'Advertiser', label: 'Advertiser' },
  { name: 'CampaignID', label: 'Campaign ID' },
];

const operators = [
  { name: '=', label: '=' }
];


// Custom control elements to disable adding rules and groups
const customControlElements = {
  //addRuleAction: () => <span></span>,   // Hide the "Add Rule" button
  addGroupAction: () => <span></span>,  // Hide the "Add Group" button
  removeRuleAction: () => <span></span>, // Hide the "Remove Rule" button
};

const defaultQueryRule: RuleGroupType = { 
  combinator: 'and', 
  rules: [
    {
      field: 'DealID',
      operator: '=',
      value: ''
    },
    {
      field: 'SeatID',
      operator: '=',
      value: ''
    },
    {
      field: 'CampaignID',
      operator: '=',
      value: ''
    }
  ],
  not: false
};


const App = () => {
  const parser = new Parser();
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bidData, setBidData] = useState<Bid[]>(sampleBidData);

  const handleEditClick = (rule: Rule) => {
    setSelectedRule(rule);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteClick = (rule: Rule) => {
    setRules(prevRules => prevRules.filter(r => r.id !== rule.id));
  }

  const handleCreateClick = () => {
    setSelectedRule(null);
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRule(null);
    setIsEditMode(false);
  };

  const handleSaveDialog = (rule: Rule) => {
    if (isEditMode && selectedRule) {
      // Update existing rule
      setRules(prevRules => prevRules.map(r => r.id === selectedRule.id ? rule : r));
    } else if (!isEditMode) {
      // Add new rule
      setRules(prevRules => [...prevRules, { ...rule, id: rules.length + 1 }]); // Ensure a unique ID
    }
  };
  

  // Define the columns for the DataGrid
  const ruleColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'network', headerName: 'Network', flex: 1 },
    { field: 'condition', headerName: 'Condition', flex: 1},
    { field: 'bidScore', headerName: 'Bid Score', flex: 1 },
    { field: 'bidScoreType', headerName: 'Bid Score type', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => {
      return (
        <Button onClick={() => handleEditClick(params.row)}>Edit</Button>
      );
    }},
    { field: 'Delete', headerName: 'Delete', flex: 1, renderCell: (params) => {
      return (
        <Button onClick={() => handleDeleteClick(params.row)}>Delete</Button>
      );
    }},
    { field: 'Evaluate', headerName: 'Evaluate', flex: 1, renderCell: (params) => {
      return (
        <Button onClick={() => handleEvaluateRule(params.row)}>Evaluate</Button>
      );
    }}
  ];

  const exprEvalExpression = (condition: string, bid: Bid) => {
        // Since expr-eval does not support && and ||, we need to replace them with `and` and `or`
        let exprEvalExpression = condition
          .replaceAll('&&', 'and')
          .replaceAll('||', 'or');
        const expr = parser.parse(exprEvalExpression);
        return expr.evaluate(bid);
  };

  const evaludateRule = (rules: Rule[], bid: Bid) => {
    bid.match = 'No';
    bid.newScore = bid.BidScore || 0;
    bid.ruleIDs = [];
    for(let i = 0; i < rules.length; i++) {
      let rule = rules[i]; 
      if (bid.network === rule.network) {
        if (!exprEvalExpression(rule.condition, bid)) {
          continue;
        }
        bid.match = 'Yes';
        if (rule.bidScoreType === 'fixed') {
          bid.ruleIDs.push(rule.id);
          bid.newScore = rule.bidScore;
          break;
        }else {
          if (rule.bidScoreType === 'increase') {
            bid.ruleIDs.push(rule.id);
            bid.newScore *= (1 + (rule.bidScore/100));
          }else if (rule.bidScoreType === 'decrease') {
            bid.ruleIDs.push(rule.id);
            bid.newScore *= (1 - (rule.bidScore/100));
          }            
        }
      }      
    }
    return bid;
  }

  // Evaluate single rule on all bid data
  const handleEvaluateRule = (rule: Rule) => {
    bidData.forEach((bid) => {
      setBidData((prev) => prev.map((b) => b.id === bid.id ? evaludateRule([rule], b) : b));
    });
  }

  // Evaluate all rules on all bid data
  const evaludateEachBidData = () => {
    let sortRules = [...rules];
    sortRules.sort((a, b) => b.bidScore - a.bidScore);
    // Evaluate fix score rules first
    bidData.forEach((bid) => {
      let evaluatedBid = evaludateRule(sortRules, bid);
      setBidData((prev) => prev.map((b) => b.id === evaluatedBid.id ? evaluatedBid : b));
    });
  }


  return (
    <div className="App">
      <SimpleDataTable
        rules={rules}
        columns={ruleColumns}
        onEditClick={handleEditClick}
        onCreateClick={handleCreateClick}
      />

      <BidDataTable
        bids={bidData}
        columns={bidColumns}
        onEvaluateClick={evaludateEachBidData}
      />

      {dialogOpen && (
        <EditRuleDialog
          open={dialogOpen}
          queryFields={queryFields}
          initialRule={selectedRule || undefined}
          defaultQueryRule={defaultQueryRule}
          operators={operators}
          customControlElements={customControlElements}
          isEditMode={isEditMode}
          onClose={handleCloseDialog}
          onSave={handleSaveDialog}
        />
      )}
    </div>
  );
}

export default App;