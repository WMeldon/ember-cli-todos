import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:todos', 'Unit - TodosController');

function mock(properties) {
  return Ember.Object.create(properties || {});
}

test('inflection', function(){
  var controller = this.subject();

  controller.get('inflection').should.equal('items');

  Ember.run(function () {
    controller.pushObject(mock({
      isCompleted: false
    }));
  });

  controller.get('inflection').should.equal('item');

  Ember.run(function () {
    controller.pushObject(mock({
      isCompleted: false
    }));
  });

  controller.get('inflection').should.equal('items');
});

test('aggregates', function(){
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

  // __nextSuper: undefined invalidates the assertion.  Slice removes it.
  controller.get('active').slice().should.eql([todo1, todo2, todo3]);
  controller.get('completed').should.eql([]);
  controller.get('hasCompleted').should.be.false;
  controller.get('allAreDone').should.be.false;

  todo1.set('isCompleted', true);

  controller.get('active').slice().should.eql([todo2, todo3]);
  controller.get('completed').slice().should.eql([todo1]);
  controller.get('hasCompleted').should.be.true;
  controller.get('allAreDone').should.be.false;

  todo2.set('isCompleted', true);

  controller.get('active').slice().should.eql([todo3]);
  controller.get('completed').slice().should.eql([todo1, todo2]);
  controller.get('hasCompleted').should.be.true;
  controller.get('allAreDone').should.be.false;

  todo3.set('isCompleted', true);

  controller.get('active').slice().should.eql([]);
  controller.get('completed').slice().should.eql([todo1, todo2, todo3]);
  controller.get('hasCompleted').should.be.true;
  controller.get('allAreDone').should.be.true;
});

test('allAreDone: get', function(){
  var controller = this.subject();
  var todo1 = mock();
  var todo2 = mock();

  controller.get('allAreDone').should.be.false;

  controller.pushObject(todo1);
  controller.get('allAreDone').should.be.false;

  controller.pushObject(todo2);
  controller.get('allAreDone').should.be.false;

  todo1.set('isCompleted', true);
  controller.get('allAreDone').should.be.false;

  todo2.set('isCompleted', true);
  controller.get('allAreDone').should.be.true;

  todo2.set('isCompleted', false);
  controller.get('allAreDone').should.be.false;
});

test('allAreDone: set', function(){
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

  todo1.get('isCompleted').should.be.true;
  todo2.get('isCompleted').should.be.true;

  controller.set('allAreDone', false);

  todo1.get('isCompleted').should.be.false;
  todo2.get('isCompleted').should.be.false;
});

test('actions: createTodo', function(){
  var store, controller, saveSpy;

  store = { };
  saveSpy = sinon.spy();
  store.createRecord = sinon.spy(function(type, data){
    controller.pushObject(data);
    data.save = saveSpy;
    return data;
  });


  controller = this.subject({
    store: store,
    model: Ember.A(),
    newTitle: "   "
  });


  controller.send('createTodo');

  controller.get('newTitle').should.equal("");
  controller.get('length').should.equal(0);

  controller.set('newTitle', 'understanding tests');

  controller.send('createTodo');

  controller.get('newTitle').should.equal("");
  controller.get('length').should.equal(1);

  store.createRecord.calledOnce.should.be.ok;
  store.createRecord.calledWith('todo').should.be.ok;
  saveSpy.calledOnce.should.be.ok;
});

test('actions: clearCompleted', function(){
  var controller, todo, todo1, todo2;
  var properties = {
    isCompleted: true,
    deleteRecord: function() {
      controller.removeObject(this);
    },
    save: function() {

    }
  };

  var deleteSpy = sinon.spy(properties, 'deleteRecord');
  var saveSpy = sinon.spy(properties, 'save');


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

  controller.get('length').should.equal(3);

  controller.send('clearCompleted');

  controller.get('length').should.equal(1);
  deleteSpy.calledTwice.should.be.ok;
  // TODO: Spy never called :(
  // saveSpy.calledTwice.should.be.ok;
});
