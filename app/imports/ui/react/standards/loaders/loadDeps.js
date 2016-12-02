import { batchActions } from 'redux-batched-actions';

import { BackgroundSubs } from '/imports/startup/client/subsmanagers';
import { Departments } from '/imports/share/collections/departments';
import { Files } from '/imports/share/collections/files';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Actions } from '/imports/share/collections/actions';
import { WorkItems } from '/imports/share/collections/work-items';
import { LessonsLearned } from '/imports/share/collections/lessons';
import {
  setDepartments,
  setFiles,
  setNCs,
  setRisks,
  setActions,
  setWorkItems,
  setLessons,
} from '/client/redux/actions/collectionsActions';
import { setDepsReady } from '/client/redux/actions/standardsActions';
import loadMainData from './loadMainData';

export default function loadDeps({ dispatch, organizationId, initializing }, onData) {
  const subscription = BackgroundSubs.subscribe('standardsDeps', organizationId);

  if (subscription.ready()) {
    const query = { organizationId };
    const pOptions = { sort: { serialNumber: 1 } };
    const departments = Departments.find(query, { sort: { name: 1 } }).fetch();
    const files = Files.find(query, { sort: { updatedAt: -1 } }).fetch();
    const ncs = NonConformities.find(query, pOptions).fetch();
    const risks = Risks.find(query, pOptions).fetch();
    const actions = Actions.find(query, pOptions).fetch();
    const workItems = WorkItems.find(query, pOptions).fetch();
    const lessons = LessonsLearned.find(query, pOptions).fetch();
    const reduxActions = [
      setDepartments(departments),
      setFiles(files),
      setNCs(ncs),
      setRisks(risks),
      setActions(actions),
      setWorkItems(workItems),
      setLessons(lessons),
      setDepsReady(true),
    ];

    if (initializing) {
      loadMainData({ dispatch, organizationId }, () => null);
    }

    dispatch(batchActions(reduxActions));
  }

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
}
