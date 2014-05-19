import { test, moduleForModel } from 'ember-qunit';

moduleForModel('todo', 'Integration - Model');


test('contrived example, loading an additional todo', function(){
  var store = this.store();

  // he user interacts with the application (via click or something)
  // so lets simulate that via an programmatic run-loop (normally the eventDispatcher does this for us)
  Ember.run(function(){

    // lets grab all the Todos
    wait();
    store.find('todo').then(function(todos){

      // ensure new length
      var numberOfTodos = todos.get('length');

      // lets pretend another Todo was added
      store.push('todo', {
        id: '9999',
        title: 'install EAK',
        isCompleted: true
      });

      // triggers another find
      store.find('todo', 9999).then(function(todo) {
        todo.get('id').should.equal('9999');
        todo.get('title').should.equal('install EAK');
        todo.get('isCompleted').should.be.true;
      });

      // lets do another findAll
      store.find('todo').then(function(todos){
        todos.get('length').should.equal(numberOfTodos + 1);
      });
    });
  });
});
