import React, {useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import { GoogleLogin } from 'react-google-login'
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import useStyles from './styles'
import Input from './Input';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, signin } from '../../actions/auth'


const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState(initialState);
    const [isSignUp, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword); 

    const classes = useStyles();

    const handleSubmit = (e) => { 
        e.preventDefault();


        if (isSignUp) {
            dispatch(signup(formData, navigate))
        } else {
            dispatch(signin(formData, navigate))
            
        }
    }

    const handleChange = (e) => { 
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const switchMode = () => {
        setFormData(initialState);
        setIsSignup((preIsSignup) => !preIsSignup)
        setShowPassword(false);
    };

    const googleSuccess = async (res) => { 
        // use of ?. and only .
        //  undefined
        const result = res?.profileObj;
        // Cannot get profileObj of undefined :
        // const result = res.profileObj;
        const token = res.tokenId;
        try {
            dispatch({ type: 'AUTH', data: { result, token } })
            navigate('/');
        } catch (error) {
            console.log(error);
        }
        console.log(res);
    }
    
    const googleFailure = (error) => {
        console.error(error);
        console.log('Google Sign In failed! Try again...');
    }


return (
    <Container component='main' maxWidth='xs'>
        <Paper className={classes.Paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant='h5'>{isSignUp ? 'SignUp' : 'SignIn'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignUp && (
                            <>
                                <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                                <Input name='lasttName' label='Last Name' handleChange={handleChange} half />
                            </>
                        )
                    }
                    <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                    <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                    {isSignUp && <Input name='confirmPassword' label='Confirm Password' handleChange={handleChange} type='password' />}
                </Grid>
                <Button type='submit' variant='contained' fullWidth color='primary' className={classes.submit}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
                <GoogleLogin
                    clientId='635858930277-3qp0fgh5l656d9kovd0dfel0ilk1afoa.apps.googleusercontent.com'
                    render={
                        (renderProps) => { 
                            return (
                        <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>Google Sign In</Button>
                    )}}
                    onSuccess={ googleSuccess }
                    onFailure={googleFailure}
                    cookiePolicy='single_host_origin'
                />
                <Grid container justify='flex-end' >
                    <Grid item>
                        <Button onClick={switchMode} >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account ? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
    )
}

export default Auth