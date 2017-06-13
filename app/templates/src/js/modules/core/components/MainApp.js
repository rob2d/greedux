import React, {
    PureComponent,
    PropTypes
} from 'react'

import {
    withStyles,
    createStyleSheet
} from 'material-ui/styles';
import { muiRequired } from 'material-ui/utils/customPropTypes'
import store         from '../../../store'
import { connect }   from 'react-redux'

import { refreshWindowDimensions } from './../actions'


const styleSheet = createStyleSheet('MainApp',
{
    appWrapper :
    {
        minHeight       : '100%',
        margin          : '0px auto',
        display         : 'flex',
        flexDirection   : 'row'
    },
    mainWrapper :
    {
        minHeight       : '100%',
        margin          : '0px auto',
        display         : 'flex',
        flexDirection   : 'column',
        flex            : '1 0 auto'
    },
    contentWrapper :
    {
        maxWidth : '720px',
        minWidth : '360px',
        margin   : '0 auto'
    },
    mainContainer :
    {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        flex           : '1 0 auto',
        flexDirection  : 'column'
    },
    mainContent :
    {
        flexDirection : 'column',
        display       : 'flex',
        flex          : '1 0 auto'
    },
    appFooter :
    {
        height    : '40px',
        textAlign : 'center'
    }
});


class MainApp extends PureComponent
{
    static contextTypes =
    {
        store        : PropTypes.object.isRequired,
        styleManager : muiRequired
    };
    onResizeWindow = ()=>
    {
        this.props.onResizeWindow();
    };
    componentDidMount()
    {
        window.addEventListener('resize', this.onResizeWindow);
    }
    componentWillUnmount()
    {
        window.removeEventListener('resize', this.onResizeWindow);
    }
    render ()
    {
        const { classes } = this.props;

        return (
                <div className={classes.appWrapper}>
                    <div className={classes.mainWrapper}>
                        <div className={classes.mainContent}>
                            <div className={classes.mainContainer}>
                                Hello new React/Redux App!
                            </div>
                        </div>
                        <div className={classes.appFooter}>
                            Footer content goes here
                        </div>
                    </div>
                </div>
        );
    }
}

const VisibleMainApp = connect(
    (state, ownProps)=>
    ({
        language       : state.core.language,
        viewportWidth  : state.core.viewportWidth,
        viewportHeight : state.core.viewportHeight
    }),
    (dispatch)=>
    ({
        onResizeWindow : ()=>
        {
            dispatch(refreshWindowDimensions())
        }
    })
)(withStyles(styleSheet)(MainApp));

export default VisibleMainApp
