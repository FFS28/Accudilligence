// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
//import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
//import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import { styled } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
//import LinearProgress from '@material-ui/core/LinearProgress';
import { API, Auth } from 'aws-amplify';
import Terms from './Terms';
import bldom from './bldom';
import { PayPalButton } from "react-paypal-button-v2";
import './Terms.css';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import './ClientProjects.css';
import { ADCache } from '../store/ADCache';
import { white } from 'material-ui/styles/colors';
//import { ConfirmationNumber } from '@material-ui/icons';

// eslint-disable-next-line
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const regexDomainPattern = new RegExp("[^@]+@(.+)$");

//function signOut() {
//  Auth.signOut();
//  Check environment variable for release
//  let domainStr = "localhost:3000/"
//  window.location.href = domainStr + "?signin=1";
//  window.location.reload();
//}


export default class ClientNewProject extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange            = this.handleChange.bind(this);
    this.handleChangeScope       = this.handleChangeScope.bind(this);
    this.handleChangePaymentType = this.handleChangePaymentType.bind(this);
    this.handleDateChange        = this.handleDateChange.bind(this);
    this.handleOnFocus     = this.handleOnFocus.bind(this);
    this.handlePTC         = this.handlePTC.bind(this);
    this.handleChangeCheck = this.handleChangeCheck.bind(this);
    this.handleChangeSlider = this.handleChangeSlider.bind(this);
    this.handleDiscount = this.handleDiscount.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleRequestInvoice = this.handleRequestInvoice.bind(this);
    this.formatNumber = this.formatNumber.bind(this);
    this.CreateProjectFromPayment = this.CreateProjectFromPayment.bind(this);
    this.addDays = this.addDays.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this);

    this.state = {
      debug: 1,
      beta: 1,
      tEmail: "sample@target-email.com",
      projectNameIsValid: false,
      projectName: "",
      systemName: "",
      primaryEmailIsValid: false,
      primaryEmail: "",
      service: "Cybersecurity",
      CYscope: "CYC",
      TDscope: "TDC",
      ITscope: "ITC",
      requestCompletionBy: null,
      requestCompletionByValue: "",
      maxDate: null,
      dateIsValid: true,
      paymentType: null,
      ptncAgree: false,
      pCheckOut: false,
      PONumber: "",
      checkedITBO: false,
      checkedTech: false,
      checkedCyber: false,
      checkedAcquisitiveGrowth: false,
      checkedOrganicGrowth: false,
      checkedScalability: false,
      checkedIP: false,
      checkedTechDebt: false,
      checkedExitIPO: false,
      checkedExitStrategic: false,
      checkedExitSecondary: false,
      checkedExitLiquidation: false,
      checkedSTOS: false,
      checkedSTCQ: false,
      checkedSTSC: false,
      sliderAcquisitiveGrowthValue: 1,
      sliderOrganicGrowthValue: 1,
      sliderScalabilityValue: 1,
      sliderIPValue: 1,
      sliderTechDebtValue: 1,
      sliderExitIPOValue: 1,
      sliderExitStrategicValue: 1,
      sliderExitSecondaryValue: 1,
      sliderExitLiquidationValue: 1,
      discountTotal: 0,
      totalDue: 0,
      countSelectedServices: 0,
      debounceSubmit: null,
      servicePricingData: null,
      scrolledOnce: false
    };

    // references for smooth scrolling
    this.step2 = React.createRef();
    this.step3 = React.createRef();
    this.step4 = React.createRef();
  }

  // receipt, null -> paypal
  // null, 2500 -> request invoice
  // This amount must match current promotions or will be rejected by server and suspend the user account
  //
  CreateProjectFromPayment(receipt, invoice) {
    //Submit to Server if debounce > 5 minute between project submission.
    if (this.props.usrEmail && this.props.jwt && (Math.abs((new Date()) - this.state.debounceSubmit) > 300000)) {

      // Create Scope array
      var serviceArray = [];
      var serviceIndex = 0;
      var thesisValues = null;
      if (this.state.checkedCyber) {
        serviceArray[serviceIndex] = { Service: "Cybersecurity", ServiceType: (this.state.CYscope === "CYC" ? "Confirmatory" : "Extensive") };
        serviceIndex = serviceIndex + 1;
      }
      if (this.state.checkedTech) {
        serviceArray[serviceIndex] = { Service: "TechDiligence", ServiceType: (this.state.TDscope === "TDC" ? "Confirmatory" : "Extensive") };
        serviceIndex = serviceIndex + 1;
      }
      if (this.state.checkedITBO) {
        serviceArray[serviceIndex] = { Service: "ITBackOffice", ServiceType: (this.state.ITscope === "ITC" ? "Confirmatory" : "Extensive") };
        serviceIndex = serviceIndex + 1;
      }

      // Have to reset to 1 since for React, user can try extensive, set the variables and then go back to confirmatory for submission.
      // however, prior to submission we won't reset to 1 during when they go back to confirmatory so the values are "remembered" in the session if they go back and forth with extensive.
      if ((this.state.CYscope === "CYC") && (this.state.TDscope === "TDC") && (this.state.ITscope === "ITC")) {
        thesisValues = {
          ACQG: 1,
          ORGG: 1,
          SCAL: 1,
          INTP: 1,
          DEBT: 1,
          XIPO: 1,
          XSTR: 1,
          X2ND: 1,
          XLIQ: 1
        }
      } else {
        thesisValues = {
          ACQG: this.state.sliderAcquisitiveGrowthValue,
          ORGG: this.state.sliderOrganicGrowthValue,
          SCAL: this.state.sliderScalabilityValue,
          INTP: this.state.sliderIPValue,
          DEBT: this.state.sliderTechDebtValue,
          XIPO: this.state.sliderExitIPOValue,
          XSTR: this.state.sliderExitStrategicValue,
          X2ND: this.state.sliderExitSecondaryValue,
          XLIQ: this.state.sliderExitLiquidationValue
        }
      }

      let payLoad = {
        headers: {
          Authorization: this.props.jwt
        },
        body: {
          ProjectName: this.state.projectName,
          SystemName: this.state.systemName,
          ClientID: this.props.ClientID,
          Scope: serviceArray,
          Thesis: thesisValues,
          RequestDeliveryDT: "" + (this.state.requestCompletionBy.getMonth() + 1) + "/" + this.state.requestCompletionBy.getDate() + "/" + this.state.requestCompletionBy.getFullYear(),
          targetUsr: this.state.primaryEmail,
          PONumber: this.state.PONumber,
          PaymentReceipt: {
            "PaymentType": receipt === null ? "Invoice" : "PayPal",
            "Receipt": receipt === null ? invoice : receipt
          }
        }
      }
      //console.log(payLoad);
      //console.log("calling out to pay");
      // CRITICAL NOTE: PUT NOT POST FOR THIS SHARED PATH API WITH 2 METHODS
      this.setState({ pCheckOut: true }, () => { 
        API.put('createclientproject', '/', payLoad).then(response => {
          this.setState({ pCheckOut: false });
          if (response.statusCode === 200) {
            this.setState({ debounceSubmit: new Date() });
            this.setState({ ptncAgree: false });
            window.location.reload();
          } else {
            // Create failed: show user to contact support
            alert("Error " + response.statusCode + ": An error occured and the new project request failed. Details:" + JSON.stringify(response.body));
          }
        }).catch(error => {
          if (error.message.includes("401")) {
            console.log(error)
            //signOut();
          } else {
            console.log(error)
          }
          window.location.reload();
        });
      });
    }
  }


  handleRequestInvoice() {
      this.CreateProjectFromPayment(null, (this.state.totalDue - this.state.discountTotal));
  }

  handleGoBack() {
    this.props.changeView("Home", null);
  }

  handlePTC = (e) => {
    if (!this.state.ptncAgree) {
      this.setState({ ptncAgree: !this.state.ptncAgree });
    }
    this.scrollToRef(this.step4);
  };

  handleOnFocus = index => event => {
    var newEmails = this.state.tEmail.slice(); // Create a shallow copy of the roles
    newEmails[index] = ''; // Set the new value
    this.setState({ tEmail: newEmails });
  };

  handleDateChange = (e, row) => {
    if (row) {
      var dateArray = row.split(" ");
      let newDate = new Date(dateArray[2], dateArray[0]-1, dateArray[1]);
      let vDateStr = dateArray[2] + " " + dateArray[0] + " " + dateArray[1];
      console.log(vDateStr);
      this.setState({ requestCompletionBy: newDate, requestCompletionByValue: vDateStr });
      this.setState({ dateIsValid: (newDate <= this.state.maxDate)})
    }
  };

  scrollToRef(aRef) {
    if (aRef.current) {
      aRef.current.scrollIntoView({ 
        block: "start",
        behavior: "smooth"
      });
      this.setState({scrolledOnce: true})
    }
  }

  handleChangeScope = event => {
    console.log(event);
    console.log(event.target);
    console.log(event.target.value);
    if (event.target.value.substring(0,2) === "CY") {
      this.setState({ CYscope: event.target.value });
      this.handleDiscount(this.state.checkedCyber, event.target.value, this.state.checkedTech, this.state.TDscope, this.state.checkedITBO, this.state.ITscope)
    } else if (event.target.value.substring(0,2) === "TD") {
      this.setState({ TDscope: event.target.value });
      this.handleDiscount(this.state.checkedCyber, this.state.CYscope, this.state.checkedTech, event.target.value, this.state.checkedITBO, this.state.ITscope)
    } else if (event.target.value.substring(0,2) === "IT") {
      this.setState({ ITscope: event.target.value });
      this.handleDiscount(this.state.checkedCyber, this.state.CYscope, this.state.checkedTech, this.state.TDscope, this.state.checkedITBO, event.target.value)
    }

    if (this.state.scrolledOnce === false) {
      if (event.target.value.substring(2,3) === 'E') {
        this.scrollToRef(this.step2);
      }
    }
  }

  handleChangePaymentType = event => {
    if (event.target.value !== this.state.paymentType) {
      this.setState({ paymentType: event.target.value });
    }
  }


  // newScope is true if Extensive selected  but state may not yet have flipped due to React nature
  handleDiscount(cy, cys, td, tds, it, its) {
      var tot = 0;
      var serviceCount = 0
      var discount = 0

      if (cy) {
        serviceCount += 1;
        tot += (cys === "CYC") ? ADCache.CYCprice : ADCache.CYEprice
      }
      if (td) {
        serviceCount += 1;
        tot += (tds === "TDC") ? ADCache.TDCprice : ADCache.TDEprice
      }
      if (it) {
        serviceCount += 1;
        tot += (its === "ITC") ? ADCache.ITCprice : ADCache.ITEprice
      }

      if (ADCache.DiscountBETA !== null) {
        discount += ADCache.DiscountBETA * tot / 100;
      }
      if ((ADCache.Discount2X !== null) && (serviceCount === 2)) {
        discount += ADCache.Discount2X * tot / 100;
      }
      if ((ADCache.Discount2X !== null) && (serviceCount === 3)) {
        discount += ADCache.Discount3X * tot / 100;
      }
      this.setState({ totalDue: tot, discountTotal: discount, countSelectedServices: serviceCount });
      //console.log(this.state.checkedCyber);
      //console.log(tot);
      //console.log(serviceCount);
    return;
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  handleChangeCheck = event => {
    if (event.target.name === "checkedCyber") {
      this.setState({ checkedCyber: event.target.checked });
      this.setState({countSelectedServices: (event.target.checked===true ? 1 : 0) + (this.state.checkedTech === true ? 1 : 0) + (this.state.checkedITBO === true ? 1 : 0)});
      this.handleDiscount(event.target.checked, this.state.CYscope, this.state.checkedTech, this.state.TDscope, this.state.checkedITBO, this.state.ITscope );
      this.scrollToRef(this.step3);
      return;
    }
    if (event.target.name === "checkedTech") {
      this.setState({ checkedTech: event.target.checked });
      this.setState({countSelectedServices: (event.target.checked===true ? 1 : 0) + (this.state.checkedITBO === true ? 1 : 0) + (this.state.checkedCyber === true ? 1 : 0)});
      this.handleDiscount(this.state.checkedCyber, this.state.CYscope, event.target.checked, this.state.TDscope, this.state.checkedITBO, this.state.ITscope );
      this.scrollToRef(this.step3);
      return;
    }
    if (event.target.name === "checkedITBO") {
      this.setState({ checkedITBO: event.target.checked });
      this.setState({countSelectedServices: (event.target.checked===true ? 1 : 0) + (this.state.checkedTech === true ? 1 : 0) + (this.state.checkedCyber === true ? 1 : 0)});
      this.handleDiscount(this.state.checkedCyber, this.state.CYscope, this.state.checkedTech, this.state.TDscope, event.target.checked, this.state.ITscope );
      this.scrollToRef(this.step3);
      return;
    }

    if (event.target.name === "checkedAcquisitiveGrowth") { this.setState({ checkedAcquisitiveGrowth: event.target.checked }); if (!event.target.checked) this.setState({ sliderAcquisitiveGrowthValue: 1 }); return; }
    if (event.target.name === "checkedOrganicGrowth") { this.setState({ checkedOrganicGrowth: event.target.checked }); if (!event.target.checked) this.setState({ sliderOrganicGrowthValue: 1 }); return; }
    if (event.target.name === "checkedScalability") { this.setState({ checkedScalability: event.target.checked }); if (!event.target.checked) this.setState({ sliderScalabilityValue: 1 }); return; }
    if (event.target.name === "checkedIP") { this.setState({ checkedIP: event.target.checked }); if (!event.target.checked) this.setState({ sliderIPValue: 1 }); return; }
    if (event.target.name === "checkedTechDebt") { this.setState({ checkedTechDebt: event.target.checked }); if (!event.target.checked) this.setState({ sliderTechDebtValue: 1 }); return; }
    if (event.target.name === "checkedExitIPO") { this.setState({ checkedExitIPO: event.target.checked }); if (!event.target.checked) this.setState({ sliderExitIPOValue: 1 }); return; }
    if (event.target.name === "checkedExitStrategic") { this.setState({ checkedExitStrategic: event.target.checked }); if (!event.target.checked) this.setState({ sliderExitStrategicValue: 1 }); return; }
    if (event.target.name === "checkedExitSecondary") { this.setState({ checkedExitSecondary: event.target.checked }); if (!event.target.checked) this.setState({ sliderExitSecondaryValue: 1 }); return; }
    if (event.target.name === "checkedExitLiquidation") { this.setState({ checkedExitLiquidation: event.target.checked }); if (!event.target.checked) this.setState({ sliderExitLiquidationValue: 1 }); return; }
  }

  handleChangeSlider = name => (event, newValue) => {
    if (name === "sliderAcquisitiveGrowth") { this.setState({ sliderAcquisitiveGrowthValue: newValue }); return; }
    if (name === "sliderOrganicGrowth") { this.setState({ sliderOrganicGrowthValue: newValue }); return; }
    if (name === "sliderScalability") { this.setState({ sliderScalabilityValue: newValue }); return; }
    if (name === "sliderIP") { this.setState({ sliderIPValue: newValue }); return; }
    if (name === "sliderTechDebt") { this.setState({ sliderTechDebtValue: newValue }); return; }
    if (name === "sliderExitIPO") { this.setState({ sliderExitIPOValue: newValue }); return; }
    if (name === "sliderExitStrategic") { this.setState({ sliderExitStrategicValue: newValue }); return; }
    if (name === "sliderExitSecondary") { this.setState({ sliderExitSecondaryValue: newValue }); return; }
    if (name === "sliderExitLiquidation") { this.setState({ sliderExitLiquidationValue: newValue }); return; }
  }

  sliderValueText(value) {
    if (value === 1) return "N/A";
    if (value === 2) return "Low";
    if (value === 3) return "Moderate";
    if (value === 4) return "High";
    if (value === 5) return "Critical";
  }

  addDays(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleChange = event => {
    var outString = "";
    if (event.target.value !== "") {
      // outString = event.target.value.replace(/[`~!@#$%^&*()|+=?;'",<>\{\}\[\]\\\/]/gi, '');
      outString = event.target.value.replace(/[`~!@#$%^&*()|+=?;'",<>{}[\]\\/]/gi, '');
    }

    if (event.target.name === "projectName") {
      if (event.target.value !== "") {
        this.setState({ projectName: outString, projectNameIsValid: true });
        if (this.state.primaryEmailIsValid) {
          this.scrollToRef(this.step4);
        }
      } else {
        this.setState({ projectName: event.target.value, projectNameIsValid: false });
      }
    } else if (event.target.name === "systemName") {
      if (event.target.value !== "") {
        this.setState({ systemName: outString });
      } else
        this.setState({ systemName: event.target.value });

    } else if (event.target.name === "primaryEmail") {
      this.setState({ primaryEmail: event.target.value });
      if (validEmailRegex.test(event.target.value)) {
        let emailDomain = regexDomainPattern.exec(event.target.value);
        let userDomain = regexDomainPattern.exec(this.props.usrEmail);
        let entryValid = !(bldom.includes(emailDomain[1]) || (emailDomain === userDomain) || emailDomain[1].endsWith(".cn") || emailDomain[1].endsWith(".ru") || emailDomain[1].endsWith(".ir"))
        this.setState({ primaryEmailIsValid: entryValid });
        if ((this.state.projectNameIsValid) && entryValid) {
          this.scrollToRef(this.step4);
        }
      } else {
        this.setState({ primaryEmailIsValid: false });
      }

    } else if (event.target.name === "PONumber") {
      this.setState({ PONumber: event.target.value });
    }
  };

  componentDidMount() {
    let vDate = this.addDays(7);
    let vDateStr = "" + vDate.getFullYear() + " " + (vDate.getMonth() + 1) + " " + vDate.getDate();
    this.setState({ maxDate: this.addDays(30), requestCompletionBy: vDate, requestCompletionByValue: vDateStr });

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
        this.setState({ servicePricingData: response.body });
        console.log(response.body);
      } else {
        // Create failed: show user to contact support
        alert("Error " + response.statusCode + ": An error occured getting current pricing:" + JSON.stringify(response.body));
        this.setState({ servicePricingData: null });
      }
    }).catch(error => {
        console.log(error)
    });
    
    document.body.style.backgroundColor = "#000008"
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = "#000"
  }

  //componentDidUpdate(prevProps, prevState) {
  //  Object.entries(this.props).forEach(([key, val]) =>
  //    prevProps[key] !== val && console.log(`Prop '${key}' changed`)
  //  );
  //  if (this.state) {
  //    Object.entries(this.state).forEach(([key, val]) =>
  //      prevState[key] !== val && console.log(`State '${key}' changed`)
  //    );
  //  }
  //}

  render() {
    //const GreenFormControlLabel = styled(FormControlLabel)({
    //  color: '#ffffff',
    //  fontFamily: "HelveticaNeue-CondensedBold"
    //});
    //const GreenRadio = styled(Radio)({
    //  root: {
    //      color: '#777777',
    //      '&$checked': {
    //          color: '#ffffff',
    //      },
    //  },
    //  checked: {},
    //});

    if (this.props.ClientStatus === "ACT") {
      if (!this.state.pCheckOut) {
        return (
          <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
            <Grid container spacing={2} direction="column" justify="center" alignItems="stretch" alignContent="center">
              {(ADCache.DiscountBETA !== null) ?
                <Grid item sm={10}>
                  <div className="ad-dim-bkground">
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Start New Assessment / Diligence:</h4>
                    <div className="ad-paper-warning-background ad-margin-t-10">
                      <h4 className="ad-color-dkblue ad-padding-lr-15">BETA RELEASE:</h4>
                      <p className="ad-color-dkblue ad-padding-lr-15">
                        We are working hard to provide the final production release of our highly-automated due diligence services. 
                        Given the complexities for our processing logic, we are working through additional supervised training
                        rounds to offer the best possible deliverables. If you have any urgent needs not yet released, 
                        please contact one of our diligence subject matter experts at support@accudiligence.com or chat with us below.
                      </p>
                    </div>
                  </div>
                </Grid>
              : null
              }
              <Grid item sm={10}>
                <div className="ad-dim-bkground">
                  <h4 className="ad-align-left ad-border-b-gold ad-color-white">Step 1: Select Assessment Type and Scope</h4>
                  <div className="ad-fullwidth">
                    <Grid container spacing={1} justify="center" alignItems="center">

                      {/*Cybersecurity Type and Scope */}
                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.CYCenabled || ADCache.CYEenabled) ? white : '#999999'}}>Cybersecurity Assessment</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedCyber}
                              onChange={this.handleChangeCheck}
                              name="checkedCyber"
                              style={{color:(ADCache.CYCenabled || ADCache.CYEenabled) ? white : '#000008'}}
                              disabled={!(ADCache.CYCenabled || ADCache.CYEenabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30">
                          <RadioGroup aria-label="" name="CyberScope" value={this.state.CYscope} onChange={this.handleChangeScope}>
                            <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="CYC" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedCyber ? (ADCache.CYCenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedCyber ? (ADCache.CYCenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedCyber && ADCache.CYCenabled)} 
                                  label={<div style={{color: (this.state.checkedCyber && ADCache.CYCenabled) ? white : "#999999"}}>Confirmatory<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.CYCprice)}</span></div>}
                                />
                                <p className={(this.state.checkedCyber && ADCache.CYCenabled && (this.state.CYscope === "CYC")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Fast. Low Cost.<br/>
                                      Critical Red Flags. No Data Room review.
                                </p>
                                <ul className={(this.state.checkedCyber && ADCache.CYCenabled && (this.state.CYscope !== null)) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                  <li className="body-small">Modeling &amp; Designs</li>
                                  <li className="body-small">Architecture &amp; Controls</li>
                                  <li className="body-small">DevOps, Policies &amp; Compliance</li>
                                  <li className="body-small">Security Organization</li>
                              </ul>
                              </Grid>
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="CYE" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedCyber ? (ADCache.CYEenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedCyber ? (ADCache.CYEenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedCyber && ADCache.CYEenabled)} 
                                  label={<div style={{color: (this.state.checkedCyber && ADCache.CYEenabled) ? white : "#999999"}}>Extensive<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.CYEprice)}</span></div>}
                                />
                                <p className={(this.state.checkedCyber && ADCache.CYEenabled && (this.state.CYscope === "CYE")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Broad. Deep. Cost Effective.<br/>
                                      Detailed Findings and Recommendations.<br />
                                </p>
                                  <ul className={(this.state.checkedCyber && ADCache.CYEenabled && (this.state.CYscope === "CYE")) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                    <li className="body-small">All Confirmatory Areas, Plus:</li>
                                    <li className="body-small">Budget &amp; Spend</li>
                                    <li className="body-small">Includes Data Room Review</li>
                                    <li className="body-small">Deliverables Readout Meeting</li>
                                  </ul>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </div>
                      </Grid>

                      {/*Product Technology Type and Scope */}
                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.TDCenabled || ADCache.TDEenabled) ? white : '#999999'}}>Product Technology Diligence {!(ADCache.TDCenabled && ADCache.TDEenabled) ? <span>(Available Soon)</span> : null}</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedTech}
                              onChange={this.handleChangeCheck}
                              name="checkedTech"
                              style={{color:(ADCache.TDCenabled || ADCache.TDEenabled) ? white : '#000008'}}
                              disabled={!(ADCache.TDCenabled || ADCache.TDEenabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30">
                          <RadioGroup aria-label="" name="TechScope" value={this.state.TDscope} onChange={this.handleChangeScope}>
                            <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="TDC" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedTech ? (ADCache.TDCenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedTech ? (ADCache.TDCenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedTech && ADCache.TDCenabled)} 
                                  label={<div style={{color: (this.state.checkedTech && ADCache.TDCenabled) ? white : "#999999"}}>Confirmatory<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.TDCprice)}</span></div>}
                                />
                                <p className={(this.state.checkedTech && ADCache.TDCenabled && (this.state.TDscope === "TDC")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Fast. Low Cost.<br/>
                                      Critical Red Flags. No Data Room review.
                                </p>
                                <ul className={(this.state.checkedTech && ADCache.TDCenabled && (this.state.TDscope !== null)) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                  <li className="body-small ad-color-disabled">Product Technology Architecture</li>
                                  <li className="body-small ad-color-disabled">Deployment Infrastructure</li>
                                  <li className="body-small ad-color-disabled">Development Operations</li>
                                  <li className="body-small ad-color-disabled">R&amp;D Organization</li>
                                </ul>
                              </Grid>
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="TDE" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedTech ? (ADCache.TDEenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedTech ? (ADCache.TDEenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedTech && ADCache.TDEenabled)} 
                                  label={<div style={{color: (this.state.checkedTech && ADCache.TDEenabled) ? white : "#999999"}}>Extensive<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.TDEprice)}</span></div>}
                                />
                                <p className={(this.state.checkedTech && ADCache.TDEenabled && (this.state.TDscope === "TDE")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Broad. Deep. Cost Effective.<br/>
                                      Detailed Findings and Recommendations.<br />
                                </p>
                                  <ul className={(this.state.checkedTech && ADCache.TDEenabled && (this.state.TDscope === "TDE")) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                    <li className="body-small">All Confirmatory Areas, Plus:</li>
                                    <li className="body-small">R&amp;D Budget &amp; Spend</li>
                                    <li className="body-small">Includes Data Room Review</li>
                                    <li className="body-small">Deliverables Readout Meeting</li>
                                  </ul>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </div>
                      </Grid>
                      {/* END Product Technology Assessment Type and Scope */}

                      {/* IT Back Office Type and Scope */}
                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.ITCenabled || ADCache.ITEenabled) ? white : '#999999'}}>IT Back Office Diligence {!(ADCache.ITCenabled && ADCache.ITEenabled) ? <span>(Available Soon)</span> : null}</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedITBO}
                              onChange={this.handleChangeCheck}
                              name="checkedITBO"
                              style={{color:(ADCache.ITCenabled || ADCache.ITEenabled) ? white : '#000008'}}
                              disabled={!(ADCache.ITCenabled || ADCache.ITEenabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30">
                          <RadioGroup aria-label="" name="ITBOScope" value={this.state.ITscope} onChange={this.handleChangeScope}>
                            <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-start">
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="ITC" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedITBO ? (ADCache.ITCenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedITBO ? (ADCache.ITCenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedITBO && ADCache.ITCenabled)} 
                                  label={<div style={{color: (this.state.checkedITBO && ADCache.ITCenabled) ? white : "#999999"}}>Confirmatory<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.ITCprice)}</span></div>}
                                />
                                <p className={(this.state.checkedITBO && ADCache.ITCenabled && (this.state.ITscope === "ITC")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Fast. Low Cost.<br/>
                                      Critical Red Flags. No Data Room review.
                                </p>
                                <ul className={(this.state.checkedITBO && ADCache.ITCenabled && (this.state.ITscope !== null)) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                  <li className="body-small ad-color-disabled">IT Systems &amp; Applications</li>
                                  <li className="body-small ad-color-disabled">IT Infrastructure</li>
                                  <li className="body-small ad-color-disabled">IT Operations</li>
                                  <li className="body-small ad-color-disabled">IT Organization</li>
                                </ul>
                              </Grid>
                              <Grid item sm={6}>
                                <FormControlLabel 
                                  value="ITE" 
                                  control={
                                    <Radio 
                                      disableRipple 
                                      style={{
                                        borderColor: (this.state.checkedITBO ? (ADCache.ITEenabled ? white : '#999999') : '#000008'),
                                        color: (this.state.checkedITBO ? (ADCache.ITEenabled ? white : '#999999') : '#000008')
                                      }} 
                                    />
                                  } 
                                  disabled={!(this.state.checkedITBO && ADCache.ITEenabled)} 
                                  label={<div style={{color: (this.state.checkedITBO && ADCache.ITEenabled) ? white : "#999999"}}>Extensive<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.ITEprice)}</span></div>}
                                />
                                <p className={(this.state.checkedITBO && ADCache.ITEenabled && (this.state.ITscope === "ITE")) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                                      Broad. Deep. Cost Effective.<br/>
                                      Detailed Findings and Recommendations.<br />
                                </p>
                                  <ul className={(this.state.checkedITBO && ADCache.ITEenabled && (this.state.ITscope === "TDE")) ? "ad-radio-help ad-color-white" : "ad-radio-help ad-color-disabled"}>
                                    <li className="body-small">All Confirmatory Areas, Plus:</li>
                                    <li className="body-small">IT Budget &amp; Spend</li>
                                    <li className="body-small">Includes Data Room Review</li>
                                    <li className="body-small">Deliverables Readout Meeting</li>
                                  </ul>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </div>
                      </Grid>
                      {/* END IT BACK OFFICE Diligence Type and Scope */}

                      {/* Add-Ons: Automated Code Scans */}
                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.STOpenSourceEnabled ? white : '#999999')}}>Add-On: Open Source Scan{!(ADCache.STOpenSourceEnabled) ? <span>(Available Soon)</span> : null}</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedSTOS}
                              onChange={this.handleChangeCheck}
                              name="checkedSTOS"
                              style={{color:(ADCache.STOpenSourceEnabled ? white : '#000008')}}
                              disabled={!(ADCache.STOpenSourceEnabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30 ad-fullwidth">
                          <div style={{paddingBottom: 15, color: (this.state.checkedSTOS ? white : "#999999")}}>
                            Integrated Quantitative Analysis<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.STOSprice)}</span>
                          </div>
                          <p className={(this.state.checkedSTOS && ADCache.STOpenSourceEnabled) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                            Perform a formal, quantitative Open Source License Audit and Risk Assessment code scan as a part of the overall diligence project.
                            Scans complete automatically and integrated into the interviewing and reporting logic for a fixed price compared to the legacy approach that
                            can cost hundreds of thousands more and require multiple days or weeks to complete.
                          </p>
                        </div>
                      </Grid>

                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.STSecuredCodingEnabled ? white : '#999999')}}>Add-On: Secured Coding Practices{!(ADCache.STSecuredCodingEnabled) ? <span>(Available Soon)</span> : null}</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedSTSC}
                              onChange={this.handleChangeCheck}
                              name="checkedSTSC"
                              style={{color:(ADCache.STSecuredCodingEnabled ? white : '#000008')}}
                              disabled={!(ADCache.STSecuredCodingEnabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30 ad-fullwidth">
                          <div style={{paddingBottom: 15, color: (this.state.checkedSTSC ? white : "#999999")}}>
                            Integrated Quantitative Analysis<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.STSCprice)}</span>
                          </div>
                          <p className={(this.state.checkedSTSC && ADCache.STSecuredCodingEnabled) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                            Perform a formal, quantitative Secured Coding Pracices Risk Assessment code scan as a part of the overall diligence project.
                            Scans complete automatically and integrated into the interviewing and reporting logic for a fixed price. 
                            Our systems integrate seamlessly into a single comprehensive experience, from flagging quantitative data points to injecting key questions
                            into the interview process to summarizing the findings in the executive summary.
                          </p>
                        </div>
                      </Grid>

                      <Grid item sm={12} className="ad-border-faded">
                        <FormControlLabel label={<div style={{color:(ADCache.STCodeQualEnabled ? white : '#999999')}}>Add-On: Code Quality Scan{!(ADCache.STCodeQualEnabled) ? <span>(Available Soon)</span> : null}</div>}
                          control={
                            <Checkbox
                              checked={this.state.checkedSTCQ}
                              onChange={this.handleChangeCheck}
                              name="checkedSTOS"
                              style={{color:(ADCache.STCodeQualEnabled ? white : '#000008')}}
                              disabled={!(ADCache.STCodeQualEnabled)}
                            />
                          }
                        />
                        <div className="ad-padding-l-30 ad-fullwidth">
                          <div style={{paddingBottom: 15, color: (this.state.checkedSTCQ ? white : "#999999")}}>
                            Integrated Quantitative Analysis<span className="ad-padding-l-50">${this.numberWithCommas(ADCache.STCQprice)}</span>
                          </div>
                          <p className={(this.state.checkedSTCQ && ADCache.STCodeQualEnabled) ? "body-small ad-radio-help ad-color-white" : "body-small ad-radio-help ad-color-disabled"}>
                            Perform a formal, quantitative Code Quality Risk Assessment code scan as a part of the overall diligence project.
                            Automated scan completed automatically and integrated into the interviewing and reporting logic for a fixed price. 
                            Our systems integrate seamlessly into a single simple experience, from flagging quantitative data points to injecting key questions
                            into the interview process to summarizing the findings in the executive summary.
                          </p>
                        </div>
                      </Grid>

                    </Grid>
                  </div>
                </div>
              </Grid>
              {/* END STEP 1 GRID sm=10 */}

                <Grid item sm={10}>
                  <div className="ad-dim-bkground" ref={this.step2}>
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Step 2: Apply Investment Thesis Priorities</h4>
                    <Grid container spacing={1} direction="column" justify="flex-start" alignItems="flex-start">
                      <Grid item sm={12} className="ad-fullwidth ad-border-faded">
                          {((this.state.checkedCyber && (this.state.CYscope === 'CYE')) ||
                            (this.state.checkedTech  && (this.state.TDscope === 'TDE')) ||
                            (this.state.checkedITBO  && (this.state.ITscope === 'ITE')))
                            ?
                              <div>
                                <div className="ad-padding-l-15 ad-padding-tb-15 ad-color-white">
                                  Please enable and configure the investment objectives below to align with your investment
                                  thesis. The settings will adjust interview flows and final scoring calculations.
                                </div>
                                <div className="ad-fullwidth ad-align-center">
                                  <table align="center" className="nopadding">
                                    <thead>
                                      <tr>
                                        <th><h5 className="ad-color-white">Investment Objectives</h5></th>
                                        <th className="body2 semi-bold ad-color-white">Criticality</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Acquisitive Growth</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedAcquisitiveGrowth}
                                                onChange={this.handleChangeCheck}
                                                name="checkedAcquisitiveGrowth"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderAcquisitiveGrowthValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderAcquisitiveGrowth")}
                                            onChangeCommitted={this.handleChangeSlider("sliderAcquisitiveGrowth")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedAcquisitiveGrowth}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderAcquisitiveGrowthValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderAcquisitiveGrowthValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Organic Growth</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedOrganicGrowth}
                                                onChange={this.handleChangeCheck}
                                                name="checkedOrganicGrowth"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderOrganicGrowthValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderOrganicGrowth")}
                                            onChangeCommitted={this.handleChangeSlider("sliderOrganicGrowth")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedOrganicGrowth}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderOrganicGrowthValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderOrganicGrowthValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Scalability</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedScalability}
                                                onChange={this.handleChangeCheck}
                                                name="checkedScalability"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderScalabilityValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderScalability")}
                                            onChangeCommitted={this.handleChangeSlider("sliderScalability")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedScalability}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderScalabilityValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderScalabilityValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Intellectual Properties</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedIP}
                                                onChange={this.handleChangeCheck}
                                                name="checkedIP"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderIPValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderIP")}
                                            onChangeCommitted={this.handleChangeSlider("sliderIP")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedIP}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderIPValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderIPValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Minimal Technical Debt</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedTechDebt}
                                                onChange={this.handleChangeCheck}
                                                name="checkedTechDebt"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderTechDebtValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderTechDebt")}
                                            onChangeCommitted={this.handleChangeSlider("sliderTechDebt")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedTechDebt}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderTechDebtValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderTechDebtValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Exit: IPO</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedExitIPO}
                                                onChange={this.handleChangeCheck}
                                                name="checkedExitIPO"
                                                style={{color:white}}
                                              />
                                            }
                                          />&nbsp;
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderExitIPOValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderExitIPO")}
                                            onChangeCommitted={this.handleChangeSlider("sliderExitIPO")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedExitIPO}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderExitIPOValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderExitIPOValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Exit: Strategic</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedExitStrategic}
                                                onChange={this.handleChangeCheck}
                                                name="checkedExitStrategic"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderExitStrategicValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderExitStrategic")}
                                            onChangeCommitted={this.handleChangeSlider("sliderExitStrategic")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedExitStrategic}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderExitStrategicValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderExitStrategicValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Exit: Secondary</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedExitSecondary}
                                                onChange={this.handleChangeCheck}
                                                name="checkedExitSecondary"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderExitSecondaryValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderExitSecondary")}
                                            onChangeCommitted={this.handleChangeSlider("sliderExitSecondary")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedExitSecondary}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderExitSecondaryValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderExitSecondaryValue)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-nowrap body-small semi-bold" align="left">
                                          <FormControlLabel label={<span className="ad-color-white">Exit: Liquidation</span>} labelPlacement="end"
                                            control={
                                              <Checkbox
                                                checked={this.state.checkedExitLiquidation}
                                                onChange={this.handleChangeCheck}
                                                name="checkedExitLiquidation"
                                                style={{color:white}}
                                              />
                                            }
                                          />
                                        </td>
                                        <td width="67%" className="ad-padding-lr-15">
                                          <Slider
                                            defaultValue={1}
                                            value={this.state.sliderExitLiquidationValue}
                                            getAriaValueText={this.sliderValueText}
                                            onChange={this.handleChangeSlider("sliderExitLiquidation")}
                                            onChangeCommitted={this.handleChangeSlider("sliderExitLiquidation")}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="off"
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}
                                            disabled={!this.state.checkedExitLiquidation}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="ad-lineheightcompress ad-align-center body-small"></td>
                                        <td className="ad-lineheightcompress ad-align-center body-small ad-color-disabled">
                                          {this.sliderValueText(this.state.sliderExitLiquidationValue) === "N/A" ? "" : this.sliderValueText(this.state.sliderExitLiquidationValue)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            :
                              <div>
                                <div className="ad-padding-l-15 ad-padding-tb-15 ad-color-disabled ad-fullwidth">
                                  Configuration of Investment Thesis Priorities is not available for the Confirmatory Assessment Scope.
                                </div>
                              </div>
                          }
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item sm={10}>
                  <div className="ad-dim-bkground">
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white" ref={this.step3}>Step 3: Project Details</h4>
                      {((this.state.checkedCyber && (this.state.CYscope !== null)) || 
                        (this.state.checkedTech  && (this.state.TDscope !== null)) || 
                        (this.state.checkedITBO && (this.state.ITscope !== null)))
                      ?
                        <div className="ad-fullwidth ad-align-center">
                          <Grid container spacing={1} direction="column" justify="center" alignItems="flex-start">
                            <Grid item sm={12}  className="ad-fullwidth ad-border-faded">
                              <div className="ad-fullheight ad-padding-l-15 ad-padding-t-20">
                                  <form className="StartProjectForm" noValidate autoComplete="off">
                                    <TextField required
                                      id="projectName"
                                      name="projectName"
                                      label={<span className="ad-color-white">Project Name</span>}
                                      helperText={<span className="ad-color-disabled">{!this.state.projectNameIsValid ? "Required. Unique Project Names will help when viewing invoices and dashboards as Target/Seller entity names will not be saved." : "Valid."}</span>}
                                      value={this.state.projectName}
                                      error={!this.state.projectNameIsValid}
                                      onChange={this.handleChange}
                                      InputProps={{style: {color: white}}}
                                      style={{ width: "70%", marginRight: 20, marginBottom: 20, backgroundColor: '#222' }}
                                    />
                                    <TextField
                                      id="systemName"
                                      name="systemName"
                                      label={<span className="ad-color-white">System Name</span>}
                                      helperText={<span className="ad-color-disabled">Optional. Scope includes 1 major platform or system per AccuDiligence project. Anonymize the System Name if needed. This is used to distinguish multiple projects (i.e., one for each major platform or system) at the same Target.</span>}
                                      value={this.state.systemName}
                                      onChange={this.handleChange}
                                      InputProps={{style: {color: white}}}
                                      style={{ width: "70%", marginRight: 20, marginBottom: 20, backgroundColor: '#222' }}
                                    />
                                    <TextField required
                                      id="primaryEmail"
                                      name="primaryEmail"
                                      label={<span className="ad-color-white">Primary Contact/Owner Target Email</span>}
                                      helperText={<span className="ad-color-disabled">{!this.state.primaryEmailIsValid ? "Required. TARGET's / SELLER's primary contact email able to answer diligence evidence requests. An email invitation will be sent to begin the automated interview process. This Primary Contact can designate additional contributors after accepting the project. Please ensure contact is willing and able to act as the lead for the process. No refunds are provided once interview responses are committed for security reasons. Email domain rules may apply. Contact support@accudiligence.com with any concerns." : "Valid."}</span>}
                                      value={this.state.primaryEmail}
                                      onChange={this.handleChange}
                                      error={!this.state.primaryEmailIsValid}
                                      InputProps={{style: {color: white}}}
                                      style={{ width: "70%", marginRight: 20, marginBottom: 20, backgroundColor: '#222' }}
                                    />
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                      <KeyboardDatePicker disablePast required
                                        disableToolbar
                                        varient="inline"
                                        maxDate={this.state.maxDate}
                                        maxDateMessage="Keep within 21 days"
                                        margin="normal"
                                        id="RequestCompletBy"
                                        name="RequestCompletBy"
                                        label={<span className="ad-color-white">Data Collection Completed By</span>}
                                        views={["month", "date", "year"]}
                                        format="MM DD YYYY"
                                        value={this.state.requestCompletionBy}
                                        error={this.state.requestCompletionBy > this.state.maxDate}
                                        InputProps={{style: {color: white}}}
                                        onChange={this.handleDateChange}
                                        helperText={<span className="ad-color-disabled">Required. Reports usually available within 24hrs of the Target completing interviews. This is the due date for Target to complete the interviews. Please ensure Target agrees with the deadline for completing the interview. Note, maximum days allowed is 30 days.</span>}
                                        style={{ width: "70%", marginRight: 20, marginBottom: 20, color:white, backgroundColor: '#222' }}
                                        KeyboardButtonProps={{
                                          'aria-label': 'change date',
                                        }}
                                      />
                                    </MuiPickersUtilsProvider>
                                  </form>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      :
                        <div>
                          <div className="ad-padding-l-15 ad-padding-tb-15 ad-color-disabled ad-fullwidth ad-border-faded">
                            Please select a minimum engagement type and scope to access and define project details parameters in this section.
                          </div>
                        </div>
                      }
                    </div>
                  </Grid>

                  <Grid item sm={10}>
                    <div className="ad-dim-bkground">
                      <h4 className="ad-align-left ad-border-b-gold ad-color-white">Step 4: Accept Terms &amp; Conditions of Use Below</h4>
                      <Grid container spacing={1} direction="column" justify="flex-start" alignItems="flex-start">
                        <Grid item sm={12}>
                          <div className="ad-fullwidth ad-fullheight">
                            <div className="ad-padding-tb-15">
                              <Terms />
                                {this.state.projectNameIsValid && this.state.primaryEmailIsValid && this.state.dateIsValid ?
                                  <div>
                                    <input type="checkbox" id="terms" name="terms" checked={this.state.ptncAgree} ref="ptncAgree" onChange={this.handlePTC} />
                                    <label htmlFor="terms" className={"ptncLabel " + (this.state.ptncAgree ? "" : "labelFlash")}>I  have read and agree to AccuDiligence's Purchase Terms &amp; Conditions of Use</label><br />
                                  </div>
                                : null
                                }
                              <div ref={this.step4}>&nbsp;</div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>

                  {this.state.projectNameIsValid && this.state.primaryEmailIsValid && this.state.ptncAgree && this.state.dateIsValid ?
                    <Grid item sm={10}>
                      <div className="ad-dim-bkground">
                        <h4 className="ad-align-left ad-border-b-gold ad-color-white">Step 5: Payment</h4>
                        <div className="ad-fullwidth ad-align-center">
                          <Grid container spacing={1} direction="column" justify="center" alignItems="flex-start">
                            <Grid item sm={12}  className="ad-fullwidth ad-border-faded">
                              <div className="ad-fullheight ad-padding-lr-15 ad-color-white ad-padding-t-20 ad-align-left">
                                <p>
                                  Given the SaaS approach with quick turn on project completion, AccuDiligence works on an engagement model
                                  that differs from traditional mangement consultant engagements, reducing complexity for legal
                                  agreements and eliminates the largest costs of travel and management consulting hours.
                                </p>
                                <p>
                                  We are working on maturing our invoicing and payment options, however in order to receive the
                                  final report or deliverables, full payment for options selected must first be received.
                                </p>
                                <p>
                                  With the low cost of our Confirmatory red-flags assessment for earlier engagement in a transaction,
                                  whereby the fees apply 100% towards an upgrade to the Extensive diligence near or at LOI, the spend 
                                  is much more aligned with the transaction lifecycle.
                                </p>
                                <p>
                                  Please email support@AccuDiligence.com with any payment issues or concerns.
                                </p>
                              </div>

                              <div className="ad-padding-lr-15 ad-flexv ad-fullwidth">
                                <RadioGroup aria-label="" name="Scope" value={this.state.paymentType} onChange={this.handleChangePaymentType}>
                                  <Grid container spacing={1} direction="row" justify="center" alignItems="flex-start">
                                    <Grid item sm={6}>
                                      <FormControlLabel 
                                        value="Invoice" 
                                        control={
                                          <Radio 
                                            disableRipple 
                                            disabled={this.props.acctBalance.Balance.charAt(0) === "-"}
                                            style={{
                                              borderColor: (this.state.paymentType==="Invoice" ? white : '#999999'),
                                              color: (this.state.paymentType==="Invoice" ? white : '#999999')
                                            }} 
                                          />
                                        } 
                                        label={<div style={{color: white}}>Email Invoice</div>}
                                      />
                                      <p className="body-small ad-radio-help ad-color-disabled ad-fullwidth">
                                        Email invoice and pay online by ACH, debit, or credit card.
                                      </p>
                                    </Grid>
                                    <Grid item sm={6}>
                                      <FormControlLabel 
                                        value="PayPal" 
                                        control={
                                          <Radio 
                                            disableRipple 
                                            style={{
                                              borderColor: (this.state.paymentType==="PayPal" ? white : '#999999'),
                                              color: (this.state.paymentType==="PayPal" ? white : '#999999')
                                            }} 
                                          />
                                        } 
                                        label={<div style={{color: white}}>PayPal</div>}
                                      />
                                      <p className="body-small ad-radio-help ad-color-disabled ad-fullwidth">
                                        Pay now via your PayPal account.
                                      </p>
                                    </Grid>
                                  </Grid>
                                </RadioGroup>
                              </div>

                              <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                                <Grid item xs={6}>
                                  {(this.props.acctBalance.Balance.charAt(0) === "-") ?
                                    <div className="ad-color-disabled ad-align-left ad-padding-lr-15">
                                        For security reasons, requesting an invoice payment is not allowed when there is a balance due on a prior project.
                                        Please pay the balance of that project's invoice first to be able to create a new project via invoice.
                                        PayPal card payment is available to create the new project immediately if needed.
                                    </div>
                                  :
                                    <div className="ad-padding-t-25 centerAmp">
                                      {(this.state.paymentType === "Invoice")
                                        ?
                                          <div >
                                            <TextField
                                              id="PONumber"
                                              name="PONumber"
                                              label={<span className="ad-color-white">Please enter a PO Number</span>}
                                              helperText={<span className="body-small ad-color-white">Optional. Enter a PO Number here if applicable.</span>}
                                              value={this.state.PONumber}
                                              onChange={this.handleChange}
                                              InputProps={{style: {color: white}}}
                                              style={{ width: "100%", backgroundColor: '#222' }}
                                            />
                                            <p className="body-small ad-color-disabled">
                                              Note that Target interviews and data collection starts immediately when payment is received. Please pay the
                                              invoice promptly to begin the diligence process.
                                            </p>
                                            <div align="center" className="ad-margin-t-10 ad-align-center">
                                              <div align="center" className="ovalButton ad-margin-t-5 ">
                                                <a className="ovalButtonLabel" href="#0" onClick={this.handleRequestInvoice}>Request Invoice By Email</a>
                                              </div>
                                            </div>
                                          </div>
                                        : null
                                        }
                                    </div>
                                  }
                                </Grid>
                                <Grid item xs={6} >
                                  <Grid container spacing={1} direction="row" justify="space-between" alignItems="flex-start">
                                    <Grid item xs={9}>
                                      <div align="center" className="ad-margin-t-10 ad-border-b-gold ad-flush-right">
                                        <h5 className="ad-margin-b-0 ad-color-white">Order</h5>
                                      </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <div align="right" className="ad-margin-t-10 ad-border-b-gold ad-flush-right">
                                        <h5 className="ad-margin-b-0 ad-nowrap ad-color-white">Service Fee</h5>
                                      </div>
                                    </Grid>
                                    {(this.state.checkedCyber === true) ?
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right semi-bold body-small ad-color-white">
                                            {(this.state.CYscope === "CYC") ?
                                              <span>Confirmatory</span>
                                            :
                                              <span>Extensive</span>
                                            } Cybersecurity Risk Assessment:
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-white body-small">
                                            $ {((this.state.CYscope === "CYC") ? this.numberWithCommas(ADCache.CYCprice) : this.numberWithCommas(ADCache.CYEprice))} USD
                                          </div>
                                        </Grid>
                                      </>
                                    : null }   

                                    {(this.state.checkedTech === true) ?
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right semi-bold body-small ad-color-white">
                                            {(this.state.TDscope === "TDC") ?
                                              <span>Confirmatory</span>
                                            :
                                              <span>Extensive</span>
                                            } Product Technology Diligence:
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-black body-small">
                                            $ {((this.state.TDscope === "TDC") ? this.numberWithCommas(ADCache.TDCprice) : this.numberWithCommas(ADCache.TDEprice))} USD
                                          </div>
                                        </Grid>
                                      </>
                                    : null }  

                                    {(this.state.checkedITBO === true)  ?
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right semi-bold body-small">
                                            {(this.state.TDscope === "ITC") ?
                                              <span>Confirmatory</span>
                                            :
                                              <span>Extensive</span>
                                            } IT Back Office Diligence:
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-black body-small">
                                            $ {((this.state.ITscope === "ITC") ? this.numberWithCommas(ADCache.ITCprice) : this.numberWithCommas(ADCache.ITEprice))} USD
                                          </div>
                                        </Grid>
                                      </>
                                    : null }  

                                    {(ADCache.DiscountBETA !== null) ? 
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right ad-color-white ad-margin-t-5 semi-bold body-small">
                                            BETA PHASE DISCOUNT ({ADCache.DiscountBETA}%):
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-red body-small">
                                            <b>- $ {this.numberWithCommas(ADCache.DiscountBETA * this.state.totalDue / 100.0)} USD</b>
                                          </div>
                                        </Grid>
                                      </>
                                    : null }

                                    {(this.state.countSelectedServices === 2) ? 
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right ad-color-white ad-margin-t-5 semi-bold body-small">
                                            MULTI-SERVICE (2x) DISCOUNT ({ADCache.Discount2X}%):
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-red body-small">
                                            - $ {this.numberWithCommas(ADCache.Discount2X * this.state.totalDue / 100.0)} USD
                                          </div>
                                        </Grid>
                                      </>
                                    : null }

                                    {(this.state.countSelectedServices >= 3) ? 
                                      <>
                                        <Grid item xs={9}>
                                          <div align="right" className="ad-flush-right ad-color-white ad-margin-t-5 semi-bold body-small">
                                          MULTI-SERVICE (3x) DISCOUNT ({ADCache.Discount3X}%):
                                          </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                          <div align="right" className="ad-color-red body-small">
                                            - $ {this.numberWithCommas(ADCache.Discount3X * this.state.totalDue / 100.0)} USD
                                          </div>
                                        </Grid>
                                      </>
                                    : null }

                                    <Grid item xs={9}>
                                      <div align="right" className="ad-flush-right ad-margin-t-5 semi-bold">
                                        <span className="ad-color-white"><b>Total Payment Due:</b></span>
                                      </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <div align="right" className="ad-color-white ad-margin-b-30">
                                        $ {this.formatNumber(this.state.totalDue - this.state.discountTotal)} USD
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                <Grid item xs={9}>&nbsp;</Grid>
                                <Grid item xs={3}>
                                  {(this.state.paymentType === "PayPal") ?
                                    <div align="center" className="ad-fullwidth">
                                      <div className="ad-padding-tb-15" style={{display: this.state.paymentType === 'PayPal' ? 'inherit' : 'none', width:"100%", align:'center' }}>
                                        <PayPalButton
                                          amount={this.state.totalDue - this.state.discountTotal}
                                          currency="USD"
                                          style={{
                                            layout: 'vertical',
                                            color: 'gold',
                                            shape: 'rect',
                                            label: 'pay',
                                            size: 'small',
                                            height: 30
                                          }}
                                          shippingPreference="NO_SHIPPING"
                                          onSuccess={(details, data) => {
                                            this.CreateProjectFromPayment(details, null);
                                          }}
                                          options={{
                                            clientId: "sb"
                                          }}
                                          catchError={(err) => {
                                            console.log(err);
                                            alert('Unable to process PayPal payment. Please try again or contact support@AccuDiligence.com for payment alternatives.');
                                          }}
                                        />
                                      </div>
                                    </div>
                                  : null 
                                  }
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  : null
                  }
              </Grid>
            <div className="ad-padding-b-100">&nbsp;</div>
          </div>
        );
      } else {
        return (
            <div className="ad-newuser-background appcontainer AppLoaderAnim2 AnimBorder" />
        );
      }
    } else {        
      console.log(this.props.ClientStatus);
      if (this.props.ClientStatus !== null) {
        return (
          <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
            <Grid container spacing={2} direction="column" justify="center" alignItems="stretch" alignContent="center">
              <Grid item sm={10}>
                <div className="ad-dim-bkground">
                  Your client account status [{this.props.ClientStatus}] is not active. Please contact our support team (support@accudiligence.com) for additional assistance.
                </div>
              </Grid>
            </Grid>
          </div>
        );
      } else {
        console.log("Empty");
        return (<div></div>);
      }
    }
  }
}

