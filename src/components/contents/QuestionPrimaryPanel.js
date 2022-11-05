import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';

import SimpleInputBox from './resComponents/SimpleInputBox';
import MultipleCheckBox from './resComponents/MultipleCheckBox';
import LowToHighSlider from './resComponents/LowToHighSlider';
import ExpandableTextArea from './resComponents/ExpandableTextArea';
import DropDownList from './resComponents/DropDownList';
import RadioButtonGroup from './resComponents/RadioButtonGroup';
import DateTimeCalender from './resComponents/DateTimeCalender';
import FileUploadControl from './resComponents/FileUploadControl';
import SwitchButton from './resComponents/SwitchButton';
import TextFieldAndDropDownList from './resComponents/TextFieldAndDropDownList';
import EmailInvite from './resComponents/EmailInvite';
import { SubmitQuestionResponse } from '../../store/modules/questionRedux';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%'
    },
    topPad: {
        marginTop: 15
    },
    marginBottom: {
        marginBottom: 30
    },
    noPanel: {
        marginTop: 5,
        padding: '5px 5px 5px 2px',
        color: '#353535',
        maxWidth:800
    },
    noPanelNoBottom: {
        marginTop: 5,
        padding: '3px 5px 3px 2px',
        color: '#353535',
        maxWidth:800
    },
    questionPanel: {
      marginTop: 5,
      border: '1px solid grey',
      padding: '5px 5px 5px 12px',
      color: '#5c5c5c',
      width: '100%',
      zIndex: 20
    },
    whitePanel: {
        background: '#fff',
        maxWidth:800
    }, 
    greyPanel: {
        background: '#d6d6d6',
        maxWidth:800
    },
    rootGrid: {
        position: 'relative',
        width: '100%'
    },
    noText: {
        fontFamily: '"Open Sans", "Roboto Condensed", "HelveticaNeue-Light", Lato, HelveticaNeue',
        fontSize: '0.9em',
        fontWeight: 300,
        color: '#111',
        maxWidth:800,
        textAlign:'justify'
    },
    qText: {
        fontFamily: '"Open Sans", HelveticaNeue',
        fontSize: '0.9em',
        color: '#5c5c5c',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        maxWidth:800,
        fontStyle: 'italic'
    },
    qContent: {
        // margin: '10px 0 0 20px'
    },
    declineArea: {
        position: 'absolute',
        right: 0,
    },
    declineButton: {
        color: '#797979',
        fontSize: '12pt',
        float: 'right',
        padding: 0,
        marginRight: 1
    },
    closeIcon: {
        border: '1px solid #797979 !important'
    },
    declineLabel: {
        float: 'right',
        color: '#868282',
        fontSize: 12,
        fontStyle: 'italic',
        lineHeight: 1,
        marginRight: 5,
    }
}));


function QuestionPanel(props) {
    const classes  = useStyles();
    const dispatch = useDispatch();

    const { pQuestion, pQCount, pQkey, lastOf, jwt, frt, fra } = props;

    const rootPanelClass = classNames(classes.root, classes.marginBottom);
    const whitePanelClass = classNames(classes.questionPanel, classes.whitePanel);
    const greyPanelClass = classNames(classes.questionPanel, classes.greyPanel);
    const noPanelClass = classNames(classes.noPanel);
    const noPanelNoBottomClass = classNames(classes.noPanelNoBottom);

    const [resComponent, setResComponent] = useState(''); // component type come from questionList respType
    const [declineState, setDeclineState] = useState(false);
    const [submitted, setSubmitted] = useState(-1);

    useEffect(() => {
        setSubmitted(pQuestion.submitted);
        setDeclineState(pQuestion.HasOptOut === 0 ? false : true);

        const respType = pQuestion.RespType;

        if (respType === 'NO') {
            setResComponent('');
        } else if (respType === 'MP') {
            setResComponent('MultipleCheckBox');
        } else if (respType === 'SP') {
            setResComponent('RadioButtonGroup');
        } else if (respType === 'SS') {
            setResComponent('DropDownList');
        } else if (respType === 'BL' || respType === 'YN') {
            setResComponent('SwitchButton');
        } else if (respType === 'EM') {
            setResComponent('EmailInvite');
        } else if (respType === 'IN' || respType === 'RN' || respType === 'UR' || respType === 'MO' || respType === 'DY' || respType === 'WK') {
            setResComponent('SimpleInputBox');
        } else if (respType === 'PR' || respType === 'RG') {
            setResComponent('LowToHighSlider');
        } else if (respType === 'TX' || respType === 'CO')  {
            setResComponent('ExpandableTextArea');
        } else if (respType === 'DA' || respType === 'DT' || respType === 'TM') {
            setResComponent('DateTimeCalender');
        } else if (respType === 'UR' || respType === 'FL' || respType === 'IM') {
            setResComponent('FileUploadControl');
        } else if (respType === 'UN') {
            setResComponent('TextFieldAndDropDownList');
        }
    }, [pQuestion.RespType, pQuestion.submitted]);

    const handleDecline = () => {
        setDeclineState(!declineState);
        console.log("handled decline on question primary")
    }

    // ----- questionRedux ------ //
    const submitResponse = useSelector(state => state.questionRedux.submitted);
    const submittedQuestionKey = useSelector(state => state.questionRedux.pQuestionkey);

    useEffect(() => {
        if (submitResponse === 200 && pQkey === submittedQuestionKey) {
            setSubmitted(1);
            dispatch(SubmitQuestionResponse(0, -1));
        }
    }, [dispatch, pQkey, submitResponse, submitted, submittedQuestionKey]);

    return (
        <div className={pQCount - 1 === pQkey ? (pQuestion.RespType === 'NO'? classes.topPad : rootPanelClass) : classes.root}>
            <div className={pQuestion.RespType === 'NO' ? (lastOf ? noPanelClass : noPanelNoBottomClass) : declineState ? greyPanelClass : submitted === 1 ? greyPanelClass : whitePanelClass }>
                <Grid container className={classes.rootGrid}>
                    <Grid item xs={(pQuestion.RespType === 'NO' || pQuestion.isRequired === 1) ? 12 : 10}>
                        <Typography className={pQuestion.RespType === 'NO' ? classes.noText : classes.qText}>
                            {submitted === 1 && pQuestion.RespType === 'CO' ? "Your prior posting:" : pQuestion.qText}
                        </Typography>
                    </Grid>
                    {pQuestion.RespType !== 'NO'
                      ?
                        <div>
                            <Grid item xs={2}>
                                {submitted === 0
                                ?
                                    pQuestion.isRequired === 0 && pQuestion.RespType !== 'CO'
                                    ?
                                        <div className={classes.declineArea}>
                                            <IconButton aria-label="close" className={classes.declineButton} onClick={handleDecline}>
                                                <CloseIcon className={classes.closeIcon}/>
                                            </IconButton>
                                            <Typography className={classes.declineLabel}>
                                                Decline to<br /> respond
                                            </Typography>
                                        </div> : null
                                : null }
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.qContent, classes.marginBottom}>
                                    { resComponent === 'MultipleCheckBox'         ? <MultipleCheckBox         pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></MultipleCheckBox> : null }
                                    { resComponent === 'DropDownList'             ? <DropDownList             pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></DropDownList> : null }
                                    { resComponent === 'RadioButtonGroup'         ? <RadioButtonGroup         pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></RadioButtonGroup> : null }
                                    { resComponent === 'EmailInvite'              ? <EmailInvite              pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></EmailInvite> : null }
                                    { resComponent === 'SwitchButton'             ? <SwitchButton             pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></SwitchButton> : null }
                                    { resComponent === 'SimpleInputBox'           ? <SimpleInputBox           pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></SimpleInputBox> : null}
                                    { resComponent === 'LowToHighSlider'          ? <LowToHighSlider          pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></LowToHighSlider> : null }
                                    { resComponent === 'ExpandableTextArea'       ? <ExpandableTextArea       pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></ExpandableTextArea> : null }
                                    { resComponent === 'DateTimeCalender'         ? <DateTimeCalender         pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></DateTimeCalender> : null }
                                    { resComponent === 'FileUploadControl'        ? <FileUploadControl        pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></FileUploadControl> : null }
                                    { resComponent === 'TextFieldAndDropDownList' ? <TextFieldAndDropDownList pQuestion={pQuestion} declinedPanel={declineState} pQkey={pQkey} jwt={jwt} frt={frt} fra={fra}></TextFieldAndDropDownList> : null }
                                </div>
                            </Grid>
                        </div>
                      : null }
                </Grid>
            </div>
        </div>
    );
}

export default QuestionPanel;