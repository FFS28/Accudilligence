// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { Component } from 'react';
import NewUserTask from "./NewUserTask";
import ClientTask from "./ClientTask";
import TargetTask from "./TargetTask";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import { Auth, API } from 'aws-amplify';
import './AppContainer.css';
//import { mdiConsoleNetworkOutline } from '@mdi/js';

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

export default class AppContainer extends Component {
  constructor (props) { 
    super(props); 
    this.state = { 
      ClientID: null, 
      clientStatus: null,
      TargetID: null,
      targetStatus: null,
      usrStatus: null,
      panelIsLoading: true,
      initialProjectCount: 0
    } 
    this.updateUserRole = this.updateUserRole.bind(this)
  }

  updateUserRole(recType, recID, recStatus, pCount) {
    if (recType === "C") {
      this.setState({ ClientID: recID, clientStatus: recStatus, initialProjectCount: pCount })
    } else if (recType === "T") {
      this.setState({ TargetID: recID, targetStatus: recStatus });
    }
  }

  handleBuyerClick() 
  {
    this.updateUserRole("T", null, null)
  }

  handleSellerClick()
  {
    this.updateUserRole("C", null, null)
  }
  
  processUpdates(roles)
  {
    // console.log(roles);
    if (roles) {
      // console.log(roles);
      this.setState({usrStatus: roles.status});
      if (roles.usrRole.includes("C")) {
        this.updateUserRole("C", roles.clientID, roles.clientUsrStatus, roles.projectCount);
      }
      if (roles.usrRole.includes("T")) {
        this.updateUserRole("T", roles.targetID, roles.targetUsrStatus, 0);
      }
      this.setState({panelIsLoading: false });
    } else 
      console.log("inbound roles:"+JSON.stringify(roles))
  }

  async fetchUserRoles()
  {
    var fetchedRoles = null;

    if (this.props.usrEmail && this.props.jwt) {
      let payLoad = {
        headers: {
          Authorization: this.props.jwt
        },
        body: {

        }
      }
      //console.log(payLoad);
      API.post('getuserroles', '/', payLoad ).then(response => {
        if (response.statusCode === 200) {
          fetchedRoles = response.body;
          this.processUpdates(fetchedRoles);
        }
        else {
          console.log(response.body);
        }
      }).catch(error => { 
        //if (error.message.includes("401")) {
        //  signOut();
        //} else {
          console.log(error)
        //}
    });
    }
    return fetchedRoles;
  }

  componentDidMount()
  {
    // console.log("Application Container Mounted...");
    if (this.props.usrEmail && this.props.jwt)
      this.fetchUserRoles();
  }

  render() {
      if ((! this.state.panelIsLoading) && this.props.usrEmail) {
        if (!(["ACT", "REG"].includes(this.state.usrStatus)) || ((this.state.ClientID !== null) && (this.state.clientStatus !== "ACT")) || ((this.state.TargetID !== null) && !(['ACT', 'NEW', 'REG'].includes(this.state.targetStatus)))) {
          return (
            <Container maxWidth="lg" className="ad-margin-t-100">
              <Typography component="div" style={{ backgroundColor: '#000' }} >
                <div className="TaskPanelStyle ad-margin-t-100">
                  <p className="headLiner2 padLeft">User Account Status is Invalid</p>
                  <p className="DirectionsHeader padLeft">
                    Currently, this account is flagged by operations.
                    Please contact our support team at support@accudiligence.com if you have questions about the status of your Account or feel the status is in error.
                  </p>
                </div>
              </Typography>
            </Container>
          );
        } else {
          return (
            <div className="appcontainer">
              <div>
                { this.state.ClientID === null && this.state.TargetID === null && 
                  <NewUserTask usrEmail={this.props.usrEmail} ClientID={this.state.ClientID} jwt={this.props.jwt} updateUserRole={this.updateUserRole} />
                }
                { this.state.TargetID !== null && this.state.ClientID !== null &&
                  <Container maxWidth="lg">
                    <Typography component="div" style={{ backgroundColor: '#000' }} >
                      <div className="TaskPanelStyle">
                        <p className="headLiner2 padLeft">Choose Primary Role for this Session</p>
                        <p className="DirectionsHeader padLeft">
                          Your email account is registered both as a client that initiates and manages due diligence projects as well as
                          a target or seller that is designated to respond to due diligence evidentiary requests. This can occur often if
                          an acquisitive company itself becomes the target of an acqusition. Please choose which role you will be
                          using for this session. You must logout and log back in to choose the other role as only one can be active at a time per session.
                        </p>
                        <p className="Spacer"> </p>
                        <Divider variant="middle" />
                        <p className="Spacer"> </p>
                        <table width="100%">
                          <thead>
                            <tr valign="top">
                              <th width="70%" className="tableStd">
                                <table className="sellBoxWhite">
                                  <tbody>
                                    <tr>
                                      <td className="headLiner">Buy-Side</td>
                                      <td className="headLiner">Sell-Side / Target</td>
                                    </tr>
                                    <tr>
                                      <td className="simpleBlackText padBottom">Diligence project management</td>
                                      <td className="simpleBlackText padBottom">Responding to due diligence evidence  requests</td>
                                    </tr>
                                    <tr>
                                      <td className="padBottom"><a href="/#" className="button" onClick={this.handleBuyerClick}>Continue As Buy-Side Investor</a></td>
                                      <td className="padBottom"><a href="/#" className="button" onClick={this.handleSellerClick}>Continue As Sell-Side Target</a></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </Typography>
                  </Container>
                }
                { this.state.TargetID !== null && this.state.ClientID === null &&
                  <TargetTask usrEmail={this.props.usrEmail} TargetID={this.state.TargetID} TargetStatus={this.state.targetStatus} jwt={this.props.jwt} />
                }
                { this.state.ClientID !== null && this.state.TargetID === null &&
                  <ClientTask usrEmail={this.props.usrEmail} ClientID={this.state.ClientID} ClientStatus={this.state.clientStatus} jwt={this.props.jwt} initProjCount={this.state.initialProjectCount} />
                }
              </div>
            </div>
          );
        }
      } else {
        return (
          <div className="appcontainer AppLoaderAnim2 AnimBorder" />
        );
      }
  }
}
