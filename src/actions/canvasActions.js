export const actionTypes = {
    SAVE_NODES: 'SAVE_NODES',
    UPDATE_NODE: 'UPDATE_NODE',
    SAVE_CONNECTIONS: 'SAVE_CONNECTIONS',
}

export const actions = {
    saveNodes: (nodes) => ({ type: actionTypes.SAVE_NODES, nodes }),
    saveConnections: (connections) => ({ type: actionTypes.SAVE_CONNECTIONS, connections }),
    updateNode: (node) => ({ type: actionTypes.UPDATE_NODE, node })
}
