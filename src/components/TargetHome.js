// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from './sidebar/Sidebar';
import Content from './contents/Content';
import { SubmitFollowUpQuestions } from '../store/modules/questionRedux';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex'
    },
}));

function TargetHome(props) {
    const classes = useStyles();
    const { usrEmail, TargetID, targetStatus, jwt } = props;

    // Question Redux
    const followUpQuestions    = useSelector(state => state.questionRedux.followUpQuestions);

    const [progressBarValue, setProgressBarValue] = useState(1);
    const [progressBarBuffer, setProgressBarBuffer] = useState(1);
    const [requestResetTopics, SetRequestResetTopics] = useState(false);
    const [requestResetAreas, SetRequestResetAreas] = useState(false);

    const fnSetPBV = (val) => { setProgressBarValue(val); }
    const fnSetPBB = (val) => { setProgressBarBuffer(val); }
    const fnResetTopics = (val) => { SetRequestResetTopics(val); }
    const fnResetAreas = (val) => { SetRequestResetAreas(val); }
    
    useEffect(() => {
        // console.log("userEffect(TargetHome)...");
        if (followUpQuestions) {
          var q = followUpQuestions[0];
          if (q) {
            var answered = q.AnsweredCount;
            var total    = q.TotalCount;
            var underReview = q.UnderReviewCount;
            setProgressBarValue(Math.floor(answered*100/total));
            setProgressBarBuffer(Math.floor((answered+underReview)*100/total));
          }
        }
    }, [followUpQuestions]);
    

    return (
        <div className={classes.root}>
            <Sidebar usrEmail={usrEmail} TargetID={TargetID} TargetStatus={targetStatus} jwt={jwt} setPBV={fnSetPBV} setPBB={fnSetPBB} rt={requestResetTopics} ra={requestResetAreas} frt={fnResetTopics} fra={fnResetAreas} />
            <Content jwt={props.jwt} pbv={progressBarValue} pbb = {progressBarBuffer} frt={fnResetTopics} fra={fnResetAreas} ></Content>
        </div>
    );
}

TargetHome.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default TargetHome;