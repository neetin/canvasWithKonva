
import { actionTypes } from "../actions/canvasActions";

const initialState = {
    nodes: [],
    connections: [],
}

const reducer = (state = initialState, action) => {
     console.log(action)
    Object.freeze(state)
    switch (action.type) {
        case actionTypes.SAVE_NODES:
            return { ...state, nodes: action.nodes };
        case actionTypes.SAVE_CONNECTIONS:
            return { ...state, connections: action.connections }
        case actionTypes.UPDATE_NODE:
            var prevState = { ...state }
            prevState.nodes.map((node, i) => {
                if (node.key.id === action.node.id) {
                    prevState.nodes[i].key = action.node
                }
            });
            return {
                ...prevState,
            }
        default:
            return state
    }
}

export default reducer;