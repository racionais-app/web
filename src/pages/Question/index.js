import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import history from '../../services/history';

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: 650,
  },
  paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Question = () => {
  const classes = useStyles();
  let { id } = useParams();
  let { mid } = useParams();

  const questionId = id;
  const moduleId = mid;

  const [items, setItems] = React.useState([]);

  const [text1, setText1] = React.useState('');
  const [text2, setText2] = React.useState('');
  const [text3, setText3] = React.useState('');
  const [imgURL, setImgURL] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [placeholderAnswer, setPlaceholderAnswer] = React.useState('');
  const [modalStyle] = React.useState(getModalStyle);
  const [openModal, setOpenModal] = React.useState(false);


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
    let arrItems = [];
    db.collection('modules')
      .doc(moduleId)
      .collection('items')
      .doc(questionId)
      .collection('questions')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          arrItems.push({ "id": doc.id, "data": doc.data() });
          console.log({ arrItems })
        });
      }).then(() => setItems(arrItems))
  }, []);

  function handleSubmitQuestion(event) {
    event.preventDefault();
    const db = firebase.firestore();
    const docId = Date.now();

    db.collection("modules").doc(moduleId).collection('items').doc(questionId).collection('questions').doc(docId.toString()).set({
      0: {
        id: "0",
        text: text1,
        type: "text"
      },
      1: {
        id: "1",
        size: 240,
        type: "image",
        url: imgURL
      },
      2: {
        id: "2",
        text: text2,
        type: "text"
      },
      3: {
        answer: answer,
        id: "3",
        label: text3,
        placeholder: placeholderAnswer,
        type: "input"
      }
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

  const bodyQuestion = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Submeter Questão</h2>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <form noValidate autoComplete="off" onSubmit={handleSubmitQuestion}>
          <TextField
            id="standard-basic"
            label="Texto antes da imagem"
            style={{ width: 500 }}
            value={text1}
            onInput={e => setText1(e.target.value)}
          />
          <br />
          <TextField
            id="standard-basic"
            label="URL da imagem do exercício"
            style={{ width: 500 }}
            value={imgURL}
            onInput={e => setImgURL(e.target.value)}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Texto após a imagem"
            style={{ width: 500 }}
            value={text2}
            onInput={e => setText2(e.target.value)}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Texto explicativo sobre campo de resposta"
            style={{ width: 500 }}
            value={text3}
            onInput={e => setText3(e.target.value)}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Resposta correta"
            style={{ width: 500 }}
            value={answer}
            onInput={e => setAnswer(e.target.value)}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Placeholder do campo da resposta"
            style={{ width: 500 }}
            value={placeholderAnswer}
            onInput={e => setPlaceholderAnswer(e.target.value)}
          />
          <br /> <br />
          <Button
            key={1}
            color='primary'
            variant='contained'
            type="submit"
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Questionários
          </Typography>
          <Button color="inherit" onClick={() => logout()}>Sair</Button>
        </Toolbar>
        </AppBar>
      <div style={{marginTop: 200}}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <TableContainer className={classes.table} component={Paper}>
            <Table size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell component='th' scope='row'>{item.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{textAlign: "center", marginTop: 20}}>
          <Button color='primary' variant='contained' onClick={handleOpenModal}>
            Adicionar Item
          </Button>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {bodyQuestion}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Question;
