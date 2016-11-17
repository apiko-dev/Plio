import React from 'react';

import propTypes from './propTypes';
import FieldRead from '../FieldRead';
import FieldReadBlock from '../FieldReadBlock';
import _user_ from '/imports/startup/client/mixins/user';

const NotifyRead = ({ users }) => (
  <FieldReadBlock label="Notify changes">
    <FieldRead>
      {users.map(_user_.userNameOrEmail).join(', ')}
    </FieldRead>
  </FieldReadBlock>
);

NotifyRead.propTypes = propTypes;

export default NotifyRead;