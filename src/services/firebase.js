import firebase from 'firebase/app';
import 'firebase/analytics';

import env from '../.env.json';

firebase.initializeApp(env);
firebase.analytics();
