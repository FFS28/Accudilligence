// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { API, Auth } from 'aws-amplify';
import { withStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
//import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
//import Button from '@material-ui/core/Button';
////import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import ClientProjects from "./ClientProjects";
import ClientNewProject from "./ClientNewProject";
import ClientProjectDetails from "./ClientProjectDetails";
import './ClientTask.css';
//import { toDate } from 'date-fns/esm';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 9,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    borderRadius: 3,
    backgroundColor: '#355c35',
  },
  dashed: {
    animation: 'none',
    transition: 'none',
    display: 'none',
    marginTop: 2
  },
  barColorPrimary: {
      backgroundColor: '#355c35ee'
  }
}))(LinearProgress);

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

function SimpleMenu(props) {
  const { menuViewChange } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleShowCompanyPortfolio = () => {
    setAnchorEl(null);
    menuViewChange("CompanyPortfolio", null);
  };

  const handleShowMyProject = () => {
    setAnchorEl(null);
    menuViewChange("Projects", null);
  };

  const handleShowMyAccount = () => {
    setAnchorEl(null);
    menuViewChange("Account", null);
  };

  return (
    <span className="ad-padding-l-30">
      <a href="#0" className="ad-appbar-link" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>View</a>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleShowMyProject}>My Projects</MenuItem>
        <MenuItem onClick={handleShowMyAccount}>My Account Summary</MenuItem>
        <MenuItem onClick={handleShowCompanyPortfolio}>My Company's Portfolio</MenuItem>
      </Menu>
    </span>
  );
}

export default class ClientTask extends React.Component {
  constructor(props) { 
    super(props); 
    this.handleChangeView = this.handleChangeView.bind(this);
    this.handleChangeActivePage = this.handleChangeActivePage.bind(this);
    this.handleChangeActiveRowsPerPage = this.handleChangeActiveRowsPerPage.bind(this);
    this.handleChangeClosedPage = this.handleChangeClosedPage.bind(this);
    this.handleChangeClosedRowsPerPage = this.handleChangeClosedRowsPerPage.bind(this);    
    this.handleNewProjectClick = this.handleNewProjectClick.bind(this);
    this.handleConfirmatoryClick = this.handleConfirmatoryClick.bind(this);
    this.handleExtensiveClick = this.handleExtensiveClick.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = { 
      clientView: "Home",
      showNewProjectForm: false,
      showProjectList: true,
      newProjNotice: null,
      newProjectType: "",
      tabValue: 0,
      activeProjects: {},
      closedProjects: {},
      activeRowsPerPage: 10,
      activePage:1,
      activeCount:0,
      closedRowsPerPage: 10,
      closedPage:1,
      closedCount:0,
      accountSummary:{},
      pbv:0,
      pbb:0
    };
  }

  handleChangeView(newView, newProjectID)
  {
    window.scrollTo(0, 0);
    this.setState({clientView: newView});
    if (newProjectID) {
      this.setState({ newProjNotice: newProjectID });
      if (newProjectID !== 1) {
        this.fetchClientProjects("A");
      }
    }
  }

  handleChangeActivePage = (event, newPage) => {
    console.log("newPage:"+newPage)
    this.setState({activePage: newPage+1}, () => {this.fetchClientProjects("A")});
  };

  handleChangeActiveRowsPerPage = (event) => {
      this.setState({activeRowsPerPage: parseInt(event.target.value, 10), activePage: 0}, () => {this.fetchClientProjects("A")});
  };

  handleChangeClosedPage = (event, newPage) => {
      this.setState({closedPage: newPage+1}, () => {this.fetchClientProjects("C")});
  };

  handleChangeClosedRowsPerPage = (event) => {
      this.setState({closedRowsPerPage: parseInt(event.target.value, 10), closedPage: 0}, () => {this.fetchClientProjects("C")});
  };

  async fetchClientAccount() {
    if (this.props.usrEmail && this.props.jwt && this.props.ClientID) {
      let payLoad = {
        headers: {
          Authorization: this.props.jwt
        },
        body: {
          ClientID: this.props.ClientID
        }
      }
      API.post('getclientfinancials', '/', payLoad ).then(response => {
          if ((response !== "") && (response.statusCode === 200)) {
            // console.log(response);
            this.setState({accountSummary: response.body})
          } else {
              console.log("Error");
              console.log(response);
          }  
      }).catch(error => { 
          if (error.message.includes("401")) {
            signOut();
          } else {
            console.log(error)
          }
      });
    }
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
            sortCol: "rd-a",
            filter: cStatus
            }
        }
        // console.log(payLoad);
        API.post('getclientprojects', '/', payLoad ).then(response => {
            // NEED TO SET clientID and bubble back up to top
            // console.log(response.body);
            if ((response !== "") && (response.statusCode === 200)) {
                if (cStatus === "A") {
                    this.setState({activeProjects: response.body})
                    this.setState({activeCount: response.body.records.length });
                    // console.log(this.state.activeProjects);
                }
                if (cStatus === "C") {
                    this.setState({closedProjects: response.body})
                    this.setState({closedCount: response.body.records.length });
                }
            } else {
                console.log("Error");
                console.log(response);
            }
          }).catch(error => { 
            if (error.message.includes("401")) {
              signOut();
            } else {
              console.log(error)
            }
        });
    }
  }

  componentDidMount()
  {
    document.body.style.backgroundColor = "#f8fff8";
    if (this.props.usrEmail && (this.props.ClientID.length > 0) && (this.props.ClientID !== "NONE")) {
      this.fetchClientProjects("A");
      this.fetchClientAccount();
    }
  }

  componentWillUnmount()
  {
    document.body.style.backgroundColor = "#000"
  }

  handleNewProjectClick = event => { 
    this.setState({ showNewProjectForm: !this.state.showNewProjectForm });
    this.setState({ showProjectList: !this.state.showProjectList });
  }

  // 20201122 TJANNAK - New widget grid UI landing content
  handleConfirmatoryClick = event => { 
    this.setState({clientView: "NewProject", newProjectType: "Confirmatory"});
  }

  handleExtensiveClick = event => { 
    this.setState({clientView: "NewProject", newProjectType: "Extensive"});
  }

  handleTabChange = (event, newValue) => {
    this.setState({tabValue: newValue});
  };


  render() {
    if (this.props.ClientStatus === "ACT") {
      return (
        <div>
          <div className="ad-appbar">
            <div>
              <a href="#0" className="ad-appbar-link" aria-controls="simple-menu" onClick={() => this.handleChangeView("Home")}>Home</a>
              <SimpleMenu menuViewChange={this.handleChangeView} />
              <span className="ad-padding-l-30">&nbsp;</span>
              <a href="#0" className="ad-appbar-link" aria-controls="simple-menu" onClick={this.handleConfirmatoryClick}>Start a Diligence Project</a>
            </div>
          </div>
          {(this.state.clientView === "Home")
            ?
              <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
                <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                  {/* TODO - Add notifications per client
                  <Grid item xs={11}>
                    <div className="ad-fullwidth ad-fullheight ad-paper-background">
                        <h3 className="ad-margin-b-0 ad-border-b-gold">Notification and News</h3>
                        <div className="ad-margin-t-10">
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  No new notifications.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </Grid>
                  <p className="ad-margin-t-10"></p>
                  */}
                  <Grid item sm={11}>
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Project Summary:</h4>
                      <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15">
                        <table className="ad-tablerowspacing-15 ad-color-white ad-fullwidth">
                          <thead>
                            <tr>
                              <th className="ad-padding-tb-10">Project Name</th>
                              <th className="ad-padding-tb-10">Status</th>
                              <th className="ad-padding-tb-10">Activated On</th>
                              <th className="ad-padding-tb-10">Progress</th>
                              <th className="ad-padding-tb-10 ad-padding-l-10 ad-padding-r-10">Request By</th>
                            </tr>
                          </thead>
                          {(this.props.initProjCount === 0)
                            ?
                              <tbody>
                                <tr className="ad-padding-tb-10 ad-hover-row" onClick={() => this.handleChangeView("projectDetails", 1)}>
                                  <td className="ad-align-top ad-padding-l-10 ad-padding-r-10">AccuDiligence Demo<br/>
                                    <div className="condensed ad-padding-l-20 ad-color-disabled ad-lineheight-default">
                                      <b>Confirmatory Cybersecurity<br/>
                                      Confirmatory Product Technology<br/>
                                      Confirmatory IT Back Office<br/></b>
                                    </div>
                                  </td>
                                  <td className="ad-align-center ad-align-top ad-padding-l-10 ad-padding-r-10">Active</td>
                                  <td className="ad-align-center ad-align-top ad-padding-l-10 ad-padding-r-10">{(new Date()).getFullYear()}-{(new Date()).getMonth()+1}-{(new Date()).getDate() < 7 ? 1 : (new Date()).getDate()-6}</td>
                                  <td className="ad-align-top ad-padding-l-10 ad-padding-r-10">
                                    <Box display="flex" alignItems="center">
                                      <Box width="100%" mr={1}>
                                        <BorderLinearProgress 
                                          color="primary" 
                                          variant="buffer" 
                                          value =  { 75 } 
                                          valueBuffer = { 80 } 
                                        />
                                      </Box>
                                      <Box minWidth={10}>
                                        <span className="condensed  body-small">{75}%</span>
                                      </Box>
                                    </Box>
                                  </td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td colSpan={4} className="ad-lineheight-default ad-padding-t-80">
                                    Above is a clickable sample or demo of an assessment project in flight on AccuDiligence.<br/>
                                    Your diligence projects will have similar metrics and capabilities.<br/><br/>
                                    Start your diligence today - click Start at the menu above.
                                  </td>
                                </tr>
                              </tbody>
                            : (Object.keys(this.state.activeProjects).length > 0) 
                                ?
                                  <tbody>
                                    {this.state.activeProjects.records.map((record) => (
                                        <tr key={record.ID} className="ad-hover-row" onClick={() => this.handleChangeView("projectDetails", record.ID)}>
                                            <td align="left" component="th">
                                                {record.ProjectName} &nbsp;&nbsp;
                                                {record.New ? <span className="newProjSticker ad-color-black condensed body-small"><b>NEW</b></span> : null}
                                                <div className="condensed ad-padding-l-20 ad-margin-t-10 ad-color-disabled ad-lineheight-default">
                                                  <b>
                                                    {record.Type[0]}
                                                    {record.Type.length > 1 ? <br/> : null }
                                                    {record.Type.length > 1 ? record.Type[1] : null}
                                                    {record.Type.length > 2 ? <br/> : null}
                                                    {record.Type.length > 2 ? record.Type[2] : null}
                                                  </b>
                                                </div>
                                            </td>
                                            <td className="ad-align-center ad-align-top ad-padding-l-10 ad-padding-r-10">{record.Status}</td>
                                            <td className="ad-align-center ad-align-top ad-padding-l-10 ad-padding-r-10">{record.ActivationDate}</td>
                                            <td className="ad-align-top ad-padding-l-10 ad-padding-r-10">
                                              <Box display="flex" alignItems="center">
                                                <Box width="100%" mr={1}>
                                                  <BorderLinearProgress 
                                                    color="primary" 
                                                    variant="buffer" 
                                                    value =       { (record.totalCount > 0) ? Math.floor(record.answeredCount*100/record.totalCount) : 0 } 
                                                    valueBuffer = { (record.totalCount > 0) ? Math.floor((record.answeredCount+record.underReviewCount)*100/record.totalCount) : 0 } 
                                                  />
                                                </Box>
                                                <Box minWidth={10}>
                                                  <span className="condensed body-small">{(record.totalCount > 0) ? Math.floor(record.answeredCount*100/record.totalCount) : 0 }%</span>
                                                </Box>
                                              </Box>
                                            </td>
                                            <td className="ad-align-center ad-align-top ad-padding-l-10">{record.RequestDeliveryBy}</td>
                                        </tr>
                                    ))}
                                  </tbody>
                                : null
                          }
                        </table>
                        {((Object.keys(this.state.activeProjects).length > 0) && (this.state.activeProjects.totalRows > this.state.activeProjects.pgSize)) 
                          ?
                            <TablePagination
                                component="div"
                                count={this.state.activeProjects.totalRows}
                                page={this.state.activeProjects.page-1}
                                onChangePage={this.handleChangeActivePage}
                                rowsPerPage={this.state.activeProjects.pgSize}
                                onChangeRowsPerPage={this.handleChangeActiveRowsPerPage}
                            />
                          : null
                        }
                      </div>
                  </Grid>
                </Grid>
              </div>
            : (this.state.clientView === "NewProject") ?
                <ClientNewProject usrEmail={this.props.usrEmail} ClientID={this.props.ClientID} ClientStatus={this.props.ClientStatus} jwt={this.props.jwt} changeView={this.handleChangeView} newProjectType={this.state.newProjectType} acctBalance={this.state.accountSummary} />

            : (this.state.clientView === "Account") ?
              <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
                <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                  <Grid item sm={12}>
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Account Summary:</h4>
                    <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15">
                      {(Object.keys(this.state.accountSummary).length > 0)
                        ?
                          <table className="ad-table-compress ad-color-white">
                            <thead>
                              <tr>
                                <th></th>
                                <th className="ad-padding-r-10">Projects</th>
                                <th colSpan={2}>Cybersecurity</th>
                                <th colSpan={2}>Product Technology</th>
                                <th colSpan={2}>IT Back Office</th>
                              </tr>
                              <tr>
                                <th></th>
                                <th></th>
                                <th className="condensed ad-padding-l-10 ad-color-disabled">Confirmatory</th>
                                <th className="condensed ad-padding-l-5 ad-padding-r-10 ad-color-disabled">Extensive</th>
                                <th className="condensed ad-padding-l-10 ad-color-disabled">Confirmatory</th>
                                <th className="condensed ad-padding-l-5 ad-padding-r-10 ad-color-disabled">Extensive</th>
                                <th className="condensed ad-padding-l-10 ad-color-disabled">Confirmatory</th>
                                <th className="condensed ad-padding-l-5 ad-padding-r-10 ad-color-disabled">Extensive</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td align="left" className="ad-padding-tb-10">Last 12 mo:</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsCount}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('CYC') ? this.state.accountSummary.Last12MonthsItems['CYC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('CYE') ? this.state.accountSummary.Last12MonthsItems['CYE'] : ""}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('TDC') ? this.state.accountSummary.Last12MonthsItems['TDC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('TDE') ? this.state.accountSummary.Last12MonthsItems['TDE'] : ""}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('ITC') ? this.state.accountSummary.Last12MonthsItems['ITC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.Last12MonthsItems.hasOwnProperty('ITE') ? this.state.accountSummary.Last12MonthsItems['ITE'] : ""}</td>
                              </tr>
                              <tr>
                                <td align="left" className="ad-padding-tb-10">in {new Date().getFullYear()}:</td>
                                <td align="center">{this.state.accountSummary.CurrentYearCount}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('CYC') ? this.state.accountSummary.CurrentYearItems['CYC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('CYE') ? this.state.accountSummary.CurrentYearItems['CYE'] : ""}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('TDC') ? this.state.accountSummary.CurrentYearItems['TDC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('TDE') ? this.state.accountSummary.CurrentYearItems['TDE'] : ""}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('ITC') ? this.state.accountSummary.CurrentYearItems['ITC'] : ""}</td>
                                <td align="center">{this.state.accountSummary.CurrentYearItems.hasOwnProperty('ITE') ? this.state.accountSummary.CurrentYearItems['ITE'] : ""}</td>
                              </tr>
                            </tbody>
                          </table>
                        :                         
                          <p className="ad-color-white">No current projects.</p>
                      }
                    </div>
                  </Grid>
                  <Grid item sm={12}>
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Account Balance:</h4>
                    <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15">
                      {(Object.keys(this.state.accountSummary).length > 0)
                        ?
                            (this.state.accountSummary.Balance.charAt(0) === "-")
                              ?
                                <span className="ad-color-red semi-bold">{this.state.accountSummary.Balance}</span>
                              :
                                <span className="ad-color-white">{this.state.accountSummary.Balance}</span>
                        :
                          <p className="ad-color-white">No current balance.</p>
                      }
                    </div>
                  </Grid>
                </Grid>
              </div>

            : (this.state.clientView === "CompanyPortfolio") ?
              <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
                <Grid container spacing={1} direction="column" justify="center" alignItems="stretch" alignContent="center">
                  <Grid item sm={6}>
                    <h4 className="ad-align-left ad-border-b-gold ad-color-white">Under construction:</h4>
                    <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15 ad-lineheight-default">
                      <span className="ad-color-white">Once we enable federated login support, you will be able to control access to AccuDiligence
                      and have visibility into the company's portfolio of diligences and their metrics. Thank you for your patience.</span>
                    </div>
                  </Grid>
                </Grid>
              </div>
      
            : (this.state.clientView === "Projects") ?
                <ClientProjects usrEmail={this.props.usrEmail} ClientID={this.props.ClientID} jwt={this.props.jwt} changeView={this.handleChangeView} newProjNotice={this.state.newProjNotice} />
                
            : (this.state.clientView === "projectDetails") ?
                <ClientProjectDetails usrEmail={this.props.usrEmail} ClientID={this.props.ClientID} jwt={this.props.jwt} changeView={this.handleChangeView} newProjNotice={this.state.newProjNotice} />

            : null
          }
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
