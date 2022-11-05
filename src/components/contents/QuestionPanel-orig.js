import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import QuestionPrimaryPanel from './QuestionPrimaryPanel';
import QuestionSubPanel from './QuestionSubPanel';
import { getQuestions, loadQuestionPanel, submittedFollowUpQuestions } from '../../store/modules/questionRedux';


function QuestionPanel() {
    const dispatch  = useDispatch();

    const [pQuestionList, setPQuestionList] = useState([]);
    const [loadingQuestionPanel, setLoadingQuestionPanel] = useState(false);

    // ----------------  question redux  ------------------ //
    const resLoadQuestionPanel = useSelector(state => state.questionRedux.loadQuestionPanel);
    const resQuestionList = useSelector(state => state.questionRedux.questionList);

    useEffect(() => {
        if (resLoadQuestionPanel !== null) {
            setLoadingQuestionPanel(resLoadQuestionPanel);
            dispatch(loadQuestionPanel(null));
        }
        if (resQuestionList.length !== 0) {  
            setPQuestionList(resQuestionList);
            dispatch(getQuestions([]));
        }
    }, [dispatch, resLoadQuestionPanel, resQuestionList]);

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

            console.log(pQuestionList);
            dispatch(submittedFollowUpQuestions([], -1));
        }
    }, [dispatch, pQuestionList, resFollowUpQuestions, resSubmittedKey]);

    return (
        <div> {console.log("loading qp")}
            {!loadingQuestionPanel ?
                pQuestionList.map((pQuestion, key) => {
                    return (
                        <div key={key}>
                        {pQuestion.isPrimary === 1 ?
                            <QuestionPrimaryPanel pQuestion={pQuestion} pQkey={key} pQCount={pQuestionList.length}></QuestionPrimaryPanel>
                            : <QuestionSubPanel subQuestion={pQuestion} sQkey={key} nextQuestion={pQuestionList[key + 1]} pQCount={pQuestionList.length}></QuestionSubPanel>
                        }
                        </div>
                        )
                    }) : null }
        </div>
    );
}

export default QuestionPanel;