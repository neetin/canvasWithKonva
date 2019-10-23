import React, { useState } from 'react'
import { Shape } from "react-konva";
import PropTypes from 'prop-types';
import { NodeRectTypes } from '../config/configShape';
const RADIUS = 20;

const CustomLine = ({ points, stroke, strokeWidth, capabilityType, startNode }) => {
    const [isMouseOver, setIsMouseOver] = useState(false)

    if (isMouseOver) {
        stroke = '#69767f'
    }

    const ctp = {
        x: (points[0] + points[2]) / 2,
        y: (points[1] + points[3]) / 2
    };

    const width = points[2] - points[0];
    const height = points[3] - points[1];

    const dir = Math.sign(height)
    const radius = Math.min(
        RADIUS,
        Math.abs(height / 2),
        Math.abs(width / 2)
    )

    const maxX = Math.max(Math.abs(width), RADIUS)

    let p1 = points[0] + maxX
    let p2 = points[1] + dir * radius
    let p3 = points[2] - maxX
    let p4 = ctp.y + height / 3
    let p5 = points[2]
    let p6 = points[3]

    if (capabilityType !== undefined && capabilityType === 'action') {
        p1 = points[0] - maxX
        p3 = points[2] + maxX
    }

    return (
        <Shape
            // dash={[10, 5]}
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}
            points={points}
            sceneFunc={(context, shape) => {
                context.beginPath()
                context.moveTo(points[0], points[1])

                if ((points[0] >= points[2] && capabilityType === 'action') ||
                    (startNode === NodeRectTypes.CONNECTOR && points[0] < points[2])
                ) {
                    context.quadraticCurveTo(
                        points[0],
                        points[3],
                        points[2],
                        points[3]
                    )
                } else if (points[0] >= points[2] || (points[0] < points[2] && capabilityType === 'action')) {
                    context.bezierCurveTo(p1, p2, p3, p4, p5, p6)
                } else {
                    context.quadraticCurveTo(
                        points[2],
                        points[1],
                        points[2],
                        points[3]
                    )
                }
                context.fillStrokeShape(shape)
            }}
            stroke={stroke}
            strokeWidth={strokeWidth}
        />
    )
}

CustomLine.propTypes = {
    points: PropTypes.array.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    stroke: PropTypes.string.isRequired,
}

export default CustomLine
