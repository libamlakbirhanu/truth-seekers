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
	SET_EDITED_TO_FALSE,
	SET_SEEK,
	POST_COMMENT,
	DELETE_COMMENT,
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
	EDIT_COMMENT,
	SET_MULTIPLE_ERRORS,
	CLEAR_MULTIPLE_ERRORS,
} from '../types';
import swearWords from '../../assets/profanity';

export const getSeeks = () => (dispatch) => {
	dispatch({
		type: LOADING_DATA,
	});

	axios
		.get('/api/seeks')
		.then((res) => {
			dispatch({ type: SET_SEEKS, payload: res.data.data.docs });
		})
		.catch((err) => console.error(err.response));

	setInterval(() => {
		axios
			.get('/api/seeks')
			.then((res) => {
				dispatch({ type: SET_SEEKS, payload: res.data.data.docs });
			})
			.catch((err) => console.error(err.response));
	}, 5000);
};

export const getSeek = (id) => (dispatch) => {
	axios
		.get(`/api/seeks/${id}`)
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

export const clearErrors = () => (dispatch) => {
	dispatch({
		type: CLEAR_MULTIPLE_ERRORS,
	});
};

export const createSeek = (newSeek) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});
	dispatch({
		type: CLEAR_MULTIPLE_ERRORS,
	});

	let foundSwearsInBody = false;
	let foundSwearsInTitle = false;

	for (const word of newSeek.body.split(' ')) {
		if (swearWords.includes(word.toLowerCase())) {
			foundSwearsInBody = true;
			break;
		}
	}

	for (const word of newSeek.title.split(' ')) {
		if (swearWords.includes(word.toLowerCase())) {
			foundSwearsInTitle = true;
			break;
		}
	}

	if (foundSwearsInBody || foundSwearsInTitle) {
		dispatch({
			type: SET_MULTIPLE_ERRORS,
			errors: {
				title: foundSwearsInTitle && 'profanity is not allowed',
				body: foundSwearsInBody && 'profanity is not allowed',
			},
		});
		dispatch({
			type: LOADING_UI,
		});
	} else {
		axios
			.post('/api/seeks', newSeek)
			.then((res) => {
				dispatch({ type: POST_SEEK, payload: res.data.result });
				dispatch({
					type: LOADING_UI,
				});
			})
			.catch((err) => {
				const title =
					err.response.data.error.errors.title &&
					err.response.data.error.errors.title.message;
				const body =
					err.response.data.error.errors.body &&
					err.response.data.error.errors.body.message;

				dispatch({
					type: SET_MULTIPLE_ERRORS,
					errors: { title: title && title, body: body && body },
				});
				dispatch({
					type: LOADING_UI,
				});
			});
	}
};

export const editSeek = (seekDetails) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});
	dispatch({
		type: CLEAR_MULTIPLE_ERRORS,
	});
	axios
		.patch(`/api/seeks/${seekDetails.id}`, seekDetails)
		.then((res) => {
			dispatch({
				type: EDIT_SEEK,
				payload: res.data.result,
			});
			dispatch({
				type: LOADING_UI,
			});
		})
		.catch((err) => {
			const title =
				err.response.data.error.errors.title &&
				err.response.data.error.errors.title.message;
			const body =
				err.response.data.error.errors.body &&
				err.response.data.error.errors.body.message;

			dispatch({
				type: SET_MULTIPLE_ERRORS,
				errors: { title: title && title, body: body && body },
			});
			dispatch({
				type: LOADING_UI,
			});
		});
};

export const setEditedToFalse = () => (dispatch) => {
	dispatch({
		type: SET_EDITED_TO_FALSE,
	});
};

export const upvoteSeek = (id) => (dispatch) => {
	axios
		.patch(`/api/seeks/${id}/upvote`)
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
		.patch(`/api/seeks/${id}/downvote`)
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
		.delete(`/api/seeks/${id}`)
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
		.post('/api/comments', commentData)
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
		.delete(`/api/comments/${id}`)
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
		.patch(`/api/comments/${id}/upvote`)
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
		.patch(`/api/comments/${id}/downvote`)
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
		.patch(`/api/comments/${commentDetails.id}`, commentDetails)
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
