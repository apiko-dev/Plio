import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import property from 'lodash.property';

import {
  pickC,
  pickDocuments,
  mapC,
  transsoc,
  propValue,
  every,
  notDeleted,
  propEq,
  find,
  filterC,
  getC,
} from '/imports/api/helpers';
import { capitalize, getFormattedDate } from '/imports/share/helpers';
import { getNameByScore, getClassByScore } from '/imports/api/risks/helpers';
import { getLinkedActions, getLinkedLessons } from '/imports/ui/react/share/helpers/linked';
import { DocumentTypes, ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/api/actions/helpers';
import { getPath } from '/imports/ui/utils/router';

import BodyContents from '../../components/RHS/Body';

const mapStateToProps = (state) => ({
  ...pickC(['userId', 'urlItemId'], state.global),
  ...pickC(['orgSerialNumber'], state.organizations),
  ...pickC([
    'usersByIds',
    'departmentsByIds',
    'standardsByIds',
    'riskTypesByIds',
    'workItems',
    'lessons',
    'actions',
  ], state.collections),
});

const propsMapper = ({
  risk,
  usersByIds,
  riskTypesByIds,
  departmentsByIds,
  standardsByIds,
  ...props
}) => {
  const pickUsers = pickDocuments(['_id', 'profile', 'emails'], usersByIds);
  const predicate = every([
    notDeleted,
    compose(
      find(propEq('documentId', risk._id)),
      property('linkedTo')
    ),
  ]);
  const linkedActions = getLinkedActions(predicate, props, props.actions);
  const actionsByType = splitActionsByType(linkedActions);
  const preventativeActions = actionsByType[ActionTypes.PREVENTATIVE_ACTION];
  const correctiveActions = actionsByType[ActionTypes.CORRECTIVE_ACTION];
  const type = riskTypesByIds[risk.typeId];
  const lessons = getLinkedLessons(risk._id, DocumentTypes.RISK, props.lessons);
  const magnitude = risk.magnitude && capitalize(risk.magnitude);
  const scores = mapC(transsoc({
    scoreTypeId: compose(capitalize, property('scoreTypeId')),
    scoredBy: compose(pickUsers, property('scoredBy')),
    scoredAt: compose(getFormattedDate, property('scoredAt')),
    priority: compose(getNameByScore, propValue),
    className: compose(getClassByScore, propValue),
    value: propValue,
  }), risk.scores);
  const identifiedBy = pickUsers(risk.identifiedBy);
  const identifiedAt = getFormattedDate(risk.identifiedAt);
  const notify = pickUsers(risk.notify);
  const departments = pickDocuments(['_id', 'name'], departmentsByIds, risk.departmentsIds);
  const standards = compose(
    mapC(s => ({ ...s, href: getPath('standard')({ urlItemId: s._id }) })),
    filterC(notDeleted),
    pickDocuments(['_id', 'title'], standardsByIds),
  )(risk.standardsIds);
  const improvementPlan = {
    ...risk.improvementPlan,
    owner: pickUsers(getC('improvementPlan.owner', risk)),
  };

  return {
    ...props,
    ...risk,
    type,
    preventativeActions,
    correctiveActions,
    magnitude,
    scores,
    identifiedAt,
    identifiedBy,
    notify,
    departments,
    standards,
    lessons,
    improvementPlan,
  };
};

export default compose(
  connect(mapStateToProps),
  mapProps(propsMapper),
)(BodyContents);