import { SHA256 } from 'meteor/sha';

import store from '/imports/client/store';
import { callMethod, setErrorText, close } from '/imports/client/store/actions/modalActions';
import { deleteCustomerOrganization } from '/imports/api/organizations/methods';
import swal from '/imports/ui/utils/swal';
import { ORG_DELETE, ORG_DELETE_PASSWORD } from '/imports/api/swal-params';
import { compileTemplateObject } from '/imports/api/helpers';


export const onOrgDelete = ({
  _id: organizationId,
  name: orgName,
}) => () => {
  const deleteOrg = (password) => {
    if (!password) {
      swal.close();
      return store.dispatch(setErrorText('Password can not be empty'));
    }

    const adminPassword = SHA256(password); // eslint-disable-line new-cap

    return store.dispatch(callMethod(deleteCustomerOrganization, { organizationId, adminPassword }))
      .then(() => {
        store.dispatch(close);
        swal.success('Success', `Organization ${orgName} has been deleted`);
      });
  };

  const showPasswordInput = () =>
    swal(compileTemplateObject(ORG_DELETE_PASSWORD, { orgName }), deleteOrg);

  return swal(ORG_DELETE, showPasswordInput);
};
