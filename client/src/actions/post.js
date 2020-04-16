import axios from 'axios';
import * as actionTypes from './types';
import { setAlert } from './alert';

// Get all posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: actionTypes.GET_POSTS,
            payload: res.data
        })
        // dispatch(setAlert(''));

    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status                
            }
        });
    }
}

// Add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: actionTypes.UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: actionTypes.UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Add comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    
    try {

        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
        
        dispatch({
            type: actionTypes.ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert('Comment added successfully', 'success'));
    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
      await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
  
      dispatch({
        type: actionTypes.REMOVE_COMMENT,
        payload: commentId
      });
  
      dispatch(setAlert('Comment Removed', 'success'));
    } catch (err) {
      dispatch({
        type: actionTypes.POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

//  Add Post 
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    try {
        const res = await axios.post('/api/posts', formData, config);
        dispatch({
            type: actionTypes.ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post created successfully', 'success'));
    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Delete Post
export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({
            type: actionTypes.DELETE_POST,
            payload: id
        })
        dispatch(setAlert('Post has been deleted', 'danger'));
    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}

// Get post by ID
export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: actionTypes.GET_POST,
            payload: res.data
        })
        // dispatch(setAlert(''));

    } catch (err) {
        dispatch({
            type: actionTypes.POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status                
            }
        });
    }
}
