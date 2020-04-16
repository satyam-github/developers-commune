import * as actionTypes from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function(state=initialState, action) {

    switch(action.type) {
        case actionTypes.GET_ALL_PROFILE:
             return {
                 ...state,
                 profiles: action.payload,
                 loading: false
             }
        case actionTypes.GET_PROFILE:
        case actionTypes.UPDATE_PROFILE:
        case actionTypes.DELETE_PROFILE:
        case actionTypes.DELETE_EXPERIENCE:
        case actionTypes.DELETE_EDUCATION:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }
        case actionTypes.GET_REPOS:
            return {
                ...state,
                repos: action.payload,
                loading: false
            }
        case actionTypes.PROFILE_ERROR:
            return {
                ...state,
                error: action.payload,
                profile: null,
                loading: false
            }
        case actionTypes.CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loading: true,
                repos: []
            }
        default:
            return state;
    }
}