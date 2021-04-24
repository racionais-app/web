import React from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/firestore';

import history from '../services/history';

const Modules = () => {
  const [modules, setModules] = React.useState([]);
  console.log("chamou a pagina")
  const handleModules = ({ docs }) => {
    console.log("chamou")
    const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setModules(data);
    console.log({docs})
  }

  const onClick = (mid) => {
    history.push('questions');
  }

  React.useEffect(() => {
    const db = firebase.firestore();
    console.log({db})
    const subscribe = db.collection('modules')
      .onSnapshot(handleModules);
    
    return () => subscribe();
  }, []);

  return modules.map(({ id, name }) => (
    <div>
      aaassad<br/> jasjsajaj
    {/* <Button
      key={id}
      color='primary'
      variant='contained'
      onClick={() => onClick(id)}
    >
      {name}
    </Button> */}
    </div>
  ));
}

export default Modules;
