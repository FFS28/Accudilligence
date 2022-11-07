//import React, { Component } from 'react';
import React from 'react';
import PropTypes from "prop-types";
//import Typography from '@material-ui/core/Typography';
//import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
//import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
//import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import Button from '@material-ui/core/Button';
//import SaveIcon from '@material-ui/icons/Save';
import './NewUserTask.css';
//import _isEqual from 'lodash/isEqual';
import { API } from 'aws-amplify';
import bldom from './bldom';
import { ADCache } from '../store/ADCache';

//const styles = theme => ({
//  formControl: {
//    margin: theme.spacing.unit,
//    minWidth: 120
//  },
//  Paper: { 
//    backgroundColor: "black"
//  },
//  MuiTextField: {
//    margin: theme.spacing(1),
//    width: '40ch',
//  }
//});

const regexPattern = new RegExp("[^@]+@(.+)$");

export default class NewUserTask extends React.Component {
  constructor(props) { 
    super(props);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNewBuyerClick = this.handleNewBuyerClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this);
    this.state = { 
      noneOrNew: "NONE",
      CoName: "",
      CoNameIsValid: true,
      CoDomain: "",
      SelTypeVal: "",
      SelTypeValIsValid: true,
      SelCountryVal: "",
      SelCountryValIsValid: true,
      Line1: "",
      Line2: "",
      Line3: "",
      City: "",
      CityIsValid: true,
      CountyProvince: "",
      CountyProvinceIsValid: true,
      ZipPostalCode: "",
      formErrors: false,
      isUsrDOMBL: true,      // Default: withhold permission
      servicePricingData: null
    }; 
  }

  setClientInfo() {
    //Submit to Server
    let payLoad = {
      headers: {
        Authorization: this.props.jwt
      },
      body: {
        CoName: this.state.CoName,
        CoType: this.state.SelTypeVal,
        CoDomain: this.state.CoDomain,
        CoCity: this.state.City,
        CoState: this.state.CountyProvince,
        CoAddrType: "M",
        CoCountry: this.state.SelCountryVal,
        CoZipPostal: this.state.ZipPostalCode,
        CoLine1: this.state.Line1,
        CoLine2: this.state.Line2,
        CoLine3: this.state.Line3
      }
    }

    API.post('setclientinfo', '/', payLoad ).then(response => {
        // NEED TO SET clientID and bubble back up to top
        if ((response !== "") && (response.statusCode === 200)) {
          console.log(response)
          this.props.updateUserRole("C", response.body.clientID, "ACT", 0);
        } else {
          console.log("Error")
          console.log(response)
        }
      }).catch(error => {
          console.log(error.response)
      });
  }

  /*
  static getDerivedStateFromProps(nextProps, prevState) 
  {
    console.log("in getDerivedStateFromProps with next: "+nextProps.usrEmail+ " and prev = " + prevState.usrEmail)
    const { aCurEmailProps } = nextProps;
    if ((aCurEmailProps !== prevState) && (nextProps !== null) && (typeof(nextProps.usrEmail) !== 'undefined'))
    {
      return {
        usrEmail: nextProps.usrEmail
      }
    } else 
      return null;
  }

  componentDidUpdate(prevProps) {
    console.log("innewusertask dd UPDATE with "+prevProps.usrEmail+ " and this.props = " + this.props.usrEmail)
    if (this.props.usrEmail !== prevProps.usrEmail) { 
      let companyDomain = regexPattern.exec(this.props.usrEmail);
      if (companyDomain) {
        this.setState({DefaultCoDomain: companyDomain[1]});
        console.log("Domain:" + companyDomain[1]);
  
        if (companyDomain[1].substr(companyDomain[1].length-3) === "com") {
          this.setState({SelCountryVal: "US"})
        }
      }
    }
  }
  */

  checkDomain() 
  {
    let companyDomain = regexPattern.exec(this.props.usrEmail);
    if (companyDomain[1] !== this.state.CoDomain) {
      this.setState({CoDomain: companyDomain[1]});

      //if (companyDomain[1].substr(companyDomain[1].length-3) === "com")
      this.setState({SelCountryVal: "USA"})

      // Check if domain is on the blacklist
      // TODO: 20201122 TJANNAK - Need to update from server list and the blacklisted domains table
      this.setState({isUsrDOMBL: bldom.includes(companyDomain[1])});
    }
  }

  componentDidMount()
  {
    //console.log("in newusertask didmount - " + this.props.usrEmail);
    if (this.props.usrEmail)
      this.checkDomain();

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
  }

  handleChange = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
    if ((event.target.name === "CoName") && (this.state.CoName !== ""))
      this.setState({CoNameIsValid: true});
    if ((event.target.name === "SelTypeVal") && (event.target.value !== ""))
      this.setState({SelTypeValIsValid: true});
    if ((event.target.name === "City") && (this.state.City !== ""))
      this.setState({CityIsValid: true});
    if ((event.target.name === "CountyProvince") && (this.state.CountyProvince !== ""))
      this.setState({CountyProvinceIsValid: true});
    if ((event.target.name === "SelCountryVal") && (event.target.value !== ""))
      this.setState({SelCountryValIsValid: true});
    //this.props.onChange && this.props.onChange(); //TMP
  };

  handleChangeCountry = event => {
    this.setState({ SelCountryVal: event.target.value });
    //this.props.onChange && this.props.onChange(); // TEMP
  };

  handleChangeCoAddr = event => { this.setState({ CoAddr: event.target.value })};

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  onSave(event) {
    event.preventDefault();
    // Validate if submission is ok
    let subOK = true;
    if (this.state.CoName === "") {
      this.setState({CoNameIsValid: false})
      subOK = false;
    } else {
      this.setState({CoNameIsValid: true})
    }
    if (this.state.SelTypeVal === "") {
      this.setState({SelTypeValIsValid: false})
      subOK = false;
    } else {
      this.setState({SelTypeValIsValid: true})
    }    
    if (this.state.City === "") {
      this.setState({CityIsValid: false})
      subOK = false;
    } else {
      this.setState({CityIsValid: true})
    }   
    if (this.state.CountyProvince === "") {
      this.setState({CountyProvinceIsValid: false})
      subOK = false;
    } else {
      this.setState({CountyProvinceIsValid: true})
    }   
      //this.state.DefaultCoDomain === "" || 
      //this.state.SelTypeVal === ""

    this.setState({formErrors: !subOK})
    if (subOK) {
      this.setClientInfo();
    }
  }

  handleNewBuyerClick(e) {
    e.preventDefault();
    this.checkDomain();
    if (this.state.noneOrNew === "NEW") {
      this.setState({noneOrNew: "NONE"}); 
    } else {
      this.setState({noneOrNew: "NEW"}); 
    }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    // Check if existing client based on email domain - LAMBDA to check blacklist domains 
    // If not on Blacklist from GetClientInfo MAKE SURE TENANT / DOMAIN RESTRICTIONS
    // TODO: Someone registering with a PE domain can't possibly have verified the email if not in the domain
    // IF PULLING THE DATA FROM THE CLIENT DB, ONLY ALLOW CHANGES TO ADDRESS OR ANYTIHNG THAT CAN REPRESENT THAT LOCALE
    // TODO: Tie preferred company address to RegUser
    const { classes } = this.props;
    if (this.state.noneOrNew === "NONE") { 
      console.log("NewUserTask - Render - 1")
      return (
        <div className="ad-newuser-background ad-padding-t-20 ad-div-center">
          <div className="ad-fullwidth-grid ad-padding-pgsection ad-div-center">
            <Grid container spacing={2} direction="row" justify="center" alignItems="center">
              <Grid item sm={8}>
                <div className="ad-fullwidth ad-margin-l-15 ad-dk-underlay">
                    <h2 className="ad-border-b-gold ad-color-white ad-headingCenter">Welcome to AccuDiligence</h2>
                    <p className="ad-color-white">
                      Thank you for registering. We are currently in our <b>beta release</b> and looking to quickly
                      become the new standard for your diligence and risk assessment needs.
                    </p>
                    <h3 className="ad-color-white">Diligence 2.0<sup className="superscript">TM</sup></h3>
                    <ul className="ad-color-white">
                      <li>
                        Simple web interface, available 24x7 - no traveling, minimized live meetings
                      </li>
                      <li>
                        Continuously growing road, &amp; deep interviews knowledge base
                      </li>
                      <li>
                        Low fixed costs via automation of the due diligence process<br/><span className="ad-color-gold">(U.S. Patent Pending)</span>
                      </li>
                    </ul>
                </div>
              </Grid>
              <Grid item sm={8}>
                <Grid container spacing={3} direction="row" justify="space-between" alignItems="flex-start">
                  <Grid item sm={6}>
                      <h2 className="ad-headingCenter ad-border-b-gold ad-color-white">Buyers / Investors:</h2>
                        <div className="ad-display-flex-h ad-margin-t-5">
                          <div className="body2 ad-color-white">
                            We just need to collect a little bit of information
                            about your company first.<br/><br/>
                            <div align="center" className="ad-align-center">
                              <div align="center" className="ovalButton ad-margin-t-5 ">
                                <a className="ovalButtonLabel" href="#0" onClick={this.handleNewBuyerClick}>START A DILIGENCE</a>
                              </div>
                            </div>
                          </div>
                        </div>
                  </Grid>
                  <Grid item sm={6}>
                      <h2 className="ad-headingCenter ad-border-b-gold ad-color-white">Sellers / Targets:</h2>
                        <div className="ad-display-flex-h ad-margin-t-5">
                          <div className="body2 ad-color-white ad-align-justify">
                            If you've been told to submit evidence for a project, 
                            your login email is not yet registered with an active project.
                            Please contact your project's sponsor to start a diligence.
                          </div>
                        </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={8}>
                  <br/>
                  <div className="ad-fullwidth ad-padding-r-30 ad-padding-b-100 ad-dk-underlay">
                      <h2 className="ad-align-left ad-padding-b-10 ad-color-white">Best Value in the Industry:</h2>
                      <table className="ad-fullwidth ad-table-compress">
                        <thead>
                          <tr>
                            <th></th>
                            <th className="ad-align-center ad-color-companygreen ad-lineHeight-compressed">                                 
                              <i className="pricing-icon icon-speedometer ad-color-white"></i>
                            </th>
                            <th className="ad-align-center ad-color-companygreen ad-lineHeight-compressed">                                 
                              <i className="pricing-icon icon-badge ad-color-white"></i>
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                            <th className="ad-lineHeight-compressed">
                                <h5 className="ad-color-white ad-align-center">Confirmatory</h5>
                                <div className="ad-price-footnote ad-color-darkorange ad-align-center">Fast. Red Flags.<br/>Low Cost.</div>
                            </th>
                            <th className="ad-lineHeight-compressed">
                                <h5 className="ad-color-white ad-align-center ad-padding-lr-10">Extensive</h5>
                                <div className="ad-price-footnote ad-color-darkorange ad-align-center">Broad. Deep.<br/>Cost Effective.</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={(ADCache.CYEenabled || ADCache.CYCEnabled) ? "ad-border-b-gold ad-priceCell-padding" : "ad-border-b-faded ad-priceCell-padding" }>
                                <h5 className={(ADCache.CYEenabled || ADCache.CYCEnabled) ? "ad-h-collapse ad-color-gold" : "ad-h-collapse ad-color-disabled"}>
                                  Cybersecurity Risk Assessment {(ADCache.DiscountBETA && (ADCache.CYEenabled || ADCache.CYCEnabled)) ? <span>(BETA)</span> : <span></span>}
                                </h5>
                            </td>
                            {ADCache.CYCenabled
                              ?
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.CYCprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom">Coming Soon</td>
                            }
                            {ADCache.CYEenabled
                              ? 
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.CYEprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom">Coming Soon</td>
                            }
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li className="ad-bullet-tight ad-color-white">Security Architecture &amp; Controls</li>
                                <li className="ad-bullet-tight ad-color-white">Network Protective Tooling</li>
                                <li className="ad-bullet-tight ad-color-white">Operations, Policies, &amp; Compliance</li>
                                <li className="ad-bullet-tight ad-color-white">Cybersecurity Organization</li>
                                <li className="ad-bullet-tight ad-color-white">Cybersecurity Budget &amp; Spend</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-border-b-gold ad-priceCell-padding" : "ad-border-b-faded ad-priceCell-padding" }>
                                <h5 className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-h-collapse ad-color-gold" : "ad-h-collapse ad-color-disabled"}>
                                  Product Technology Diligence {(ADCache.DiscountBETA && (ADCache.TDEenabled || ADCache.TDCEnabled)) ? <span>(BETA)</span> : <span></span>}
                                </h5>
                            </td>
                            {ADCache.TDCenabled
                              ?
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.TDCprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom body-small">Coming Soon</td>
                            }
                            {ADCache.TDEenabled
                              ? 
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.TDEprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom body-small">Coming Soon</td>
                            }
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Product Technology Architecture</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Deployment Infrastructure</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Development Operations</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>R&amp;D Organization</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>R&amp;D Spend</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className={(ADCache.ITEenabled || ADCache.ITCEnabled) ? "ad-border-b-gold ad-priceCell-padding" : "ad-border-b-faded ad-priceCell-padding" }>
                                <h5 className={(ADCache.ITEenabled || ADCache.ITCEnabled) ? "ad-h-collapse ad-color-gold" : "ad-h-collapse ad-color-disabled"}>
                                  IT Back Office Diligence {(ADCache.DiscountBETA && (ADCache.ITEenabled || ADCache.ITCEnabled)) ? <span>(BETA)</span> : <span></span>}
                                </h5>
                            </td>
                            {ADCache.ITCenabled
                              ?
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.ITCprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom body-small">Coming Soon</td>
                            }
                            {ADCache.ITEenabled
                              ? 
                                <td className="ad-border-b-gold ad-align-center ad-color-gold ad-valign-bottom">
                                  <h5 className="ad-h-collapse ad-color-gold">$ {this.numberWithCommas(ADCache.ITEprice)}.</h5>
                                </td>
                              :
                                <td className="ad-border-b-faded ad-align-center ad-color-disabled ad-valign-bottom body-small">Coming Soon</td>
                            }
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li className={(ADCache.ITEenabled || ADCache.ITCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Product Technology Architecture</li>
                                <li className={(ADCache.ITEenabled || ADCache.ITCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Deployment Infrastructure</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>Development Operations</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>R&amp;D Organization</li>
                                <li className={(ADCache.TDEenabled || ADCache.TDCEnabled) ? "ad-bullet-tight ad-color-white" : "ad-bullet-tight ad-color-disabled"}>R&amp;D Spend</li>
                              </ul>
                            </td>
                          </tr>
                          {ADCache.DiscountBETA
                            ?
                              <tr>
                                <td colSpan={3} className="ad-align-right body-small ad-color-white"><sup>*</sup>BETA release discounts may be available.</td>
                              </tr>
                            : null
                          }
                          {(ADCache.Discount2X || ADCache.Discount3X)
                            ?
                              <tr>
                                <td colSpan={3} className="ad-align-right body-small ad-color-white"><sup>*</sup>Multi-service discounts may be available.</td>
                              </tr>
                            : null
                          }
                        </tbody>
                      </table>
                  </div>
              </Grid>
            </Grid>
          </div>
          <br/><br/><br/>
        </div>
      )
    } else if (this.state.noneOrNew === "NEW") { 
      return (
        <React.Fragment>
          <div className="ad-fullwidth-grid ad-page-fullheight ad-padding-pgsection ad-newuser-background">
            <Grid container spacing={1} direction="row" justify="center" alignItems="flex-start">
              <Grid item sm={10}>
                {((! this.state.isUsrDOMBL)
                  ?
                    <div className="tableCenter ad-fullwidth ad-padding-tb-60">
                      <h2 className="ad-align-left ad-padding-b-10 ad-color-white">Register Your Company:</h2>
                        <p className="DirectionsHeader padLeft tableLeft ad-color-white">
                          To complete your registration as a Buyer/Investor, please enter your Company/Employer
                          information below:
                        </p>
                        <table className="ad-fullwidth-grid">
                          <tbody>
                            <tr>
                              <td width="100%" className="tableStd">
                                <table className="ad-paper-background">
                                  <tbody>
                                    <tr>
                                      <td className="tableDetails padLeft tableLeft">
                                        <form className="MainForm tableLeft" noValidate autoComplete="off">
                                          <TextField required
                                            id="CoName"
                                            name="CoName"
                                            label="Full Company Name"
                                            helperText="Required. If individual investor, please enter DBA or your full name."
                                            value={this.state.CoName}
                                            error={! this.state.CoNameIsValid}
                                            onChange={this.handleChange}
                                            style = {{ width: 518 }}
                                          />
                                          <FormControl required className="classes.formControl">
                                            <InputLabel id="CompanyTypeLabel">Type of Company</InputLabel>
                                              <Select
                                                labelId="CompanyTypeLabel"
                                                id="SelTypeVal"
                                                name="SelTypeVal"
                                                value={this.state.SelTypeVal}
                                                error={! this.state.SelTypeValIsValid}
                                                onChange={(this.handleChange)}
                                                inputProps={{ name: "SelTypeVal", id: "SelTypeVal" }}
                                                style = {{width: 518 }}
                                              >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                <MenuItem value={"AN"}>Angel Investor</MenuItem>
                                                <MenuItem value={"VC"}>Venture Capital</MenuItem>
                                                <MenuItem value={"PE"}>Private Equity</MenuItem>
                                                <MenuItem value={"CO"}>Company Performing Add-On/Tuck-In Acquisition</MenuItem>
                                                <MenuItem value={"FI"}>Financial Institutioin</MenuItem>
                                                <MenuItem value={"LG"}>Legal Representatives of Buyer</MenuItem>
                                                <MenuItem value={"IN"}>Independent Investor</MenuItem>
                                                <MenuItem value={"SE"}>Seller (Self-Assessing)</MenuItem>                    
                                                <MenuItem value={"3P"}>3rd Party Diligence Consultancy</MenuItem>
                                                <MenuItem value={"IC"}>Independent Contractor</MenuItem>
                                                <MenuItem value={"OT"}>Other</MenuItem>
                                              </Select>
                                            <FormHelperText>Required.</FormHelperText>
                                          </FormControl>
                                          <TextField
                                            id="Line1"
                                            name="Line1"
                                            label="Address Line 1"
                                            helperText="Please enter your assigned office address or the corporate headquarter's."
                                            value={this.state.Line1}
                                            onChange={this.handleChange}
                                            style = {{width: 518}}
                                          /><br />
                                          <TextField
                                            id="Line2"
                                            name="Line2"
                                            label="Address Line 2"
                                            value={this.state.Line2}
                                            onChange={this.handleChange}
                                            style = {{width: 518, marginTop:10}}
                                          /><br />
                                          <TextField
                                            id="Line3"
                                            name="Line3"
                                            label="Address Line 3"
                                            value={this.state.Line3}
                                            onChange={this.handleChange}
                                            style = {{width: 518, marginTop:10}}
                                          /><br />
                                          <TextField required
                                            id="City"
                                            name="City"
                                            label="City/SubDistrict/District"
                                            value={this.state.City}
                                            error={! this.state.CityIsValid}
                                            onChange={this.handleChange}
                                            style = {{width: 200, marginTop:10, paddingRight:10}}
                                            helperText="Required."
                                          />                                  
                                          <TextField required
                                            id="CountyProvince"
                                            name="CountyProvince"
                                            label="State/Province"
                                            value={this.state.CountyProvince}
                                            error={! this.state.CountyProvinceIsValid}
                                            onChange={this.handleChange}
                                            style = {{width: 150, marginTop:10, paddingRight:10}}
                                            helperText="Required."
                                          />
                                          <TextField
                                            id="ZipPostalCode"
                                            name="ZipPostalCode"
                                            label="Zip / Postal Code"
                                            value={this.state.ZipPostalCode}
                                            onChange={this.handleChange}
                                            style = {{width: 150, marginTop:10, paddingRight:10}}
                                          />
                                          <p className="Spacer"> </p>
                                          <FormControl required className="classes.formControl">
                                            <InputLabel id="Country">Country</InputLabel>
                                              <Select
                                                labelId="CountryLabel"
                                                id="CoCountry"
                                                name="CoCountry"
                                                value={this.state.SelCountryVal}
                                                error={! this.state.SelCountryValIsValid}
                                                onChange={(this.handleChangeCountry)}
                                                inputProps={{ name: "CoCountry", id: "CoCountry" }}
                                              >
                                                <MenuItem value="USA">(USA) United States of America</MenuItem>
                                                <MenuItem value="ABW">(ABW) Aruba</MenuItem>
                                                <MenuItem value="AFG">(AFG) Afghanistan</MenuItem>
                                                <MenuItem value="AGO">(AGO) Angola</MenuItem>
                                                <MenuItem value="AIA">(AIA) Anguilla</MenuItem>
                                                <MenuItem value="ALA">(ALA) Åland Islands</MenuItem>
                                                <MenuItem value="ALB">(ALB) Albania</MenuItem>
                                                <MenuItem value="AND">(AND) Andorra</MenuItem>
                                                <MenuItem value="ARE">(ARE) United Arab Emirates</MenuItem>
                                                <MenuItem value="ARG">(ARG) Argentina</MenuItem>
                                                <MenuItem value="ARM">(ARM) Armenia</MenuItem>
                                                <MenuItem value="ASM">(ASM) American Samoa</MenuItem>
                                                <MenuItem value="ATA">(ATA) Antarctica</MenuItem>
                                                <MenuItem value="ATF">(ATF) French Southern Territories</MenuItem>
                                                <MenuItem value="ATG">(ATG) Antigua and Barbuda</MenuItem>
                                                <MenuItem value="AUS">(AUS) Australia</MenuItem>
                                                <MenuItem value="AUT">(AUT) Austria</MenuItem>
                                                <MenuItem value="AZE">(AZE) Azerbaijan</MenuItem>
                                                <MenuItem value="BDI">(BDI) Burundi</MenuItem>
                                                <MenuItem value="BEL">(BEL) Belgium</MenuItem>
                                                <MenuItem value="BEN">(BEN) Benin</MenuItem>
                                                <MenuItem value="BES">(BES) Bonaire, Sint Eustatius and Saba</MenuItem>
                                                <MenuItem value="BFA">(BFA) Burkina Faso</MenuItem>
                                                <MenuItem value="BGD">(BGD) Bangladesh</MenuItem>
                                                <MenuItem value="BGR">(BGR) Bulgaria</MenuItem>
                                                <MenuItem value="BHR">(BHR) Bahrain</MenuItem>
                                                <MenuItem value="BHS">(BHS) Bahamas</MenuItem>
                                                <MenuItem value="BIH">(BIH) Bosnia and Herzegovina</MenuItem>
                                                <MenuItem value="BLM">(BLM) Saint Barthélemy</MenuItem>
                                                <MenuItem value="BLR">(BLR) Belarus</MenuItem>
                                                <MenuItem value="BLZ">(BLZ) Belize</MenuItem>
                                                <MenuItem value="BMU">(BMU) Bermuda</MenuItem>
                                                <MenuItem value="BOL">(BOL) Bolivia (Plurinational State of)</MenuItem>
                                                <MenuItem value="BRA">(BRA) Brazil</MenuItem>
                                                <MenuItem value="BRB">(BRB) Barbados</MenuItem>
                                                <MenuItem value="BRN">(BRN) Brunei Darussalam</MenuItem>
                                                <MenuItem value="BTN">(BTN) Bhutan</MenuItem>
                                                <MenuItem value="BVT">(BVT) Bouvet Island</MenuItem>
                                                <MenuItem value="BWA">(BWA) Botswana</MenuItem>
                                                <MenuItem value="CAF">(CAF) Central African Republic</MenuItem>
                                                <MenuItem value="CAN">(CAN) Canada</MenuItem>
                                                <MenuItem value="CCK">(CCK) Cocos (Keeling) Islands</MenuItem>
                                                <MenuItem value="CHE">(CHE) Switzerland</MenuItem>
                                                <MenuItem value="CHL">(CHL) Chile</MenuItem>
                                                <MenuItem value="CHN">(CHN) China</MenuItem>
                                                <MenuItem value="CIV">(CIV) Côte d'Ivoire</MenuItem>
                                                <MenuItem value="CMR">(CMR) Cameroon</MenuItem>
                                                <MenuItem value="COD">(COD) Congo, Democratic Republic of the</MenuItem>
                                                <MenuItem value="COG">(COG) Congo</MenuItem>
                                                <MenuItem value="COK">(COK) Cook Islands</MenuItem>
                                                <MenuItem value="COL">(COL) Colombia</MenuItem>
                                                <MenuItem value="COM">(COM) Comoros</MenuItem>
                                                <MenuItem value="CPV">(CPV) Cabo Verde</MenuItem>
                                                <MenuItem value="CRI">(CRI) Costa Rica</MenuItem>
                                                <MenuItem value="CUB">(CUB) Cuba</MenuItem>
                                                <MenuItem value="CUW">(CUW) Curaçao</MenuItem>
                                                <MenuItem value="CXR">(CXR) Christmas Island</MenuItem>
                                                <MenuItem value="CYM">(CYM) Cayman Islands</MenuItem>
                                                <MenuItem value="CYP">(CYP) Cyprus</MenuItem>
                                                <MenuItem value="CZE">(CZE) Czechia</MenuItem>
                                                <MenuItem value="DEU">(DEU) Germany</MenuItem>
                                                <MenuItem value="DJI">(DJI) Djibouti</MenuItem>
                                                <MenuItem value="DMA">(DMA) Dominica</MenuItem>
                                                <MenuItem value="DNK">(DNK) Denmark</MenuItem>
                                                <MenuItem value="DOM">(DOM) Dominican Republic</MenuItem>
                                                <MenuItem value="DZA">(DZA) Algeria</MenuItem>
                                                <MenuItem value="ECU">(ECU) Ecuador</MenuItem>
                                                <MenuItem value="EGY">(EGY) Egypt</MenuItem>
                                                <MenuItem value="ERI">(ERI) Eritrea</MenuItem>
                                                <MenuItem value="ESH">(ESH) Western Sahara</MenuItem>
                                                <MenuItem value="ESP">(ESP) Spain</MenuItem>
                                                <MenuItem value="EST">(EST) Estonia</MenuItem>
                                                <MenuItem value="ETH">(ETH) Ethiopia</MenuItem>
                                                <MenuItem value="FIN">(FIN) Finland</MenuItem>
                                                <MenuItem value="FJI">(FJI) Fiji</MenuItem>
                                                <MenuItem value="FLK">(FLK) Falkland Islands (Malvinas)</MenuItem>
                                                <MenuItem value="FRA">(FRA) France</MenuItem>
                                                <MenuItem value="FRO">(FRO) Faroe Islands</MenuItem>
                                                <MenuItem value="FSM">(FSM) Micronesia (Federated States of)</MenuItem>
                                                <MenuItem value="GAB">(GAB) Gabon</MenuItem>
                                                <MenuItem value="GBR">(GBR) United Kingdom of Great Britain and Northern Ireland</MenuItem>
                                                <MenuItem value="GEO">(GEO) Georgia</MenuItem>
                                                <MenuItem value="GGY">(GGY) Guernsey</MenuItem>
                                                <MenuItem value="GHA">(GHA) Ghana</MenuItem>
                                                <MenuItem value="GIB">(GIB) Gibraltar</MenuItem>
                                                <MenuItem value="GIN">(GIN) Guinea</MenuItem>
                                                <MenuItem value="GLP">(GLP) Guadeloupe</MenuItem>
                                                <MenuItem value="GMB">(GMB) Gambia</MenuItem>
                                                <MenuItem value="GNB">(GNB) Guinea-Bissau</MenuItem>
                                                <MenuItem value="GNQ">(GNQ) Equatorial Guinea</MenuItem>
                                                <MenuItem value="GRC">(GRC) Greece</MenuItem>
                                                <MenuItem value="GRD">(GRD) Grenada</MenuItem>
                                                <MenuItem value="GRL">(GRL) Greenland</MenuItem>
                                                <MenuItem value="GTM">(GTM) Guatemala</MenuItem>
                                                <MenuItem value="GUF">(GUF) French Guiana</MenuItem>
                                                <MenuItem value="GUM">(GUM) Guam</MenuItem>
                                                <MenuItem value="GUY">(GUY) Guyana</MenuItem>
                                                <MenuItem value="HKG">(HKG) Hong Kong</MenuItem>
                                                <MenuItem value="HMD">(HMD) Heard Island and McDonald Islands</MenuItem>
                                                <MenuItem value="HND">(HND) Honduras</MenuItem>
                                                <MenuItem value="HRV">(HRV) Croatia</MenuItem>
                                                <MenuItem value="HTI">(HTI) Haiti</MenuItem>
                                                <MenuItem value="HUN">(HUN) Hungary</MenuItem>
                                                <MenuItem value="IDN">(IDN) Indonesia</MenuItem>
                                                <MenuItem value="IMN">(IMN) Isle of Man</MenuItem>
                                                <MenuItem value="IND">(IND) India</MenuItem>
                                                <MenuItem value="IOT">(IOT) British Indian Ocean Territory</MenuItem>
                                                <MenuItem value="IRL">(IRL) Ireland</MenuItem>
                                                <MenuItem value="IRN">(IRN) Iran (Islamic Republic of)</MenuItem>
                                                <MenuItem value="IRQ">(IRQ) Iraq</MenuItem>
                                                <MenuItem value="ISL">(ISL) Iceland</MenuItem>
                                                <MenuItem value="ISR">(ISR) Israel</MenuItem>
                                                <MenuItem value="ITA">(ITA) Italy</MenuItem>
                                                <MenuItem value="JAM">(JAM) Jamaica</MenuItem>
                                                <MenuItem value="JEY">(JEY) Jersey</MenuItem>
                                                <MenuItem value="JOR">(JOR) Jordan</MenuItem>
                                                <MenuItem value="JPN">(JPN) Japan</MenuItem>
                                                <MenuItem value="KAZ">(KAZ) Kazakhstan</MenuItem>
                                                <MenuItem value="KEN">(KEN) Kenya</MenuItem>
                                                <MenuItem value="KGZ">(KGZ) Kyrgyzstan</MenuItem>
                                                <MenuItem value="KHM">(KHM) Cambodia</MenuItem>
                                                <MenuItem value="KIR">(KIR) Kiribati</MenuItem>
                                                <MenuItem value="KNA">(KNA) Saint Kitts and Nevis</MenuItem>
                                                <MenuItem value="KOR">(KOR) Korea, Republic of</MenuItem>
                                                <MenuItem value="KWT">(KWT) Kuwait</MenuItem>
                                                <MenuItem value="LAO">(LAO) Lao People's Democratic Republic</MenuItem>
                                                <MenuItem value="LBN">(LBN) Lebanon</MenuItem>
                                                <MenuItem value="LBR">(LBR) Liberia</MenuItem>
                                                <MenuItem value="LBY">(LBY) Libya</MenuItem>
                                                <MenuItem value="LCA">(LCA) Saint Lucia</MenuItem>
                                                <MenuItem value="LIE">(LIE) Liechtenstein</MenuItem>
                                                <MenuItem value="LKA">(LKA) Sri Lanka</MenuItem>
                                                <MenuItem value="LSO">(LSO) Lesotho</MenuItem>
                                                <MenuItem value="LTU">(LTU) Lithuania</MenuItem>
                                                <MenuItem value="LUX">(LUX) Luxembourg</MenuItem>
                                                <MenuItem value="LVA">(LVA) Latvia</MenuItem>
                                                <MenuItem value="MAC">(MAC) Macao</MenuItem>
                                                <MenuItem value="MAF">(MAF) Saint Martin (French part)</MenuItem>
                                                <MenuItem value="MAR">(MAR) Morocco</MenuItem>
                                                <MenuItem value="MCO">(MCO) Monaco</MenuItem>
                                                <MenuItem value="MDA">(MDA) Moldova, Republic of</MenuItem>
                                                <MenuItem value="MDG">(MDG) Madagascar</MenuItem>
                                                <MenuItem value="MDV">(MDV) Maldives</MenuItem>
                                                <MenuItem value="MEX">(MEX) Mexico</MenuItem>
                                                <MenuItem value="MHL">(MHL) Marshall Islands</MenuItem>
                                                <MenuItem value="MKD">(MKD) North Macedonia</MenuItem>
                                                <MenuItem value="MLI">(MLI) Mali</MenuItem>
                                                <MenuItem value="MLT">(MLT) Malta</MenuItem>
                                                <MenuItem value="MMR">(MMR) Myanmar</MenuItem>
                                                <MenuItem value="MNE">(MNE) Montenegro</MenuItem>
                                                <MenuItem value="MNG">(MNG) Mongolia</MenuItem>
                                                <MenuItem value="MNP">(MNP) Northern Mariana Islands</MenuItem>
                                                <MenuItem value="MOZ">(MOZ) Mozambique</MenuItem>
                                                <MenuItem value="MRT">(MRT) Mauritania</MenuItem>
                                                <MenuItem value="MSR">(MSR) Montserrat</MenuItem>
                                                <MenuItem value="MTQ">(MTQ) Martinique</MenuItem>
                                                <MenuItem value="MUS">(MUS) Mauritius</MenuItem>
                                                <MenuItem value="MWI">(MWI) Malawi</MenuItem>
                                                <MenuItem value="MYS">(MYS) Malaysia</MenuItem>
                                                <MenuItem value="MYT">(MYT) Mayotte</MenuItem>
                                                <MenuItem value="NAM">(NAM) Namibia</MenuItem>
                                                <MenuItem value="NCL">(NCL) New Caledonia</MenuItem>
                                                <MenuItem value="NER">(NER) Niger</MenuItem>
                                                <MenuItem value="NFK">(NFK) Norfolk Island</MenuItem>
                                                <MenuItem value="NGA">(NGA) Nigeria</MenuItem>
                                                <MenuItem value="NIC">(NIC) Nicaragua</MenuItem>
                                                <MenuItem value="NIU">(NIU) Niue</MenuItem>
                                                <MenuItem value="NLD">(NLD) Netherlands</MenuItem>
                                                <MenuItem value="NOR">(NOR) Norway</MenuItem>
                                                <MenuItem value="NPL">(NPL) Nepal</MenuItem>
                                                <MenuItem value="NRU">(NRU) Nauru</MenuItem>
                                                <MenuItem value="NZL">(NZL) New Zealand</MenuItem>
                                                <MenuItem value="OMN">(OMN) Oman</MenuItem>
                                                <MenuItem value="PAK">(PAK) Pakistan</MenuItem>
                                                <MenuItem value="PAN">(PAN) Panama</MenuItem>
                                                <MenuItem value="PCN">(PCN) Pitcairn</MenuItem>
                                                <MenuItem value="PER">(PER) Peru</MenuItem>
                                                <MenuItem value="PHL">(PHL) Philippines</MenuItem>
                                                <MenuItem value="PLW">(PLW) Palau</MenuItem>
                                                <MenuItem value="PNG">(PNG) Papua New Guinea</MenuItem>
                                                <MenuItem value="POL">(POL) Poland</MenuItem>
                                                <MenuItem value="PRI">(PRI) Puerto Rico</MenuItem>
                                                <MenuItem value="PRK">(PRK) Korea (Democratic People's Republic of)</MenuItem>
                                                <MenuItem value="PRT">(PRT) Portugal</MenuItem>
                                                <MenuItem value="PRY">(PRY) Paraguay</MenuItem>
                                                <MenuItem value="PSE">(PSE) Palestine, State of</MenuItem>
                                                <MenuItem value="PYF">(PYF) French Polynesia</MenuItem>
                                                <MenuItem value="QAT">(QAT) Qatar</MenuItem>
                                                <MenuItem value="REU">(REU) Réunion</MenuItem>
                                                <MenuItem value="ROU">(ROU) Romania</MenuItem>
                                                <MenuItem value="RUS">(RUS) Russian Federation</MenuItem>
                                                <MenuItem value="RWA">(RWA) Rwanda</MenuItem>
                                                <MenuItem value="SAU">(SAU) Saudi Arabia</MenuItem>
                                                <MenuItem value="SDN">(SDN) Sudan</MenuItem>
                                                <MenuItem value="SEN">(SEN) Senegal</MenuItem>
                                                <MenuItem value="SGP">(SGP) Singapore</MenuItem>
                                                <MenuItem value="SGS">(SGS) South Georgia and the South Sandwich Islands</MenuItem>
                                                <MenuItem value="SHN">(SHN) Saint Helena, Ascension and Tristan da Cunha</MenuItem>
                                                <MenuItem value="SJM">(SJM) Svalbard and Jan Mayen</MenuItem>
                                                <MenuItem value="SLB">(SLB) Solomon Islands</MenuItem>
                                                <MenuItem value="SLE">(SLE) Sierra Leone</MenuItem>
                                                <MenuItem value="SLV">(SLV) El Salvador</MenuItem>
                                                <MenuItem value="SMR">(SMR) San Marino</MenuItem>
                                                <MenuItem value="SOM">(SOM) Somalia</MenuItem>
                                                <MenuItem value="SPM">(SPM) Saint Pierre and Miquelon</MenuItem>
                                                <MenuItem value="SRB">(SRB) Serbia</MenuItem>
                                                <MenuItem value="SSD">(SSD) South Sudan</MenuItem>
                                                <MenuItem value="STP">(STP) Sao Tome and Principe</MenuItem>
                                                <MenuItem value="SUR">(SUR) Suriname</MenuItem>
                                                <MenuItem value="SVK">(SVK) Slovakia</MenuItem>
                                                <MenuItem value="SVN">(SVN) Slovenia</MenuItem>
                                                <MenuItem value="SWE">(SWE) Sweden</MenuItem>
                                                <MenuItem value="SWZ">(SWZ) Eswatini</MenuItem>
                                                <MenuItem value="SXM">(SXM) Sint Maarten (Dutch part)</MenuItem>
                                                <MenuItem value="SYC">(SYC) Seychelles</MenuItem>
                                                <MenuItem value="SYR">(SYR) Syrian Arab Republic</MenuItem>
                                                <MenuItem value="TCA">(TCA) Turks and Caicos Islands</MenuItem>
                                                <MenuItem value="TCD">(TCD) Chad</MenuItem>
                                                <MenuItem value="TGO">(TGO) Togo</MenuItem>
                                                <MenuItem value="THA">(THA) Thailand</MenuItem>
                                                <MenuItem value="TJK">(TJK) Tajikistan</MenuItem>
                                                <MenuItem value="TKL">(TKL) Tokelau</MenuItem>
                                                <MenuItem value="TKM">(TKM) Turkmenistan</MenuItem>
                                                <MenuItem value="TLS">(TLS) Timor-Leste</MenuItem>
                                                <MenuItem value="TON">(TON) Tonga</MenuItem>
                                                <MenuItem value="TTO">(TTO) Trinidad and Tobago</MenuItem>
                                                <MenuItem value="TUN">(TUN) Tunisia</MenuItem>
                                                <MenuItem value="TUR">(TUR) Turkey</MenuItem>
                                                <MenuItem value="TUV">(TUV) Tuvalu</MenuItem>
                                                <MenuItem value="TWN">(TWN) Taiwan, Province of China</MenuItem>
                                                <MenuItem value="TZA">(TZA) Tanzania, United Republic of</MenuItem>
                                                <MenuItem value="UGA">(UGA) Uganda</MenuItem>
                                                <MenuItem value="UKR">(UKR) Ukraine</MenuItem>
                                                <MenuItem value="UMI">(UMI) United States Minor Outlying Islands</MenuItem>
                                                <MenuItem value="URY">(URY) Uruguay</MenuItem>
                                                <MenuItem value="UZB">(UZB) Uzbekistan</MenuItem>
                                                <MenuItem value="VAT">(VAT) Holy See</MenuItem>
                                                <MenuItem value="VCT">(VCT) Saint Vincent and the Grenadines</MenuItem>
                                                <MenuItem value="VEN">(VEN) Venezuela (Bolivarian Republic of)</MenuItem>
                                                <MenuItem value="VGB">(VGB) Virgin Islands (British)</MenuItem>
                                                <MenuItem value="VIR">(VIR) Virgin Islands (U.S.)</MenuItem>
                                                <MenuItem value="VNM">(VNM) Viet Nam</MenuItem>
                                                <MenuItem value="VUT">(VUT) Vanuatu</MenuItem>
                                                <MenuItem value="WLF">(WLF) Wallis and Futuna</MenuItem>
                                                <MenuItem value="WSM">(WSM) Samoa</MenuItem>
                                                <MenuItem value="YEM">(YEM) Yemen</MenuItem>
                                                <MenuItem value="ZAF">(ZAF) South Africa</MenuItem>
                                                <MenuItem value="ZMB">(ZMB) Zambia</MenuItem>
                                                <MenuItem value="ZWE">(ZWE) Zimbabwe</MenuItem>
                                              </Select>
                                            <FormHelperText>Please enter country of your address, <em>NOT</em> the operational headquarters if different.</FormHelperText>
                                          </FormControl>
                                          <p className="Spacer"> </p>
                                          <div className="ButtonGroup ad-margin-b-40">
                                            <div align="center" className="ovalButton ad-margin-t-5">
                                              <a className="ovalButtonLabel" href="#0" onClick={this.handleNewBuyerClick}>BACK</a>
                                            </div>
                                            <span className="ad-padding-l-150">&nbsp;</span>
                                            {this.state.formErrors && <span className="showOnError">Please correct errors above.</span>}
                                            <div align="center" className="ovalButton ad-margin-t-5">
                                              <a className="ovalButtonLabel ad-align-center" href="#0" onClick={this.onSave}>REGISTER YOUR COMPANY</a>
                                            </div>
                                          </div>
                                        </form>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                  :
                    <div className="tableCenter sellBoxWhite ad-fullwidth ad-margin-t-100 ad-padding-tb-60">
                        <p className="headLiner2 padLeft ad-padding-b-15">Invalid Domain</p>
                        <p className="padLeft tableLeft ad-color-white">
                          AccuDiligence is not a consumer product. You must provide a valid business domain
                          for our communication purposes and agree to the Terms and Conditions of Use.
                        </p>
                        <p className="padLeft tableLeft ad-color-white">
                          For more information or support, please contact us via email or the chat feature
                          below.
                        </p>
                        <p className="Spacer"> </p>
                        <div align="center" className="ovalButton ad-margin-t-5">
                          <a className="ovalButtonLabel ad-align-center" href="#0" onClick={this.handleNewBuyerClick}>BACK</a>
                        </div>
                    </div>
                )}
              </Grid>
            </Grid>
          </div>
        </React.Fragment>
      )
    } else {
      return(<div>&nbsp;</div>);
    }
  }
}

NewUserTask.propTypes = {
  classes: PropTypes.object
  //classes: PropTypes.object.isRequired
    /* TODO: Review ProTypes */
}
