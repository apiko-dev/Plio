import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


const getWorkflowDefaultsConfig = (field, label) => {
  return [
    {
      field: `workflowDefaults.${field}.workflowType`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              `Workflow type for ${label} changed ` +
              `from "{{oldValue}}" to "{{newValue}}"`
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              `{{userName}} changed workflow type for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.workflowType`
        ];
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeUnit`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              `Default step time for ${label} changed ` +
              `from "{{oldValue}}" to "{{newValue}}"`
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeUnit`
        ];
        const timeVal = newDoc.workflowDefaults[field].stepTime.timeValue;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${timeVal} ${newValue}`,
          oldValue: () => `${timeVal} ${oldValue}`
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeValue`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_CHANGED]:
              `Default step time for ${label} changed ` +
              `from "{{oldValue}}" to "{{newValue}}"`
          }
        }
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeValue`
        ];
        const timeUnit = newDoc.workflowDefaults[field].stepTime.timeUnit;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${newValue} ${timeUnit}`,
          oldValue: () => `${oldValue} ${timeUnit}`
        };
      },
      receivers: getReceivers
    },
  ];
};

export default [
  ...getWorkflowDefaultsConfig('minorProblem', 'minor non-conformities/risks'),
  ...getWorkflowDefaultsConfig('majorProblem', 'major non-conformities/risks'),
  ...getWorkflowDefaultsConfig('criticalProblem', 'critical non-conformities/risks')
];