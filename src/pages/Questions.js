import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase';
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: 650,
  },
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

const Questions = () => {
  const history = useHistory();
  const classes = useStyles();
  let { id } = useParams();
  const moduleId = id;
  const [questions, setQuestions] = React.useState([]);

  const handleQuestions = (doc) => {
    const data = doc.data();
    console.log(data.items)
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
    let arrQuestions = [];
    const subscribe = db.collection('modules')
      .doc(moduleId)
      .collection('items')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          arrQuestions.push({"id": doc.id, "data": doc.data()});
          console.log({arrQuestions})
        });
      }).then(() => setQuestions(arrQuestions))
      }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Conteúdos
          </Typography>
          <Button color="inherit" onClick={() => logout()}>Sair</Button>
        </Toolbar>
      </AppBar>
    <div style={{display:"flex", justifyContent:"center", alignItems: "center", marginTop: "200px"}}>
      <TableContainer className={classes.table} component={Paper}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align='right'>Tipo</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map(question => (
              <TableRow key={question.id}>
                <TableCell component='th' scope='row'>{question.data.name}</TableCell>
                <TableCell align='right'>{question.data.type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(question.data.name)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(question.data.name)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </div>
  );
};

export default Questions;
