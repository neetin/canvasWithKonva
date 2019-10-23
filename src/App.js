import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as canvasActions } from './actions/canvasActions';
import NodeRect from './components/NodeRect'
import ConnectorRect from './components/ConnectorRect'
import PlusRect from './components/PlusRect'
import { Stage, Layer, Line, Rect } from 'react-konva'
import ListPopUp from './components/ListPopUp'
import cycle from './assets/cycle.svg'
import puzzle from './assets/puzzle.svg'
import openLock from './assets/open-lock.svg'
import floppy from './assets/floppy.svg'
import addIcon from './assets/add.svg'
import { reverse, checkPointInclusion, shortestSideCoordinates, getRightSidePointOfNode, getLeftSidePointOfNode, generateUniqueId, hitCheck } from './utils/utils'
import { NodeRectTypes, nodeRectConfig, connectionConfig } from './config/configShape';
import Graph from './utils/Graph'
import CustomLine from './components/CustomLine';

class App extends PureComponent {

    constructor(props) {
        super(props)
        this.graph = new Graph()
    }

    state = {
        mouse: {
            clientX: 0,
            clientY: 0,
        },
        lineStartPoint: {
            x: 0,
            y: 0,
        },
        lineEndPoint: {
            x: 0,
            y: 0,
        },
        isMouseDown: false,
        isdragging: false,
        isdragComplete: false,
        pointInclusion: false,
        dropInside: false,
        poinInclusionCoordinates: { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0, x: 0, y: 0 },
        nodeConnected: false,
        dragInitiaterNode: {},
        selectedNode: null,
        capabilityType: null,
        multiSelectedNodeIds: new Set(),
        posStart: { x: 0, y: 0 },
        posNow: { x: 0, y: 0 },
        selectRectMouseUp: false,
        selectRectMouseDown: false,
        selectRectWidth: 0,
        selectRectHeight: 0,
        selectRectStartX: 0,
        selectRectStartY: 0,

        stageScale: 1,
        stageX: 0,
        stageY: 0,
    };

    resetStateToOriginal = () => {
        this.setState({
            lineStartPoint: {
                x: 0,
                y: 0,
            },
            lineEndPoint: {
                x: 0,
                y: 0,
            },
            isMouseDown: false,
            isdragging: false,
            isdragComplete: false,
            pointInclusion: false,
            dropInside: false,
            poinInclusionCoordinates: { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0, x: 0, y: 0 },
            selectRectMouseDown: false,
            selectRectWidth: 0,
            selectRectHeight: 0,
            selectRectStartX: 0,
            selectRectStartY: 0
        })
    }

    handleComponentDrag = (props, dragEnd = false) => {
        let { newX, newY, item, movementX, movementY } = props
        item.originX = newX
        item.originY = newY
        const selectedNodes = this.state.multiSelectedNodeIds
        if (this.state.multiSelectedNodeIds.has(item.id)) {
            selectedNodes.forEach(node => {
                this.props.nodes.forEach(n => {
                    if (node === n.key.id) {
                        n.key.originX = n.key.originX + movementX
                        n.key.originY = n.key.originY + movementY
                        this.props.updateNode(n)
                    }
                })
            });
        } else {
            this.setState({
                multiSelectedNodeIds: new Set()
            })
            if (dragEnd) {
                this.props.updateNode(item)
            }
        }
        this.resetStateToOriginal()
    }

    getRectCoordinated = (x, y, item) => {
        const origin = { x: item.originX - nodeRectConfig.width / 2, y: item.originY - nodeRectConfig.height / 2 }
        let rectCoordinates = {
            x: x,
            y: y,
            x1: origin.x,
            y1: origin.y,
            x2: origin.x + nodeRectConfig.width,
            y2: origin.y,
            x3: origin.x + nodeRectConfig.width,
            y3: origin.y + nodeRectConfig.height,
            x4: origin.x,
            y4: origin.y + nodeRectConfig.height,
        }

        if (item.type === NodeRectTypes.CONNECTOR) {
            const newOrigin = { x: item.originX - connectionConfig.width / 2, y: item.originY - connectionConfig.height / 2 }
            rectCoordinates = {
                x: x,
                y: y,
                x1: newOrigin.x,
                y1: newOrigin.y,
                x2: newOrigin.x + connectionConfig.width,
                y2: newOrigin.y,
                x3: newOrigin.x + connectionConfig.width,
                y3: newOrigin.y + connectionConfig.height,
                x4: newOrigin.x,
                y4: newOrigin.y + connectionConfig.height,
            }
        }
        return rectCoordinates;
    }

    checkOtherPointInclusion = (props) => {
        const { x, y } = props
        let node = {}
        let response = {
            node: node,
            isIncluded: false
        }
        const reduxNodes = this.props.nodes
        for (let i = 0; i < reduxNodes.length; i++) {
            node = reduxNodes[i]
            let rectCoordinates = this.getRectCoordinated(x, y, node.key)
            if (checkPointInclusion(rectCoordinates)) {
                return response = {
                    node,
                    isIncluded: true
                }
            }
        }
        return response
    }

    handleMouseDown = (props) => {
        const { item, x, y, capabilityType } = props
        const rectCoordinates = this.getRectCoordinated(x, y, item)

        this.setState({
            lineStartPoint: {
                x: x,
                y: y,
            },
            lineEndPoint: {
                x: x,
                y: y,
            },
            capabilityType,
            isMouseDown: true,
            pointInclusion: true,
            isdragComplete: false,
            dropInside: false,
            poinInclusionCoordinates: rectCoordinates,
            dragInitiaterNode: item,
            nodeConnected: false
        })
    }

    handleMouseMove = e => {
        const mouseX = e.evt.x
        const mouseY = e.evt.y

        if (this.state.selectRectMouseDown && this.state.isMouseDown == false) {
            const pointsNow = { x: e.evt.x, y: e.evt.y }
            const posRect = reverse(this.state.posStart, pointsNow)
            const selectRectWidth = posRect.x2 - posRect.x1
            const selectRectHeight = posRect.y2 - posRect.y1

            this.setState({
                posNow: pointsNow,
                selectRectWidth: selectRectWidth,
                selectRectHeight: selectRectHeight,
                selectRectStartX: posRect.x1,
                selectRectStartY: posRect.y1
            })

            // TODO: need to select the nodes those are covered by select rect
            const shape2 = {
                x: this.state.selectRectStartX, y: this.state.selectRectStartY,
                width: this.state.selectRectWidth, height: this.state.selectRectHeight
            }
            this.props.nodes.forEach(node => {
                let shape1 = {}

                if (node.key.type == NodeRectTypes.CONNECTOR) {
                    const offsetX = connectionConfig.width / 2
                    const offsetY = connectionConfig.height / 2
                    shape1 = { x: node.key.originX - offsetX, y: node.key.originY - offsetY, width: connectionConfig.width, height: connectionConfig.height }
                } else {
                    const offsetX = nodeRectConfig.width / 2
                    const offsetY = nodeRectConfig.height / 2
                    shape1 = { x: node.key.originX - offsetX, y: node.key.originY - offsetY, width: nodeRectConfig.width, height: nodeRectConfig.height }
                }

                if (hitCheck(shape1, shape2)) {
                    // covers this node
                    console.log('Covers this node: ', node)
                    const multiSelectedNodeIds = this.state.multiSelectedNodeIds
                    multiSelectedNodeIds.add(node.key.id)
                    this.setState({
                        multiSelectedNodeIds: multiSelectedNodeIds
                    })
                } else {
                    // not cover, remove from selection if any
                    const multiSelectedNodeIds = this.state.multiSelectedNodeIds
                    multiSelectedNodeIds.delete(node.key.id)
                    this.setState({
                        multiSelectedNodeIds: multiSelectedNodeIds
                    })
                }


            })

        }
        if (this.state.isMouseDown) {
            if (this.state.pointInclusion) {
                this.setState({
                    lineEndPoint: {
                        x: mouseX,
                        y: mouseY,
                    },
                    isdragging: true
                })
            }
            else {
                this.setState({
                    lineEndPoint: {
                        x: mouseX,
                        y: mouseY,
                    },
                    isMouseDown: false,
                })
            }
        }
    }

    handleSelected = (item, isSelected) => {

        if (this.state.multiSelectedNodeIds.has(item.id)) {
            const multiSelectedNodeIds = this.state.multiSelectedNodeIds
            multiSelectedNodeIds.delete(item.id)
            this.setState({ multiSelectedNodeIds })
        } else if (!this.state.multiSelectedNodeIds.has(item.id) && this.state.selectedNode === null) {
            this.setState({
                selectedNode: item,
                multiSelectedNodeIds: new Set()
            })
        } else if (this.state.selectedNode !== item) {
            this.setState({ selectedNode: item })
        } else {
            this.setState({ selectedNode: null })
        }
    }

    handleMouseUp = e => {
        if (this.state.selectRectMouseDown) {

            // clear & selected dotted rect
            this.setState({
                selectRectMouseDown: false,
                selectRectWidth: 0,
                selectRectHeight: 0,
                selectRectStartX: 0,
                selectRectStartY: 0
            })
        }

        if (this.state.isMouseDown) {
            const mouseX = e.evt.x
            const mouseY = e.evt.y

            const props = this.state.poinInclusionCoordinates
            props.x = mouseX
            props.y = mouseY


            let coordinates = { x: 0, y: 0 }
            if (this.state.dragInitiaterNode.type !== NodeRectTypes.CONNECTOR) {
                if (this.state.capabilityType === 'trigger') {
                    const { sideX, sideY } = getRightSidePointOfNode(this.state.dragInitiaterNode.originX - nodeRectConfig.width / 2, this.state.dragInitiaterNode.originY - nodeRectConfig.height / 2)
                    coordinates = { x: sideX, y: sideY }
                } else if (this.state.capabilityType === 'action') {
                    const { sideX, sideY } = getLeftSidePointOfNode(this.state.dragInitiaterNode.originX, this.state.dragInitiaterNode.originY)
                    coordinates = { x: sideX, y: sideY }
                } else {
                    return
                }
            } else {
                console.log("setting coordinates connector")
                coordinates = { x: this.state.dragInitiaterNode.x, y: this.state.dragInitiaterNode.y } // center point of object already calculated in <Group> of connector
            }
            // check line point inclusion inside rect itself. If line end in the node itself then discard it.
            if (checkPointInclusion(props) || (this.checkOtherPointInclusion(e.evt).isIncluded)) {
                this.setState({
                    lineEndPoint: {
                        x: mouseX,
                        y: mouseY,
                    },
                    isMouseDown: false,
                    isdragComplete: true,
                    dropInside: true,
                })
                let response = this.checkOtherPointInclusion(e.evt)
                if (response.isIncluded) {
                    //create new node relation between nodes
                    this.handleNewConnection(response.node)
                }
            } else {
                // console.log('checkPointInclusion false in handleMouseUp:  props----', props)
                this.setState({
                    lineEndPoint: {
                        x: mouseX,
                        y: mouseY
                    },
                    lineStartPoint: {
                        x: coordinates.x,
                        y: coordinates.y,
                    },
                    isMouseDown: false,
                    isdragComplete: true,
                })
            }
        } else {
            console.log("Mouse not down?")
            // not mouse down
            this.setState({
                dropInside: true,
            })
        }
    }

    handleNewConnection = end => {
        // console.log("In handleNewConnection")

        let startNode = this.state.dragInitiaterNode
        if (startNode !== end.key) {
            if (startNode.type == NodeRectTypes.CONNECTOR
                && end.key.type == NodeRectTypes.CONNECTOR) {
                console.log('can not add two connector')
                return
            }

            const newConnectorId = generateUniqueId()

            const startX = startNode.originX
            const startY = startNode.originY
            const endX = end.key.originX
            const endY = end.key.originY
            let res

            if (startNode.type !== NodeRectTypes.CONNECTOR) {
                let addX = startX
                let addY = startY

                if (startX > endX) {
                    addX = endX
                }
                if (startY > endY) {
                    addY = endY
                }

                const midX = Math.abs(endX - startX) / 2 + addX
                const midY = Math.abs(endY - startY) / 2 + addY

                let connectingNode = {
                    id: newConnectorId,
                    type: NodeRectTypes.CONNECTOR,
                    originX: midX,
                    originY: midY,
                    isSelected: false,
                }
                if (end.key.type !== NodeRectTypes.CONNECTOR) {
                    res = this.graph.addVertex(connectingNode, this.props.nodes)
                    if (this.state.capabilityType === 'trigger') {
                        this.graph.addEdge(startNode, connectingNode, this.props.nodes)
                        this.graph.addEdge(connectingNode, end.key, this.props.nodes)
                    } else if (this.state.capabilityType === 'action') {
                        this.graph.addEdge(connectingNode, startNode, this.props.nodes)
                        this.graph.addEdge(end.key, connectingNode, this.props.nodes)
                    }
                } else {
                    if (this.state.capabilityType === 'trigger') {
                        res = this.graph.addEdge(startNode, end.key, this.props.nodes)
                    } else if (this.state.capabilityType === 'action') {
                        res = this.graph.addEdge(end.key, startNode, this.props.nodes)
                    }
                }
            } else {
                if (this.state.capabilityType === 'trigger') {
                    res = this.graph.addEdge(startNode, end.key, this.props.nodes)
                } else if (this.state.capabilityType === 'action') {
                    res = this.graph.addEdge(end.key, startNode, this.props.nodes)
                }
            }
            this.props.saveNodes(res)
            this.setState({
                nodeConnected: true,
            })
        }
    }

    handlePopUpItemClick = (item) => {

        console.log("In handlePopUpItemClick")
        const newNodeId = generateUniqueId() // just for test, we need to improve this
        const newConnectorId = generateUniqueId() // just for test, we need to improve this

        let startNode = this.state.dragInitiaterNode

        let node = {
            id: newNodeId,
            type: item.type,
            originX: this.state.lineEndPoint.x,
            originY: this.state.lineEndPoint.y,
            isSelected: false,
        }
        // console.log("graph :::::::::::::", this.graph)

        const startX = startNode.originX
        const startY = startNode.originY
        const endX = this.state.lineEndPoint.x
        const endY = this.state.lineEndPoint.y
        let res
        if (this.state.dragInitiaterNode.type !== NodeRectTypes.CONNECTOR) {

            // console.log("---------------  not a connector", startNode)
            let addX = startX
            let addY = startY

            if (startX > endX) {
                addX = endX
            }
            if (startY > endY) {
                addY = endY
            }

            const midX = Math.abs(endX - startX) / 2 + addX
            const midY = Math.abs(endY - startY) / 2 + addY

            let connectingNode = {
                id: newConnectorId,
                type: NodeRectTypes.CONNECTOR,
                originX: midX,
                originY: midY,
                isSelected: false,
            }

            if (this.state.capabilityType === 'trigger') {
                this.graph.addVertex(connectingNode, this.props.nodes)
                this.graph.addEdge(this.state.dragInitiaterNode, connectingNode, this.props.nodes)

                res = this.graph.addVertex(node, this.props.nodes)
                this.graph.addEdge(connectingNode, node, this.props.nodes)

            } else if (this.state.capabilityType === 'action') {
                this.graph.addVertex(connectingNode, this.props.nodes)
                this.graph.addEdge(connectingNode, this.state.dragInitiaterNode, this.props.nodes)

                res = this.graph.addVertex(node, this.props.nodes)
                this.graph.addEdge(node, connectingNode, this.props.nodes)

            }
        } else {
            console.log("--------------- connector", startNode)
            res = this.graph.addVertex(node, this.props.nodes)
            if (this.state.capabilityType === 'trigger') {
                this.graph.addEdge(this.state.dragInitiaterNode, node, this.props.nodes)
            } else {
                this.graph.addEdge(node, this.state.dragInitiaterNode, this.props.nodes)
            }
        }
        this.props.saveNodes(res)
        this.setState({
            nodeConnected: true,
        })

    }

    handleOverlayClicked = e => {
        //    console.log('handleOverlayClicked.........')
        this.setState({
            dropInside: true,
        })
    }

    componentDidUpdate(prevProps) {
        // console.log("componentDidUpdate props:::::::::::::::::::::: ", this.props)
        if (prevProps.nodes !== this.props.nodes) {
            this.setState({
                nodes: this.props.nodes,
            });
        }
    }

    keyPressHandler = (event) => {
        //escape key press
        if (event.keyCode === 27) {
            // console.log("escape pressed")
            if (this.state.dropInside === false) {
                this.setState({
                    dropInside: true,
                })
            }

        } else if (event.keyCode === 13) {
            // console.log("enter pressed")
        } else if (event.keyCode === 8) {
            // console.log("delete pressed")
            if (this.state.selectedNode != null) {
                const res = this.graph.deleteVertex(this.state.selectedNode, this.props.nodes)
                this.props.saveNodes(res)
                this.setState({
                    selectedNode: null
                })
            }
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyPressHandler, false);
        const nodes = [{
            key: rootNode,
            value: []
        }]
        this.props.saveNodes(nodes)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyPressHandler, false);
    }

    handleSelectMouseDown = (e) => {
        // console.log('handleSelectMouseDown event==', e)
        if (!this.checkOtherPointInclusion(e.evt).isIncluded) {
            this.setState({
                posStart: { x: e.evt.x, y: e.evt.y },
                posNow: { x: e.evt.x, y: e.evt.y },
                selectRectMouseDown: true,
                multiSelectedNodeIds: new Set(),
                selectedNode: null
            })
        }
    }

    handleWheel = e => {
        e.evt.preventDefault();

        const scaleBy = 1.01;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        this.setState({
            stageScale: newScale,
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        });
    };

    render() {
        // Stage is a div container
        // Layer is actual canvas element (so you may have several canvases in the stage)
        // And then we have canvas shapes inside the Layer

        // console.log("state============== ", this.state)
        const gridSize = 25
        const canvasHeight = window.innerHeight
        const canvasWidth = window.innerWidth

        // rect for drag & multi-select 
        let drawSelectRect = [];
        if (this.state.selectRectMouseDown == true) {
            drawSelectRect.push(<Rect
                x={this.state.selectRectStartX}
                y={this.state.selectRectStartY}
                key={generateUniqueId()}
                width={this.state.selectRectWidth}
                height={this.state.selectRectHeight}
                strokeEnabled={true}
                strokeWidth={1}
                dash={[10, 5]}
                stroke={'red'}
            />)
        }

        let grid = []
        for (let i = 0; i < (canvasWidth / gridSize); i++) {
            grid.push(<Line key={`line1${i}`} points={[i * gridSize, 0, i * gridSize, canvasHeight]} stroke='#ccc' strokeWidth={.75} />)
            grid.push(<Line key={`line2${i}`} points={[0, i * gridSize, canvasWidth, i * gridSize]} stroke='#ccc' strokeWidth={.75} />)

        }
        const startX = this.state.lineStartPoint.x
        const startY = this.state.lineStartPoint.y
        const endX = this.state.lineEndPoint.x
        const endY = this.state.lineEndPoint.y

        let line = <CustomLine points={[0, 0, 0, 0]} key={generateUniqueId()} stroke='#ccc' strokeWidth={1} />
        let lines = [line]
        if (this.state.isdragging) {
            const capabilityType = this.state.capabilityType
            const startNode = this.state.dragInitiaterNode.type
            lines.push(<CustomLine
                key={generateUniqueId()}
                points={[startX, startY, endX, endY]}
                stroke='black'
                strokeWidth={.75}
                capabilityType={capabilityType}
                startNode={startNode}
            />)
        }

        let plusNode;
        let popUpStyle = {
            display: 'none',

        }

        let overlayStyle = {
            display: 'none'
        }
        if (this.state.isdragComplete && !this.state.nodeConnected) {

            // check if line drop is inside rect, if inside do not draw line and node
            if (this.state.dropInside) {
                lines.pop()
            } else {
                // console.log("joiningCorner;;;; ", this.state.joiningCorner)
                plusNode = <PlusRect joiningX={this.state.lineEndPoint.x} joiningY={this.state.lineEndPoint.y} />

                popUpStyle = {
                    position: 'absolute',
                    top: this.state.lineEndPoint.y - 25 + 'px',
                    left: this.state.lineEndPoint.x + 50 + 'px',
                    display: 'block',
                }

                overlayStyle = {
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    display: 'block',
                    width: '1600px',
                    height: '1600px',
                    backgroundColor: '#00000020',
                }
            }
        }

        if (this.state.nodeConnected) {
            overlayStyle = {
                display: 'none'
            }
            popUpStyle = {
                display: 'none',
            }
            lines = [] // delete all temporary lines
        }
        let nodes = []
        let connectors = []

        this.props.nodes.forEach(node => {
            for (let i = 0; i < node.value.length; i++) {
                const con = node.value[i]

                let lineStartX = 0
                let lineStartY = 0
                let lineEndX = 0
                let lineEndY = 0
                let startNode = node.key.type
                if (node.key.type !== NodeRectTypes.CONNECTOR) {
                    const { sideX, sideY } = getRightSidePointOfNode(node.key.originX - nodeRectConfig.width / 2, node.key.originY - nodeRectConfig.height / 2)
                    lineStartX = sideX
                    lineStartY = sideY
                    lineEndX = con.originX - 30
                    lineEndY = con.originY
                } else if (node.key.type === NodeRectTypes.CONNECTOR) {
                    lineStartX = node.key.originX + 30
                    lineStartY = node.key.originY
                    const { sideX, sideY } = getLeftSidePointOfNode(con.originX - nodeRectConfig.width / 2, con.originY - nodeRectConfig.height / 2)
                    lineEndX = sideX
                    lineEndY = sideY
                }

                connectors.push(<CustomLine
                    key={generateUniqueId()}
                    points={[lineStartX, lineStartY, lineEndX, lineEndY]}
                    stroke='black' strokeWidth={1}
                    startNode={startNode}
                />)
            }
            let isSelected = false
            if (this.state.selectedNode !== null && node.key.id === this.state.selectedNode.id) {
                // console.log("isSelected true for node: ", node.key)
                isSelected = true
            }

            // implement multi-select 
            if (this.state.multiSelectedNodeIds.has(node.key.id)) {
                isSelected = true
            }

            if (node.key.type === NodeRectTypes.CONNECTOR) {
                nodes.push(<ConnectorRect key={node.key.id} id={node.key.id} originX={node.key.originX} originY={node.key.originY} isSelected={isSelected} handleSelected={this.handleSelected} data={node.key} onDrag={this.handleComponentDrag} onMouseDown={this.handleMouseDown} type={node.key.type} />)
            } else {
                nodes.push(<NodeRect
                    key={node.key.id}
                    id={node.key.id}
                    type={node.key.type}
                    originX={node.key.originX}
                    originY={node.key.originY}
                    isSelected={isSelected}
                    handleSelected={this.handleSelected}
                    onMouseDown={this.handleMouseDown}
                    onDrag={this.handleComponentDrag}
                    data={node.key}
                    stageX={this.state.stageX}
                    stageY={this.state.stageY}
                    stageScale={this.state.stageScale}
                />)
            }
        });

        const addIconStyle = {
            position: 'absolute',
            top: window.innerHeight - 100 + 'px',
            left: window.innerWidth * 3 / 100 + 'px',
            display: 'block'
        }
        return (
            <div>
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseDown={this.handleSelectMouseDown}
                    onWheel={this.handleWheel}
                    scaleX={this.state.stageScale}
                    scaleY={this.state.stageScale}
                    x={this.state.stageX}
                    y={this.state.stageY}
                >
                    <Layer></Layer>
                    <Layer>
                        {grid}
                        {nodes}
                        {connectors}
                        {lines}
                        {plusNode}
                        {drawSelectRect}
                    </Layer>
                </Stage>
                <div style={overlayStyle} onClick={this.handleOverlayClicked}></div>
                <div style={popUpStyle}>
                    <ListPopUp data={popUpItems} onItemClick={this.handlePopUpItemClick} />
                </div>
                <img style={addIconStyle} src={addIcon}></img>
            </div>
        );
    }
}


const rootNode = {
    id: '1',
    type: NodeRectTypes.LOGIN,
    originX: 100,
    originY: 100,
}


const popUpItems = [
    {
        id: 1,
        name: 'Open Lock',
        image: openLock,
        type: NodeRectTypes.DEVICE_POLICY
    },
    {
        id: 2,
        name: 'Device Policy',
        image: puzzle,
        type: NodeRectTypes.DEVICE_POLICY
    },
    {
        id: 3,
        name: 'Floppy Disk',
        image: floppy,
        type: NodeRectTypes.DEVICE_POLICY
    },
    {
        id: 4,
        name: 'Mountain Bike',
        image: cycle,
        type: NodeRectTypes.DEVICE_POLICY
    }

];


const mapStateToProps = (state) => {
    // console.log('state:-------', state)
    return {
        nodes: state.canvas.nodes ? state.canvas.nodes : null,
        connections: state.canvas.connections ? state.canvas.connections : null,
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({ ...canvasActions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)