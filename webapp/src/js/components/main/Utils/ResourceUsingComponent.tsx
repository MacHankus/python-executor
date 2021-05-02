import React from 'react'
import ResourceLoader from './ResourceLoader'
import Loader from '../Loader/Loader'
import isElementInViewport from '../../../utils/viewport'
type ResourceUsingComponentState = {
    isError: boolean,
    errorMsg: string | null,
    data: object[] ,
    resourceLoaded: boolean | null,
    loading: boolean,
    isEmpty: boolean,
    actualLoaded:object,
    eventSetTime:number,
    nextUrl: string | null
}
type ResourceUsingComponentProps = {
    render(data:object[], loading: boolean): React.Component | JSX.Element,
    baseUrl:string ,
    envelope: string ,
    fetchOptions?: object,
    waitingComponent?: React.FC,
    errorRender?(errorMsg: string): React.Component | JSX.Element,
    enableLoader?: boolean,
    loadOnce?:boolean,
    lazyLoadId:string
}


class ResourceUsingComponent extends React.Component<ResourceUsingComponentProps,ResourceUsingComponentState> {
    constructor(props:ResourceUsingComponentProps) {
        super(props)
        this.state = {
            isError: false,
            errorMsg: null,
            data: [],
            actualLoaded:{},
            resourceLoaded: null,
            loading: false,
            isEmpty: false,
            eventSetTime: 0,
            nextUrl: null
        }
    }
    static defaultProps = {
        fetchOptions:{
            method:'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        waitingComponent:<Loader />,
        enableLoader: true
    }
    setModifiedUrl = (newUrl: string)=>{
        this.setState({
            nextUrl: newUrl
        })
    }
    disableEvent = ()=>{
        document.removeEventListener('scroll',this.whenVisible)
        this.setState({isEmpty:true})
    }
    setEvent = ()=>{
        const id = this.props.lazyLoadId
        const elem = document.getElementById(id)
        if (!elem){
            throw Error(`There is no element with id [${id}].`)
        }
        document.addEventListener('scroll',this.whenVisible)
    }
    whenVisible = (ev: Event)=>{
        // Prevent too many scrolls
        if (this.state.eventSetTime + 100 >= ev.timeStamp || this.state.loading) return
        // Check if element is in view
        const elem = document.getElementById(this.props.lazyLoadId)
        if(!elem) return
        if (!isElementInViewport(elem)) return
        // Do nothing if error during last request
        if(this.state.isError){
            console.log("There is error inside ResourceUsingComponent. Cant load more from " + this.props.baseUrl +".")
            return
        }
        // Is empty only when last resource didnt have 'next'
        if(this.state.isEmpty){
            this.disableEvent()
            console.log("Loading disabled for : [" + this.props.baseUrl +"].")
            return 
        }
        this.setState(
            {loading:true, eventSetTime: ev.timeStamp},
            ()=>setTimeout(()=>{if ( this.state.eventSetTime === ev.timeStamp ) this.load()},50)
        )

    }
    componentDidMount(){
        this.setState(
            {loading:true},
            ()=>{
                this.load()
                this.setEvent()
            }
        )
    }
    load = async () => {
        const url = this.state.nextUrl ? this.state.nextUrl : this.props.baseUrl
        const res = await fetch(url,this.props.fetchOptions)
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
            loading:false,
            isEmpty : !data._links || !data._links.next ? true : false,
            nextUrl : data._links && data._links.next ? data._links.next : null 
        }))
    }
    render() {
        console.log(this.state)
        if (!this.state.resourceLoaded && !this.state.isError && this.props.enableLoader) {
            return this.props.waitingComponent
        }
        if (this.state.isError && this.state.errorMsg) {
            if (this.props.errorRender) {
                return this.props.errorRender(this.state.errorMsg)
            }
            return <div>{this.state.errorMsg}</div>
        }
        return this.props.render(this.state.data, this.state.loading)

    }
}


export default ResourceUsingComponent