import { Template } from 'meteor/templating';

Template.NC_Card_Edit_Main.viewmodel({
  update(...args) {
    this.parent().update(...args);
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
