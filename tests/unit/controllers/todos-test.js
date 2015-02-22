import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:todos', 'Unit - TodosController');

function mock(properties) {
  return Ember.Object.create(properties || {});
}

test('inflection', function(assert) {
  var controller = this.subject();

  assert.equal(controller.get('inflection'), 'items');

  Ember.run(() => {
    controller.pushObject(mock({
      isCompleted: false
    }));
  });

  assert.equal(controller.get('inflection'), 'item');

  Ember.run(() => {
    controller.pushObject(mock({
      isCompleted: false
    }));
  });

  assert.equal(controller.get('inflection'), 'items');
});

test('aggregates', function(assert) {
  var todo1 = mock({ isCompleted: false });
  var todo2 = mock({ isCompleted: false });
  var todo3 = mock({ isCompleted: false });

  var controller = this.subject({
    model: [
      todo1,
      todo2,
      todo3,
    ]
  });

  assert.deepEqual(controller.get('active'), [todo1, todo2, todo3]);
  assert.deepEqual(controller.get('completed'), []);
  assert.equal(controller.get('hasCompleted'), false);
  assert.equal(controller.get('allAreDone'), false);

  todo1.set('isCompleted', true);

  assert.deepEqual(controller.get('active'), [todo2, todo3]);
  assert.deepEqual(controller.get('completed'), [todo1]);
  assert.equal(controller.get('hasCompleted'), true);
  assert.equal(controller.get('allAreDone'), false);

  todo2.set('isCompleted', true);

  assert.deepEqual(controller.get('active'), [todo3]);
  assert.deepEqual(controller.get('completed'), [todo1, todo2]);
  assert.equal(controller.get('hasCompleted'), true);
  assert.equal(controller.get('allAreDone'), false);

  todo3.set('isCompleted', true);

  assert.deepEqual(controller.get('active'), []);
  assert.deepEqual(controller.get('completed'), [todo1, todo2, todo3]);
  assert.equal(controller.get('hasCompleted'), true);
  assert.equal(controller.get('allAreDone'), true);
});

test('allAreDone: get', function(assert) {
  var controller = this.subject();
  var todo1 = mock();
  var todo2 = mock();

  assert.equal(controller.get('allAreDone'), false);

  controller.pushObject(todo1);
  assert.equal(controller.get('allAreDone'), false);

  controller.pushObject(todo2);
  assert.equal(controller.get('allAreDone'), false);

  todo1.set('isCompleted', true);
  assert.equal(controller.get('allAreDone'), false);

  todo2.set('isCompleted', true);
  assert.equal(controller.get('allAreDone'), true);

  todo2.set('isCompleted', false);
  assert.equal(controller.get('allAreDone'), false);
});

test('allAreDone: set', function(assert) {
  var todo1 = mock();
  var todo2 = mock();

  var controller = this.subject({
    model: [
      todo1,
      todo2
    ],
    newTitle: ' '
  });

  controller.set('allAreDone', true);

  assert.equal(todo1.get('isCompleted'),  true);
  assert.equal(todo2.get('isCompleted'),  true);

  controller.set('allAreDone', false);

  assert.equal(todo1.get('isCompleted'), false);
  assert.equal(todo2.get('isCompleted'), false);
});

test('actions: createTodo', function(assert) {
  var store, controller;

  store = { };

  controller = this.subject({
    store: store,
    model: Ember.A(),
    newTitle: "   "
  });

  store.createRecord = function(type, data) {
    assert.equal(type, 'todo');
    assert.ok(true, 'expected Store#createRecord');
    controller.pushObject(data);
    data.save = function() {
      assert.ok(true, 'expected Record#save');
    };
    return data;
  };

  controller.send('createTodo');

  assert.equal(controller.get('newTitle'), "");
  assert.equal(controller.get('length'), 0);

  controller.set('newTitle', 'understanding tests');

  controller.send('createTodo');

  assert.equal(controller.get('newTitle'), "");
  assert.equal(controller.get('length'), 1);
});

test('actions: clearCompleted', function(assert) {
  var controller, todo, todo1, todo2;
  var properties = {
    isCompleted: true,
    deleteRecord() {
      assert.ok(true, 'expected Record#deleteRecord');
      controller.removeObject(this);
    },
    save() {
      assert.ok(true, 'expected Record#save');
    }
  };

  todo = mock(properties);
  todo1 = mock(properties);
  todo2 = mock(properties);

  todo2.set('isCompleted', false);

  controller = this.subject({
    model: [
      todo,
      todo1,
      todo2
    ]
  });

  assert.equal(controller.get('length'), 3);

  controller.send('clearCompleted');

  assert.equal(controller.get('length'), 1);
});
