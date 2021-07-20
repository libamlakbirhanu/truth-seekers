import axios from 'axios';
import {
	SET_SEEKS,
	LOADING_DATA,
	LOADING_UI,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
	CLEAR_SEEK,
	POST_SEEK,
	EDIT_SEEK,
	SET_SEEK,
	POST_COMMENT,
	DELETE_COMMENT,
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
	EDIT_COMMENT,
} from '../types';

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

	setInterval(() => {
		axios
			.get('/seeks')
			.then((res) => {
				dispatch({ type: SET_SEEKS, payload: res.data.data.docs });
			})
			.catch((err) => console.error(err.response));
	}, 5000);
};

export const getSeek = (id) => (dispatch) => {
	axios
		.get(`/seeks/${id}`)
		.then((res) => {
			dispatch({
				type: SET_SEEK,
				payload: res.data.data,
			});
		})
		.catch((err) => console.error(err.response));
};

export const clearSeek = () => (dispatch) => {
	dispatch({
		type: CLEAR_SEEK,
	});
};

export const createSeek = (newSeek) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post('/seeks', newSeek)
		.then((res) => {
			dispatch({ type: POST_SEEK, payload: res.data.result });
			dispatch({
				type: LOADING_UI,
			});
		})
		.catch((err) => console.error(err));
};

export const editSeek = (seekDetails) => (dispatch) => {
	axios
		.patch(`/seeks/${seekDetails.id}`, seekDetails)
		.then((res) => {
			dispatch({
				type: EDIT_SEEK,
				payload: res.data.result,
			});
		})
		.catch((err) => {
			console.error(err);
		});
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

export const createComment = (commentData) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post('/comments', commentData)
		.then((res) => {
			dispatch({
				type: POST_COMMENT,
				payload: res.data.result,
			});
			dispatch({
				type: LOADING_UI,
			});
		})
		.catch((err) => {
			console.error('error', err.response);
			dispatch({
				type: LOADING_UI,
			});
		});
};

export const deleteComment = (id) => (dispatch) => {
	axios
		.delete(`/comments/${id}`)
		.then((res) => {
			dispatch({
				type: DELETE_COMMENT,
				payload: res.data.doc,
			});
		})
		.catch((err) => console.error(err));
};

export const upvoteComment = (id) => (dispatch) => {
	axios
		.patch(`/comments/${id}/upvote`)
		.then((res) => {
			dispatch({
				type: UPVOTE_COMMENT,
				payload: res.data.result,
			});
		})
		.catch((err) => console.error(err));
};

export const downvoteComment = (id) => (dispatch) => {
	axios
		.patch(`/comments/${id}/downvote`)
		.then((res) => {
			dispatch({
				type: DOWNVOTE_COMMENT,
				payload: res.data.result,
			});
		})
		.catch((err) => console.error(err));
};

export const editComment = (commentDetails) => (dispatch) => {
	axios
		.patch(`/comments/${commentDetails.id}`, commentDetails)
		.then((res) => {
			dispatch({
				type: EDIT_COMMENT,
				payload: res.data.result,
			});
		})
		.catch((err) => {
			console.error(err);
		});
};
