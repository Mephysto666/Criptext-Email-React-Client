import { connect } from 'react-redux';
import randomcolor from 'randomcolor';
import SettingsWrapper from './../components/SettingsWrapper';
import { getCustomeLabels, getSystemLabelToEdit } from './../selectors/labels';
import { addLabel, updateLabel, removeLabel } from './../actions';
import { myAccount, mySettings } from '../utils/electronInterface';
import {
  cleanDataLogout,
  getUserSettings,
  logout,
  logoutApp,
  removeDevice,
  resendConfirmationEmail,
  resetPassword,
  updateAccount,
  updateContactByEmail,
  updateNameEvent,
  setReadTracking,
  checkForUpdates,
  generateLabelUUID
} from './../utils/ipc';
import { appDomain, SectionType } from '../utils/const';
import { defineLastDeviceActivity } from '../utils/TimeUtils';
import { clearStorage } from '../utils/storage';
import {
  sendResetPasswordSendLinkSuccessMessage,
  sendResetPasswordSendLinkErrorMessage
} from '../utils/electronEventInterface';
import string from '../lang';

const mapStateToProps = state => {
  const systemLabels = getSystemLabelToEdit(state);
  const customLabels = getCustomeLabels(state);
  return {
    systemLabels,
    customLabels
  };
};

const formatDevicesData = devices => {
  return devices
    .sort((device1, device2) => {
      const a = new Date(device1.lastActivity.date).getTime();
      const b = new Date(device2.lastActivity.date).getTime();
      return a > b ? -1 : a < b ? 1 : 0;
    })
    .map(device => {
      return {
        name: device.deviceFriendlyName,
        type: device.deviceType,
        deviceId: device.deviceId,
        lastConnection: {
          place: null,
          time: device.lastActivity.date
            ? defineLastDeviceActivity(device.lastActivity.date)
            : string.settings.over_time
        },
        isCurrentDevice: device.deviceId === myAccount.deviceId
      };
    });
};

const deleteDeviceData = async (onUpdateApp, onClickSection) => {
  clearStorage({});
  const nextAccount = await cleanDataLogout({
    recipientId: myAccount.recipientId
  });
  if (nextAccount) {
    const { id, recipientId } = nextAccount;
    const mailbox = {
      id: 1,
      text: 'Inbox'
    };
    onClickSection(SectionType.MAILBOX, { mailboxSelected: mailbox });
    onUpdateApp({ accountId: id, recipientId });
    return;
  }
  await logoutApp();
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddLabel: async text => {
      const color = randomcolor({
        seed: text,
        luminosity: mySettings.theme === 'dark' ? 'dark' : 'bright'
      });
      const uuid = await generateLabelUUID();
      const label = {
        text,
        color: color.replace('#', ''),
        visible: true,
        uuid
      };
      dispatch(addLabel(label));
    },
    onDeleteDeviceData: async () => {
      await deleteDeviceData(ownProps.onUpdateApp, ownProps.onClickSection);
    },
    onGetUserSettings: async () => {
      const settings = await getUserSettings();
      const {
        devices,
        recoveryEmail,
        twoFactorAuth,
        recoveryEmailConfirmed,
        readReceiptsEnabled,
        replyTo
      } = settings;
      return {
        devices: formatDevicesData(devices),
        recoveryEmail,
        twoFactorAuth,
        recoveryEmailConfirmed,
        readReceiptsEnabled,
        replyToEmail: replyTo
      };
    },
    onLogout: async () => {
      const res = await logout();
      return res.status === 200;
    },
    onRemoveLabel: (labelId, labelUuid) => {
      dispatch(removeLabel(String(labelId), labelUuid));
    },
    onRemoveDevice: async params => {
      const { status } = await removeDevice(params);
      return status === 200;
    },
    onResendConfirmationEmail: async () => {
      return await resendConfirmationEmail();
    },
    onUpdateAccount: async params => {
      const recipientId = myAccount.recipientId;
      const { name } = params;
      if (name) {
        const res = await updateNameEvent(params);
        if (res.status === 200) {
          await updateAccount({ ...params, recipientId });
        }
      } else {
        await updateAccount({ ...params, recipientId });
      }
    },
    onUpdateContact: async name => {
      const email = myAccount.email;
      await updateContactByEmail({ email, name });
    },
    onUpdateLabel: params => {
      dispatch(updateLabel(params));
    },
    onResetPassword: async () => {
      const [recipientId, domain] = myAccount.recipientId.split('@');
      const params = {
        recipientId,
        domain: domain || appDomain
      };
      const { status } = await resetPassword(params);
      if (status === 200) {
        sendResetPasswordSendLinkSuccessMessage();
        return;
      }
      sendResetPasswordSendLinkErrorMessage();
    },
    onSetReadReceiptsTracking: async enabled => {
      const { status } = await setReadTracking(enabled);
      return status;
    },
    onCheckForUpdates: () => {
      checkForUpdates();
    }
  };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper);

export { Settings as default, deleteDeviceData };
