import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.filter('todo', completed);
  },

  renderTemplate(controller){
    this.render('todos/index', { controller: controller });
  }
});

function completed(todo) {
  return todo.get('isCompleted');
}
