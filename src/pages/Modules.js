import React from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/firestore';

import history from '../services/history';

const Modules = () => {
  const [modules, setModules] = React.useState([]);

  const handleModules = ({ docs }) => {
    const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setModules(data);
  }

  const onClick = (mid) => {
    history.push('questions');
  }

  React.useEffect(() => {
    const db = firebase.firestore();
    const subscribe = db.collection('modules')
      .onSnapshot(handleModules);
    
    return () => subscribe();
  }, []);

  return modules.map(({ id, name }) => (
    <Button
      key={id}
      color='primary'
      variant='contained'
      onClick={() => onClick(id)}
    >
      {name}
    </Button>
  ));
}

export default Modules;
