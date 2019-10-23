import React from 'react'
import ReactDOM from 'react-dom';
import Root from './Root'
import configureStore, { history } from './configureStore';

document.addEventListener('DOMContentLoaded', () => {
    const { persistor, store } = configureStore();
    const root = document.getElementById('root');
    ReactDOM.render(<Root store={store} persistor={persistor} history={history} />, root);
});

