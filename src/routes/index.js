import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Modules from '../pages/Modules';
import Questions from '../pages/Questions';
import Question from '../pages/Question';
import Login from '../pages/Login';
import firebase from 'firebase';
import Navbar from '../components/navbar';

const Routes = () => {
  // const [currentUser, setCurrentUser] = React.useState(undefined);
  // React.useEffect(() => {
  //   const user = firebase.auth().currentUser;
  //   setCurrentUser(user);
  // });

  // const user = firebase.auth().currentUser;
  // console.log({user})
  return (
    <Switch>
      <Route path='/' exact component={Modules}/>
      <Route path='/:id/questions' component={Questions}>
      </Route>
      <Route path='/question/:id' component={Question}/> 
      <Route path='/signin' component={Login} />
    </Switch>
  )
};

export default Routes;
