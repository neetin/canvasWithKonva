import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { Rect, Group, Path, Circle } from 'react-konva';
import useImage from 'use-image';
import { NodeRectTypes, nodeRectConfig, loginNode, devicePolicyNode, rootNode } from '../config/configShape';
import { generateUniqueId } from '../utils/utils';

class NodeRect extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            x: this.props.originX,
            y: this.props.originY,
            isSelected: props.isSelected,
            isMouseOver: false,
            isMouseOut: true,
            movable:true
        }
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseOut = this.handleMouseOut.bind(this)

    }

    componentWillReceiveProps(props) {
        this.setState({
            isSelected: props.isSelected,
            x: this.props.originX,
            y: this.props.originY,
        });
    }

    handleClick = e => {
        this.setState({
            isSelected: !this.state.isSelected
        });
        this.props.handleSelected(this.props.data, this.state.isSelected)
    }

    handleMouseOver = e => {
        this.setState({
            isMouseOver: true,
            isMouseOut: false,
        })
    }

    handleMouseOut = e => {
        this.setState({
            isMouseOut: true,
            isMouseOver: false,
            movable:true
        })
    }

    handleMouseDown = (e,capabilityType) => {
        console.log("Mouse down")
        console.log(capabilityType)
        this.setState({movable:false})
        const x = e.evt.x
        const y = e.evt.y
        const props = { item: this.props.data, x: x, y: y, capabilityType }

        this.props.onMouseDown(props)
    }

    handleDragEnd = e => {
        const {movementX, movementY} = e.evt
        const absolutePosition = this.rectRef.getAbsolutePosition();
        // console.log(absolutePosition)

        this.setState({
            x: absolutePosition.x,
            y: absolutePosition.y,
        });

        const props = { newX: absolutePosition.x, newY: absolutePosition.y, item: this.props.data, movementX, movementY }
        this.props.onDrag(props, true)
    }

    //This helps to show the movement of lines connected to the node in real time
    handleDragMove = e => {
        const {movementX, movementY} = e.evt
        const absolutePosition = this.rectRef.getAbsolutePosition();
        //    console.log(absolutePosition)
        this.setState({
            x: absolutePosition.x,
            y: absolutePosition.y,
        });
        const props = { item: this.props.data, newX: absolutePosition.x, newY: absolutePosition.y, movementX, movementY }

        this.props.onDrag(props, false)

    }

    render() {
        const outerRectWidth = nodeRectConfig.width + 10
        const outerRectHeight = nodeRectConfig.height + 10
        const outerRectCornerRadius = nodeRectConfig.cornerRadius * 1.1

        const outerRectX = - 5
        const outerRectY = - 5


        // if item is selected then show outer stroke behind the outer rect
        let outer;
        let outerStrokeColor = '#000000'
        if (this.props.type === NodeRectTypes.LOGIN) {
            outerStrokeColor = loginNode.outerStrokeColor
        } else if (this.props.type === NodeRectTypes.DEVICE_POLICY) {
            outerStrokeColor = devicePolicyNode.outerStrokeColor
        }

        if (this.state.isSelected) {
            outer = <Rect
                key={generateUniqueId()}
                x={outerRectX}
                y={outerRectY}
                offsetX={nodeRectConfig.width/2}
                offsetY={nodeRectConfig.height/2}
                width={outerRectWidth}
                height={outerRectHeight}
                cornerRadius={outerRectCornerRadius}
                strokeEnabled={true}
                strokeWidth={2}
                stroke={outerStrokeColor}
            />
        }

        let fillLinearGradientColorStops = [0, '#298cc1', 1, '#196086']
        if (this.props.type === NodeRectTypes.LOGIN) {
            fillLinearGradientColorStops = [0, loginNode.fillLinearGradientColors[0], 1, loginNode.fillLinearGradientColors[1]]
        } else if (this.props.type === NodeRectTypes.DEVICE_POLICY) {
            fillLinearGradientColorStops = [0, devicePolicyNode.fillLinearGradientColors[0], 1, devicePolicyNode.fillLinearGradientColors[1]]
        }


        return (
            <Group
                draggable={this.state.movable}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
                x={this.state.x}
                y={this.state.y}
            >
                {outer}

                <Rect
                    ref={node => {
                        this.rectRef = node;
                    }}
                    offsetX={nodeRectConfig.width/2}
                    offsetY={nodeRectConfig.height/2}
                    key={this.props.id}
                    width={nodeRectConfig.width}
                    height={nodeRectConfig.height}
                    onClick={this.handleClick}
                    cornerRadius={nodeRectConfig.cornerRadius}
                    strokeEnabled={true}
                    strokeWidth={4}
                    stroke={'white'}
                    fillLinearGradientStartPoint= { {X: nodeRectConfig.width / 2, Y: 0 }}
                    fillLinearGradientEndPoint= {{X: nodeRectConfig.width/2, Y: nodeRectConfig.height }}
                    fillLinearGradientColorStops= {fillLinearGradientColorStops}
                />
                <Path fill="white" data="M287.305,243.005c-0.136-1.772-0.928-3.476-2.227-4.747L172.835,126.015c4.416-10.403,6.747-21.669,6.747-33.312
                c0-22.754-8.875-44.163-24.938-60.266C138.558,16.366,117.164,7.5,94.397,7.5c-22.778,0-44.135,8.869-60.247,24.95
                C0.907,65.675,0.9,119.716,34.145,152.938c16.111,16.115,37.475,24.99,60.241,24.99c11.646,0,22.884-2.35,33.312-6.772
                l36.874,36.902c1.534,1.515,3.557,2.319,5.74,2.248l20.095-0.705l-0.656,20.145c-0.062,2.125,0.705,4.193,2.245,5.706
                c1.484,1.512,3.569,2.334,5.685,2.248l20.169-0.689l-0.724,20.123c-0.063,2.127,0.754,4.199,2.238,5.712
                c1.534,1.512,3.321,2.325,5.74,2.251l20.119-0.684l-0.674,20.126c-0.118,2.232,0.822,4.379,2.418,5.903
                c1.472,1.339,3.309,2.06,5.245,2.06c0.278,0,0.563-0.012,0.847-0.037l30.851-3.426c4.169-0.455,7.205-4.175,6.847-8.353
                L287.305,243.005z M84.106,82.415c-9.476,9.466-24.796,9.466-34.252,0c-9.47-9.469-9.47-24.786,0-34.246
                c9.456-9.46,24.771-9.469,34.252-0.003C93.563,57.625,93.557,72.952,84.106,82.415z M260.97,245.575
                c-1.126,1.126-2.635,1.688-4.101,1.688s-2.976-0.563-4.101-1.688l-95.501-95.529c2.659-2.867,5.077-5.885,7.273-9.058l96.429,96.41
                C263.221,239.65,263.221,243.324,260.97,245.575z" scaleX={0.2} scaleY={0.2} offsetX ={nodeRectConfig.width} offsetY={nodeRectConfig.height} onClick={this.handleClick}
                />

                <Circle
                    radius={10}
                    offsetX = {nodeRectConfig.width/2}
                    fill={'red'}
                    onMouseDown={(e) => this.handleMouseDown(e,'action')}
                    onMouseOut={this.handleMouseOut}
                />
                
                <Circle
                    radius={10}
                    offsetX = {-nodeRectConfig.width/2}
                    fill={'blue'}
                    onMouseDown={(e) => this.handleMouseDown(e,'trigger')}
                    onMouseOut={this.handleMouseOut}
                />

            </Group>
        )
    }
}

NodeRect.propTypes = {
    type: PropTypes.oneOf([NodeRectTypes.LOGIN, NodeRectTypes.DEVICE_POLICY]).isRequired,
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool
}

export default NodeRect;