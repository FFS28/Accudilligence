import React, { Component } from 'react';
//import Button from '@material-ui/core/Button';
import { Auth } from 'aws-amplify';
import '../App.css';
import logoTopLeft from '../img/logo.png';
import exiticon from '../img/exiticon.png';

export default class TopNavPanel extends Component {
  constructor(props) { 
    super(props);
    this.state = { }; 
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    Auth.signOut();
    //Check environment variable for release
    let domainStr = "localhost:3000/"
    window.location.href = domainStr + "?signin=1";
    window.location.reload();
  }

  render() {
    return (
      (this.props.usrEmail === null)
         ?
          <div className="unregisteredUserHeader">
            <div className="TopLeftIconLarge"><img src={logoTopLeft} width="64px" height="64px" alt="" /></div>
            <div className="headerTitleLarge"><span className="superCaps">A</span><span className='superCapSmall'>ccu</span><span className="superCaps">D</span><span className='superCapSmall'>iligence</span></div>
            {(this.props.displayAmplify)
              ?
                <div className="headerButtons">
                  <a href="#0" onClick={() => this.props.changeDisplayState(false)} className="btn"><span>EXIT</span></a>
                </div>
              :
                <div className="headerButtons">
                  <a href="#0" onClick={() => this.props.changeDisplayState(true)} className="btn"><span>SIGN IN</span></a>
                </div>
            }
          </div>
         :
            <div className="topheader" id="topHeaderNav">
              <div className="TopLeftIcon"><img src={logoTopLeft} width="40px" height="40px" alt="" /></div>
              <div className="headerTitle"><span className="superCapSmall">A</span><span>ccu</span><span className="superCapSmall">D</span><span>iligence</span></div>
              <div className="TopNavPanelStyle RightTopNav ad-nowrap">
                {/*
                  <span className="ad-sm-lr-padding"><a href="#" className="fa fa-linkedin"></a></span>
                  <span className="ad-sm-lr-padding"><a href="https://twitter.com/accudiligence" className="fa fa-twitter"></a></span>
                  <span className="ad-hideOnMobile ad-sm-lr-padding">{this.props.usrEmail} &nbsp;&nbsp;&nbsp;</span>
                */}
                  <span className="ad-sm-lr-padding">
                    <a href="#0" className="signOutFont" onClick={this.signOut}>
                      <div id="logo-holder">
                        <img className="image" alt="Click to exit" width="26" height="28" src={exiticon} />
                        <div className="text signOutFont">Sign Out</div>
                      </div>
                    </a>
                  </span>
              </div>
            </div>
    )
  }
}

TopNavPanel.propTypes = {
    /* TODO: Review ProTypes */
}