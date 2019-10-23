import { takeLatest } from 'redux-saga/effects';

// Actions
import { actionTypes as canvasActionTypes, actions as canvasActions } from '../actions/canvasActions';


function* saveNodes(props) {
    console.log('save nodes called... with props::: ', props)
}


export default function* root() {
    yield [
        takeLatest(canvasActionTypes.SAVE_NODES, saveNodes),
    ]
}
