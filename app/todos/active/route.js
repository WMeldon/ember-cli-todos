import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.filter('todo', active);
  },

  renderTemplate(controller){
    this.render('todos/index', {controller: controller});
  }
});

function active(todo) {
  return !todo.get('isCompleted');
}
