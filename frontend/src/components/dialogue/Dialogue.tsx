import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MdInfoOutline } from "react-icons/md";


interface DialogueProps {
    text: string;
    className?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const AlertDialog: React.FC<DialogueProps> = ({ text, onConfirm, onCancel }) => {
    const [open, setOpen] = React.useState(true);


    const handleClose = () => {
        setOpen(false);
        onConfirm()
    };

    const handleCancel = () => {
        onCancel()
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className=' text-orange-300 '>
                    <MdInfoOutline
                        className=' mx-auto w-1/4 h-1/4'
                    />
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>No</Button>
                    <Button onClick={handleClose} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AlertDialog
