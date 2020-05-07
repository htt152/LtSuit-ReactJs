import React, { Component } from 'react'
import { InputAdornment, Icon } from '@material-ui/core';
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import history from '@history'
import FormHelperText from '@material-ui/core/FormHelperText'
import postLoginUser from '../../../axios/user/userLogin'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {setUserData} from 'app/auth/store/actions/user.actions';
import { useDispatch } from "react-redux";
import { connect } from 'react-redux';

class JWTLoginTab extends Component {

    render() {
        const {
            errors,
            touched,
            isSubmitting
        } = this.props

        return (
            <Grid container justify='center' alignContent='center'>
                <Grid className="block text-grey-darker text-sm font-bold mb-2" item xs={12} md={12} >
                    <Form >
                        <FormControl fullWidth margin='normal' error={touched.username && !!errors.username} >
                            <InputLabel>Username or Email</InputLabel>
                            <Field
                                name='username'
                                placeholder='example'
                                render={({ field }) => (
                                    <Input fullWidth {...field}
                                    />
                                )} />
                            <InputAdornment style={{ justifyContent: "flex-end" }}><Icon className="text-20" color="action" style={{ marginBottom: "20px" }}>email</Icon></InputAdornment>
                            {touched.username && errors.username && <FormHelperText>{errors.username}</FormHelperText>}
                        </FormControl>


                        <FormControl fullWidth margin='normal' error={touched.password && !!errors.password}>
                            <InputLabel>Password</InputLabel>
                            <Field
                                name='password'
                                render={({ field }) => (
                                    <Input fullWidth type='password' {...field} />
                                )} />
                            <InputAdornment style={{ justifyContent: "flex-end" }}><Icon className="text-20" color="action" style={{ marginBottom: "20px" }}>vpn_key</Icon></InputAdornment>
                            {touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin='normal'>
                            <div style={{ textAlign: "end", marginBottom: "20px" }}>
                                <a href="/forgot-password" style={{ textDecoration: "none", fontSize: "12px", marginBottom: "7px" }}>Forgot Password?</a>
                            </div>
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={isSubmitting}
                                onClick={this.props.handleSubmit}
                                style={{ fontSize: "15px", textTransform: "capitalize" }}
                            >
                                Login
                                </Button>

                        </FormControl>
                    </Form>
                </Grid>
            </Grid>
        )
    }
}

const LoginForm = withFormik({
    mapPropsToValues() {
        return {
            username: '',
            email: '',
            password: '',
            receiveLetter: true,
            plan: 'basic'
        }
    },
    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Username is required')
            .min(6, 'Username/Email must have min 6 characters')
            .max(32, 'Username have max 10 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must have min 6 characters')
    }),
    handleSubmit(values, { resetForm, setErrors, setSubmitting,props }) {
        setTimeout(async () => {
            setSubmitting(false)
            let response = await postLoginUser({
                username: values.username,
                password: values.password
            })
            if (!response){
                history.push('/500InternalError')
            } else if (response.status === 400) {
                if (response.data.error === "Wrong Password"){
                    setErrors({ password: response.data.error })
                }
                else{
                    setErrors({ username: response.data.error })
                }
            }
            else{
                localStorage.setItem('username',response.data.user.username)
                localStorage.setItem('email',response.data.user.email)
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('name',response.data.user.name)
                localStorage.setItem('id',response.data.user._id)
                localStorage.setItem('_id',response.data.user._id)
                if (response.data.user.role === 1){
                    localStorage.setItem('role','admin')
                    props.dispatch(setUserData({role: "admin"}));
                }
                else{
                    localStorage.setItem('role','user')
                    props.dispatch(setUserData({role: "user"}));
                }
                history.push('/example')
            }
        }, 1000)
    }
})(JWTLoginTab)
const FormikForm = connect()(LoginForm);


export default FormikForm
