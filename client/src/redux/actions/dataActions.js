import {
	SET_SEEKS,
	LOADING_DATA,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
} from '../types';
import axios from 'axios';

export const getSeeks = () => (dispatch) => {
	dispatch({
		type: LOADING_DATA,
	});
	axios
		.get('/seeks')
		.then((res) => {
			dispatch({ type: SET_SEEKS, payload: res.data.data.docs });
		})
		.catch((err) => console.error(err.response));
};

export const upvoteSeek = (id) => (dispatch) => {
	axios
		.patch(`/seeks/${id}/upvote`)
		.then((res) => {
			dispatch({
				type: UPVOTE_SEEK,
				payload: res.data.result,
			});
		})
		.catch((err) => console.error(err));
};

export const downvoteSeek = (id) => (dispatch) => {
	axios
		.patch(`/seeks/${id}/downvote`)
		.then((res) => {
			dispatch({
				type: DOWNVOTE_SEEK,
				payload: res.data.result,
			});
		})
		.catch((err) => console.error(err));
};

export const deleteSeek = (id) => (dispatch) => {
	axios
		.delete(`/seeks/${id}`)
		.then((res) => {
			dispatch({
				type: DELETE_SEEK,
				payload: res.data.doc,
			});
		})
		.catch((err) => console.error(err));
};
