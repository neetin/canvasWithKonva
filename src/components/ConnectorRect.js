import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { Rect, Group, Path, Image,Circle } from 'react-konva';
import useImage from 'use-image';

import {connectionConfig, NodeRectTypes} from '../config/configShape';
import connector from '../assets/share.svg';
import { generateUniqueId } from '../utils/utils';

function ConnectorImage() {
    // set crossOrigin of image as second argument
    const [image, status] = useImage(connector, 'Anonymous');

    // status can be "loading", "loaded" or "failed"

    return (
        <Image image={image} x={200} y={200} />
    );
}

class ConnectorRect extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            x: this.props.originX - connectionConfig.width / 2,
            y: this.props.originY - connectionConfig.height / 2,
            originX: props.originX,
            originY: props.originY,
            isSelected: props.isSelected,
            movable:true
        }

    }

    handleClick = e => {
        this.setState({
            isSelected: !this.state.isSelected
        });
        this.props.handleSelected(this.props.data, this.state.isSelected)
    }

    handleMouseOut = e => {
        this.setState({
            movable:true
        })
    }

    handleMouseDown = (e,capabilityType) => {
        // console.log('state::::: ', this.state)
        console.log("handleMouseDown in rect  .......e  ", e)
        console.log(capabilityType)
        this.setState({movable:false})
        const x = e.evt.x
        const y = e.evt.y
        // console.log("x:  ",x)
        // console.log("y:  ",y)
        // console.log("isSelected false state..- -----------------------")
        const props = { item: this.props.data, x: x, y: y,capabilityType }
        // console.log('passed props ------------------ ::: ', props)

        this.props.onMouseDown(props)
    }

    handleDragEnd = e => {
        const { movementX, movementY } = e.evt
        // console.log('drag end e: ::::: ', e)
        const absolutePosition = this.rectRef.getAbsolutePosition();
        // console.log("onDragEnd Rect", absolutePosition);
        this.setState({
            x: absolutePosition.x ,
            y: absolutePosition.y ,
        });

        const props = { newX: absolutePosition.x + connectionConfig.width/2, newY: absolutePosition.y+ connectionConfig.height/2, item: this.props.data, movementX, movementY }
        this.props.onDrag(props, true)
    }

    componentWillReceiveProps(props) {
        this.setState({
            isSelected: props.isSelected,
            originX: props.originX,
            originY: props.originY,
            x: this.props.originX - connectionConfig.width / 2,
            y: this.props.originY - connectionConfig.height / 2,
        });
    }

    handleDragMove = e => {
        const { movementX, movementY } = e.evt
        console.log('event----', this.rectRef)
        const absolutePosition = this.rectRef.getAbsolutePosition();
        // this.setState({
        //     x: - connectionConfig.width / 2,
        //     y: - connectionConfig.height / 2,
        // });

        const props = { newX: absolutePosition.x + connectionConfig.width/2, newY: absolutePosition.y + connectionConfig.height/2, item: this.props.data, movementX, movementY  }
        this.props.onDrag(props, false)
    }


    render() {
        // assuming icon size fits into the rect, we need to work on this if icons are larger than outer rect
        const iconOriginX = 8
        const iconOriginY = 8
        const fillLinearGradientColorStops = [0, '#2f3539', 1, '#2f3539']
        const outerRectWidth = connectionConfig.width + 10
        const outerRectHeight = connectionConfig.height + 10
        const outerRectCornerRadius = outerRectWidth / 2
        let outerStrokeColor = '#000000'

        const outerRectX = - 5
        const outerRectY = - 5

        let outer;
        if (this.state.isSelected) {
            outer = <Rect
                key={generateUniqueId()}
                x={outerRectX}
                y={outerRectY}
                width={outerRectWidth}
                height={outerRectHeight}
                cornerRadius={outerRectCornerRadius}
                strokeEnabled={true}
                strokeWidth={2}
                stroke={outerStrokeColor}
            />
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
                    key={this.props.id}
                    width={connectionConfig.width}
                    height={connectionConfig.height}
                    cornerRadius={connectionConfig.cornerRadius}
                    fillLinearGradientStartPoint={{ X: connectionConfig.width / 2, Y: 0 }}
                    fillLinearGradientEndPoint={{ X: 0, Y: connectionConfig.height }}
                    fillLinearGradientColorStops={fillLinearGradientColorStops}
                    onClick={this.handleClick}
                />

                <Path fill="white" data="M385.513,301.214c-27.438,0-51.64,13.072-67.452,33.09l-146.66-75.002
                c1.92-7.161,3.3-14.56,3.3-22.347c0-8.477-1.639-16.458-3.926-24.224l146.013-74.656c15.725,20.924,40.553,34.6,68.746,34.6
                c47.758,0,86.391-38.633,86.391-86.348C471.926,38.655,433.292,0,385.535,0c-47.65,0-86.326,38.655-86.326,86.326
                c0,7.809,1.381,15.229,3.322,22.412L155.892,183.74c-15.833-20.039-40.079-33.154-67.56-33.154
                c-47.715,0-86.326,38.676-86.326,86.369s38.612,86.348,86.326,86.348c28.236,0,53.043-13.719,68.832-34.664l145.948,74.656
                c-2.287,7.744-3.947,15.79-3.947,24.289c0,47.693,38.676,86.348,86.326,86.348c47.758,0,86.391-38.655,86.391-86.348
                C471.904,339.848,433.271,301.214,385.513,301.214z" scaleX={0.05} scaleY={0.05} x={iconOriginX} y={iconOriginY} onClick={this.handleClick}
                />


              <Circle
                radius={10}
                offsetX = {+10}
                offsetY = {-connectionConfig.height / 2}
                fill={'red'}
                onMouseDown={(e) => this.handleMouseDown(e,'action')}
                onMouseOut={this.handleMouseOut}

              />
              <Circle
                radius={10}
                offsetX = {-connectionConfig.width - 10}
                offsetY = {-connectionConfig.height / 2}
                fill={'blue'}
                onMouseDown={(e) => this.handleMouseDown(e,'trigger')}
                onMouseOut={this.handleMouseOut}

              />

            </Group>
        );
    }
}

ConnectorRect.propTypes = {
    originX: PropTypes.number.isRequired,
    originY: PropTypes.number.isRequired,
    type: PropTypes.oneOf([NodeRectTypes.CONNECTOR]).isRequired,
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool
}

export default ConnectorRect;
