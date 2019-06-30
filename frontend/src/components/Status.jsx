import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from '../actions';

export class Status extends Component {
	componentDidMount() {
		this.props.getStatus();
	}

	render() {
		const { externalIP, isOnline, currentDownload, lastCheck } = this.props.status;

		return (
			<div>
				<div className="ui segment">
					<div className="ui four column very relaxed stackable grid">
						<div className="column">IP:<br /> {externalIP}</div>
						<div className="column">Online:<br /> {isOnline ? '✔' : '❌'}</div>
						<div className="column">
							Currently downloading:<br /> {currentDownload ? currentDownload.title : '– none –'}
                        </div>
                        <div className="column">Last Check:<br /> {lastCheck}</div>
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
