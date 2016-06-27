import { Template } from 'meteor/templating';


Template.Actions_CompletedOn.viewmodel({
  completedAt: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Completed on',
  enabled: true,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date } = viewmodel.getData();

    if (date === this.templateInstance.data.completedAt) {
      return;
    }

    this.completedAt(date);

    this.parent().update({ completedAt: date });
  },
  getData() {
    return { completedAt: this.completedAt() };
  }
});
