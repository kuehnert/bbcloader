import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from '../actions';

const format = new Intl.DateTimeFormat('en-GB', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
});

export class Status extends Component {
	componentDidMount() {
		this.props.getStatus();
	}

	render() {
		const { externalIP, isOnline, currentVideo, lastUpdate } = this.props.status;
		console.log(currentVideo);

		if (!lastUpdate) return <div>Loading...</div>

		const lastUpdateStr = format.format(new Date(lastUpdate));

		return (
			<div>
				<div className="ui segment">
					<div className="ui four column very relaxed stackable grid">
						<div className="column">IP:<br /> {externalIP}</div>
						<div className="column">Online:<br /> {isOnline ? '✔' : '❌'}</div>
						<div className="column">
							Currently downloading:<br /> {currentVideo ? currentVideo.filename : '– none –'}
                        </div>
                        <div className="column">Last Check:<br /> {lastUpdateStr}</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	status: state.status,
});

const mapDispatchToProps = { getStatus };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Status);
