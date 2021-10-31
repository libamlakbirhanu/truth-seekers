import React, { useState } from 'react';
import { connect } from 'react-redux';

function Pagination({ postsPerPage, seeks, paginate, prev, next }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalSeeks, setTotalSeeks] = useState(seeks.length);
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(seeks.length / postsPerPage); i++) {
		pageNumbers.push(i);
	}

	const handleClick = (number) => {
		setCurrentPage(number);
		paginate(number);
	};

	const handleNext = () => {
		currentPage !== Math.ceil(seeks.length / postsPerPage) &&
			setCurrentPage(currentPage + 1);
		next();
	};

	const handlePrev = () => {
		currentPage !== 1 && setCurrentPage(currentPage - 1);
		prev();
	};

	if (totalSeeks !== seeks.length) {
		setCurrentPage(1);
		paginate(1);
		setTotalSeeks(seeks.length);
	}

	return (
		<nav style={{ margin: 'auto' }}>
			<ul className="pagination">
				{currentPage !== 1 && (
					<button className="arrows" onClick={handlePrev}>
						prev
					</button>
				)}
				{pageNumbers.map((number) => (
					<li
						key={number}
						className="listItem"
						onClick={() => handleClick(number)}
					>
						<span className={`pageLink ${number === currentPage && 'active'}`}>
							{number}
						</span>
					</li>
				))}
				{currentPage !== pageNumbers.length && (
					<button className="arrows" onClick={handleNext}>
						next
					</button>
				)}
			</ul>
		</nav>
	);
}

const mapStateToProps = (state) => {
	return {
		seeks: state.data.seeks,
	};
};

export default connect(mapStateToProps)(Pagination);
