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
			marginTop: 30,
		},
		formContainer: {
			width: 350,
			textAlign: 'center',
		},
		block: {
			display: 'block',
		},
		image: {
			width: 100,
			padding: 15,
		},
		textField: {
			width: '100%',
			marginBottom: 20,
		},
		button: {
			marginTop: 20,
			position: 'relative',
		},
		errorBox: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#ff3333',
			marginTop: 20,
			color: 'white',
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
