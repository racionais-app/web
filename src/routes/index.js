import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Modules from '../pages/Modules';
import Questions from '../pages/Questions';
import Question from '../pages/Question';

const Routes = () => (
  <Switch>
    <Route path='/' exact component={Modules} />
    <Route path='/questions' component={Questions} />
    <Route path='/question/:id' component={Question} />
  </Switch>
);

export default Routes;
