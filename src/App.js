// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { Component } from 'react';
import Amplify, { Auth, API } from 'aws-amplify';
import { Hub } from "@aws-amplify/core";
//import { AmplifyAuthenticator, AmplifySignIn, AmplifySignUp } from '@aws-amplify/ui-react';
//import { withAuthenticator, AmplifyTheme, AuthPiece, Authenticator, SignIn, SignUp, SignOut, ConfirmSignIn, ConfirmSignUp, RequireNewPassword, VerifyContact, ForgotPassword, Loading, Greetings } from "aws-amplify-react";
//import { Authenticator, AuthPiece, SignIn, SignUp, VerifyContact, ConfirmSignUp, ConfirmSignIn, Greetings, AmplifyTheme, withAuthenticator } from 'aws-amplify-react';
import { AmplifyTheme, AuthPiece, Authenticator, SignIn, SignUp, ConfirmSignIn, ConfirmSignUp, RequireNewPassword, VerifyContact, ForgotPassword, Loading, Greetings } from "aws-amplify-react";
//import AWSCognito from 'amazon-cognito-identity-js';
import MuiPhoneNumber from 'material-ui-phone-number';
import ReCAPTCHA from "react-google-recaptcha";
import AppContainer from "./components/AppContainer";
import TopNavPanel from "./components/TopNavPanel";
import Footer from "./components/Footer";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './App.css';
import './components/AppContainer.css';
//import { BorderAll, FormatAlignCenter, ThreeSixtySharp } from '@material-ui/icons';
import bldom from './components/bldom';
import ReactCodeInput from 'react-verification-code-input';
//import { ContactsOutlined } from '@material-ui/icons';
//import awsconfig from './aws-exports';
//import { BrowserRouter as Router, Route } from "react-router-dom";
//import Slider from "react-slick";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
//import slideimage1 from "./img/500x500/01.jpg";
//import slideimage2 from "./img/500x500/02.jpg";
import { ADCache } from './store/ADCache';

const MySectionHeader = Object.assign({}, AmplifyTheme.sectionHeader,
    { background: 'orange' }
);
const MyTheme = Object.assign({}, AmplifyTheme,
    { sectionHeader: MySectionHeader }
);

// eslint-disable-next-line
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const regexDomainPattern = new RegExp("[^@]+@(.+)$");

function checkUser() {
    Auth.currentAuthenticatedUser()
        .then(user => {
            //console.log(user);
            Hub.dispatch('custom', { signedIn: true });
        })
        .catch(err => console.log(err))
};

function validatePasswordComplexity(entryValue) {
    if (entryValue.length < 9)
        return false;

    var hasUpperCase = /[A-Z]/.test(entryValue);
    var hasLowerCase = /[a-z]/.test(entryValue);
    var hasNumbers = /\d/.test(entryValue);
    var hasNonalphas = /\W/.test(entryValue);

    return (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas >= 4)
}

class MyCustomConfirmation extends AuthPiece {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = { show: true };
    }

    onChange(data) {
        this.props.updateChallengeResponse(data);

        //Auth.sendCustomChallengeAnswer(this.props.authData, data)
        //.then( (user) => { 
        //  Hub.dispatch('custom', {signedIn: true})
        //})
    }

    render() {
        if (this.state.show) {
            return (
                <div>
                    {(this.props.authState === 'signIn' || this.props.authState === 'signUp' || this.props.authState === 'signedUp' || this.props.authState === 'forgotPassword') &&
                        <div className="ad-padding-t-20">
                            <ReCAPTCHA
                                style={{ display: "inline-block", margin: "15" }}
                                theme="dark"
                                sitekey="6Lc968gaAAAAAJmMD8oKnQ_DZzdXdYdw3a1auWT6"
                                onChange={this.onChange}
                            //ref={this._reCaptchaRef}
                            //asyncScriptOnLoad={this.asyncScriptOnLoad}
                            />
                        </div>
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}

class CustomForgotPassword extends ForgotPassword {
    constructor(props) {
        super(props)
        this._validAuthStates = ['forgotPassword'];
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleCodeComplete = this.handleCodeComplete.bind(this);
        this.updateChallengeResponse = this.updateChallengeResponse.bind(this);
        this.performForgotStep1 = this.performForgotStep1.bind(this);
        this.performForgotStep2 = this.performForgotStep2.bind(this);
        this.state = {
            email: "",
            emailIsValid: false,
            password: "",
            passwordIsValid: false,
            code: "",
            codeComplete: false,
            challenge: "",
            challengeIsValid: false,
            readyToSubmit: false
        }
    }

    async performForgotStep1() {
        if (this.state.emailIsValid) {
            Auth.ForgotPassword({
                username: this.state.email,
                clientMetadata: { captcha: this.state.challenge }
            }).then(data => console.log(data))
                .catch(err => console.log(err));
        }
    }

    async performForgotStep2() {
        if (this.state.readyToSubmit) {
            Auth.ForgotPassword({
                username: this.state.email,
                clientMetadata: { captcha: this.state.challenge }
            }).then(data => console.log(data))
                .catch(err => console.log(err));
        }
    }

    updateChallengeResponse(val) {
        if (val !== "") {
            this.setState({ challenge: val, challengeIsValid: true });
            if (this.state.passwordIsValid) {
                this.setState({ readyToSubmit: true });
            }
        }
    }

    handleCodeComplete(e) {
        console.log('complete:');
        console.log(e);
        this.setState({ codeComplete: true, code: e });
    }

    handleFieldChange(e) {
        if (e.target.name === "username") {
            this.setState({ email: e.target.value });
            this.setState({ emailIsValid: validEmailRegex.test(e.target.value) });
        } else if (e.target.name === "password") {
            this.setState({ password: e.target.value });
            var isPasswordValid = validatePasswordComplexity(e.target.value)
            this.setState({ passwordIsValid: isPasswordValid });
            this.setState({ readyToSubmit: isPasswordValid && this.state.usernameIsValid && this.state.givenNameIsValid && this.state.familyNameIsValid && this.state.challengeIsValid && this.state.phoneIsValid })
        }
    };

    showComponent(MyTheme) {
        return (
            this.props.authState === 'forgotPassword'
                ?
                <div className=" forceCenter">
                    <div className="ad-paper-background centerAmp ad-padding-t-40">
                        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                            <Grid item sm={11}>
                                <h4>Forget Password Account Recovery:</h4>
                            </Grid>
                            {this.state.errorMsg !== ""
                                ?
                                <Grid>
                                    <div className="ad-darkred-font ad-padding-b-15">{this.state.errorMsg}</div>
                                </Grid>
                                : null
                            }
                            {this.props.resetting
                                ?
                                <>
                                    <Grid item sm={11}>
                                        <ReactCodeInput type="number" fields={6} onComplete={this.handleCodeComplete} />
                                    </Grid>
                                    <Grid item sm={11}>
                                        <TextField required
                                            id="password"
                                            name="password"
                                            label="Password:"
                                            helperText={this.state.passwordIsValid ? "Valid email format." : "Please enter your business email used at registration, then click on CONFIRM."}
                                            value={this.state.email}
                                            onChange={this.handleFieldChange}
                                            style={{ width: "300px", marginBottom: 5 }}
                                        />
                                    </Grid>
                                    <Grid item sm={11}>
                                        {this.state.readyToSubmit
                                            ?
                                            <div className="btnBackground">
                                                <a href="#0" onClick={(e) => { e.preventDefault(); this.performForgotStep2(); }} className="btn btn-shine"><span>CONFIRM</span></a>
                                            </div>
                                            : null
                                        }
                                    </Grid>
                                </>
                                :
                                <>
                                    <Grid item sm={11}>
                                        <TextField required
                                            id="username"
                                            name="username"
                                            label="Business Email:"
                                            helperText={this.state.emailIsValid ? "Valid." : "Required. Min. 9 characters, must contain a mix of numbers, special characters, uppercase and alowercase letters."}
                                            value={this.state.email}
                                            onChange={this.handleFieldChange}
                                            style={{ width: "300px", marginBottom: 5 }}
                                        />
                                    </Grid>
                                    <Grid item sm={11}>
                                        <MyCustomConfirmation updateChallengeResponse={this.updateChallengeResponse} authState={this.props.authState} override={this.props.authState} />
                                    </Grid>
                                    <Grid item sm={11}>
                                        {(this.state.emailIsValid && this.state.challengeIsValid)
                                            ?
                                            <div className="btnBackground">
                                                <a href="#0" onClick={(e) => { e.preventDefault(); this.performForgotStep1(); }} className="btn btn-shine"><span>CONFIRM</span></a>
                                            </div>
                                            : null
                                        }
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </div>
                </div>
                : null
        )
    }

}

class CustomConfirmSignUp extends ConfirmSignUp {
    constructor(props) {
        super(props)
        this._validAuthStates = ['confirmSignUp'];
        this.performConfirm = this.performConfirm.bind(this);
        this.handleCodeComplete = this.handleCodeComplete.bind(this);
        this.state = {
            code: "",
            errorMsg: "",
            codeComplete: false
        }
    }

    handleCodeComplete(e) {
        //console.log('complete:');
        //console.log(e);
        this.setState({ codeComplete: true, code: e });
    }

    async performConfirm() {
        Auth.confirmSignUp(this.props.usrEmail, this.state.code)
            .then(() => {
                super.changeState("signedUp", this.props.user);
            })
            .catch(err => {
                this.setState({ errorMsg: err['message'] });
            });
    }

    showComponent(MyTheme) {
        return (
            this.props.authState === 'confirmSignUp'
                ?
                <div className=" forceCenter">
                    <div className="headerTitleLarge ad-addedLetterSpacing ad-color-white"><span className="superCaps">W</span>elcome to <span className="superCaps">D</span>iligence 2.0<sup className="superscript2">TM</sup></div>
                    <div className="headerTitleSmall ad-color-white">The New Standard for Diligence</div>
                    <div className="ad-paper-background centerAmp ad-padding-t-40">
                        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                            {this.state.errorMsg !== ""
                                ?
                                <Grid>
                                    <div className="ad-darkred-font ad-padding-b-15">{this.state.errorMsg}</div>
                                </Grid>
                                : null
                            }
                            <Grid item sm={11}>
                                <div>
                                    Confirmation code sent to: {this.props.usrEmail}:<br />
                                    Please confirm the code below to verify your email:
                                </div>
                            </Grid>
                            <Grid item sm={11}>
                                <ReactCodeInput type="number" fields={6} onComplete={this.handleCodeComplete} />
                            </Grid>
                            <Grid item sm={11}>
                                {this.state.codeComplete
                                    ?
                                    <div className="btnBackground">
                                        <a href="#0" onClick={(e) => { e.preventDefault(); this.performConfirm(); }} className="btn btn-shine"><span>CONFIRM</span></a>
                                    </div>
                                    :
                                    <a href="#0" onClick={(e) => { e.preventDefault(); this.props.resendVerify(); }}><span>Resend confirmation code via email</span></a>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </div>
                : null
        )
    }
}

class CustomConfirmSignIn extends ConfirmSignIn {
    constructor(props) {
        super(props)
        this._validAuthStates = ['confirmSignIn'];
        this.performConfirm = this.performConfirm.bind(this);
        this.handleCodeComplete = this.handleCodeComplete.bind(this);
        this.state = {
            code: "",
            errorMsg: "",
            codeComplete: false
        }
    }

    handleCodeComplete(e) {
        //console.log('complete:');
        //console.log(e);
        this.setState({ code: e })
        this.setState({ codeComplete: true })
    }

    async performConfirm() {
        //console.log(this.props.usrEmail);
        //console.log(this.props.resendVerifyCode);
        //console.log(this.props.user);
        //console.log(this.state.code);
        //console.log(this.props.user.challengeName);
        if (this.props.resendVerifyCode) {
            Auth.verifyCurrentUserAttributeSubmit('phone_number', this.state.code)
                .then(() => {
                    //console.log('phone_number verified');
                }).catch(e => {
                    console.log("Error: Unexpected error from server. Please try again later.")
                    console.log(e);
                });
        } else {
            Auth.confirmSignIn(this.props.user, this.state.code, this.props.user.challengeName)
                .then(() => {
                    super.changeState('signedIn', this.props.user);
                })
                .catch(err => {
                    this.setState({ errorMsg: err.message });
                });
        }
    }

    showComponent(MyTheme) {
        return (
            this.props.authState === 'confirmSignIn'
                ?
                <div className=" forceCenter">
                    <div className="headerTitleLarge ad-addedLetterSpacing ad-color-white"><span className="superCaps">W</span>elcome to <span className="superCaps">D</span>iligence 2.0<sup className="superscript2">TM</sup></div>
                    <div className="headerTitleSmall ad-color-white">The New Standard for Diligence</div>
                    <div className="ad-paper-background centerAmp ad-padding-t-40">
                        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                            {this.state.errorMsg !== ""
                                ?
                                <Grid>
                                    <div className="ad-darkred-font ad-padding-b-15">{this.state.errorMsg}</div>
                                </Grid>
                                : null
                            }
                            <Grid item sm={11}>
                                <div>
                                    Please confirm SMS code below:
                                </div>
                            </Grid>
                            <Grid item sm={11}>
                                <ReactCodeInput type="number" fields={6} onComplete={this.handleCodeComplete} />
                            </Grid>
                            <Grid item sm={11}>
                                {this.state.codeComplete
                                    ?
                                    <div className="btnBackground">
                                        <a href="#0" onClick={(e) => { e.preventDefault(); this.performConfirm(); }} className="btn btn-shine"><span>CONFIRM</span></a>
                                    </div>
                                    :
                                    <p>Please contact support if you do not receive your SMS code.</p>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </div>
                : null
        )
    }
}


class CustomSignUp extends SignUp {
    constructor(props) {
        super(props)
        this._validAuthStates = ['signUp'];
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.performSignUp = this.performSignUp.bind(this);
        this.updateChallengeResponse = this.updateChallengeResponse.bind(this);
        this.handleShowPassword = this.handleShowPassword.bind(this);
        this.handleOnChangePhone = this.handleOnChangePhone.bind(this);
        this.state = {
            username: "",
            usernameIsValid: false,
            given_name: "",
            givenNameIsValid: false,
            family_name: "",
            familyNameIsValid: false,
            password: "",
            passwordIsValid: false,
            phone_number: "",
            phoneIsValid: false,
            challenge: "",
            challengeIsValid: false,
            readyToSubmit: false,
            showPassword: false,
            errorCount: 1,
            errorMsg: ""
        };
    }

    async performSignUp() {
        if (this.state.readyToSubmit) {
            Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes: {
                    email: this.state.username,
                    family_name: this.state.family_name,
                    given_name: this.state.given_name,
                    phone_number: this.state.phone_number
                },
                clientMetadata: { captcha: this.state.challenge }
            }).then((signup) => {
                console.log(signup);
                this.setState({ errorMsg: "" });
                this.props.setUsrEmail(signup.user.username);
                super.changeState('confirmSignUp', signup.user.username);

            }).catch(error => {
                var timeout = this.state.errorCount;
                this.setState({ errorCount: this.state.errorCount + 1 });
                setTimeout(() => this.setState({ readyToSubmit: true }), 100 * (timeout ^ timeout));
                console.log('SignUp Error: ', error);
                this.setState({ errorMsg: error['message'] })
            });
        }
    }

    updateChallengeResponse(value) {
        if (value !== "") {
            this.setState({ challenge: value });
            this.setState({ challengeIsValid: true })
            this.setState({ readyToSubmit: this.state.usernameIsValid && this.state.givenNameIsValid && this.state.familyNameIsValid && this.state.passwordIsValid && this.state.phoneIsValid })
        }
    }

    handleShowPassword = (e) => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleOnChangePhone(value) {
        this.setState({ phone_number: value });
        this.setState({ phoneIsValid: (value !== "") })
    }

    handleFieldChange(e) {
        var outString = "";
        if (e.target.value !== "") {
            // outString = event.target.value.replace(/[`~!@#$%^&*()|+=?;'",<>\{\}\[\]\\\/]/gi, '');
            outString = e.target.value.replace(/[`~!@#$%^&*()|+=?;'",<>{}[\]\\/]/gi, '');
        }

        if (e.target.name === "username") {
            this.setState({ username: e.target.value });
            if (validEmailRegex.test(e.target.value)) {
                let emailDomain = regexDomainPattern.exec(e.target.value);
                var isValid = !(bldom.includes(emailDomain[1]) || emailDomain[1].endsWith(".cn") || emailDomain[1].endsWith(".ru") || emailDomain[1].endsWith(".ir"));
                this.setState({ usernameIsValid: isValid });
                this.setState({ readyToSubmit: isValid && this.state.givenNameIsValid && this.state.familyNameIsValid && this.state.passwordIsValid && this.state.challengeIsValid && this.state.phoneIsValid })
            } else {
                this.setState({ usernameIsValid: false, readyToSubmit: false });
            }
        } else if (e.target.name === "given_name") {
            var isGivenVal = (outString !== "")
            this.setState({ given_name: outString });
            this.setState({ givenNameIsValid: isGivenVal });
            this.setState({ readyToSubmit: isGivenVal && this.state.usernameIsValid && this.state.familyNameIsValid && this.state.passwordIsValid && this.state.challengeIsValid && this.state.phoneIsValid })

        } else if (e.target.name === "family_name") {
            var isFamilyVal = (outString !== "");
            this.setState({ family_name: outString });
            this.setState({ familyNameIsValid: isFamilyVal });
            this.setState({ readyToSubmit: isFamilyVal && this.state.usernameIsValid && this.state.givenNameIsValid && this.state.passwordIsValid && this.state.challengeIsValid && this.state.phoneIsValid })

        } else if (e.target.name === "password") {
            this.setState({ password: e.target.value });
            var isPasswordValid = validatePasswordComplexity(e.target.value)
            this.setState({ passwordIsValid: isPasswordValid });
            this.setState({ readyToSubmit: isPasswordValid && this.state.usernameIsValid && this.state.givenNameIsValid && this.state.familyNameIsValid && this.state.challengeIsValid && this.state.phoneIsValid })
        }
    };

    showComponent(MyTheme) {
        return (
            (this.props.authState === 'signUp')
                ?
                <div className=" forceCenter">
                    
                    <div className="ad-paper-background centerAmp ad-padding-t-40">
                        <form>
                            <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                                {this.state.errorMsg !== ""
                                    ?
                                    <Grid>
                                        <div className="ad-darkred-font ad-padding-b-15">{this.state.errorMsg}</div>
                                    </Grid>
                                    : null
                                }
                                <Grid item sm={11}>
                                    <TextField required
                                        id="given_name"
                                        name="given_name"
                                        label="First Name:"
                                        helperText="Required."
                                        value={this.state.given_name}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.givenNameIsValid}
                                        style={{ width: '300px', textAlign: 'left', marginBottom: 5 }}
                                    />
                                </Grid>
                                <Grid item sm={11}>
                                    <TextField required
                                        id="family_name"
                                        name="family_name"
                                        label="Surname/Family Name:"
                                        helperText="Required."
                                        value={this.state.family_name}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.familyNameIsValid}
                                        style={{ width: "300px", marginBottom: 5 }}
                                    />
                                </Grid>
                                <Grid item sm={11}>
                                    <TextField required
                                        id="username"
                                        name="username"
                                        label="Business Email:"
                                        helperText={this.state.usernameIsValid ? "Valid." : "Required. General public email domains may be rejected by the system."}
                                        value={this.state.username}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.usernameIsValid}
                                        style={{ width: "300px", marginBottom: 15 }}
                                    />
                                </Grid>
                                <Grid item sm={11}>
                                    <MuiPhoneNumber required defaultCountry={'us'} autoFormat={false} disableAreaCodes={true} onChange={this.handleOnChangePhone}
                                        id="phone_number"
                                        name="phone_number"
                                        label="Mobile Phone Number (for 2FA):"
                                        helperText={this.state.usernameIsValid ? "Valid." : "Required. Mobile phone number is requried for MFA."}
                                        value={this.state.phone}
                                        error={!this.state.phoneIsValid}
                                        style={{ width: "300px", marginBottom: 5 }}
                                    />
                                </Grid>
                                <Grid item sm={11}>
                                    <TextField required
                                        id="password"
                                        type={this.state.showPassword ? "input" : "password"}
                                        name="password"
                                        label="Password:"
                                        helperText={this.state.passwordIsValid ? "Valid." : "Required. Min. 9 characters, must contain a mix of numbers, special characters, uppercase and alowercase letters."}
                                        value={this.state.password}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.passwordIsValid}
                                        style={{ width: "300px", marginBottom: 5 }}
                                    /><br />
                                    <input type="checkbox" id="showPassword" name="showPassword" checked={this.state.showPassword} onChange={this.handleShowPassword} />
                                    <label htmlFor="showPassword" className="body-small">Show Password</label>
                                </Grid>
                                <Grid item sm={11}>
                                    <MyCustomConfirmation updateChallengeResponse={this.updateChallengeResponse} authState={this.props.authState} override={this.props.authState} />
                                </Grid>
                                <Grid item sm={11}>
                                    {this.state.readyToSubmit
                                        ?
                                        <div className="btnBackground">
                                            <a href="#0" onClick={(e) => { e.preventDefault(); this.performSignUp(); }} className="btn btn-shine"><span>REGISTER</span></a>
                                        </div>
                                        :
                                        <div className="ad-color-disabled">Complete above form to Register</div>
                                    }
                                </Grid>
                                <Grid item sm={11}>
                                    <hr width="75%" />
                                    <Grid container spacing={1} direction="row" justify="center" alignItems="center" alignContent="center">
                                        <Grid item sm={11}>
                                            <p className="text-grey-dark text-xs">
                                                Already Have an Account?<br />
                                                <a href="#0" className="a-loginLink" onClick={(e) => { e.preventDefault(); super.changeState('signIn') }} >
                                                    Back to Login
                                                </a>
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </div>
                : null
        )
    }
}

class CustomSignIn extends SignIn {
    constructor(props) {
        super(props)
        this._validAuthStates = ['signIn', 'signedOut', 'signedUp']
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.updateChallengeResponse = this.updateChallengeResponse.bind(this);
        this.performSignIn = this.performSignIn.bind(this);
        this.handleShowPassword = this.handleShowPassword.bind(this);
        this.state = {
            username: "",
            usernameIsValid: false,
            password: "",
            passwordIsValid: false,
            challenge: "",
            challengeIsValid: false,
            readyToSubmit: false,
            errorCount: 1,
            errorMsg: "",
            showPassword: false
        };
    }

    performSignIn() {
        const user = {challengeParam : {USER_ID_FOR_SRP : 1}}
        this.setState({ readyToSubmit: false });
        this.setState({ errorMsg: "" });
        this.props.setUsr(user);
        this.props.onStateChange('signedIn', user);
        return;
        if (this.state.readyToSubmit) {
            this.setState({ readyToSubmit: false });
            Auth.signIn(
                this.state.username, this.state.password, {
                captcha: this.state.challenge
            }
            ).then((user) => {
                console.log(user);
                // Successful signup, need to enter the confirmation code for MFA
                this.setState({ errorMsg: "" });
                this.props.setUsr(user);

                if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                    this.props.onStateChange('confirmSignIn', user);
                } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    //const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
                    // You need to get the new password and required attributes from the UI inputs
                    // and then trigger the following function with a button click
                    // For example, the email and phone_number are required attributes
                    //const { username, email, phone_number } = getInfoFromUserInput();
                    //const loggedUser = await Auth.completeNewPassword(
                    //    user,               // the Cognito User Object
                    //    newPassword,       // the new password
                    //    // OPTIONAL, the required attributes
                    //    {
                    //        email,
                    //        phone_number,
                    //   }
                    //);
                } else if (user.challengeName === 'MFA_SETUP') {
                    // This happens when the MFA method is TOTP
                    // The user needs to setup the TOTP before using it
                    // More info please check the Enabling MFA part
                    Auth.setupTOTP(user);
                } else {
                    // The user directly signs in
                    console.log(user);
                    this.props.onStateChange('signedIn', user);
                }
            }).catch(error => {
                var timeout = this.state.errorCount;
                this.setState({ errorCount: this.state.errorCount + 1 });
                setTimeout(() => this.setState({ readyToSubmit: true }), 100 * (timeout ^ timeout));
                console.log('SignIn Error: ', error);
                this.setState({ errorMsg: error['message'] })

                if (error.code === 'UserNotConfirmedException') {
                    // The error happens if the user didn't finish the confirmation step when signing up
                    // In this case you need to resend the code and confirm the user
                    // About how to resend the code and confirm the user, please check the signUp part
                    this.resendCode();
                } else if (error.code === 'PasswordResetRequiredException') {
                    // The error happens when the password is reset in the Cognito console
                    // In this case you need to call forgotPassword to reset the password
                    // Please check the Forgot Password part.
                    console.log(error);
                    this.props.onStateChange('forgotPassword', this.props.usrEmail);
                } else {
                    console.log(error);
                }
            });
        }
    }

    updateChallengeResponse(value) {
        if (value !== "") {
            this.setState({ challenge: value });
            this.setState({ challengeIsValid: true })
            this.setState({ readyToSubmit: this.state.usernameIsValid && this.state.passwordIsValid })
        }
    }

    handleShowPassword = (e) => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleFieldChange(e) {
        if (e.target.name === "username") {
            this.setState({ username: e.target.value });
            if (validEmailRegex.test(e.target.value)) {
                let emailDomain = regexDomainPattern.exec(e.target.value);
                var isEmailValid = !(bldom.includes(emailDomain[1]) || emailDomain[1].endsWith(".cn") || emailDomain[1].endsWith(".ru") || emailDomain[1].endsWith(".ir"));
                this.setState({ usernameIsValid: isEmailValid });
                this.setState({ readyToSubmit: isEmailValid && this.state.passwordIsValid && this.state.challengeIsValid })
            } else {
                this.setState({ usernameIsValid: false, readyToSubmit: false });
            }
        } else if (e.target.name === "password") {
            this.setState({ password: e.target.value });
            var isValidPassword = validatePasswordComplexity(e.target.value);
            this.setState({ passwordIsValid: isValidPassword });
            this.setState({ readyToSubmit: this.state.usernameIsValid && isValidPassword && this.state.challengeIsValid })
        }
    };

    showComponent(MyTheme) {
        return (
            ((this.props.authState === 'signIn') || (this.props.authState === 'signedUp') || (this.props.authState === 'signedOut'))
                ?
                <div className=" forceCenter">
                    {/* <div className="headerTitleLarge ad-addedLetterSpacing ad-color-white"><span className="superCaps">W</span>elcome to <span className="superCaps">D</span>iligence 2.0<sup className="superscript2">TM</sup></div>
                    <div className="headerTitleSmall ad-color-white">The New Standard for Diligence</div> */}
                    <div className="ad-paper-background centerAmp ad-padding-t-40">
                        <form className="ad-margin-forceZero">
                            <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                                {this.props.authState === "signedUp"
                                    ?
                                    <Grid>
                                        <div className="ad-color-companygreen ad-padding-b-15">
                                            Thank you for registering with us.<br />
                                            Please sign in with your new credentials, including SMS verification, to get started.
                                        </div>
                                    </Grid>
                                    : this.state.errorMsg !== ""
                                        ?
                                        <Grid>
                                            <div className="ad-darkred-font ad-padding-b-15">{this.state.errorMsg}</div>
                                        </Grid>
                                        : <div className='V_login_title'>PreAuthentication failed with error invalid ReCaptcha Response.</div>
                                }
                                <Grid item sm={11}>
                                    <TextField required
                                        id="username"
                                        name="username"
                                        label="Business Email:"
                                        helperText={this.state.usernameIsValid ? "Valid." : "Required. General public email domains may be rejected by the system."}
                                        value={this.state.username}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.usernameIsValid}
                                        style={{ width: "300px", marginBottom: 5 }}
                                    />
                                </Grid>
                                <Grid item sm={11}>
                                    <TextField required
                                        id="password"
                                        type={this.state.showPassword ? "input" : "password"}
                                        name="password"
                                        label="Password:"
                                        helperText={this.state.passwordIsValid ? "Valid." : "Required. Min. 9 characters, must contain a mix of numbers, special characters, uppercase and alowercase letters."}
                                        value={this.state.password}
                                        onChange={this.handleFieldChange}
                                        error={!this.state.passwordIsValid}
                                        style={{ width: "300px", marginBottom: 5 }}
                                    /><br />
                                    <input type="checkbox" id="showPassword" name="showPassword" checked={this.state.showPassword} onChange={this.handleShowPassword} />
                                    <label htmlFor="showPassword" className="body-small">Show Password</label>
                                </Grid>
                                <Grid item sm={11}>
                                    <MyCustomConfirmation updateChallengeResponse={this.updateChallengeResponse} authState={this.props.authState} override={this.props.authState} />
                                </Grid>
                                <Grid item sm={11}>
                                    {!this.state.readyToSubmit
                                        ?
                                        <div className="btnBackground">
                                            <a href="#0" onClick={(e) => { e.preventDefault(); this.performSignIn(); }} className="btn btn-shine"><span>SIGN IN</span></a>
                                        </div>
                                        :
                                        <div className="ad-color-disabled">Complete the above form to Login</div>
                                    }
                                </Grid>
                                <Grid item sm={11}>
                                    <hr width="75%" />
                                    <Grid container spacing={1} direction="row" justify="center" alignItems="center" alignContent="center">
                                        <Grid item sm={6}>
                                            <p className="text-grey-dark text-xs">
                                                Forgot password?<br />
                                                <a href="#0" className="a-loginLink" onClick={(e) => { e.preventDefault(); super.changeState('forgotPassword'); }}>
                                                    Reset Password
                                                </a>
                                            </p>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <p className="text-grey-dark text-xs">
                                                No Account?<br />
                                                <a href="#0" className="a-loginLink" onClick={(e) => { e.preventDefault(); super.changeState('signUp'); }}>
                                                    Click to Register
                                                </a>
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </div>
                : null
        )
    }
}


//Amplify.configure(awsconfig);
Amplify.configure({
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        //identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        //identityPoolRegion: 'XX-XXXX-X',

        // OPTIONAL - Amazon Cognito User Pool ID
        //userPoolId: 'us-east-2_uW5kSsXsk',
        userPoolId: 'us-east-2_jULTw8K3k',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        //userPoolWebClientId: '17n9h55qa9b7eql2qohdetdkgo',
        //userPoolWebClientId: '4f56gcg4fjpjht8tbgov6ak3hd',
        userPoolWebClientId: '7gtt91m6bk6mnb53e31re04bco',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        //mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        //cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //    domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
        //    path: '/',
        // OPTIONAL - Cookie expiration in days
        //    expires: 365,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //    secure: true
        //},

        // OPTIONAL - customized storage object
        //storage: new MyStorage(),

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        //authenticationFlowType: 'USER_PASSWORD_AUTH' | 'CUSTOM_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        //clientMetadata: { myCustomKey: '17qvgtocfh6smb9eg3fbh41prdbqdld4moevgagsofm5o5idldfd' },
        //clientMetadata: { myCustomKey: '1lbkr7hb5bgh1e7ettht3t28il0b2pab2roi8cposph26dhek2tj' },

        // OPTIONAL - Hosted UI configuration
        //oauth: {
        //    domain: 'your_cognito_domain',
        //    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        //    redirectSignIn: 'http://localhost:3000/',
        //    redirectSignOut: 'http://localhost:3000/',
        //    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        //}
    },
    API: {
        endpoints: [
            {
                name: "getuserroles",
                endpoint: "https://api.accudiligence.com/users/roles"
            },
            {
                name: "setclientinfo",
                endpoint: "https://api.accudiligence.com/clients/info"
            },
            {
                name: "getclientprojects",
                endpoint: "https://api.accudiligence.com/clients/projects"
            },
            {
                name: "createclientproject",
                endpoint: "https://api.accudiligence.com/clients/projects"
            },
            {
                name: "activateprojectbytarget",
                endpoint: "https://api.accudiligence.com/targets/projects/activations"
            },
            {
                name: "gettargetprojects",
                endpoint: "https://api.accudiligence.com/targets/projects"
            },
            {
                name: "getprojectareas",
                endpoint: "https://api.accudiligence.com/targets/projects/areas"
            },
            {
                name: "getprojectareatopic",
                endpoint: "https://api.accudiligence.com/targets/projects/areas/topics"
            },
            {
                name: "getsubtopics",
                endpoint: "https://api.accudiligence.com/targets/projects/areas/topics/subtopics"
            },
            {
                name: "getmeasures",
                endpoint: "https://api.accudiligence.com/targets/projects/measures"
            },
            {
                name: "postresponses",
                endpoint: "https://api.accudiligence.com/targets/projects/measures/responses"
            },
            {
                name: "servicespricing",
                endpoint: "https://api.accudiligence.com/services/pricing"
            },
            {
                name: "getclientfinancials",
                endpoint: "https://api.accudiligence.com/clients/financials"
            },
            {
                name: "adactivateprojectarea",
                endpoint: "https://ivzfc9tnx8.execute-api.us-east-2.amazonaws.com/Dev"
            }
        ]
    }
});


// You can get the current config object
//const currentConfig = Auth.configure();
Auth.configure();
// Select SMS as preferred
//Auth.setPreferredMFA(user, 'SMS');
API.configure();


//const App = () => (
class App extends Component {
    constructor(props) {
        super(props);
        checkUser();
        this.signOut = this.signOut.bind(this);
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.changeDisplayState = this.changeDisplayState.bind(this);
        this.handleSetToken = this.handleSetToken.bind(this);
        this.handleSetUsrEmail = this.handleSetUsrEmail.bind(this);
        this.handleSetCognitoUser = this.handleSetCognitoUser.bind(this);
        this.resendVerify = this.resendVerify.bind(this);
        this.handlePricingLoaded = this.handlePricingLoaded.bind(this);
        this.initADCache = this.initADCache.bind(this);
        this.state = {
            authState: 'loading',
            authData: null,
            authError: null,
            preSignInID: "",
            cognitoUser: null,
            usrEmail: null,
            setSignIn: false,
            jwtToken: null,
            refreshToken: null,
            displayAmplify: false,
            resendVerifyCode: false,
            resettingPassword: false,
            user_firstName: "",
            pricingLoaded: false,
            CYenabled: false,
            TDenabled: false,
            INenabled: false
        }
        // let the Hub module listen on Auth events
        Hub.listen('auth', (data) => {
            //console.log("in Hub Auth:" + data.payload.event);
            //console.log(data);
            switch (data.payload.event) {
                case 'signIn':
                    var dpm = data.payload.message;
                    if ((dpm.substring(dpm.length - 9) === "signed in") || data.payload.data.hasOwnProperty("signInUserSession")) {
                        let cognitoUser = data.payload.data;
                        this.handleSetToken(cognitoUser.signInUserSession.idToken.jwtToken, cognitoUser.signInUserSession.refreshToken.token, cognitoUser.username);
                        this.setState({ usrEmail: data.payload.data.signInUserSession.idToken.payload.email });
                        this.setState({ authState: 'signedIn', authData: cognitoUser });
                    }
                    break;
                case 'signIn_failure':
                    this.setState({ authState: 'signIn', authData: null, authError: data.payload.data });
                    break;
                case 'signUp':
                    //this.setState({authState: 'signUp'});
                    //this.forceUpdate();
                    break;
                case 'confirmSignIn':
                    //this.setState({authState: 'confirmSignIn'});
                    //this.forceUpdate();
                    break;
                default:
                    break;
            }
        });
        Hub.listen('ADGlobalState', (data) => {
            switch (data.payload.event) {
                case 'rerender':
                    this.forceUpdate();
                    break;
                default:
                    break;
            }
        });


        //this._reCaptchaRef = React.createRef();
    }

    handleResetPassword(b) {
        this.setState({ resettingPassword: b });
    }

    resendVerify() {
        this.setState({ resendVerifyCode: true });
        Auth.verifyCurrentUserAttribute("phone_number")
            .then(() => {
                console.log('a verification code is sent');
            }).catch((e) => {
                console.log('failed with error', e);
            });
    }

    handleSetCognitoUser(usr) {
        usr.username = usr.challengeParam.USER_ID_FOR_SRP;
        this.setState({ cognitoUser: usr });
    }
    handleSetUsrEmail(em) {
        this.setState({ preSignInID: em });
    }

    handleSetToken(jwt, refresh, cogUsr) {
        //this.setState({usrEmail: Auth.userPool.getCurrentUser().username});
        this.setState({ jwtToken: jwt, refreshToken: refresh, cognitoUser: cogUsr });
    }

    changeDisplayState(newState) {
        // this.setState({ displayAmplify: true });
        this.setState({ displayAmplify: newState });
    }

    initADCache() {
        // Check current service pricing if not yet initialized
        if (ADCache.servicePricing == null) {
            // Pull current pricing and available adjustments
            // Server will still verify payment due amount based on project submission, data, time, and available valid adjustments
            let payLoad = {
                body: {
                    enabled: "",
                    scope: "",
                    setDT: ""
                }
            }
            API.post('servicespricing', '/', payLoad).then(response => {
                if (response.statusCode === 200) {
                    ADCache.servicePricing = response.body;

                    // Process into flags in ADCache. Rather archaic but easier to understand in code later
                    response.body.adjustments.forEach((adj) => {
                        if (adj.Adjustment === 'BETA') {
                            ADCache.DiscountBETA = adj.Percentage;
                            //console.log("BETA pricing activated.");
                        } else if (adj.Adjustment === '2x') {
                            ADCache.Discount2X = adj.Percentage;
                            //console.log("2X pricing activated.");
                        } else if (adj.Adjustment === '3x') {
                            ADCache.Discount3X = adj.Percentage;
                            //console.log("3X pricing activated.");
                        }
                    });

                    // Process into flags in ADCache. Rather archaic but easier to understand in code later
                    response.body.productprice.forEach((pp) => {
                        if (pp.Code === 'CY') {
                            if (pp.ProductScope === 'C') {
                                ADCache.CYCenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.CYCprice = pp.Price;
                            } else if (pp.ProductScope === 'E') {
                                ADCache.CYEenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.CYEprice = pp.Price;
                            }
                        } else if (pp.Code === 'TD') {
                            if (pp.ProductScope === 'C') {
                                ADCache.TDCenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.TDCprice = pp.Price;
                            } else if (pp.ProductScope === 'E') {
                                ADCache.TDEenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.TDEprice = pp.Price;
                            }
                        } else if (pp.Code === 'IT') {
                            if (pp.ProductScope === 'C') {
                                ADCache.ITCenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.ITCprice = pp.Price;
                            } else if (pp.ProductScope === 'E') {
                                ADCache.ITEenabled = (pp.Enabled === 1) ? true : false;
                                ADCache.ITEprice = pp.Price;
                            }
                        }
                    });

                    this.setState({
                        CYenabled: (ADCache.CYCenabled || ADCache.CYEenabled),
                        TDenabled: (ADCache.TDCenabled || ADCache.TDEenabled),
                        INenabled: (ADCache.ITCenabled || ADCache.ITEenabled),
                        pricingLoaded: true
                    });

                } else {
                    // Create failed: show user to contact support
                    alert("Error " + response.statusCode + ": An error occured getting current pricing:" + JSON.stringify(response.body));
                    //this.setState({ servicePricingData: null });
                }
            }).catch(error => {
                console.log(error)
            });
        }
    }

    handlePricingLoaded() {

    }

    componentDidMount() {
        this.initADCache();

        // check the current user when the App component is loaded
        Auth.currentAuthenticatedUser().then(user => {
            this.handleSetToken(user.signInUserSession.idToken.jwtToken, user.signInUserSession.refreshToken.token, user.username);
            this.setState({ usrEmail: user.attributes.email, authData: user, user_firstName: user.attributes.given_name });
            Auth.user.jwt = user.signInUserSession.idToken.jwtToken; // Our override when this is usually null
            this.setState({ authState: 'signedIn' });
        }).catch(e => {
            //console.log(e.message);
            this.setState({ authState: 'signIn' });
            this.setState({ displayAmplify: false });
        });
    }

    signOut() {
        Auth.signOut().then(() => {
            this.setState({ usrEmail: null });
            this.setState({ jwtToken: '' })
            this.handleAuthStateChange('signIn');
        }).catch(e => {
            console.log(e);
        });
        this.setState({ displayAmplify: false });
    }

    handleAuthStateChange(e) {
        //console.log("handle state change needed:" + e);
        if (e !== this.state.authState)
            this.setState({ authState: e });
        if (e === 'signedIn') {
            // Handled by Hub notification from Amplify
            
            // Set view to NewUser
            this.setState({usrEmail: this.state.preSignInID })
            console.log("pre-email:"+ this.state.preSignInID)
            Auth.currentAuthenticatedUser()
             .then(user => {
                console.log("main:");
                console.log(user);
                Hub.dispatch('custom', {signedIn: true});
                this.setState({authState: 'signedIn', authData: user});
                var cognitoUser = Auth.userPool.getCurrentUser();
                console.log(cognitoUser);
                this.setState({usrEmail: cognitoUser.username});
                this.handleSetToken(cognitoUser.signInUserSession.idToken.jwtToken, cognitoUser.signInUserSession.refreshToken.token);
             });
        }
        if (e === 'signedOut') {
            this.setState({ usrEmail: null, displayAmplify: false });
        }
        
    }

    render() {


        if (Auth.user)
            if (Auth.user.jwt === null)
                Auth.user.jwt = this.state.jwtToken;

        return (
        // <div className="">
            <div className="">
                <TopNavPanel displayAmplify={this.state.displayAmplify} changeDisplayState={this.changeDisplayState} usrEmail={this.state.usrEmail} ClientID={this.state.ClientID} />
                {!this.state.usrEmail ?
                    <div className="filler ad-login-background">
                        <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center" alignContent="center">
                            {(this.state.displayAmplify)
                                ?
                                <Grid item sm={7}>
                                    <div className="ad-largeheadingspacer ad-dkbackground">
                                        <div align="center">
                                            <Authenticator theme={MyTheme} hide={[SignIn, SignUp, ConfirmSignUp, ConfirmSignIn, ForgotPassword]} usernameAlias="email" usernameAttributes='email' onStateChange={this.handleAuthStateChange}>
                                                <CustomSignIn authState={this.state.authState} onStateChange={this.handleAuthStateChange} setUsr={this.handleSetCognitoUser} />
                                                <CustomSignUp authState={this.state.authState} onStateChange={this.handleAuthStateChange} setUsrEmail={this.handleSetUsrEmail} />
                                                <VerifyContact />
                                                <CustomConfirmSignIn authState={this.state.authState} user={this.state.cognitoUser} onStateChange={this.handleAuthStateChange} resendVerify={this.resendVerify} resendVerifyCode={this.state.resendVerifyCode} resetting={this.state.resettingPassword} />
                                                <CustomConfirmSignUp authState={this.state.authState} usrEmail={this.state.preSignInID} onStateChange={this.handleAuthStateChange} resendVerify={this.resendVerify} />
                                                <Greetings />
                                                <RequireNewPassword />
                                                <CustomForgotPassword authState={this.state.authState} resetting={this.state.resettingPassword} />
                                                <Loading />
                                            </Authenticator>
                                        </div>
                                    </div>
                                </Grid>
                                :
                                <Grid container>
                                    <Grid item sm={7}>
                                        <div className="ad-largeheadingspacer">
                                            <h2 className="ad-headingLeft ad-color-black">U<span className='superCaps'>PGRADE</span> <span className='superCaps'>TO</span> D<span className='superCaps'>ILIGENCE </span>2.0<sup className="superscript2">TM</sup></h2>
                                            <p className="ad-color-black body2">
                                            the expert SaaS platform for fast, effective, and cost-efficient engagements for :
                                            </p>
                                            <ul>
                                                <li className='landing-lists'>Buy-Side Due Diligence</li>
                                            </ul>
                                            <p className="ad-color-black body2">and coming soon:</p>
                                            <ul>
                                                <li className='landing-lists'>Self-Examining Health Checks</li>
                                                <li className='landing-lists'>Pre-sale Preparatory Assistance</li>
                                                <li className='landing-lists'>Audits</li>
                                                <li className='landing-lists'>Insurance Underwriting</li><li className='landing-lists'>Vendor Performance Assessment, Evaluation, and Selection</li>
                                            </ul>
                                            <p className="ad-color-black body2">Typically conducted via high-cost, time-consuming, engagements with management consultants. AccuDiligence is looking to disrupt the market with a mix of expert heuristics, AI/ML, automation, NLG, and qualifed professional quality assurance.</p>
                                            <h4 className="ad-smallheadingLeft ad-color-black">Market Disrupting Features</h4>
                                            <ul>
                                                <li className='smalllanding-lists'>Buy-Side Due Diligence</li>
                                                <li className='smalllanding-lists'>24x7x365 access to complete the inteviews</li>
                                                <li className='smalllanding-lists'>Automated scoring and NLG delivers report in real time</li>
                                                <li className='smalllanding-lists'>Assess risks earlier with low-cost, red-flags scope </li>
                                                <li className='smalllanding-lists'>Enhanced portfolio, peer, versus market analytics</li>
                                            </ul>
                                            <div className="smalllandingbuttons">
                                                <a href="#0" className="landing-small-btn"><span>Finde out more...</span></a>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item sm={5}>
                                        <div className="ad-largeheadingspacer ad-color-blue">
                                            <p className="smalllanding-p">Current Services with more to come:</p>
                                            <li className='smalllanding'>Self-Examining Health Checks</li>
                                            <li className='smalllanding'>Pre-sale Preparatory Assistance</li>
                                            <li className='smalllanding'>Audits</li>
                                            <li className='smalllanding'>Insurance Underwriting</li><li className='smalllanding'>Vendor Performance Assessment, Evaluation, and Selection</li>

                                            <div className="smalllandingbuttons">
                                                <a href="#0" className="landing-small-btn"><span>Register to get started</span></a>
                                            </div>
                                            <p className="smalllanding-p">Register now to get a free walkthrough of how our innovations differentiate and simplify as we aim to be the primary automated assessment and due diligence vehicle for all current and future needs.</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            }
                                
                        </Grid>
                    </div>
                    : this.state.jwtToken ?
                        <AppContainer usrEmail={this.state.usrEmail} jwt={this.state.jwtToken} />
                        : null
                }
                <Footer />
            </div>
        )
    }
}
export default App;