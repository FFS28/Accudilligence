// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles} from '@material-ui/core/styles';
//import IconButton from '@material-ui/core/IconButton';
//import CloseIcon from '@material-ui/icons/Close';

import ToolBar from './ToolBar';
import QuestionPanel from './QuestionPanel';

const useStyles = makeStyles((theme) => ({
    // necessary for content to be below app bar
    root: {
      backgroundColor: '#f8fff8',
      width: '100%',
      height: 'auto'
    },
    toolbar: theme.mixins.toolbar,
    content: {
      backgroundColor: '#f8fff8',
      flexGrow: 1,
      paddingTop: theme.spacing(10),
      width: '90%',
      height: 'auto',
      margin: '0 auto',
    },
}));

function Content(props) {

    const { jwt, pbv, pbb, frt, fra } = props;

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <ToolBar pbv={pbv} pbb={pbb} />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <QuestionPanel jwt={jwt} frt={frt} fra={fra} />
            </main>
        </div>
    );
}

Content.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Content;