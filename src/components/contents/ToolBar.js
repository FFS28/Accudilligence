// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import LinearProgress from '@material-ui/core/LinearProgress';
import reviewStatusLogo from '../../assets/images/review_status_250x250.png';
import { loadQuestionPanel } from '../../store/modules/questionRedux';
import { autoShowTooltip } from 'aws-amplify';
import ADCache from '../../store/ADCache';
import { SelectTopic } from '../../store/modules/projectRedux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
    appBar: {
        background: '#353535',
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - 400px)`,
            marginLeft: 400,
        },
        position: 'fixed',
        padding: 4,
        top: 40
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontSize: 28,
        marginLeft: theme.spacing(2)
    },
    topicIconBlack: {
        fontSize: 42,
        color: '#353535'
    },
    topicIconGrey: {
        fontSize: 42,
        color: '#afbfaf'
    },
    topicIconWhite: {
        fontSize: 37,
        color: '#fff'
    },
    reviewStatusLogo: {
      marginRight: 20,
      width: 42,
      height: 42,
    },
    PageTitleFlexContainer: {
      width: '100%',
      display: 'flex',
      padding: 0,
      margin: 0,
      listStyle: 'none',
      justifyContent: 'space-between',
    },
    ProgressBarContainer: {
        width: 200,
        height: 8,
        marginTop: 20,
        marginLeft: 'auto',
        borderRadius: 3,
        colorPrimary: {
            backgroundColor: 200,
        },
        bar: {
        borderRadius: 3,
        backgroundColor: '#355c35',
        },
    }
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 9,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.background.paper,
    },
    bar: {
        backgroundColor: '#FF8c00',
        borderRadius: 5
    },
    dashed: {
      animation: 'none',
      transition: 'none',
      display: 'none',
      marginTop: 2
    },
    barColorPrimary: {
        backgroundColor: '#355c35ee'
    }
  }))(LinearProgress);

export default function ButtonAppBar(props) {
    const { pbv, pbb } = props;
    const classes = useStyles();

    // Project Redux
    const selectedProject  = useSelector(state => state.projectRedux.selectedProject);
    const selectedArea   = useSelector(state => state.projectRedux.selectedArea);
    const selectedTopic  = useSelector(state => state.projectRedux.selectedTopic);

    const [toolBarTopic, setToolBarTopic] = useState(null);

    useEffect(() => {
        if (selectedTopic) {
            const key = selectedProject + "." + selectedArea;
            if (ADCache.TopicList[key] != null) {
                for (var i = 0; i < ADCache.TopicList[key].length; ++i) {
                    if (ADCache.TopicList[key][i].TID === selectedTopic) {
                        //console.log("Find toolbar label: "+ADCache.TopicList[key][i].TIDLStr)
                        setToolBarTopic(ADCache.TopicList[key][i]);
                        break;
                    }
                }
            }
        }
      }, [selectedTopic, toolBarTopic]);

    return (
        <div className={classes.root}>
        <AppBar className={classes.appBar}>
            {(toolBarTopic) ?
                <Toolbar>
                    {toolBarTopic.AnsweredCount === toolBarTopic.TotalCount ? 
                        <RadioButtonUncheckedIcon className={classes.topicIconWhite}></RadioButtonUncheckedIcon> :

                        toolBarTopic.AnsweredCount === 0 ?
                        <FiberManualRecordIcon className={classes.topicIconWhite}></FiberManualRecordIcon> : 
                    
                        toolBarTopic.AnsweredCount > 0 ?
                        <FiberManualRecordIcon className={classes.topicIconGrey} /> : null }
                    
                    {/* {topic.ReviewStatus !== "RC" ?
                        <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img> : null} */}

                    <div className={classes.PageTitleFlexContainer}>
                        <Typography className={classes.title}>
                            {toolBarTopic.TIDLStr}
                        </Typography>
                        &nbsp;
                        <div className={classes.ProgressBarContainer}><BorderLinearProgress color="primary" variant="buffer" value={pbv} valueBuffer={pbb} /></div>
                    </div>
                </Toolbar> 
                : <Toolbar></Toolbar>
            }
        </AppBar>
        </div>
    );
}
