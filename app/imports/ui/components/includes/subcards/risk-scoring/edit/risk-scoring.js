import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Template.Subcards_RiskScoring_Edit.viewmodel({
  mixin: ['riskScore', 'date', 'addForm', 'utils', 'organization'],
  label: 'Risk scoring',
  scores: '',
  renderContentOnInitial() {
    return !(this.scoresSorted().length > 5);
  },
  scoresSorted() {
    return Array.from(this.scores() || []).sort(({ scoredAt:sc1 }, { scoredAt:sc2 }) => sc2 - sc1);
  },
  guideHtml() {
    const { rkScoringGuidelines } = this.organization() || {};
    return rkScoringGuidelines;
  },
  tableData() {
    return {
      xHeading: 'Probability',
      yHeading: 'Impacts',
      data: [
        {
          _id: 1,
          label: 'Catastrophic',
          rows: [45, 65, 91, 95, 100]
        },
        {
          _id: 2,
          label: 'Significant',
          rows: [35, 60, 75, 80, 85]
        },
        {
          _id: 3,
          label: 'Moderate',
          rows: [26, 51, 54, 59, 66]
        },
        {
          _id: 4,
          label: 'Minor',
          rows: [15, 26, 30, 36, 42]
        },
        {
          _id: 5,
          label: 'Limited',
          rows: [1, 8, 12, 16, 20]
        },
        {
          _id: 6,
          label: '',
          rows: ['V.Low', 'Low', 'Med', 'High', 'V.High'],
        }
      ]
    };
  },
  getScoreLabel({ value } = {}) {
    return value
              ? `<span>${this.getNameByScore(value)}</span>
                 <span class="label impact-${this.getClassByScore(value)}">
                   ${value}
                 </span>`
              : '';
  },
  add() {
    this.addForm(
      'Subcard',
      {
        score: {
          scoredAt: new Date(),
          scoredBy: Meteor.userId()
        },
        content: 'Subcards_RiskScore',
        _lText: 'New risk score',
        guideHtml: this.guideHtml(),
        tableData: this.tableData(),
        insertFn: this.insertFn(),
        removeFn: this.removeFn()
      }
    );
  },
  onInsert() {},
  insertFn() {
    return ({ ...args }, cb) => {
      this.onInsert({ ...args }, cb)
    };
  },
  updateFn() {
    return ({ ...args }, cb = () => {}) => cb();
  },
  onRemove() {},
  removeFn() {
    return (viewmodel, cb = () => {}) => {
      const { document:score = {} } = viewmodel.data();
      const { _id } = score;

      if (!_id) {
        viewmodel.destroy();
      } else {
        swal(
          {
            title: 'Are you sure?',
            text: `Risk score will be removed.`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Remove',
            closeOnConfirm: false
          },
          () => {
            const showSuccess = (err) => {
              if (!err) swal('Removed!', `Risk score was removed successfully.`, 'success');
            };

            const callback = this.chain(showSuccess, cb);

            this.onRemove({ score }, callback);
          }
        );
      }
    };
  }
});