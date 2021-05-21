import React from 'react'
import {ApiInputCommonProps, ApiInputCommonSate} from './Common' 
import { EqualityOperatorInterface } from '../../../../utils/resource/filterUrlParser'
import { createStyles, WithStyles } from '@material-ui/core'
import { TextField } from '@material-ui/core';

export abstract class ApiInputAbstract<P ,S > extends React.Component<P & ApiInputCommonProps, S & ApiInputCommonSate >  {
    constructor(props:P & ApiInputCommonProps){
        super(props)
        this.state = {
            value:null,
            managerIndex:0,
            error:false,
            errorMsg: null
        }
    }
    setError = (errorMsg:string) =>{
        if (errorMsg.length > 0){
            this.setState({errorMsg: errorMsg, error:true})
        }
    }
    equalityList:Array<EqualityOperatorInterface>=[]
    handleOnManagerIndexChange = (index: number)=>{
        if (this.equalityList.length === 0){
            throw Error("equalityList should be defined")
        }
        if (index !== this.state.managerIndex){
            this.setState({managerIndex:index})
            if (this.props.onChange) this.props.onChange(this.props.name,this.equalityList[index].buildFrom(this.props.name,this.state.value), this.state.value,false)
        } 
    }
    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const target = e.target
        const value = target.value
        if (this.props.validate){
            let validate = this.props.validate(value)
            console.log(validate)
            if (typeof validate === 'object' && validate !== null) {
                this.setError(validate.errorMsg)
                console.error(`Wrong value [${value}] for input: ${this.props.name}`)
                this.props.onChange(this.props.name,null, value,true)
                return
            }
            
        }
        if (this.props.onChange) this.props.onChange(this.props.name,this.equalityList[this.state.managerIndex].buildFrom(this.props.name,value), value,false)
        this.setState({value:value,error:false,errorMsg:null})
    }
}