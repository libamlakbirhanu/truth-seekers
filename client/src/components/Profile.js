import React from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import { uploadImage, userLogout } from '../redux/actions/userActions';
import EditDetails from './EditDetails';

import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CalendarToday from '@material-ui/icons/CalendarToday';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
	card: {
		padding: '10px 25px',
		position: 'relative',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
		textAlign: 'center',
		margin: '0px auto 20px',
	},
	userContent: {
		padding: '0px',
		marginBottom: 10,
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bottomActions: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	center: {
		textAlign: 'center',
	},
	button: {
		display: 'block',
		marginBottom: 10,
	},
	sizedBox: {
		width: 10,
		margin: 0,
	},
	editIcon: {
		position: 'absolute',
		right: '15%',
		top: '75px',
	},
};

const handleImageChange = (event) => (props) => {
	const image = event.target.files[0];
	const formData = new FormData();

	formData.append('photo', image);

	props.uploadImage(formData);
};

const handleImageEdit = () => {
	const input = document.getElementById('imageInput');
	input.click();
};

const Profile = (props) => {
	const { classes, currentUser, isAuthenticated, loading } = props;

	const profileMarkup = !loading ? (
		<Card className={classes.card}>
			{isAuthenticated ? (
				<>
					<CardMedia
						component={Link}
						to={`/seekers/${currentUser._id}`}
						className={classes.image}
						image={`http://localhost:5000/static/image/seekers/${currentUser.photo}`}
						key={currentUser.photo}
					></CardMedia>
					<input
						type="file"
						id="imageInput"
						name="photo"
						hidden="hidden"
						onChange={(event) => handleImageChange(event)(props)}
					/>
					<Tooltip title="edit profile picture" placement="top">
						<IconButton onClick={handleImageEdit} className={classes.editIcon}>
							<EditIcon color="primary" fontSize="small" />
						</IconButton>
					</Tooltip>
					<div className={classes.userContent}>
						<Typography
							component={Link}
							to={`/seekers/${currentUser._id}`}
						>{`@${currentUser.name}`}</Typography>
					</div>
					<div className={classes.userContent}>
						<EmailIcon color="primary" fontSize="small" />
						<div className={classes.sizedBox}></div>
						{currentUser.email}
					</div>
					<div className={classes.userContent}>
						<CalendarToday color="primary" fontSize="small" />
						<div className={classes.sizedBox}></div>
						<span>{`Joined ${dayjs(currentUser.date).format(
							'MMM YYYY'
						)}`}</span>
					</div>
					<div className={classes.bottomActions}>
						<Tooltip title="log out" placement="top">
							<IconButton onClick={() => props.userLogout()}>
								<ExitToAppIcon color="primary" fontSize="small" />
							</IconButton>
						</Tooltip>
						<EditDetails />
					</div>
				</>
			) : (
				<div className={classes.center}>
					<p>No profile found, please login or signup...</p>
					<br />
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						component={Link}
						to="/login"
					>
						Login
					</Button>
					<Button
						className={classes.button}
						variant="contained"
						color="secondary"
						component={Link}
						to="/signup"
					>
						Signup
					</Button>
				</div>
			)}
		</Card>
	) : (
		<p>loading...</p>
	);

	return profileMarkup;
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};

const mapStateToDispatch = {
	uploadImage,
	userLogout,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(Profile));
