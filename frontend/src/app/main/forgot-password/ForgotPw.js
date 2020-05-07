import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import sendEmail from '../../axios/user/sendEmail'
import * as Actions from 'app/store/actions';
import { useDispatch } from "react-redux";
import history from "@history";

const useStyles = makeStyles(theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color: theme.palette.primary.contrastText
    }
}));

const SendEmail = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [email, setEmail] = useState('')
    const [touched, setTouched] = useState(false)
    const [sendEmailForm, setSendEmailForm] = useState(false)

    const [emailError, setEmailError] = useState(false);
    const handleChange = e => {
        e.preventDefault()
        setEmail(e.target.value)
        setTouched(true)
    }

    useEffect(() => {
        const validateForm = () => {
            const filter = /^[a-z][a-z0-9_.!-]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
            if (email.length === 0) {
                setEmailError('Email is requied!')
                return false
            } else if (!filter.test(email)) {
                setEmailError('Email invalid!')
                return false
            } else {
                setEmailError(false)
                setTouched(false)
                return true
            }
        }

        validateForm()
    }, [email]);

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        setTouched(true)
        setSendEmailForm(true)

        if (email.length === 0) {
            setSendEmailForm(false)
            return
        }

        let res = await sendEmail({ email })

        if (!res) {
            return history.push('/500InternalError')
        } else if (res.status === 400) {
            dispatch(
                Actions.showMessage({
                    message: "Email does not exist!",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    },
                    variant: "error"
                }),
            )
            setSendEmailForm(false)
        } else {
            setSendEmailForm(true)
            setTouched(false)
            dispatch(
                Actions.showMessage({
                    message: "Submitted successfully! Please check your email!",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    },
                    variant: "success"
                }),
            )
            setTimeout(() => {
                history.push('/login')
            }, 5000)
        }
    }

    return (
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>

            <div className="flex flex-col items-center justify-center w-full">

                <FuseAnimate animation="transition.expandIn">

                    <Card className="w-full max-w-384">

                        <CardContent className="flex flex-col items-center justify-center p-32">

                            <div className="w-240 m-32">
                                <img src="assets/images/logos/fuse.svg" alt="logo" />
                            </div>

                            <Typography variant="h4" className="mt-16 mb-32">Forgot Password</Typography>

                            <form
                                name="recoverForm"
                                noValidate
                                className="flex flex-col justify-center w-full"
                                onSubmit={handleFormSubmit}
                            >

                                <TextField
                                    className="mb-16"
                                    label="Email"
                                    autoFocus
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={touched === false ? false : true}
                                    helperText={touched === false ? null : emailError}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="Reset"
                                    disabled={sendEmailForm}
                                    type="submit"
                                >
                                    Send Reset Link
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

export default SendEmail
