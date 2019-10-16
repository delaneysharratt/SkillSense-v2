import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//COMPONENT IMPORTS
import SkillList from '../SkillList/SkillList';

//MATERIAL-UI IMPORTS
import { Typography, Button, Grid } from '@material-ui/core';
import OneColumnLayout from '../OneColumnLayout/OneColumnLayout'
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const styles = theme => ({
    button: {
        display: 'block',
        margin: theme.spacing(3, 0),
        padding: theme.spacing(1),
        color: 'white'
    },
});

class JobDetail extends Component {
    componentDidMount() {
        this.props.dispatch({
            type: 'FETCH_JOB_DETAIL',
            payload: { id: Number(this.props.match.params.id) }
        });
    }
    //route to apply for this job (student view)
    applyNow = () => {
        this.props.history.push(`/jobs/detail/apply/${this.props.match.params.id}`);
    };

    //route to view all applications for this job (client view)
    viewApplicants = () => {
        this.props.history.push(`/jobs/detail/applications/${this.props.match.params.id}`);
    };

    //route to return to previous page (student view)
    routeBack = () => {
        this.props.history.push(`/search/jobs`);
    };

    //route to return to previous page (client view)
    routeBackClient = () => {
        this.props.history.push(`/jobs`);
    };

    //updates job status to Completed
    markedCompleted = () => {
        console.log('mark completed working')
        Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to reverse this command!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#04b8f3',
            cancelButtonColor: '#505d68',
            confirmButtonText: 'Yes, submit it!'
        }).then(result => {
            if (result.value) {
                this.props.dispatch({
                    type: 'MARK_JOB_COMPLETED',
                    payload: { id: this.props.match.params.id }
                });this.props.history.push(`/jobs`)
            }
        });}

    render() {
        let { details } = this.props;

        //checks if user type should be able to view this element
        let isStudent = () => {
            return this.props.user.user_type === 'Student';
        };
        let isClient = () => {
            return this.props.user.user_type === 'Client';
        };

        return (
            <OneColumnLayout header="Job Details">
                <Grid spacing={3} container justify="center">
                    <Grid item xs={12} align="center">
                        <Typography variant="h3" color="primary">
                            {details.project_title}
                        </Typography>
                        <Typography variant="h5" color="secondary">
                            Seeking: {details.position_title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} align="left">
                        <Typography variant="h5" color="secondary">Client: {details.username}</Typography>
                        <Typography>Location: {details.location}</Typography>
                        <Typography>Duration: {details.duration}</Typography>
                        <Typography>Budget: ${details.budget}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} align="left">
                        <Typography variant="h5" color="secondary">
                            Description:
                        </Typography>
                        <Typography>{details.description}</Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5" color="secondary">
                            Desired Skills:
                        </Typography>
                        <SkillList skillList={details.skills} />
                    </Grid>

                    {isStudent() && this.props.details.hired === null ?
                        <Grid item xs={12} align="center">
                            <Button variant="contained" color="primary" onClick={this.applyNow}>Apply</Button>
                            <Button
                                variant="contained" color="secondary" align="space-around" onClick={() => this.routeBack()}>
                                Back
                            </Button>
                        </Grid> : null}

                    {isClient() && (
                        <Grid item xs={12} align="center">
                            <Button variant="contained" color="primary" onClick={this.viewApplicants}>
                                View Applicants
                            </Button>
                            {this.props.details.status_id === 3 &&
                                <Button variant="outlined" color="primary" onClick={this.markedCompleted}>
                                    Completed Project
                                </Button>}
                            <Button
                                variant="contained" color="secondary" align="space-around" onClick={() => this.routeBackClient()}>
                                Back
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </OneColumnLayout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    skills: state.allSkillsReducer,
    selectedUserSkills: state.userSkillsReducer,
    details: state.selectedJobReducer
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(JobDetail)));
