/* eslint react/no-deprecated: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Threads from './Threads';

const SCROLL_BOTTOM_LIMIT = 25;

const UNREAD_SWITCH_STATUS = {
  ENABLED: 'enabled',
  DISABLED: 'disabled'
};

class ThreadsWrapper extends Component {
  constructor() {
    super();
    this.state = {
      hoverTarget: null,
      labels: [],
      lastMinDate: undefined,
      tip: '',
      popupContent: undefined,
      switchStatus: UNREAD_SWITCH_STATUS.ENABLED
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.mailboxSelected !== nextProps.mailboxSelected ||
      this.props.searchParams !== nextProps.searchParams ||
      (nextProps.threadItemsChecked.size === 0 &&
        this.props.threadItemsChecked.size > 0)
    ) {
      this.props.onLoadThreads(
        nextProps.mailboxSelected,
        true,
        nextProps.searchParams
      );
    }
    if (
      this.props.threadItemsChecked.size > 0 &&
      this.props.mailboxSelected !== nextProps.mailboxSelected
    ) {
      this.props.onBackOption();
    }
  }

  render() {
    return (
      <Threads
        {...this.props}
        hoverTarget={this.state.hoverTarget}
        labels={this.state.labels}
        onCloseMessage={this.handleCloseMessage}
        onMouseEnterItem={this.handleMouseEnterItem}
        onMouseLeaveItem={this.handleMouseLeaveItem}
        onScroll={this.handleScroll}
        onChangeSwitch={this.handleChangeSwitch}
        tip={this.state.tip}
        popupContent={this.state.popupContent}
        setPopupContent={this.setPopupContent}
        dismissPopup={this.dismissPopup}
        handlePopupConfirm={this.handlePopupConfirm}
        switchStatus={this.state.switchStatus}
      />
    );
  }

  componentDidMount() {
    if (!this.props.threads.size)
      this.props.onLoadApp(this.props.mailboxSelected, true);
  }

  handleCloseMessage = () => {
    if (this.props.isUpdateAvailable) {
      this.props.onCloseUpdateMessage();
    }
  };

  handleMouseEnterItem = (id, data) => {
    if (typeof data === 'string') {
      return this.setState({
        hoverTarget: id,
        tip: data
      });
    }

    this.setState({
      hoverTarget: id,
      labels: data
    });
  };

  handleMouseLeaveItem = id => {
    if (id !== this.state.hoverTarget) {
      return;
    }

    this.setState({
      hoverTarget: null,
      tip: '',
      labels: null
    });
  };

  handleScroll = e => {
    const scrollTop = e.target.scrollTop;
    const height = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    const lastThread = this.props.threads.last();

    if (scrollTop + height > scrollHeight - SCROLL_BOTTOM_LIMIT && lastThread) {
      const date = lastThread.get('maxDate');
      const threadIdRejected = lastThread.get('threadId');
      if (this.state.lastMinDate !== date) {
        const unreadSwitchStatus = this.props.switchUnreadThreadsStatus;
        const unread =
          unreadSwitchStatus === true ? unreadSwitchStatus : undefined;
        this.setState({ lastMinDate: date }, () => {
          this.props.onLoadThreads(
            this.props.mailboxSelected,
            false,
            this.props.searchParams,
            date,
            threadIdRejected,
            unread
          );
        });
      }
    }
  };

  handleChangeSwitch = ev => {
    const checked = ev.target.checked;
    this.setState({ switchStatus: UNREAD_SWITCH_STATUS.DISABLED }, async () => {
      const { currentUnreadThreadsLength, mailboxSelected } = this.props;
      const loadParams = {
        clear: true,
        unread: checked === true ? checked : undefined
      };
      await this.props.onUnreadToggle(
        checked,
        currentUnreadThreadsLength,
        mailboxSelected,
        loadParams
      );
      this.setState({ switchStatus: UNREAD_SWITCH_STATUS.ENABLED });
    });
  };

  handlePopupConfirm = () => {
    this.setState({ popupContent: undefined }, this.props.onEmptyTrash);
  };

  setPopupContent = popupContent => {
    this.setState({ popupContent });
  };

  dismissPopup = () => {
    this.setState({ popupContent: undefined });
  };
}

ThreadsWrapper.propTypes = {
  currentUnreadThreadsLength: PropTypes.number,
  isUpdateAvailable: PropTypes.bool,
  mailboxSelected: PropTypes.object,
  onBackOption: PropTypes.func,
  onCloseUpdateMessage: PropTypes.func,
  onEmptyTrash: PropTypes.func,
  onLoadApp: PropTypes.func,
  onLoadThreads: PropTypes.func,
  onUnreadToggle: PropTypes.func,
  searchParams: PropTypes.object,
  switchUnreadThreadsStatus: PropTypes.bool,
  threadItemsChecked: PropTypes.object,
  threads: PropTypes.object
};

export { ThreadsWrapper as default, UNREAD_SWITCH_STATUS };
