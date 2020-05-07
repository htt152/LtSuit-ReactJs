import React, {useState} from 'react';
import {Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography} from '@material-ui/core';
import {useSelector} from 'react-redux';
import logoutUser from '../../axios/user/userLogout'
import history from "@history"

function UserMenu(props)
{
    const user = useSelector(({auth}) => auth.user);

    const [userMenu, setUserMenu] = useState(null);

    const userMenuClick = event => {
        setUserMenu(event.currentTarget);
    };

    const userMenuClose = () => {
        localStorage.setItem('_id',localStorage.getItem('id'))
        setUserMenu(null);
        history.push('/profile')
    };

    const logout = () => {
        logoutUser();
    }
 
    return (
        <React.Fragment>

            <Button className="h-64" onClick={userMenuClick}>
                {user.data.photoURL ?
                    (
                        <Avatar className="" alt="user photo" src={user.data.photoURL}/>
                    )
                    :
                    (
                        <Avatar className="">
                            {user.data.displayName[0]}
                        </Avatar>
                    )
                }

                <div className="hidden md:flex flex-col ml-12 items-start">
                    <Typography component="span" className="normal-case font-600 flex">
                        {localStorage.getItem('username')}
                    </Typography>
                    <Typography className="text-11 capitalize" color="textSecondary">
                        {user.role.toString()}
                    </Typography>
                </div>

                <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
            </Button>

            <Popover
                open={Boolean(userMenu)}
                anchorEl={userMenu}
                onClose={userMenuClose}
                anchorOrigin={{
                    vertical  : 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical  : 'top',
                    horizontal: 'center'
                }}
                classes={{
                    paper: "py-8"
                }}
            >
                    <React.Fragment>
                        <MenuItem onClick={userMenuClose}>
                            <ListItemIcon className="min-w-40">
                                <Icon>account_circle</Icon>
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="My Profile"/>
                        </MenuItem>
                        <MenuItem onClick={logout} >
                            <ListItemIcon className="min-w-40">
                                <Icon>exit_to_app</Icon>
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Logout"/>
                        </MenuItem>
                    </React.Fragment>
            </Popover>
        </React.Fragment>
    );
}

export default UserMenu;
