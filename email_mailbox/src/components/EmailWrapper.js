import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Email from './Email';

class EmailWrapper extends Component {
  constructor() {
    super();
    this.state = {
      displayEmail: false,
      displayPopOverEmailDetail: false,
      displayPopOverMenuAction: false,
      hideView: false
    };
  }

  render() {
    return (
      <Email
        displayEmail={this.state.displayEmail}
        displayPopOverEmailDetail={this.state.displayPopOverEmailDetail}
        displayPopOverMenuAction={this.state.displayPopOverMenuAction}
        hideView={this.state.hideView}
        onToggleEmail={this.onToggleEmail}
        onTooglePopOverEmailDetail={this.onTooglePopOverEmailDetail}
        onTogglePopOverMenuAction={this.onTogglePopOverMenuAction}
        unsendButtonOnClicked={this.setHideView}
        {...this.props}
      />
    );
  }

  onToggleEmail = () => {
    if (!this.props.staticOpen) {
      this.setState({
        displayEmail: !this.state.displayEmail
      });
    }
  };

  onTooglePopOverEmailDetail = () => {
    this.setState({
      displayPopOverEmailDetail: !this.state.displayPopOverEmailDetail
    });
  };

  onTogglePopOverMenuAction = () => {
    this.setState({
      displayPopOverMenuAction: !this.state.displayPopOverMenuAction
    });
  };

  setHideView = value => {
    this.setState({
      hideView: value
    });
  };
}

EmailWrapper.propTypes = {
  displayEmail: PropTypes.func,
  staticOpen: PropTypes.bool
};

export default EmailWrapper;