import React from 'react';
import Button from '@material-ui/core/Button';
// import firebase from 'firebase/app';
import 'firebase/firestore';

import history from '../services/history';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Modules = () => {
  const [modules, setModules] = React.useState([]);
  const classes = useStyles();
  const handleModules = ({ docs }) => {
    const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setModules(data);
    console.log({ docs })
  }

  const onClick = (mid) => {
    history.push(`${ mid }/questions`);
  }

  const logout = () => {
    firebase.auth().signOut().then(() => {
      console.log("logout efetuado");
      history.push('/signin');
    }).catch((error) => {
      console.log({ error });
    });
  }

  React.useEffect(() => {
    const db = firebase.firestore();
    const subscribe = db.collection('modules')
      .onSnapshot(handleModules);

    return () => subscribe();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Módulos
          </Typography>
          <Button color="inherit" onClick={() => logout()}>Sair</Button>
        </Toolbar>
      </AppBar>
      <div style={{ textAlign: "center", marginTop: "200px" }}>
        {modules.map(({ id, name }) => (
        <div style={{marginBottom: 10}}> 
        <Button
          key={id}
          color='primary'
          variant='contained'
          onClick={() => onClick(id)}
          style={{width: "60vw"}}
          >
          {name}
        </Button>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Modules;
