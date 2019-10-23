import React, { PureComponent } from 'react'
import ReactSVG from 'react-svg'


class ListPopUp extends PureComponent {

    handleClick(data) {
        // console.log('item: ', data)
        this.props.onItemClick(data);
    }

    render() {
        return (
            <div style={popUpContainer}>
                <div style={popUpRow}>
                    {
                        this.props.data.map((item, index) => {
                            return <a style={popUpItem} href="#" id={item.id} onClick={this.handleClick.bind(this, item)} key={item.id}>
                                <ReactSVG src={item.image} style={popUpItemLeft}
                                    beforeInjection={svg => {
                                        svg.setAttribute('style', 'width: 40px; height:40px;')
                                    }}
                                />
                                <div style={popUpItemRight}>{item.name}</div>
                            </a>;
                        })
                    }
                </div>
            </div>

        );
    }
}


const popUpContainer = {
    height: '100%',
    padding: '0px',
    margin: '0px',
    display: '-webkit-box',
    display: '-moz-box',
    display: '-ms-flexbox',
    display: '-webkit-flex',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 9px 13px 0 rgba(187, 187, 187, 0.5)',
    backgroundColor: 'white',
    borderRadius: '4px',
}

const popUpRow = {
    width: 'auto',
}

const popUpItem = {
    backgroundColor: '#298cc1',
    padding: '5px',
    margin: '5px',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textDecoration: 'none',
}

const popUpItemLeft = {
    width: '50px',
    flex: '0 0 50px',
    margin: '5px',
}

const popUpItemRight = {
    width: '200px',
    display: 'flex',
    height: '50px',
    justifyContent: 'left',
    alignItems: 'center',
    color: 'white',

}

export default ListPopUp;