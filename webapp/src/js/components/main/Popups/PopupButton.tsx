import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

type PopupButtonProps = {
    ButtonComponent: JSX.Element,
    PopupComponent: JSX.Element,
    popupId?: string

}

const PopupButton =  function({ButtonComponent, PopupComponent, popupId}:PopupButtonProps) {
    
    return (
        <PopupState variant="popover" popupId={popupId}>
        {(popupState) => (
            <div>
                { React.cloneElement(ButtonComponent,Object.assign({variant:"contained",color:"primary"},bindTrigger(popupState))) }
                <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                >
                    {PopupComponent}
                </Popover>
            </div>
        )}
        </PopupState>
    );
}

export default PopupButton