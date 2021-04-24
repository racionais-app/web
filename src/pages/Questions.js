import React from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    maxWidth: 650,
  },
});

const Questions = () => {
  const history = useHistory();
  const classes = useStyles();
  console.log("chamou")
  const moduleId = 'Du3VzTaIQn1PuBeGM9ZC';
  const [questions, setQuestions] = React.useState([]);

  const handleQuestions = (doc) => {
    const data = doc.data();
    setQuestions(data.questions ?? []);
  }

  const handleEdit = (qid) => {
    history.push(`/question/${ qid }`);
  }

  const handleDelete = async(qid) => {
    const db = firebase.firestore();
    const ref = db.collection('modules').doc(moduleId);
    const newQuestions = questions.filter(question => question.id !== qid);
    try {
      await ref.update({ questions: newQuestions });
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    const db = firebase.firestore();
    const subscribe = db.collection('modules')
      .doc(moduleId)
      .onSnapshot(handleQuestions);
    
    return () => subscribe();
  }, []);

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table size='small' aria-label='a dense table'>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align='right'>Quantidade de Items</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map(question => (
            <TableRow key={question.id}>
              <TableCell component='th' scope='row'>{question.id}</TableCell>
              <TableCell align='right'>{question.items?.length ?? 0}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(question.id)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(question.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Questions;
