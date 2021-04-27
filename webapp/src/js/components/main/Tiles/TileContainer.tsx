import { Grid, GridProps } from '@material-ui/core'
import React from 'react'



const TileContainer: React.FC<GridProps> = ({
    children,
    ...props
}) => {
    
    return (
        <Grid container {...props}>
            {React.Children.map(children,(child)=>{
                return (<Grid item>
                    {child}
                </Grid>)
            })}
        </Grid>
    )
}
export default TileContainer