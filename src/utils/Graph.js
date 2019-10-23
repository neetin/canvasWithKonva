class Graph {
    constructor() {
        this.initialVertex = {}
    }

    /*
    * vertix should contain this information 
    vertex = {id: 1, 
        type: NodeRectTypes.LOGIN,
        originX: 100,
        originY: 100,}
    */
    addVertex(vertex, reduxNodes) {
        // console.log('adding vertex---', vertex)
        let newVertex = {
            key: vertex,
            value: []
        }
        reduxNodes.push(newVertex)
        return reduxNodes
    }

    addEdge(vertex, node, reduxNodes) {
        for (var i = 0; i < reduxNodes.length; i++) {
            if (reduxNodes[i].key === vertex) {
                reduxNodes[i].value.push(node)
            }
        }
        return reduxNodes
    }

    deleteVertex(vertex, reduxNodes) {
        if (reduxNodes.length > 0) {
            let index
            reduxNodes.forEach((node, i) => {
                if (node.value.length > 0) {
                    node.value.forEach((item, i) => {
                        if (item.id === vertex.id) {
                            node.value.splice(i, 1)
                        }
                    })
                }
                if (node.key.id === vertex.id) {
                    index = i
                }

            })

            reduxNodes.splice(index, 1)

        }
        return reduxNodes
    }
}

export default Graph