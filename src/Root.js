import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { actions as canvasActions } from './actions/canvasActions';
import App from './App';

class Root extends PureComponent {
    render() {
        // console.log("history::: ", this.props.history);
        return (
            <Provider store={this.props.store}>
                <PersistGate
                    loading={null}
                    persistor={this.props.persistor}>
                    <App />
                </PersistGate>
            </Provider>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authed: false
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({ ...canvasActions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
