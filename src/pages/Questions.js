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
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: 650,
  },
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
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

const Questions = () => {
  const history = useHistory();
  const classes = useStyles();
  let { id } = useParams();
  const moduleId = id;
  const [questions, setQuestions] = React.useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [openModalVideo, setOpenModalVideo] = React.useState(false);
  const [videoName, setVideoName] = React.useState('');
  const [videoURL, setVideoURL] = React.useState('');

  const handleQuestions = (doc) => {
    const data = doc.data();
    console.log(data.items)
    setQuestions(data.questions ?? []);
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

  const handleOpenModalVideo = () => {
    setOpenModalVideo(true);
  };

  const handleCloseModalVideo = () => {
    setOpenModalVideo(false);
  };

  function extractVideoIdFromYouTubeUrl(url) {
    let id = url.substring(url.lastIndexOf("v=")+2,url.length);
    return id;
  }
  
  function handleSubmitVideo(event) {
    event.preventDefault();
    const db = firebase.firestore();
    const docId = Date.now();
    const idVideoURL = extractVideoIdFromYouTubeUrl(videoURL);

    db.collection("modules").doc(moduleId).collection('items').doc(docId.toString()).set({
      name: videoName,
      type: "video",
      videoId: idVideoURL
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Submeter Vídeo</h2>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <form noValidate autoComplete="off" onSubmit={handleSubmitVideo}>
                <TextField
                    id="standard-basic"
                    label="Nome"
                    style={{width: 300}}
                    value={videoName}
                    onInput={e => setVideoName(e.target.value)}
                />
                <br /><br />
                <TextField
                    id="standard-basic"
                    label="URL"
                    style={{width: 300}}
                    value={videoURL}
                    onInput={e => setVideoURL(e.target.value)}
                />
                <br /><br />
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
      {/* <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p> */}

    </div>
  );

  function handleSubmitSurvey(qid) {
    history.push(`/question/${ moduleId }/${ qid }`);
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
                  <IconButton onClick={() => handleSubmitSurvey(question.id)}>
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
    <br/>
    <div>
    <Modal
        open={openModalVideo}
        onClose={handleCloseModalVideo}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
    <div style={{textAlign: "center"}}>
      <Button
            key='video'
            color='primary'
            variant='contained'
            onClick={handleOpenModalVideo}
            style={{width: "20vw", marginRight: 10}}
            >
            Submeter Vídeo
        </Button>
    </div>
    </div>
  );
};

export default Questions;
