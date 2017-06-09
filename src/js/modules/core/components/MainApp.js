import React, {
    PureComponent,
    PropTypes
} from 'react'

import {
    withStyles,
    createStyleSheet
} from 'material-ui/styles';

import {Tabs, Tab }    from 'material-ui/Tabs'
import { muiRequired } from 'material-ui/utils/customPropTypes'

import store         from '../../../store'
import { connect }   from 'react-redux'

import { refreshWindowDimensions } from './../actions'


const styleSheet = createStyleSheet('MainApp',
{
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
                <div className="appWrapper">
                    <div className="mainWrapper">
                        <div className="mainContent">
                            <div className={classes.mainContainer}>
                                Main Content here!
                            </div>
                        </div>
                        <div className="appFooter">
                            &copy;&nbsp;2017&nbsp;
                            <span className={classes.copyrightCompany}>
                                Whateversoft
                            </span>
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
