import { nodeRectConfig } from "../config/configShape";


export const checkPointInclusion = (props) => {
    const { x1, y1, x2, y2, x3, y3, x4, y4, x, y } = props
    // console.log('checkPointInclusion props:::::', props)

    // calculate area of a triangle
    function area(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0)
    }

    const a = area(x1, y1, x2, y2, x3, y3) + area(x1, y1, x4, y4, x3, y3)
    const a1 = area(x, y, x1, y1, x2, y2)
    const a2 = area(x, y, x2, y2, x3, y3)
    const a3 = area(x, y, x3, y3, x4, y4)
    const a4 = area(x, y, x1, y1, x4, y4)

    // console.log("area a: ", a)
    // console.log("area a1: ", a1)
    // console.log("area a2: ", a2)
    // console.log("area a3: ", a3)
    // console.log("area a4: ", a4)
    return (a == a1 + a2 + a3 + a4)
}

export const shortestSideCoordinates = (props) => {

    // const props = {x1: 200, y1: 200, x2: 280, y2: 200, x3: 280, y3: 280, x4: 200, y4: 280, x: x, y: y}
    // const props = {x1: 200, y1: 245, x2: 245, y2: 200, x3: 290, y3: 245, x4: 245, y4: 290, x: x, y: y}

    const { x1, y1, x2, y2, x3, y3, x4, y4, x, y } = props
    const px1 = x1,
        py1 = y1 + (y4 - y1) / 2,
        px2 = x4 + (x3 - x4) / 2,
        py2 = y4,
        px3 = x3,
        py3 = y2 + (y3 - y2) / 2,
        px4 = x1 + (x2 - x1) / 2,
        py4 = y1

    // console.log("px1: ", px1)
    // console.log("py1: ", py1)

    // console.log("px2: ", px2)
    // console.log("py2: ", py2)

    // console.log("px3: ", px3)
    // console.log("py3: ", py3)

    // console.log("px4: ", px4)
    // console.log("py4: ", py4)

    // console.log("x: ", x)
    // console.log("y: ", y)

    const d1 = Math.sqrt(Math.pow((px1 - x), 2) + Math.pow((py1 - y), 2))
    const d2 = Math.sqrt(Math.pow((px2 - x), 2) + Math.pow((py2 - y), 2))
    const d3 = Math.sqrt(Math.pow((px3 - x), 2) + Math.pow((py3 - y), 2))
    const d4 = Math.sqrt(Math.pow((px4 - x), 2) + Math.pow((py4 - y), 2))
    // console.log("d1: ", d1)
    // console.log("d2: ", d2)
    // console.log("d3: ", d3)
    // console.log("d4: ", d4)
    const minDistance = Math.min(d1, d2, d3, d4)

    if (d1 == minDistance) {
        return { x: px1, y: py1 }
    } else if (d2 == minDistance) {
        return { x: px2, y: py2 }
    } else if (d3 == minDistance) {
        return { x: px3, y: py3 }
    } else {
        return { x: px4, y: py4 }
    }
}

export const reArrangeConnectingLineCoordinates = (startX, startY, endX, endY) => {
    let props = getRectFourSidesAndAPoint(startX, startY, endX, endY)
    let { x, y } = shortestSideCoordinates(props)
    let propshape2 = getRectFourSidesAndAPoint(endX, endY, x, y)
    let coordinates = shortestSideCoordinates(propshape2)
    return { startX: x, startY: y, endX: coordinates.x, endY: coordinates.y }
}

export const getRectFourSidesAndAPoint = (originX, originY, x, y) => {
    // props sample x1, y1, x2, y2 ... are rectangle's four sides. (x, y) are point of other end of the line.
    return { x1: originX, y1: originY, x2: originX + nodeRectConfig.width, y2: originY, x3: originX + nodeRectConfig.width, y3: originY + nodeRectConfig.height, x4: originX, y4: originY + nodeRectConfig.height, x: x, y: y }
}

export const getRightSidePointOfNode = (originX, originY) => {
    const sideX = originX + nodeRectConfig.width
    const sideY = originY + nodeRectConfig.height / 2
    return { sideX, sideY }
}


export const getLeftSidePointOfNode = (originX, originY) => {
    const sideX = originX
    const sideY = originY + nodeRectConfig.height / 2
    return { sideX, sideY }
}

export const generateUniqueId = () => {
    let array = new Uint32Array(8)
    window.crypto.getRandomValues(array)
    let str = ''
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4)
    }
    return str
}

export const reverse = (r1, r2) => {
    // reverse co-ords if user drags left / up
    var r1x = r1.x, r1y = r1.y, r2x = r2.x, r2y = r2.y, d;
    if (r1x > r2x) {
        d = Math.abs(r1x - r2x);
        r1x = r2x; r2x = r1x + d;
    }
    if (r1y > r2y) {
        d = Math.abs(r1y - r2y);
        r1y = r2y; r2y = r1y + d;
    }
    return { x1: r1x, y1: r1y, x2: r2x, y2: r2y } // return the corrected rect.     
}

export const hitCheck = (shape1, shape2) => {
    // corners of shape 1
    var X = shape1.x;
    var Y = shape1.y
    var A = shape1.x + shape1.width;
    var B = shape1.y + shape1.height;

    // corners of shape 2
    var X1 = shape2.x;
    var A1 = shape2.x + shape2.width;
    var Y1 = shape2.y
    var B1 = shape2.y + shape2.height;

    // Simple overlapping rect collision test
    if (A < X1 || A1 < X || B < Y1 || B1 < Y) {
        return false
    }
    else {
        return true;
    }
}
