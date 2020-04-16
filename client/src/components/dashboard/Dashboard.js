import React, { useEffect , Fragment } from 'react';
import PropTypes from 'prop-types';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../UI/Spinner';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Dashboard = (props) => {

    useEffect(() => {
        props.getCurrentProfile();
    }, []);

    return (
        <div>
            {(props.profile.loading && props.profile.profile === null)
                ? <Spinner /> 
                : <Fragment>
                    <section className="container">
                        <h1 className="large text-primary">
                            Dashboard
                        </h1>
                        <p className="lead">
                            <i className="fas fa-user"></i> 
                            Welcome {props.auth.user && props.auth.user.name}
                        </p>
                        {props.profile.profile !== null 
                            ?(<Fragment>
                                <DashboardActions />
                                <Experience experience={props.profile.profile.experience} />
                                <Education education={props.profile.profile.education} />
                                
                                <div className='my-2'>
                                    <button className='btn btn-danger' onClick={() => props.deleteAccount()}>
                                    <i className='fas fa-user-minus' /> Delete My Account
                                    </button>
                                </div>
                              </Fragment>)
                            :(<Fragment>
                                <p>You have not added profile.</p>
                                <Link to='/create-profile' className="btn btn-primary my-1">
                                    Create Profile
                                </Link>
                            </Fragment>)}
                    </section>
                </Fragment> }
        </div>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);