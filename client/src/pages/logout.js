import React from 'react';
import { connect } from 'react-redux';

import { userLogout } from '../redux/actions/userActions';

const logout = (props) => {
	props.userLogout(props.history);

	return <div></div>;
};

const mapStateToDispatch = {
	userLogout,
};

export default connect(null, mapStateToDispatch)(logout);
