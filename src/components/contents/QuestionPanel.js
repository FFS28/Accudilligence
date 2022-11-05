// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuestionPrimaryPanel from './QuestionPrimaryPanel';
import QuestionSubPanel from './QuestionSubPanel';
import { GetQuestions, SubmitFollowUpQuestions } from '../../store/modules/questionRedux';
//import classes from '*.module.css';
import "./QuestionPanel.css";
import ADCache from '../../store/ADCache';
import LinearProgress from '@material-ui/core/LinearProgress';

function QuestionPanel(props) {
    const dispatch  = useDispatch();
    const { jwt, frt, fra } = props;

    const [pQuestionList, setPQuestionList] = useState([]);

    // ----------------  question redux  ------------------ //
    const selectedTopic = useSelector(state => state.projectRedux.selectedTopic);
    
    // ----------------  question redux  ------------------ //
    const loadingQuestionPanel = useSelector(state => state.questionRedux.loadingQuestionPanel);
    const resQuestionList = useSelector(state => state.questionRedux.questionList);

    useEffect(() => {
        if (resQuestionList.length !== 0) {  
            setPQuestionList(resQuestionList);
            dispatch(GetQuestions([]));
        }
    }, [dispatch, loadingQuestionPanel, resQuestionList]);

    // --------------- submitted Question list ---------------- //
    const resFollowUpQuestions = useSelector(state => state.questionRedux.followUpQuestions);
    const resSubmittedKey = useSelector(state => state.questionRedux.submittedQuestionKey);

    useEffect(() => {
        if (resFollowUpQuestions.length !== 0 && resSubmittedKey !== -1) {
            // console.log(resFollowUpQuestions);
            
            // const newData = array.slice(0); // copy
            for (let i = 0; i < resFollowUpQuestions.length; i ++) {
                pQuestionList.splice(resSubmittedKey + i + 1, 0, resFollowUpQuestions[i]);    
            }
            // pQuestionList.splice(resSubmittedKey, 0, resFollowUpQuestions[0]);

            // console.log(pQuestionList);
            dispatch(SubmitFollowUpQuestions([], -1));
        }
    }, [dispatch, pQuestionList, resFollowUpQuestions, resSubmittedKey]);

    //console.log("Rendering QuestionPanel");
    //console.log(JSON.stringify(pQuestionList));
    if (!loadingQuestionPanel) {
        return (
            <div className="QuestionPanelContainer" style={{ backgroundColor: '#f8fff8'}}>
                { pQuestionList.map((pQuestion, key) => {
                    return (
                        <div key={key}> 
                        {pQuestion.isPrimary === 1 ?
                            <QuestionPrimaryPanel pQuestion={pQuestion} pQkey={key} pQCount={pQuestionList.length} lastOf={(key === pQuestionList.length-1) ? true : (pQuestion.RespType !== pQuestionList[key+1].RespType)} jwt={jwt}  frt={frt} fra={fra}/>
                            : <QuestionSubPanel subQuestion={pQuestion} sQkey={key} nextQuestion={pQuestionList[key + 1]} pQCount={pQuestionList.length}  lastOf={(key === pQuestionList.length-1) ? true : (pQuestion.respType !== pQuestionList[key+1].respType)} jwt={jwt}  frt={frt} fra={fra}/>
                        }
                        </div>
                    )
                })}
                <div className="qBottomSpacer">
                    &nbsp;
                </div>
            </div>
        );
    } else {
        return (
            <div className="QuestionPanelContainer" style={{ backgroundColor: '#f8fff8'}}>
                <div className="progressBarContainer">
                    {ADCache && ADCache.selectedItemDPID && ADCache.selectedItemDPID[selectedTopic] ?
                        <LinearProgress />
                    : null }
                </div>
            </div>

        );
    }
}

export default QuestionPanel;