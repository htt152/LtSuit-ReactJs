import 'typeface-muli';
import './react-table-defaults';
import './react-chartjs-2-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from 'app/App';
import history from './@history'
import { Router } from 'react-router-dom';

ReactDOM.render(
    <Router history={history}>
        <App/>
    </Router>,
    document.getElementById('root')
);
serviceWorker.unregister();
