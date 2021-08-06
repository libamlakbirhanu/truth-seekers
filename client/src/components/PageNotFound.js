import React from 'react';

import notFound from '../assets/notFound.png';

export default function PageNotFound() {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				marginTop: '150px',
			}}
		>
			<p
				style={{
					color: 'rgba(220, 178, 250)',
					width: '100%',
					fontSize: '72px',
					margin: 0,
					textAlign: 'center',
				}}
			>
				404
			</p>
			<img
				src={notFound}
				alt="page not found"
				style={{ width: 300, height: 300 }}
			/>

			<div
				style={{
					marginTop: 20,
					width: '100%',
					textAlign: 'center',
				}}
			>
				<h1
					id="notFound"
					style={{
						display: 'inline',
						color: '#800080',
						marginLeft: '10px',
						fontSize: 36,
					}}
				>
					PAGE NOT FOUND
				</h1>
			</div>
		</div>
	);
}
