import React, {Component} from 'react';
import {FuseUtils} from '@fuse';
import {matchRoutes} from 'react-router-config';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import AppContext from 'app/AppContext';
import publicList from '../../../app/auth/publicList'
import history from '@history'
import findUser from '../../../app/axios/user/userFind'

class FuseAuthorization extends Component {

    constructor(props, context)
    {
        super(props);
        const {routes} = context;
        this.state = {
            accessGranted: true,
            routes
        };
    }

    exitingUser = async () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username')

        if (!token || !email || !username){
            return false
        }
        
        const response = await findUser({
            token,
            email,
            username
        })
        if (response.status !== 200){
            return false
        }
        return true
    }

    componentDidMount = async () =>
    {        
        let response = await this.exitingUser();
        if ( !response )
        {
            this.redirectRoute();
        }
        else{
            this.redirectRouteFromLogin();
        }
    }

    static getDerivedStateFromProps(props, state)
    {
        const {location, userRole} = props;
        const {pathname} = location;

        const matched = matchRoutes(state.routes, pathname)[0];
        return {
            accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true
        }
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        return nextState.accessGranted !== this.state.accessGranted;
    }

    redirectRoute(){
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('username')
        if (!publicList.includes(this.props.location.pathname)){    
            history.push('/login')
        }
    }

    redirectRouteFromLogin(){
        if (publicList.includes(this.props.location.pathname)){
            history.push('/example')
        }
    }

    // redirectRoute()
    // {
    //     const {location, userRole, history} = this.props;
    //     const {pathname, state} = location;
    //     const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';

    //     /*
    //     User is guest
    //     Redirect to Login Page
    //     */
    //     if ( !userRole || userRole.length === 0 )
    //     {
    //         history.push({
    //             pathname: '/login',
    //             state   : {redirectUrl: pathname}
    //         });
    //     }
    //     /*
    //     User is member
    //     User must be on unAuthorized page or just logged in
    //     Redirect to dashboard or redirectUrl
    //     */
    //     else
    //     {
    //         history.push({
    //             pathname: redirectUrl
    //         });
    //     }
    // }

    render()
    {
        return this.state.accessGranted ? <React.Fragment>{this.props.children}</React.Fragment> : null;
    }
}

function mapStateToProps({auth})
{
    return {
        userRole: auth.user.role
    }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
