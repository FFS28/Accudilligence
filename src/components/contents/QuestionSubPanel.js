import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';

import './QuestionSubPanel.css';
import iconGreyCircle from '../../assets/images/icon_grey_circle_outline.png';
import iconWhiteCircle from '../../assets/images/white_circle_outline_black.png';
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

import { SubmitQuestionResponse } from '../../store/modules/questionRedux';

const useStyles = makeStyles((theme) => ({
    // necessary for content to be below app bar
    root: {
        position: 'relative',
        maxWidth:700
    },
    marginBottom: {
        marginBottom: 15
    },
    noPanel: {
        marginTop: 10,
        padding: '5px 5px 5px 10px',
        margin: '10px 0 0 10px',
        color: '#353535'
    },
    questionPanel: {
      marginTop: 10,
      border: '1px solid grey',
      padding: '5px 5px 5px 10px',
      margin: '10px 0px 0px 80px',
      color: '#5c5c5c',
      maxWidth:700
    },
    whitePanel: {
        background: '#fff',
        maxWidth:700
    }, 
    greyPanel: {
        background: '#d6d6d6',
        maxWidth:700
    },
    rootGrid: {
        position: 'relative'
    },
    noText: {
        fontFamily: '"Open Sans", "Roboto Condensed", "HelveticaNeue-Light", Lato, HelveticaNeue',
        fontSize: '0.85em',
        fontWeight: 200,
        color: '#111',
        marginBottom: theme.spacing(2),
        maxWidth:700,
        textAlign:'justify'
    },
    qText: {
        fontFamily: '"Open Sans", HelveticaNeue',
        fontSize: '0.9em',
        color: '#5c5c5c',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        maxWidth:700,
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
    },
    // circle line css
    circleLineIcon: {
        float: 'left'
    },
    verticalLineTop: {
        width: 2,
        height: '60%',
        background: '#353535',
        position: 'absolute',
        left: 37,
        top: -10,
        zIndex: 1
    },
    verticalLineBottom: {
        width: 2,
        height: '55%',
        background: '#353535',
        position: 'absolute',
        left: 37,
        top: '57%',
        zIndex: 1
    },
    subQuestionCircleWhite: {
        width: 40,
        color: '#fff',
        position: 'absolute',
        top: '42%',
        left: '1%',
        marginLeft: 3,
        zIndex: 10
    },
    subQuestionCircleGrey: {
        width: 34,
        color: '#3c3636',
        position: 'absolute',
        top: '40%',
        left: 21,
        zIndex: 10
    },
    emptySubQuestionCircleWhite: {
        width: 38,
        color: '#fff',
        position: 'absolute',
        top: '20%',
        left: '1%', 
        marginLeft: 6,
        zIndex: 10
    },
    respDateTime: {
        color: '#7d7d7d',
        position: 'absolute',
        bottom: -5,
        right: 5,
        fontSize:'0.2em',
        fontStyle: 'italic'
      }
}));

function QuestionPanel(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const { subQuestion, nextQuestion, sQkey, pQCount, lastOf, jwt, frt, fra } = props;

    const rootPanelClass = classNames(classes.root, classes.marginBottom);
    const whitePanelClass = classNames(classes.questionPanel, classes.whitePanel);
    const greyPanelClass = classNames(classes.questionPanel, classes.greyPanel);
    const noPanelClass = classNames(classes.noPanel);

    const [resComponent, setResComponent] = useState(''); // component type come from questionList respType
    const [declineClassState, setDeclineClassState] = useState(false);
    const [submitted, setSubmitted] = useState(-1);
    const [whiteCircleIconId, setWhiteCirlceIconId] = useState('');

    useEffect(() => {
        setSubmitted(subQuestion.submitted);
        setDeclineClassState(subQuestion.HasOptOut === 0 ? false : true);

        const respType = subQuestion.RespType;
        // console.log(respType);

        if (respType === 'IN' || respType === 'EM' || respType === 'RN' || respType === 'UR' || respType === 'MO' || respType === 'DY' || respType === 'WK') {
            setResComponent('SimpleInputBox');
        } else if (respType === 'MP') {
            setResComponent('MultipleCheckBox');
        } else if (respType === 'PR' || respType === 'RG') {
            setResComponent('LowToHighSlider');
        } else if (respType === 'TX') {
            setResComponent('ExpandableTextArea');
        } else if (respType === 'SS') {
            setResComponent('DropDownList');
        } else if (respType === 'SP') {
            setResComponent('RadioButtonGroup');
        } else if (respType === 'DA' || respType === 'DT' || respType === 'TM') {
            setResComponent('DateTimeCalender');
        } else if (respType === 'UR' || respType === 'FL' || respType === 'IM') {
            setResComponent('FileUploadControl');
        } else if (respType === 'BL' || respType === 'YN') {
            setResComponent('SwitchButton');
        } else if (respType === 'UN') {
            setResComponent('TextFieldAndDropDownList');
        } else if (respType === 'NO') {
            setResComponent('');
        }
    }, [subQuestion.RespType, subQuestion.submitted]);
    
    const handleDecline = () => {
        setDeclineClassState(!declineClassState);
    }

    // ----- questionRedux ------ //
    const submitResponse = useSelector(state => state.questionRedux.submitted);
    const submittedQuestionKey = useSelector(state => state.questionRedux.pQuestionkey);

    useEffect(() => {
        if (submitResponse === 200 && sQkey === submittedQuestionKey) {
            setSubmitted(1);
            dispatch(SubmitQuestionResponse(0, -1));
        }
    }, [dispatch, sQkey, submitResponse, submittedQuestionKey]);

    return (
        <div className={ pQCount - 1 === sQkey ? rootPanelClass : classes.root}>
            {sQkey !== 0 ?
                <div className={classes.circleLineIcon}>
                    <span className={classes.verticalLineTop}></span>
                    {submitted === 0 ?
                        <img className={classes.subQuestionCircleWhite} 
                            id={!declineClassState ? subQuestion.RespType !== 'NO' ? "subQuestionCircleWhite" : '' : ''}
                            src={iconWhiteCircle} alt="iconWhiteCircle"></img> :
                        <img className={classes.subQuestionCircleGrey} id="subQuestionCircleGrey" src={iconGreyCircle} alt="iconGreyCircle"></img>
                    }
                    {nextQuestion ? 
                        nextQuestion.isPrimary !== 1 ?
                            <span className={classes.verticalLineBottom}></span> : null
                        : null
                    }
                </div> : null
            }
            <div className={subQuestion.RespType === 'NO' ? noPanelClass : declineClassState ? greyPanelClass : submitted === 1 ? greyPanelClass : whitePanelClass}>
                <Grid container className={classes.rootGrid}>
                    <Grid item xs={10}>
                        <Typography className={subQuestion.RespType === 'NO' ? classes.noText : classes.qText}>
                            {subQuestion.qText}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        {subQuestion.RespType !== 'NO' ?
                            submitted === 0 ?
                                subQuestion.isRequired === 0 ?
                                    <div className={classes.declineArea}>
                                        <IconButton aria-label="close" className={classes.declineButton} onClick={handleDecline}>
                                            <CloseIcon className={classes.closeIcon}/>
                                        </IconButton>
                                        <Typography className={classes.declineLabel}>
                                            Decline to<br /> respond
                                        </Typography>
                                    </div> : null
                                : null
                            : null
                        }
                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.qContent}>
                            { resComponent === 'SimpleInputBox'           ? <SimpleInputBox           pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></SimpleInputBox> : null}
                            { resComponent === 'MultipleCheckBox'         ? <MultipleCheckBox         pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></MultipleCheckBox> : null }
                            { resComponent === 'LowToHighSlider'          ? <LowToHighSlider          pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></LowToHighSlider> : null }
                            { resComponent === 'ExpandableTextArea'       ? <ExpandableTextArea       pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></ExpandableTextArea> : null }
                            { resComponent === 'DropDownList'             ? <DropDownList             pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></DropDownList> : null }
                            { resComponent === 'RadioButtonGroup'         ? <RadioButtonGroup         pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></RadioButtonGroup> : null }
                            { resComponent === 'DateTimeCalender'         ? <DateTimeCalender         pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></DateTimeCalender> : null }
                            { resComponent === 'FileUploadControl'        ? <FileUploadControl        pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></FileUploadControl> : null }
                            { resComponent === 'SwitchButton'             ? <SwitchButton             pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></SwitchButton> : null }
                            { resComponent === 'TextFieldAndDropDownList' ? <TextFieldAndDropDownList pQuestion={subQuestion} declinedPanel={declineClassState} pQkey={sQkey} jwt={jwt} frt={frt} fra={fra} ></TextFieldAndDropDownList> : null }
                            { resComponent === '' ? <></> : null }
                        </div>
                    </Grid>
                    {subQuestion.RespType === 'CO' 
                        ?
                            <Grid item xs={2}>
                                {submitted !== 0 
                                    ?
                                        <div className={classes.respDateTime}>{subQuestion.respInitials + ' ' + subQuestion.respDT}</div>
                                    : null
                                }
                            </Grid> 
                        : null
                    }
                </Grid>
            </div>
        </div>
    );
}

export default QuestionPanel;