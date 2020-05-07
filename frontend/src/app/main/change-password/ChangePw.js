import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as Actions from 'app/store/actions';
import { useDispatch } from "react-redux";
import history from "@history";
import changePassword from '../../axios/user/changePassword'
import findUserById from '../../axios/user/findUserById'

const useStyles = makeStyles(theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color: theme.palette.primary.contrastText
    }
}));

const ChangePw = () => {
    const dispatch = useDispatch()
    const classes = useStyles()

    const [name, setName] = useState('')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [touchedPassword, setTouchedPassword] = useState(false)
    const [touchedConfirmPassword, setTouchedConfirmPassword] = useState(false)
    const [changePWForm, setChangePWForm] = useState(false)

    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const handleChangePassword = e => {
        e.preventDefault()
        setPassword(e.target.value)
        setTouchedPassword(true)
    }

    const handleChangeConfirmPassword = e => {
        e.preventDefault()
        setConfirmPassword(e.target.value)
        setTouchedConfirmPassword(true)
    }

    useEffect(() => {
        const GetURLParameter = sParam => {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1];
                }
            }
        }

        const id = GetURLParameter('id')
        const token = GetURLParameter('token')

        findUserById({ id })
            .then(res => {
                if (!res) {
                    dispatch(
                        Actions.showMessage({
                            message: 'Internal Server Error!',
                            autoHideDuration: 5000,
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "center"
                            },
                            variant: "error"
                        })
                    )
                    setTimeout(() => {
                        history.push('/500InternalError')
                    }, 5000)
                } else if (res.status === 200) {
                    setName(res.data.name)
                }
            })

        localStorage.setItem('id', id)
        localStorage.setItem('token', token)
    })

    useEffect(() => {
        const validateForm = () => {
            if (password.length === 0) {
                setPasswordError('Password is requied!')
                return false
            } else if (password.length < 6) {
                setPasswordError('Password minlength is 6!')
                return false
            } else if (password.length > 32) {
                setPasswordError('Password maxlength is 32!')
                return false
            } else {
                setPasswordError(false)
                setTouchedPassword(false)
                return true
            }
        }
        validateForm()
    }, [password])

    useEffect(() => {
        const validate = () => {
            if (confirmPassword.length === 0) {
                setConfirmPasswordError('Confirm Password is requied!')
                return false
            } else if (confirmPassword.length < 6) {
                setConfirmPasswordError('Confirm Password minlength is 6!')
                return false
            } else if (confirmPassword.length > 32) {
                setConfirmPasswordError('Confirm Password maxlength is 32!')
                return false
            } else if (confirmPassword !== password) {
                setConfirmPasswordError('Confirm Password is not match!')
                return false
            } else {
                setConfirmPasswordError(false)
                setTouchedConfirmPassword(false)
                return true
            }
        }
        validate()
    }, [confirmPassword])

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        setTouchedPassword(true)
        setTouchedConfirmPassword(true)

        setChangePWForm(true)

        if (password.length === 0 || confirmPassword.length === 0) {
            setChangePWForm(false)
            return
        }

        if (password !== confirmPassword) {
            setChangePWForm(false)
            return
        }

        let res = await changePassword({
            id: localStorage.getItem('id'),
            token: localStorage.getItem('token'),
            password
        })

        if (!res) {
            setChangePWForm(true)
            dispatch(
                Actions.showMessage({
                    message: 'Internal Server Error!',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    },
                    variant: "error"
                })
            )
            setTimeout(() => {
                history.push('/500InternalError')
            }, 5000)
        } else if (res.status === 400 || res.status === 401) {
            dispatch(
                Actions.showMessage({
                    message: res.data.error,
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    },
                    variant: "error"
                })
            )
            setChangePWForm(false)
        } else {
            setChangePWForm(true)
            setTouchedPassword(false)
            setTouchedConfirmPassword(false)
            dispatch(
                Actions.showMessage({
                    message: "Password changed successfully!",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    },
                    variant: "success"
                })
            )
            setTimeout(() => {
                history.push('/login')
            }, 5000);
        }
    }

    return (
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>

            <div className="flex flex-col items-center justify-center w-full">

                <FuseAnimate animation="transition.expandIn">

                    <Card className="w-full max-w-384">

                        <CardContent className="flex flex-col items-center justify-center p-32">

                            <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
                                Change Password
                            </Typography>

                            <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
                                for {name} account
                            </Typography>

                            <form
                                name="recoverForm"
                                noValidate
                                className="flex flex-col justify-center w-full"
                                onSubmit={handleFormSubmit}
                            >

                                <TextField
                                    className="mb-16"
                                    label="Password"
                                    autoFocus
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChangePassword}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={touchedPassword === false ? false : true}
                                    helperText={touchedPassword === false ? null : passwordError}
                                />

                                <TextField
                                    className="mb-16"
                                    label="Confirm Password"
                                    autoFocus
                                    type="password"
                                    name="confirmpassword"
                                    value={confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={touchedConfirmPassword === false ? false : true}
                                    helperText={touchedConfirmPassword === false ? null : confirmPasswordError}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="Reset"
                                    disabled={changePWForm}
                                    type="submit"
                                >
                                    Submit
                                </Button>

                            </form>

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <Link className="font-medium" to="/login" style={{ textDecoration: "none" }}>
                                    <strong>Go back to login</strong>
                                </Link>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
        </div>
    )
}

export default ChangePw