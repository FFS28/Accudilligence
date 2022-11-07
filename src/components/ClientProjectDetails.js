// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { API } from 'aws-amplify';
import Grid from '@material-ui/core/Grid';
//import PropTypes from 'prop-types';
//import Table from '@material-ui/core/Table';
///import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
///import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import TablePagination from '@material-ui/core/TablePagination';
//import Paper from '@material-ui/core/Paper';
import './ClientProjects.css';
import pdficon from '../img/pdficon.png';
import risk1 from '../img/riskmeter-1.png';
import risk2 from '../img/riskmeter-2.png';
import risk3 from '../img/riskmeter-3.png';
import risk4 from '../img/riskmeter-4.png';

export default class ClientProjects extends React.Component {
    constructor(props) { 
      super(props);

      this.monthSix = this.monthSix.bind(this);

      this.state = { 
        details: null
      };
    }

    monthSix() {
        var now = new Date();
        now.setDate(now.getMonth()+6);
        return now.getYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate())
    }

    async fetchClientProjects(cStatus) {
        let pOffset = ((cStatus==="A" ? this.state.activePage : this.state.closedPage)-1)*(cStatus==="A" ? this.state.activeRowsPerPage : this.state.closedRowsPerPage);
        if (this.props.usrEmail && this.props.jwt && this.props.ClientID) {
            let payLoad = {
              headers: {
                Authorization: this.props.jwt
              },
              body: {
                ClientID: this.props.ClientID,
                pgSize: (cStatus==="A" ? this.state.activeRowsPerPage : this.state.closedRowsPerPage),
                pageOffset: pOffset,
                sortCol: "",
                filter: cStatus
                }
            }
            API.post('getprojectdetails', '/', payLoad ).then(response => {
                // NEED TO SET clientID and bubble back up to top
                if ((response !== "") && (response.statusCode === 200)) {
                    if (cStatus === "A") {
                        this.setState({activeProjects: response.body})
                    }
                    if (cStatus === "C") {
                        this.setState({closedProjects: response.body})
                    }
                } else {
                    console.log("Error")
                    console.log(response)
                }
            }).catch(error => { 
                console.log(error)
            });
        }
    }

    componentDidMount()
    {
      if (this.props.usrEmail && (this.props.ClientID.length > 0) && (this.props.ClientID !== "NONE")) {
        this.fetchClientProjects("A");
        this.fetchClientProjects("C");
      }
      document.body.style.backgroundColor = "#000008"
    }

    render() {
        return (
            <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
                {(this.props.newProjNotice === 1) ?
                    <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                        <Grid item sm={10}>
                            <h4 className="ad-align-left ad-border-b-gold ad-color-white">Project AccuDiligence Demo (System: All)</h4>
                            <div className="ad-dim-bkground">
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th align="left" className="ad-padding-t-25">Engagement Scope:</th>
                                          <th></th>
                                          <th></th>
                                          <th className="ad-padding-t-25 ad-assessment-bkcolor ad-color-dkblue">Assessment Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td align="center" className="ad-padding-tb-10"><b>Service Offerings</b></td>
                                            <td align="center" className="ad-padding-tb-10"><b>Confirmatory</b></td>
                                            <td align="center" className="ad-padding-tb-10"><b>Extensive</b></td>
                                            <td align="center" className="ad-padding-tb-10 ad-assessment-bkcolor ad-color-dkblue body-small">% Complete: 85%</td>
                                        </tr>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-20">Cybersecurity</td>
                                            <td align="center">X</td>
                                            <td align="center">-</td>
                                            <td rowSpan={2} align="center" className="ad-assessment-bkcolor ad-color-dkblue ad-grade-font">B+</td>
                                        </tr>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-20">Product Technology</td>
                                            <td align="center">X</td>
                                            <td align="center">-</td>
                                        </tr>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-20">IT Back Office</td>
                                            <td align="center">-</td>
                                            <td align="center">-</td>
                                            <td rowSpan={5} align="left" className="ad-padding-l-20 ad-assessment-bkcolor ad-color-dkblue ad-lineheight-default">
                                                <b>Creation Date: {(new Date()).getFullYear()}-{(new Date()).getMonth()+1}-{(new Date()).getDate() < 8 ? 1 : (new Date()).getDate()-7}</b><br/>
                                                <b>Acceptance Date: {(new Date()).getFullYear()}-{(new Date()).getMonth()+1}-{(new Date()).getDate() < 7 ? 1 : (new Date()).getDate()-6}</b><br/>
                                                Completion Date:<br/>
                                                Report Delivery:<br/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left" colSpan={3} className="ad-padding-t-25"><b>Add-Ons:</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="ad-padding-tb-10 ad-padding-l-20">
                                                Open Source Audit: Available roughly Q4 2021
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="ad-padding-tb-10 ad-padding-l-20">
                                                Code Quality Scan: Available roughlyQ4 2021
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="ad-padding-tb-10 ad-padding-l-20">
                                                Code Security Scan: Available roughlyQ4 2021
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th colSpan={2} align="left" className="ad-padding-t-25">Vitals:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="ad-align-left ad-padding-tb-10 ad-padding-l-20 ad-tablecell-w-sm">Vertical:</th>
                                            <td className="ad-padding-tb-10 ad-align-left ad-tablecell-w-lg">IT Consulting</td>
                                        </tr>
                                        <tr>
                                            <th className="ad-align-left ad-padding-tb-10 ad-padding-l-20">Market:</th>
                                            <td className="ad-padding-tb-10 ad-align-left">US, EU</td>
                                        </tr>
                                        <tr>
                                            <th className="ad-align-left ad-padding-tb-10 ad-padding-l-20">Annual Revenue:</th>
                                            <td className="ad-padding-tb-10 ad-align-left">~ $10M</td>
                                        </tr>
                                        <tr>
                                            <th className="ad-align-left ad-padding-tb-10 ad-padding-l-20">Employees:</th>
                                            <td className="ad-padding-tb-10 ad-align-left">23</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th colSpan={2} align="left" className="ad-padding-t-25">Executive Summary:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={2} className="ad-align-left ad-padding-tb-10 ad-padding-l-20">Cybersecurity Assessment:</th>
                                        </tr>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-30 ad-align-left">Pending data entry completion.</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} className="ad-align-left ad-padding-t-25 ad-padding-l-20">Product Technology Assessment:</th>
                                        </tr>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-30 ad-align-left">Pending data entry completion.</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th colSpan={2} align="left" className="ad-padding-t-25">Cybersecurity Details:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4} className="ad-padding-tb-10 ad-padding-l-30 ad-align-left">Cybersecurty Preparedness / Threat Modeling</th>
                                        </tr>
                                        <tr>
                                            <th className="body-small ad-padding-l-50 ad-color-disabled">Area</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Risk Level</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Findings</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Investments / Recommendations</th>
                                        </tr>
                                        <tr>
                                            <th rowSpan={2} className="ad-padding-l-50 ad-padding-r-10">Assets</th>
                                            <th className="ad-padding-lr-15 ad-border-b-faded"><img className="image" alt="low" width="62" height="12" src={risk1} /></th>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Fully cloud based infrastructure with automated asset detection and inventory simplifies several cybersecurity controls.
                                            </td>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                No further recommendations at this time.
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="ad-padding-lr-15 ad-border-b-faded"><img className="image" alt="low" width="62" height="12" src={risk3} /></th>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Data and personnel assets not fully assessed or documented as part of the threat modeling practices.
                                            </td>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Identify and classify critical information as well as key personnel, including data stewards and board members,
                                                as part of the threat modeling process.
                                            </td>
                                        </tr>
                                        <tr>
                                            <th rowSpan={2} className="ad-padding-l-50 ad-padding-r-10">Controls</th>
                                            <th className="ad-padding-lr-15 ad-border-b-faded"><img className="image" alt="low" width="62" height="12" src={risk2} /></th>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Many cloud asset controls are in place though frequency of compliance reviews is not yet consistent that can allow 
                                                weaker practices to dominate as the company grows.
                                            </td>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Controls to improve include continuous vulnerability management, malicious email protections, malware defenses on employee-owned
                                                devices (BYOD policy), and limitations around administrative privileges.
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="ad-padding-lr-15 ad-border-b-faded"><img className="image" alt="low" width="62" height="12" src={risk2} /></th>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Montiroing and analysis of system and security-specific audit logs are not yet consolidated, a modern approach to more 
                                                efficient automated threat analysis across channels.
                                            </td>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Work to automate audit log aggregation across the various cloud services. Methodologies for such aggregations are well documented
                                                by their cloud provider.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className="ad-align-center ad-color-gold ad-padding-tb-30">
                                                <i>Demonstration Only. More areas and details covered in a live project, including:</i><br/>
                                                <span className="ad-color-gold ad-padding-l-30">&#9656;</span>&nbsp; Cyber Governance and Operations,
                                                <span className="ad-color-gold ad-padding-l-30">&#9656;</span>&nbsp; Cyber Team and Culture
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th colSpan={4} align="left" className="ad-padding-t-25">Product Technology Details:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4} className="ad-padding-tb-10 ad-padding-l-30 ad-align-left">Technology Architecture</th>
                                        </tr>
                                        <tr>
                                            <th className="body-small ad-padding-l-50 ad-color-disabled">Area</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Risk Level</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Findings</th>
                                            <th className="body-small ad-border-b-faded ad-color-disabled">Investments / Recommendations</th>
                                        </tr>
                                        <tr>
                                            <th rowSpan={2} className="ad-padding-l-50 ad-padding-r-10">Model</th>
                                            <th className="ad-padding-lr-15 ad-border-b-faded"><img className="image" alt="low" width="62" height="12" src={risk4} /></th>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Server logic is Java-based, a popular programming language with sufficient expert resources, through its cloud deployment
                                                model still uses a legacy monolithic architecture inside a container/docker virtual machine that will be difficult to maintain
                                                and deploy over time. It is also not the ideal architecture pattern given various, more cost efficient serverless resources
                                                available to the team.
                                            </td>
                                            <td className="ad-tablecell-w-md ad-border-b-faded ad-align-top ad-detailedcell-padding body-small">
                                                <span className="ad-color-gold">&#9656;</span>&nbsp;
                                                Over time, break up the monolithic code base into smaller services that are more readily maintained and deployed onto cloud
                                                resources, that also lower the total cost of ownership of the platform.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className="ad-align-center ad-color-gold ad-padding-tb-30">
                                                <i>Demonstration Only. More areas and details covered in a live project, including:</i><br/>
                                                <span className="ad-color-gold ad-padding-l-30">&#9656;</span>&nbsp; Product Infratructure,
                                                <span className="ad-color-gold ad-padding-l-30">&#9656;</span>&nbsp; R&amp;D Organization,
                                                <span className="ad-color-gold ad-padding-l-30">&#9656;</span>&nbsp; Secured Development Operations<br/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="ad-table-compress ad-color-white ad-fullwidth ad-border-photo">
                                    <thead>
                                        <tr>
                                          <th colSpan={2} align="left" className="ad-padding-t-25">Evidence Request List:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="ad-padding-tb-10 ad-padding-l-30 ad-align-left">
                                                The following data points should be requested and verified against the attestations collected.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="body-small ad-padding-b-15">
                                                <div className="ad-padding-l-30"><b>Secured DevOps:</b></div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Formal Product Roadmap &amp; Project Planning</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;ITIL Change Management process documentation</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Historical release cadence</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Release rollback incidents and root causes</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Incident Response Plan</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;A/B Testing for outcome validation</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Defect volume trends, last 12 months</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Team velocity and other Operational KPIs</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;List of known concerns and/or gaps in being 100% EU GDPR compliant</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Documentation of lessons learned or retrospectives from the most recent mocked cybersecurity incident test</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="body-small ad-padding-b-15">
                                                <div className="ad-padding-l-30"><b>Product Technologies</b></div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Percentage of framework migration remaining as a project plan</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Performance and scalability testing approaches and results</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Static and dynamic code quality scans</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Data schema highlighting PII and sensitive data store</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Third-party open source license and security audit</div>
                                                <div className="ad-align-left ad-padding-l-50"><span className="ad-color-gold">&#9656;</span>&nbsp;Architecture diagrams for private and public cloud network deployment</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="ad-align-center ad-color-gold ad-padding-tb-30">
                                                <i>Demonstration Only. Early-state Confirmatory Diligence will provide a specific evidence request List
                                                    based on the attestations obtained to reduce unnecessary workload during the assessment process.</i><br/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Grid>
                        <Grid item sm={10}>
                            <div className="ad-padding-tb-30">&nbsp;</div>
                        </Grid>
                    </Grid>
                : null
                }
            </div>
        );
    } 
}  
