import { moduleFor, test } from 'ember-qunit';

moduleFor('route:todos', 'Unit - TodoRoute', {
  subject: function(options, factory) {
    return factory.create({
      store: { }
    });
  }
});

console.log(test);
test('it exists', function(){
  var route = this.subject();

  route.should.be.ok;
  route.should.be.an.instanceof(Ember.Route);
});

test('#model', function(){
  var route = this.subject();
  var expectedModel = {
    id: '1',
    title: 'install EAK',
    isCompleted: true
  };

  route.store.find = sinon.spy(function(type) {
    return expectedModel;
  });

  route.model().should.eql(expectedModel);
  route.store.find.calledOnce.should.be.ok;
  route.store.find.calledWith('todo').should.be.ok;
});
