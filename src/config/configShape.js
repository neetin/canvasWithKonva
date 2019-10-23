

export const NodeRectTypes = {
    LOGIN: 'LOGIN',
    DEVICE_POLICY: 'DEVICE_POLICY',
    CONNECTOR: 'CONNECTOR',
}

export const nodeRectConfig = {
    width: 90,
    height: 90,
    cornerRadius: 22,
}

export const connectionConfig = {
    width: 40,
    height: 40,
    strokeColor: '#9b9b9b',
    cornerRadius: 20,
}

// line join options: round, bevel, miter
export const line = {
    lineJoin: 'round',
    strokeColor: '#9b9b9b',
    storkeWidth: '2',
}

export const loginNode = {
    outerStrokeColor: '#2278a6',
    fillLinearGradientColors: ['#298cc1', '#196086']
}

export const devicePolicyNode = {
    outerStrokeColor: '#8a67c8',
    fillLinearGradientColors: ['#7d56c2', '#af98d9']
}