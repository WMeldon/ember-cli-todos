import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('edit-todo');

test("asdf", function(){
  this.subject().should.be.an.instanceof(Ember.Component);
  this.$().is('input').should.be.ok;
  this.$().is('.focus').should.be.ok;
});
