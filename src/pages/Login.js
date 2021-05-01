import React from 'react';
import { TextField, Button } from '@material-ui/core';
import firebase from 'firebase';
import history from '../services/history';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleSubmit(event) {
        event.preventDefault();

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
              history.push("/");
          }
          )
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log({errorMessage});
        });
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    id="standard-basic"
                    label="Email"
                    value={email}
                    onInput={e => setEmail(e.target.value)}
                />
                <br /><br />
                <TextField
                    id="standard-basic"
                    label="Senha"
                    type="password"
                    value={password}
                    onInput={e => setPassword(e.target.value)}
                />
                <br /><br />
                <Button
                    key={1}
                    color='primary'
                    variant='contained'
                    type="submit"
                >
                    Entrar
                </Button>
            </form>
        </div>
    );
}

export default Login;