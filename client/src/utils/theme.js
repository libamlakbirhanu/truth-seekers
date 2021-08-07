const themeUtil = {
	palette: {
		primary: {
			light: '#ff33ff',
			main: '#800080',
			dark: '#330033',
			constrastText: '#fff',
		},
		secondary: {
			light: '#aa33ff',
			main: '#4b0082',
			dark: '#1e0033',
			constrastText: '#fff',
		},
	},
	typography: {
		useNextVariants: true,
	},
	spreadIt: {
		center: {
			display: 'flex',
			justifyContent: 'center',
		},
		form: {
			marginTop: 20,
		},
		formContainer: {
			width: 300,
			textAlign: 'center',
		},
		block: {
			display: 'block',
		},
		image: {
			width: 150,
			padding: 15,
			paddingTop: 25,
		},
		textField: {
			width: '100%',
			margin: 'auto',
			marginBottom: 20,
		},
		button: {
			marginTop: 20,
			position: 'relative',
		},
		errorBox: {
			display: 'flex',
			textAlign: 'center',
			alignItems: 'center',
			backgroundColor: 'transparent',
			border: '1px solid #c4000085',
			marginTop: 20,
			color: '#c4000085',
			padding: 10,
			borderRadius: 10,
			fontSize: 14,
		},
		progress: {
			position: 'absolute',
		},
	},
};

export default themeUtil;
