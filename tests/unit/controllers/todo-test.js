import { moduleFor, test } from 'ember-qunit';

var todo;

function mock(properties) {
  return Ember.Object.create(properties || {});
}

function mockTodo(properties) {
  var m = mock(properties);
  m.reopen({
    save: function () {
      return Ember.RSVP.resolve();
    }
  });
  return m;
}

moduleFor('controller:todos/item-controller', 'Unit - TodoController', {
  needs: ['controller:todos'],
  subject: function(options, factory) {
    todo = mockTodo({
      isCompleted: true
    });

    return factory.create({
      model: todo
    });
  }
});

test('isCompleted: get', function(){
  var controller = this.subject();

  controller.get('isCompleted').should.be.true;

  todo.set('isCompleted', false);

  controller.get('isCompleted').should.be.false;
});

test('isCompleted: set', function(){
  var controller = this.subject();

  controller.get('isCompleted').should.be.true;
  todo.get('isCompleted').should.be.true;

  controller.set('isCompleted', false);

  controller.get('isCompleted').should.be.false;
  todo.get('isCompleted').should.be.false;
});

test('actions: editTodo', function(){
  var controller = this.subject();

  controller.get('isEditing').should.be.false;

  controller.send('editTodo');

  controller.get('isEditing').should.be.true;
});

test('actions: removeTodo', function(){

  var controller = this.subject();

  todo.deleteRecord = sinon.spy();

  todo.save = sinon.spy();

  controller.send('removeTodo');

  todo.deleteRecord.calledOnce.should.be.true;
  todo.save.calledOnce.should.be.true;
  todo.deleteRecord.calledBefore(todo.save).should.be.true;

});

test('actions: acceptChanges', function(){

  var controller = this.subject();

  todo.save = sinon.spy();

  controller.set('isEditing', true);
  controller.send('acceptChanges');
  controller.get('isEditing').should.be.false;
  todo.save.calledOnce.should.be.true;

});

moduleFor('controller:todos/item-controller', 'Unit - TodoController with multiple todos', {
  needs: ['controller:todos'],
  otherTodo: function (options, factory) {
    var otherTodo = mockTodo({
      isCompleted: true
    });

    return factory.create({
      model: otherTodo
    });
  },
  // maybe todos: 'controller:todos'
  todosController: function (options, factory, container) {
    return container.lookup('controller:todos');
  },
  subject: function(options, factory) {
    todo = mockTodo({
      isCompleted: false
    });

    return factory.create({
      model: todo
    });
  },
  setup: function (container) {
    var todos = container.lookup('controller:todos');
    todos.set('content', [this.subject(), this.otherTodo()]);
  }
});

test('isLastRemaining', function () {
  var controller = this.subject();

  this.todosController().get('length').should.equal(2);
  this.todosController().get('active.length').should.equal(1);
  controller.get('isCompleted').should.be.false;
  controller.get('isLastRemaining').should.be.true;

  controller.set('isCompleted', true);

  todo.get('isCompleted').should.be.true;
  controller.get('isLastRemaining').should.be.false;
});
