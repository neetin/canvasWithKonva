import React, { Component } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

class GridCanvas extends Layer {
    constructor() {
        super();
    }
    state = {
        color: 'green'
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };
    render() {
        return (
            <layer>{this.props.children}</layer>
        );
    }
}

export default GridCanvas