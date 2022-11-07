// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { API } from 'aws-amplify';
//import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import './ClientProjects.css';
import pdficon from '../img/pdficon.png';

export default class ClientProjects extends React.Component {
    constructor(props) { 
      super(props);
      this.handleChangeActivePage = this.handleChangeActivePage.bind(this);
      this.handleChangeActiveRowsPerPage = this.handleChangeActiveRowsPerPage.bind(this);
      this.handleChangeClosedPage = this.handleChangeClosedPage.bind(this);
      this.handleChangeClosedRowsPerPage = this.handleChangeClosedRowsPerPage.bind(this);    
      this.handleNewProjectClick = this.handleNewProjectClick.bind(this)
      this.state = { 
        activeProjects: {},
        closedProjects: {},
        activeRowsPerPage: 10,
        activePage:1,
        closedRowsPerPage: 10,
        closedPage:1
      };
    }

    handleNewProjectClick(e) {
        e.preventDefault();
        this.props.changeView("NewProject");
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
            API.post('getclientprojects', '/', payLoad ).then(response => {
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
    }

    render() {
        return (
            <div className="ad-margin-center ad-page-fullheight ad-newuser-background ad-padding-t-80">
                <Grid container spacing={1} direction="column" justify="flex-start" alignItems="stretch" alignContent="center">
                    <Grid item sm={12}>
                        <h4 className="ad-align-left ad-border-b-gold ad-color-white">Open &#47; Active Projects:</h4>
                        <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15">
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="open projects table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Project Name</TableCell>
                                            <TableCell align="left">Type</TableCell>
                                            <TableCell align="center">Creation Date</TableCell>
                                            <TableCell align="center">Target Activated On</TableCell>
                                            <TableCell align="center">Request Delivery By</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {(Object.keys(this.state.activeProjects).length > 0) ?
                                        <TableBody>
                                            {this.state.activeProjects.records.map((record) => (
                                                <TableRow key={record.ID}>
                                                    <TableCell align="left" component="th" scope="row">
                                                        {record.ProjectName} &nbsp;&nbsp;
                                                        {this.props.newProjNotice && record.ID===this.props.newProjNotice && <span className="newProjSticker">NEW</span>}
                                                    </TableCell>
                                                    <TableCell align="left">{record.Type}</TableCell>
                                                    <TableCell align="center">{record.CreationDate}</TableCell>
                                                    <TableCell align="center">{record.ActivationDate}</TableCell>
                                                    <TableCell align="center">{record.RequestDeliveryBy}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    : null
                                    }
                                </Table>
                                {((Object.keys(this.state.activeProjects).length > 0) && (this.state.activeProjects.totalRows > this.state.activeProjects.pgSize)) ?
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
                            </TableContainer>
                        </div>
                    </Grid>
                    <Grid item sm={12}>
                        <div className="tableGap">
                            <h4 className="ad-align-left ad-border-b-gold ad-color-white">Closed &#47; Completed Projects:</h4>
                            <div className="ad-display-flex-h ad-margin-t-5 ad-margin-b-15">
                                {(Object.keys(this.state.closedProjects).length > 0) ?
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="closed projects table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Project Name</TableCell>
                                                    <TableCell align="left">Type</TableCell>
                                                    <TableCell align="center">Creation Date</TableCell>
                                                    <TableCell align="center">Requested Delivery By</TableCell>
                                                    <TableCell align="center">Delivered On</TableCell>
                                                    <TableCell align="center"><img src={pdficon} alt="PDF document" width="20px" height="25px" /></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.closedProjects.records.map((record, index) => (
                                                    <TableRow key={record.ID}>
                                                        <TableCell align="left" component="th" scope="row">{record.ProjectName}</TableCell>
                                                        <TableCell align="left">{record.Type}</TableCell>
                                                        <TableCell align="center">{record.CreationDate}</TableCell>
                                                        <TableCell align="center">{record.RequestDeliveryBy}</TableCell>
                                                        <TableCell align="center">{record.DeliveryGenerationDT}</TableCell>
                                                        <TableCell align="center"><img src={pdficon} alt="PDF document" /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {(this.state.closedProjects.totalRows > this.state.closedProjects.pgSize) ?
                                            <TablePagination
                                                component="div"
                                                count={this.state.closedProjects.totalRows}
                                                page={this.state.closedProjects.page-1}
                                                onChangePage={this.handleChangeClosedPage}
                                                rowsPerPage={this.state.closedProjects.pgSize}
                                                onChangeRowsPerPage={this.handleChangeClosedRowsPerPage}
                                            />
                                        : null
                                        }
                                    </TableContainer>
                                : null
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    } 
}  
