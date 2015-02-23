// routes/todos.js
import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    state: { refreshModel: true }
  },

  model(params) {
    switch (params.state) {
      case 'all'       : return this.store.find('todo');
      case 'active'    : return this.store.filter('todo', (todo) => !todo.get('isCompleted'));
      case 'completed' : return this.store.filter('todo', (todo) =>  todo.get('isCompleted'));
      default          : throw new Error(`Unknown Todo State: '${params.state}'`);
    }
  }
});
