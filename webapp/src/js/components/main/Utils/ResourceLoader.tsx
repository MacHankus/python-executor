import React from 'react'
import Loader from '../Loader/Loader'


interface ResourceLoaderProps {
    resource: Function,
    render: Function,
    errorComponent?: React.Component,
    waitingComponent?: React.Component
}
interface ResourceLoaderState {
    resourceLoaded: boolean,
    data: object | string | null,
    isError: boolean,
    errorMsg: string | null
}

export default class ResourceLoader extends React.Component<ResourceLoaderProps, ResourceLoaderState>{
    state = {
        resourceLoaded: false,
        data: null,
        isError: false,
        errorMsg: null
    }
    componentDidMount = async () => {
        const r = await this.props.resource()
        if (!r.ok) {
            this.setState({
                isError: true,
                errorMsg: r.statusText,
                resourceLoaded: true
            })
            return
        }
        const j = await r.json()
        this.setState({
            resourceLoaded: true,
            data: j
        })
    }
    render() {
        console.log(this.state)
        if (!this.state.resourceLoaded) {
            if (this.props.waitingComponent) {
                return this.props.waitingComponent
            }
            return <Loader />
        }
        if (this.state.isError) {
            if (this.props.errorComponent) {
                return this.props.errorComponent
            }
            return <div>{this.state.errorMsg}</div>
        }
        return this.props.render(this.state.data)

    }
}