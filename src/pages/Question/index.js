import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Form from './Form';

const useStyles = makeStyles({
  table: {
    maxWidth: 650,
  },
});

const Question = () => {
  const classes = useStyles();

  const questionId = 'abcde';
  const moduleId = 'FsIN1B3G0f7GYqJCshZ1';

  const [items, setItems] = React.useState([]);
  const [adding, setAdding] = React.useState(false);

  const handleItems = (doc) => {
    const data = doc.data();
    setItems(data?.items ?? []);
  }

  React.useEffect(() => {
    const db = firebase.firestore();
    const subscribe = db.collection('modules')
      .doc(moduleId)
      .collection('questions')
      .doc(questionId)
      .onSnapshot(handleItems);
    
    return () => subscribe();
  }, []);

  return (
    <div>
      <TableContainer className={classes.table} component={Paper}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='right'>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell component='th' scope='row'>{item.id}</TableCell>
                <TableCell align='right'>{item.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button color='primary' variant='contained' onClick={() => setAdding(true)}>
        Adicionar Item
      </Button>
      <div>
        {adding ? <Form moduleId={moduleId} questionId={questionId} /> : null}
      </div>
    </div>
  );
};

export default Question;
