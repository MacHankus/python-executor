import React from 'react'
import Loader from '../Loader/Loader'


interface ResourceLoaderProps {
    resource: Promise<any>,
    render: Function,
    errorRender?: Function,
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
    load = async () => {
        try {
            const r = await this.props.resource
            if (!r.ok) {
                if (r.status === 404){
                    this.setState({
                        isError: true,
                        errorMsg: 'Not Found',
                        resourceLoaded: true
                    })
                    return    
                }
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
        }catch(e){
            this.setState({
                isError: true,
                errorMsg: 'Something wrong during data load. Please try again.'
            })
            return
        }
        
    }
    componentDidMount(){
        this.load()
    }
    render() {
        console.log(this.state)
        if (!this.state.resourceLoaded && !this.state.isError) {
            if (this.props.waitingComponent) {
                return this.props.waitingComponent
            }
            return <Loader />
        }
        if (this.state.isError) {
            if (this.props.errorRender) {
                return this.props.errorRender(this.state.errorMsg)
            }
            return <div>{this.state.errorMsg}</div>
        }
        return this.props.render(this.state.data)

    }
}