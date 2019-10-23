import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

// Reducers
import canvasReducer from './reducers/canvasReducer';

// Sagas
import canvasSagas from './sagas/canvasSagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();


export const history = createBrowserHistory()
// this listens for a route change, and scrolls to the  top of the screen each time it changes
// the back/forward buttons will push and pop, but will not hit this listener & scroll to the top
history.listen((location, action) => {
    window.scrollTo(0, 0)
})
const reactRouterMiddleware = routerMiddleware(history)

// dev tools middleware

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const canvasPersistConfig = {
    key: "canvas",
    storage,
    blacklist: ['makingApiCall', 'errors'],
}

const rootReducer = combineReducers({
    canvas: persistReducer(canvasPersistConfig, canvasReducer),
    router: routerReducer,
})

// create a redux store with our reducer above and middleware
export default () => {
    let store = createStore(
        rootReducer,
        compose(applyMiddleware(sagaMiddleware, reactRouterMiddleware), reduxDevTools)
    )

    // run the saga
    sagaMiddleware.run(canvasSagas)
    let persistor = persistStore(store)

    // fresh start
    persistor.purge()
    return { store, persistor };
}
