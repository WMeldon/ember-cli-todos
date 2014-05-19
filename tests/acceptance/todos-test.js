import startApp from 'todos/tests/helpers/start-app';
import Resolver from 'todos/tests/helpers/resolver';

var App;

suite('Acceptances - Todos', {
  setup: function(){
    var todo = Resolver.resolve('model:todo');
    todo.reopenClass({
      FIXTURES: [
        {
          id: "1",
          title: 'install EAK',
          isCompleted: true
        },
        {
          id: "2",
          title: 'install additional dependencies',
          isCompleted: true
        },
        {
          id: "3",
          title: 'develop amazing things',
          isCompleted: false
        }
    ]});

    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function exists(selector) {
  return !!window.find(selector).length;
}

function remainingCountText(){
  return Number($('#todo-count strong').text());
}

var notCompletedSelector = "#todo-list li:not('.completed') input";
var completedSelector = "#todo-list li.completed input";

function notCompleted() {
  return $(notCompletedSelector);
}

function completed() {
  return $(completedSelector);
}

function mock(options) {
  return Ember.$.extend(true, {}, options);
}

test('todos renders', function(){
  visit('/').then(function(){
    exists('#new-todo').should.be.ok;
    exists('#toggle-all').should.be.ok;

    var list = find('#todo-list li');
   list.length.should.equal(3);

    exists('#todo-count').should.be.ok;

    var linkList = find('#filters li');
    linkList.length.should.equal(3);

    exists('#clear-completed').should.be.ok;
    exists('#info').should.be.ok;
  });
});

test('todos mark last completed', function(){

  visit('/').then(function(){
    notCompleted().length.should.equal(1);
    remainingCountText().should.equal(1);
    completed().length.should.equal(2);

    click(notCompletedSelector).then(function(){
      notCompleted().length.should.equal(0);
      remainingCountText().should.equal(0);
      completed().length.should.equal(3);
    });
  });
});

test('todos mark one uncompleted', function(){
  visit('/').then(function(){
    notCompleted().length.should.equal(1);
    remainingCountText().should.equal(1);
    completed().length.should.equal(2);

    click(completedSelector + ':first').then(function(){
      notCompleted().length.should.equal(2);
      remainingCountText().should.equal(2);
      completed().length.should.equal(1);
    });
  });
});

test('clear completed', function(){
  visit('/').then(function(){
    notCompleted().length.should.equal(1);
    remainingCountText().should.equal(1);
    completed().length.should.equal(2);

    click('#clear-completed').then(function(){
      notCompleted().length.should.equal(1);
      remainingCountText().should.equal(1);
      completed().length.should.equal(0);
    });
  });
});

test("create todo", function(){
  visit('/').then(function(){
    fillIn('#new-todo', 'bro');

    // insert a newline
    keyEvent('#new-todo', 'keyup', 13).then(function(){
      notCompleted().length.should.equal(2);
      remainingCountText().should.equal(2);
      completed().length.should.equal(2);
      $('ul#todo-list li label:last').text().should.equal('bro');
    });
  });
});

test("remove todo", function(){
  visit('/').then(function(){
    click('#todo-list li.completed button.destroy').then(function(){
      notCompleted().length.should.equal(1);
      remainingCountText().should.equal(1);
      completed().length.should.equal(0);
    });
  });
});

test("edit todo", function(){

  visit('/').then(function(){
    var todo = $('#todo-list li:first');

    // TODO: master provides "triggerEvent" helper
    Ember.run(todo.find('label'), 'trigger', 'dblclick');

    var input = todo.find('input.edit');
    input.length.should.equal(1);

    fillIn(input, 'new task description');
    keyEvent(input.selector, 'keyup', 13).then(function(){
      todo.find('label').text().should.equal('new task description');
    });
  });
});
