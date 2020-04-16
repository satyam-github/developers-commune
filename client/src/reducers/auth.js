import * as actionTypes from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return  {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            }
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
        case actionTypes.AUTH_ERROR:
        case actionTypes.LOGOUT:
        case actionTypes.DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: true,
                user: null
            }
        default:
            return state;
    }   
}