// EditRuleDialog.tsx
import React, { useState, ChangeEvent } from 'react';
import { QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import { parseCEL } from "react-querybuilder/parseCEL";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, capitalize, FormLabel, FormControlLabel, SelectChangeEvent } from '@mui/material';
import Switch from '@mui/material/Switch';
import { Rule as RuleType } from './types';
import { INCREASE, DECREASE, FIXED, ACTIVE } from './constant';

interface EditRuleDialogProps {
  open: boolean;
  queryFields: any[];
  operators: any[];
  initialRule?: RuleType;
  defaultQueryRule: RuleGroupType;
  isEditMode: boolean;
  onClose: () => void;
  onSave: (rule: RuleType) => void;
}

const EditRuleDialog: React.FC<EditRuleDialogProps> = ({ open, queryFields, operators, initialRule, defaultQueryRule, isEditMode, customControlElements,  onClose, onSave }) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [network, setNetwork] = useState(initialRule?.network || '');
  const [bidScore, setBidScore] = useState(initialRule?.bidScore || 0);
  const [bidScoreType, setBidScoreType] = useState(initialRule?.bidScoreType || '');
  const [status, setStatus] = useState(initialRule?.status || ACTIVE);
  const [condition, setCondition] = useState<RuleGroupType | null>(isEditMode && initialRule ? parseCEL(initialRule.condition) : defaultQueryRule);

  // Function to get the list of already selected fields
  const getSelectedFields = () => {
    const selectedFields = [];
    condition.rules.forEach(rule => {
      if (rule.field) {
        selectedFields.push(rule.field);
      }
    });
    return selectedFields;
  };

  const customCombinationSelector = (props) => {
    return (
      <FormControl margin="normal" style={{ display: 'none'}}>
        <Select
          value={props.value || ''}
          onChange={(event) => props.handleOnChange(event.target.value)}
          variant='outlined'
        >
          <MenuItem value={props.value}>{props.value}</MenuItem>
          <MenuItem value="AND">AND</MenuItem>
          <MenuItem value="OR">OR</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const customRuleAction = (props) => {
    return (
      <Button onClick={props.handleOnClick} variant="contained" color="primary">
        + Add Rule
      </Button>
    );
  };

  // Custom Field Selector to filter out already selected fields
  const customFieldSelector = (props) => {
    const selectedFields = getSelectedFields();
    const availableFields = queryFields.filter(field => !selectedFields.includes(field.name));
    return (
      <FormControl margin="normal">
        <Select
          style={{ width: '200px' }}
          value={props.value || ''}
          onChange={(event) => props.handleOnChange(event.target.value)}
          variant='outlined'
        >
          <MenuItem value={props.value}>{props.value}</MenuItem>
          {availableFields.map(field => (
            <MenuItem value={field.name}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Custom Operator Selector to display the operator label
  const customOperatorSelector = (props: any) => {
    return (
      <FormControl margin="normal" style={{ padding: '0px 2px'}}>
        <Select
          style={{ width: '100px' }}
          value={props.value || ''}
          onChange={(event) => props.handleOnChange(event.target.value)}
          variant='outlined'
        >
          {operators.map(operator => (
            <MenuItem value={operator.name}>
              {capitalize(operator.label)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Custom Value Editor to display a text field for entering values
  const customValueEditor = (props: any) => {
    return (
      <FormControl margin="normal">
        <TextField
          style={{ width: '200px' }}
          value={props.value}
          onChange={(e) => props.handleOnChange(e.target.value)}
          label={props.field}
          variant="outlined"
        />
      </FormControl>
    );
  };


  // Function to filter out empty values
  const filterEmptyValues = (query: RuleGroupType): RuleGroupType => {
    return {
      ...query,
      rules: query.rules
        .map(rule => {
          // Check if the rule is a nested group or a simple rule
          if ('rules' in rule) {
            // Recursively filter nested groups
            return filterEmptyValues(rule as RuleGroupType);
          }
          // Omit the rule if its value is empty or undefined
          return rule.value ? rule : null;
        })
        .filter(rule => rule !== null), // Filter out null values
    };
  };

  const handleSave = () => {
    const rule: RuleType = {
      id: initialRule?.id || Date.now(), // Use current timestamp for new rules
      name,
      network: Number(network),
      bidScore,
      bidScoreType,
      status, 
      condition: condition ? formatQuery(
        filterEmptyValues(condition), {
        format: 'cel',
        parseNumbers: true,
        // exclude empty values
      }) : ''
    };
    onSave(rule);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Edit Rule' : 'Create New Rule'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Network ID"
          fullWidth
          value={network}
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNetwork(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Bid Score"
          type="number"
          fullWidth
          value={bidScore}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setBidScore(Number(e.target.value))}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Bid Score Type</InputLabel>
          <Select
            value={bidScoreType}
            onChange={(e: SelectChangeEvent) => setBidScoreType(e.target.value)}
          >
            <MenuItem value={INCREASE}>{INCREASE}</MenuItem>
            <MenuItem value={DECREASE}>{DECREASE}</MenuItem>
            <MenuItem value={FIXED}>{FIXED}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormLabel>Status</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={status === ACTIVE}
                onChange={(e) => setStatus(e.target.checked)}
              />
            }
            label={status ? 'Active' : 'Inactive'}
          />
        </FormControl>
        {condition !== null && (
          <QueryBuilder
            fields={queryFields}
            query={condition}
            operators={operators}
            controlElements={{
              ...customControlElements,
              addRuleAction: customRuleAction,
              combinatorSelector: customCombinationSelector,
              fieldSelector: customFieldSelector,
              operatorSelector: customOperatorSelector,
              valueEditor: customValueEditor,
            }}
            onQueryChange={(q) => setCondition(q)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRuleDialog;
 