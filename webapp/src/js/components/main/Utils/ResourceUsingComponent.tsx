import React from 'react'
import ResourceLoader from './ResourceLoader'
import Loader from '../Loader/Loader'

type ResourceUsingComponentState = {
    isError: boolean | null,
    errorMsg: string | null,
    data: object[] ,
    resourceLoaded: boolean | null,
    loading: boolean
}
type ResourceUsingComponentProps = {
    render(data:object[]): React.Component | JSX.Element,
    url:string ,
    envelope: string ,
    fetchOptions?: object,
    waitingComponent?: React.FC,
    errorRender?: React.FC,
    enableLoader: boolean
}


class ResourceUsingComponent extends React.Component<ResourceUsingComponentProps,ResourceUsingComponentState> {
    constructor(props:object) {
        super(props)
        this.state = {
            isError: null,
            errorMsg: null,
            data: [],
            resourceLoaded: null,
            loading: false
        }
    }
    componentDidMount(){
        this.load()
    }
    async load(){
        this.setState({loading:true})
        function isEmpty(obj:object) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
        
            return true;
        }
        if ((this.props.url === "" || !this.props.url) || (this.props.envelope === "" || !this.props.envelope)){
            throw Error("URL and envelope cannot be empty.")
        }
        
        const res = await fetch(this.props.url, !isEmpty(this.props.fetchOptions) ? this.props.fetchOptions : {
            method:'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (!res.ok){
            this.setState({
                isError:true ,
                errorMsg: res.statusText,
                loading:false
            })
        }
        const data = await res.json()

        this.setState((prevState,prevProps)=>({
            isError:false,
            errorMsg: null,
            data:prevState.data.concat(data[this.props.envelope]),
            resourceLoaded: true,
            loading:false
        }))
    }
    render() {
        console.log(this.state)
        if (!this.state.resourceLoaded && !this.state.isError && this.props.enableLoader) {
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
        return this.props.render(this.state.data, this.state.loading)

    }
}


export default ResourceUsingComponent