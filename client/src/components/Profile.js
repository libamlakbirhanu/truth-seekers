import React from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import { uploadImage, userLogout } from '../redux/actions/userActions';
import EditDetails from './EditDetails';
import SkeletonUser from './SkeletonUser';

import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CalendarToday from '@material-ui/icons/CalendarToday';
import IconButton from '@material-ui/core/IconButton';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';

import { editUser } from './../redux/actions/userActions';

const styles = {
	card: {
		padding: '10px 5px',
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
	rank: {
		fontSize: '20px !important',
		color: '#800080',
	},
	bottomActions: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	center: {
		textAlign: 'center',
		padding: '0 20px',
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
		left: '60%',
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
	const {
		classes,
		loading,
		editUser,
		user: { currentUser, isAuthenticated },
	} = props;

	const imageUrl = isAuthenticated
		? `/static/assets/image/seekers/${currentUser.photo}`
		: '';

	const profileMarkup = (
		<Card className={classes.card}>
			{!loading ? (
				isAuthenticated ? (
					<>
						<Link to={{ pathname: imageUrl }} target="_blank">
							<CardMedia
								className={classes.image}
								image={imageUrl}
								key={currentUser.photo}
							/>
						</Link>

						<input
							type="file"
							id="imageInput"
							name="photo"
							hidden="hidden"
							onChange={(event) => handleImageChange(event)(props)}
						/>
						<Tooltip title="change profile picture" placement="top">
							<IconButton
								onClick={handleImageEdit}
								className={classes.editIcon}
							>
								<AddAPhotoIcon color="primary" fontSize="small" />
							</IconButton>
						</Tooltip>

						<div className={classes.userContent}>
							<Typography
								component={Link}
								to={`/seeker/${currentUser._id}`}
								style={{ fontSize: 13 }}
							>{`@${currentUser.name}`}</Typography>
						</div>
						<div className={classes.userContent}>
							<Typography className={classes.rank}>
								{currentUser.rank}
							</Typography>{' '}
							<StarIcon style={{ color: 'yellow' }} />
						</div>
						<div className={classes.userContent}>
							<EmailIcon color="primary" fontSize="small" />
							<div className={classes.sizedBox}></div>
							<span>{currentUser.email}</span>
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
							<EditDetails
								target={currentUser}
								details={{ firstTextField: 'name', secondTextField: 'email' }}
								edit={editUser}
							/>
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
				)
			) : (
				<SkeletonUser />
			)}
		</Card>
	);

	return profileMarkup;
};

const mapStateToProps = (state) => {
	return {
		loading: state.user.loading,
		user: state.user,
	};
};

const mapStateToDispatch = {
	uploadImage,
	userLogout,
	editUser,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(Profile));
