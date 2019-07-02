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

    if (!lastUpdate)
      return (
        <div>
          <div className="ui padded segment" style={{ height: '6em' }}>
            <div className="ui active dimmer">
              <div className="ui medium text loader">Loading…</div>
            </div>
          </div>
        </div>
      );

    const lastUpdateStr = format.format(new Date(lastUpdate));
    const diff = new Date() - new Date(lastUpdate);

    const className = `ui inverted segment ${isOnline ? 'green' : 'orange'}`;

    return (
      <div>
        <div className="ui horizontal segments">
          <div className={className}>
            <p>IP</p>
            <h4>{externalIP}</h4>
          </div>
          <div className={className}>
            <p>Online</p>
            <h4>{isOnline ? '✔' : '❌'}</h4>
          </div>
          <div className={`ui inverted segment ${diff < 300 ? 'green' : 'orange'}`}>
            <p>Last Check</p>
            <h4>{lastUpdateStr}</h4>
          </div>
          <div className={`ui inverted segment ${currentVideo ? 'yellow' : 'grey'}`}>
            <p>Currently downloading</p>
            <h4>{currentVideo ? currentVideo.filename : '–'}</h4>
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
