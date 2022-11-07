import React, { Component } from 'react';
import './Footer.css';

export default class Footer extends Component {

  render() {
    return (
      <div className="FooterStyle">
        &copy; 2021. All Rights Reserved. <b>AccuDiligence, LLC.</b>(US Patent Pending)<br/>
        Use of this website constitutes acceptance of the AccuDiligence Terms &amp; Conditions of Use, <a className="ad-link-font" href="AccuDiligencePrivacyPolicyAgreement.pdf">Privacy Policy</a>, and <a className="ad-link-font" href="AccuDiligenceCookiePolicy.pdf">Cookie Policy</a>
      </div>
    )
  }
}

Footer.propTypes = {
    /* TODO: Review ProTypes */
}