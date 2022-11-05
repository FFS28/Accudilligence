import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
//import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
//import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme} from '@material-ui/core/styles';

import ProjectListContainer from '../../containers/ProjectListContainer';

const SidebarWidth = 400;

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100%}px)`,
            marginLeft: SidebarWidth,
        zIndex: theme.zIndex.drawer + 1,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: SidebarWidth,
        flexShrink: 0,
      },
      position: 'static'
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: SidebarWidth,
      marginTop: '40px',
      fontFamily: 'HelveticaNeue-CondensedBold,Helvetica Neue'
    },
}));

function Sidebar(props) {
    const { window, jwt, setPBV, setPBB, rt, ra, frt, fra } = props;

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <ProjectListContainer jwt={jwt} setPBV={setPBV} setPBB={setPBB} rt={rt} ra={ra} frt={frt} fra={fra} />
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div>
            <AppBar position="fixed" className={classes.appBar}>
            </AppBar>            
            <nav className={classes.drawer} aria-label="projects">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                    >
                    {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}

Sidebar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Sidebar;