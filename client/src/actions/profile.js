import axios from 'axios';
import { setAlert } from './alert';
import * as actionTypes from './types';

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: actionTypes.GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Get all profiles
export const getAllProfiles = () => async dispatch => {
    dispatch({ type: actionTypes.CLEAR_PROFILE });
    try {
        const res = await axios.get('/api/profile');
        
        dispatch({
            type: actionTypes.GET_ALL_PROFILE,
            payload: res.data
        });
        
    } catch (err) {
        
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Get profile by ID
export const getProfileById = (userId) => async dispatch => {
    // dispatch({ type: actionTypes.CLEAR_PROFILE });
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type: actionTypes.GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// Get githubrepos 
export const getGithubRepos = (username) => async dispatch => {
    
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type: actionTypes.GET_REPOS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: actionTypes.GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated Successfully' : 'Profile Created', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Add experience

export const addExperience = (experience, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', experience, config);
        dispatch({
            type: actionTypes.UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience added successfully', 'success'));
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Add Education 
export const addEducation = (education, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', education, config);
        dispatch({
            type: actionTypes.UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education added successfully', 'success'));
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Delete Experience
export const deleteExperience = (id) => async dispatch => {
    try {
        
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: actionTypes.DELETE_EXPERIENCE,
            payload: res.data
        })
        dispatch(setAlert('Experience deleted successfully', 'success'));
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Delete Education
export const deleteEducation = (id) => async dispatch => {
    try {
        console.log(id);
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: actionTypes.DELETE_EDUCATION,
            payload: res.data
        })
        dispatch(setAlert('Education deleted Successfully', 'success'));
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: { 
                msg: err.response.statusText, 
                status: err.response.status 
            }
        });
    }
}

// Delete account & profile
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await axios.delete('/api/profile');
  
        dispatch({ type: actionTypes.CLEAR_PROFILE });
        dispatch({ type: actionTypes.DELETE_ACCOUNT });
  
        dispatch(setAlert('Your account has been permanantly deleted'));
      } catch (err) {
        dispatch({
          type: actionTypes.PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
    }
  };