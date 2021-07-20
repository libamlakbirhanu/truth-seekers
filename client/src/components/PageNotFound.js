import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';

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
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<WarningIcon
					id="warningIcon"
					color="primary"
					style={{ fontSize: 72 }}
				/>
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
