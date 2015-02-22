import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

var todo;
moduleFor('controller:todos/item-controller', 'Unit - TodoController', {
  needs: ['controller:todos'],
  subject(options, factory) {
    todo = mockTodo({
      isCompleted: true
    });

    return factory.create({
      model: todo
    });
  }
});

function mock(properties) {
  return Ember.Object.create(properties || {});
}

function mockTodo(properties) {
  var m = mock(properties);
  m.reopen({
    save() {
      return Ember.RSVP.resolve();
    }
  });
  return m;
}

test('isCompleted: get', function(assert) {
  var controller = this.subject();
  assert.equal(controller.get('isCompleted'), true);

  todo.set('isCompleted', false);

  assert.equal(controller.get('isCompleted'), false);
});

test('isCompleted: set', function(assert) {
  var controller = this.subject();

  assert.equal(controller.get('isCompleted'), true);
  assert.equal(todo.get('isCompleted'), true);

  controller.set('isCompleted', false);

  assert.equal(controller.get('isCompleted'), false);
  assert.equal(todo.get('isCompleted'), false);
});

test('actions: editTodo', function(assert) {
  var controller = this.subject();

  assert.equal(todo.get('isEditing', false));

  controller.send('editTodo');

  assert.equal(todo.get('isEditing', true));
});

test('actions: removeTodo', function(assert) {
  assert.expect(2);

  var controller = this.subject();

  todo.deleteRecord = function() {
    assert.ok(true, 'expected Record#deleteRecord');
  };

  todo.save = function() {
    assert.ok(true, 'expected Record#save');
  };

  controller.send('removeTodo');
});

test('actions: acceptChanges', function(assert) {
  assert.expect(3);

  var controller = this.subject();

  todo.save = function() {
    assert.ok(true, 'expected Record#save');
  };

  assert.equal(todo.get('isEditing', true));
  controller.send('acceptChanges');
  assert.equal(todo.get('isEditing', false));
});

moduleFor('controller:todos/item-controller', 'Unit - TodoController with multiple todos', {
  needs: ['controller:todos'],
  otherTodo(options, factory) {
    var otherTodo = mockTodo({
      isCompleted: true
    });

    return factory.create({
      model: otherTodo
    });
  },

  todosController() {
    return this.container.lookup('controller:todos');
  },

  subject(options, factory) {
    todo = mockTodo({
      isCompleted: false
    });

    return factory.create({
      model: todo
    });
  },

  setup() {
    this.container.lookup('controller:todos').set('model', [
      this.subject(),
      this.otherTodo()
    ]);
  }
});

test('isLastRemaining', function(assert) {
  var controller = this.subject();

  assert.equal(this.todosController().get('length'), 2, "There are initially 2 todos");
  assert.equal(this.todosController().get('active.length'), 1, "Only one todo is active");

  assert.equal(controller.get('isCompleted'), false, "The todo is initially active");
  assert.equal(controller.get('isLastRemaining'), true, "todo is initially the last remaining one");

  controller.set('isCompleted', true);

  assert.equal(todo.get('isCompleted'), true, "todo is now complete");
  assert.equal(controller.get('isLastRemaining'), false, "todo is no longer the last remaining one");
});
