import React from 'react'


type ButtonGroupProps = {
    onClick?: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    itemOnClick?: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,state:{}, props:{}, children: React.ReactNode) => void,
    defaultItemClicked?: number
}
const ButtonGroup: React.FC<ButtonGroupProps> = function ({ children, onClick, itemOnClick, defaultItemClicked }) {
    const [whichIsClicked, setWhichIsClicked] = React.useState(defaultItemClicked !== null || defaultItemClicked !== undefined  ? defaultItemClicked : -1)
    const handleOnClick = (index: number):ButtonGroupProps['itemOnClick'] => (e,state,props,children)  => {
        setWhichIsClicked(index)
        if (onClick) onClick(e)
        if (itemOnClick) itemOnClick(e,state,props,children)
    }
    return (React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { key:index, onClick: handleOnClick(index), selfManage: false, clicked: whichIsClicked === index ? true : false })
    }))

}

export default ButtonGroup