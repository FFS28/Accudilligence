const SUBMIT_PROJECT = 'ProjectActivateDialog/SUBMIT_PRODUCT';
const CANCEL_DIALOG = 'ActivateDialog/CANCEL_DIALOG';
const SUBMIT_AREA = 'AreaDialog/SUBMIT_AREA';
const CANCEL_WARNING_DIALOG = 'WarningDialog/CANCEL_WARNING_DIALOG';

export const activateProject = (statusProjectCode, errorProjectActivate) => ({
    type: SUBMIT_PROJECT,
    statusProjectCode,
    errorProjectActivate
}); 

export const cancelDialog = (openDialog) => ({
    type: CANCEL_DIALOG,
    openDialog
});

export const activateArea = (statusAreaCode, errorAreaActivate) => ({
    type: SUBMIT_AREA,
    statusAreaCode,
    errorAreaActivate
});

export const cancelWarningDialog = (openWarningDialog) => ({
    type: CANCEL_WARNING_DIALOG,
    openWarningDialog
});

const initialState = {
    statusProjectCode: 0,
    statusAreaCode: 0,
    errorProjectActivate: null,
    errorAreaActivate: null,
    openDialog: null,
    openWarningDialog: null,
}

export default function dialog(state = initialState, action) {
    switch(action.type) {
        case SUBMIT_PROJECT:
            // console.log(action.statusProjectCode);
            return {
                ...state,
                statusProjectCode: action.statusProjectCode,
                errorProjectActivate: action.errorProjectActivate,
            }
        case SUBMIT_AREA:
            // console.log(action.statusAreaCode);
            return {
                ...state,
                statusAreaCode: action.statusAreaCode,
                errorAreaActivate: action.errorAreaActivate,
            }
        case CANCEL_DIALOG:
            return  {
                ...state,
                openDialog: action.openDialog,
            }
        case CANCEL_WARNING_DIALOG:
            // console.log('close:' + action.openWarningDialog);
            return {
                ...state,
                openWarningDialog: action.openWarningDialog,
            }
        default:
            return state;
    }
}