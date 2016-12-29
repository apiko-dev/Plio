import { Changelog } from '/imports/share/collections/server/changelog.js';
import AuditConfigs from '/imports/audit/audit-configs.js';
import AuditManager from '/imports/share/utils/audit-manager.js';
import DocChangeHandler from '/imports/audit/DocChangeHandler.js';
import ActionAuditConfig from '/imports/audit/configs/actions/action-audit-config.js';
import NCAuditConfig from '/imports/audit/configs/non-conformities/nc-audit-config.js';
import RiskAuditConfig from '/imports/audit/configs/risks/risk-audit-config.js';
import StandardAuditConfig from '/imports/audit/configs/standards/standard-audit-config.js';
import OccurenceAuditConfig from '/imports/audit/configs/occurrences/occurence-audit-config.js';
import LessonAuditConfig from '/imports/audit/configs/lessons/lesson-audit-config.js';
import MessageAuditConfig from '/imports/audit/configs/messages/message-audit-config.js';
import OrgAuditConfig from '/imports/audit/configs/organizations/org-audit-config.js';
import WorkItemAuditConfig from '/imports/audit/configs/work-items/work-item-audit-config.js';


const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig,
  RiskAuditConfig,
  StandardAuditConfig,
  OccurenceAuditConfig,
  LessonAuditConfig,
  MessageAuditConfig,
  OrgAuditConfig,
  WorkItemAuditConfig
];

_(auditConfigs).each((config) => {
  AuditConfigs.add(config);
  AuditManager.registerCollection(config.collection, config.collectionName);
});

AuditManager.startAudit();

Changelog.find().observe({
  added: ({ _id, collection, changeKind, newDocument, oldDocument, userId }) => {
    try {
      const auditConfig = AuditConfigs.get(collection);

      new DocChangeHandler(auditConfig, changeKind, {
        newDocument, oldDocument, userId
      }).handleChange();
    } finally {
      Changelog.remove({ _id });
    }
  }
});
