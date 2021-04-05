import React from 'react'
import MainBar from './Navigation/MainBar'
import { defaultStateInterface } from '../../redux/store/defaultState'
import { stopLoading } from '../../redux/actions/loadingActions'
import { connect } from 'react-redux'

interface HomeProps {
    stopLoadingHandle: Function
}
class Home extends React.Component<HomeProps, {}> {
    componentDidMount() {
        this.props.stopLoadingHandle()
    }
    render() {
        return (<React.Fragment>
            
        </React.Fragment>)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        stopLoadingHandle: () => {
            dispatch(stopLoading())
        }
    }
}

const _Home = connect(null, mapDispatchToProps)(Home);
export default _Home;