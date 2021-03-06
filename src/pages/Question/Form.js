import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

function randomString(length) {
  var result = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const TYPES = ['text', 'image', 'input', 'select', 'multi-select'];

const FIELDS = {
  text: {
    text: 'input'
  },
  image: {
    size: 'input',
    url: 'input'
  },
  input: {
    placeholder: 'input',
    label: 'input',
    answer: 'input'
  },
  select: {
    label: 'input',
    options: 'input',
    answer: 'input'
  },
  'multi-select': {
    label: 'input',
    options: 'input',
    answer: 'input'
  }
}

const Form = ({ moduleId, questionId }) => {
  const [data, setData] = React.useState({});
  const [type, setType] = React.useState('text');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const onChange = (event, key) => {
    let { value } = event.target;
    try {
      value = JSON.parse(value);
    } catch {
      // Do nothing
    }
    setData({ ...data, type, id: randomString(20), [key]: value })
  }

  const handleSave = async() => {
    const db = firebase.firestore();
    const ref = db.collection('modules')
      .doc(moduleId)
      .collection('questions')
      .doc(questionId);
    const item = await ref.get();
    const items = item.data()?.items ?? [];
    await ref.set({ items: [...items, data] })
    setData({});
    setType('text');
  }

  return (
    <div>
      <div>
        <Select value={type} onChange={handleChange}>
          {TYPES.map(type => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
        </Select>
      </div>
      <div>
        {Object.entries(FIELDS[type]).map(([k, v]) => {
          switch(v) {
            case 'input':
              return <TextField label={k} variant='outlined' onChange={e => onChange(e, k)} />;
            default:
              return null;
          }
        })}
      </div>
      <div>
        <Button color='primary' variant='contained' onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default Form;
