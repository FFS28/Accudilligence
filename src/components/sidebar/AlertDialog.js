import React from 'react';
import { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { cancelWarningDialog } from '../../store/modules/dialogRedux';

export default function AlertDialog(props) {

    const {type, selector, openWarningDialog} = props;

    const dispatch = useDispatch();

    const handleCancelDialog = () => {
        dispatch(cancelWarningDialog(false))
    }

    return (
        <div>
            <Dialog
                open={openWarningDialog}
                onClose={handleCancelDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{type}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This {selector} was not activated.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialog} variant="contained" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
