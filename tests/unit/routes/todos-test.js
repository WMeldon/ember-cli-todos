import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleFor('route:todos', 'Unit - TodoRoute', {
  subject(options, factory) {
    return factory.create({
      store: { }
    });
  }
});

test('it exists', function(assert) {
  assert.expect(2);
  var route = this.subject();

  assert.ok(route);
  assert.ok(route instanceof Ember.Route);
});

test('#model', function(assert) {
  assert.expect(2);
  var route = this.subject();

  var expectedModel = {
    id: '1',
    title: 'install EAK',
    isCompleted: true
  };

  route.store.find = function(type) {
    assert.equal(type, 'todo');

    return expectedModel;
  };

  assert.equal(route.model(), expectedModel, 'did not correctly invoke store');
});
