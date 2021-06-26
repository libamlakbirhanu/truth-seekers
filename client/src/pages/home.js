import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Seek from '../components/Seek';

class home extends Component {
	state = {
		seeks: null,
	};

	async componentDidMount() {
		try {
			const res = await axios.get('/seeks');

			this.setState({
				seeks: res.data.data.docs,
			});
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		const seekMarkup = this.state.seeks
			? this.state.seeks.map((seek) => <Seek key={seek.id} seek={seek} />)
			: 'content loading...';

		return (
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12}>
					<div>{seekMarkup}</div>
				</Grid>
				<Grid item sm={4} xs={12}>
					<p>Profile...</p>
				</Grid>
			</Grid>
		);
	}
}

export default home;
