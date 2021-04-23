import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Modules from '../pages/Modules';
import Questions from '../pages/Questions';
import Question from '../pages/Question';
import Login from '../pages/Login';

const Routes = () => (
  <Switch>
    <Route path='/' exact component={Modules} />
    <Route path='/questions' component={Questions} />
    <Route path='/question/:id' component={Question} />
    <Route path='/signin' component={Login} />
  </Switch>
);

export default Routes;
