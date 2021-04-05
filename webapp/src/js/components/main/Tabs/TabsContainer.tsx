import React from 'react' 

type TabsContainer = {
    onChange: Function,
    value: number
}

const TabsContainer:React.FC<TabsContainer> = ({children, onChange, value})=>{
    return (<div>
        {React.Children.map(children,(child:React.ReactNode, index: number)=>{
            return React.cloneElement(child,{
                onClick: ()=>{
                    onChange(index);
                },
                clicked: index === value
            })
        })}
    </div>)
}

export default TabsContainer