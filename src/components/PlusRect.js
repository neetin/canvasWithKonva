import React, { PureComponent } from 'react'
import { Rect, Group, Path, } from 'react-konva'

class PlusRect extends PureComponent {

    constructor() {
      super() 
    }
    render() {
      let originX = this.props.joiningX
      let originY = this.props.joiningY
  
      return (
        <Group>
          
          <Rect
            x={originX}
            y={originY}
            width={40}
            height={40}
            cornerRadius={10}
            stroke={'#9bc754'}
            dashEnabled={true}
            dash={[5, 2]}
            strokeWidth={2}
          />
          <Path fill="#9bc754" data="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059
      C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z" scaleX={0.3} scaleY={0.3} x={originX + 14 } y={originY + 14} />
      
        </Group>
      );
    }
  }
  
  export default PlusRect;