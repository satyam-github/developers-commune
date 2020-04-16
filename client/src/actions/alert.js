import uuid from 'uuid/v4';
import * as actionTypes from './types';


export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid();
    dispatch({
        type: actionTypes.SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: actionTypes.REMOVE_ALERT, payload: id }), 5000);
};
