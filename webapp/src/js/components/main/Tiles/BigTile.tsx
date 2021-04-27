import React from 'react'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import posed from 'react-pose';
import grey from '@material-ui/core/colors/grey'
import green from '@material-ui/core/colors/green'
import lightBlue from '@material-ui/core/colors/lightBlue'
import teal from '@material-ui/core/colors/teal'

function styleProducer(variant: BigTileProps['variant'], color: BigTileProps['color']): Function {
    const colorMap = {
        default:{},
        grey:{
            tile:{background:grey[700],color:'white'}
        },
        green:{
            tile:{background:green[300]}
        },
        teal:{
            tile:{background:teal[400],color:'white'}
        },
        blue:{
            tile:{background:lightBlue[200]}
        },
    }
    const variants = {
        small: (theme:any)=>({
            tile:Object.assign({  
                minWidth: theme.spacing(10),
                height: theme.spacing(10),
                background:grey[500],
                position:'relative',
                '&:hover':{
                    cursor:'pointer'
                }
            },colorMap[color].tile),
            content:{
                fontSize:'2rem',
                fontWeight:'bold'
            },
            title:{
                textTransform:'uppercase'
            },
            icon:{
                position:'absolute',
                top:0,
                left:0
            }
        }),
        default:(theme:any)=>({
            tile:Object.assign({  
                minWidth: theme.spacing(15),
                height: theme.spacing(15),
                position:'relative',
                '&:hover':{
                    cursor:'pointer'
                }
            },colorMap[color].tile),
            content:{
                fontSize:'2rem',
                fontWeight:'bold'
            },
            title:{
                textTransform:'uppercase'
            },
            icon:{
                position:'absolute',
                top:0,
                left:0
            }
        }),
        big:(theme:any)=>({
            tile:Object.assign({  
                minWidth: theme.spacing(20),
                height: theme.spacing(20),
                position:'relative',
                '&:hover':{
                    cursor:'pointer'
                }
            },colorMap[color].tile),
            content:{
                fontSize:'2rem',
                fontWeight:'bold'
            },
            title:{
                textTransform:'uppercase'
            },
            icon:{
                position:'absolute',
                top:0,
                left:0
            }
        }),
        large:(theme:any)=>({
            tile:Object.assign({  
                minWidth: theme.spacing(25),
                height: theme.spacing(25),
                position:'relative',
                '&:hover':{
                    cursor:'pointer'
                }
            },colorMap[color].tile),
            content:{
                fontSize:'2rem',
                fontWeight:'bold'
            },
            title:{
                textTransform:'uppercase'
            },
            icon:{
                position:'absolute',
                top:0,
                left:0
            }
        })
    }
    return makeStyles(variants[variant])
}

type BigTileProps = {
    color?: 'default' | 'grey' | 'green' | 'blue' | 'teal',
    variant?: 'small' | 'default' | 'big' | 'large',
    width?: string , // 15px , 10rem etc
    height?: string, // 15px , 10rem etc
    title?: string,
    content?: string
    icon?: React.FC | React.ReactElement
}
const PosedPaper = posed(Paper)({
    onHover:{
        scale:1.05
    },
    none:{
        scale:1
    }
})
const BigTile: React.FC<BigTileProps> = ({
    variant = 'default',
    color = 'default',
    width,
    height,
    children,
    title,
    content,
    icon,
    ...props
}) => {
    const [hover, setHover] = React.useState(false)
    const useStyles = styleProducer(variant, color)
    const classes = useStyles()
    const onHoverHandle = (bool)=>()=>{
        setHover(bool)
    }
    return (
        <PosedPaper className={classes.tile} style={{height,width}} pose={hover? 'onHover' : 'none'} onMouseEnter={onHoverHandle(true)} onMouseLeave={onHoverHandle(false)}>
            <Box className={classes.icon} p={1}>
                {icon}
            </Box>
            <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Box mb={1} className={classes.content}>{children ? children : content}</Box>
                <Box className={classes.title}>{title}</Box>
            </Box>
        </PosedPaper>
    )
}
export default BigTile