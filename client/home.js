//helpers

Template.todos.helpers({
	'todo': function(){
		var currentList = this._id;
		var currentUser = Meteor.userId();
		return Todos.find({createdBy: currentUser,listId: currentList}, {sort:{createdAt:-1}});
	}
});

Template.todoItem.helpers({
	'checked': function(){
		var isCompleted = this.completed;
		if (isCompleted){
			return "checked";
		} else {
			return "";
		}
	}
});

Template.todosCount.helpers({
	'totalTodos': function(){
		var currentList = this._id;
		var currentUser = Meteor.userId();
		return Todos.find({createdBy: currentUser, listId: currentList}).count();
	},
	'completedTodos': function(){
		var currentList = this._id;
		var currentUser = Meteor.userId();
		return Todos.find({createdBy: currentUser, listId: currentList, completed:true}).count();
	}
});

Template.lists.helpers({
	'list': function(){
		var currentUser = Meteor.userId();
		return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
	}
});

// events

Template.addTodo.events({
	'submit form': function(event){
		event.preventDefault();
		var todoName = $('[name="todoName"]').val();
		var currentList = this._id;
		Meteor.call('createListItem', todoName, currentList, function(err, rst){
			if (err){
				console.log(err.reason);
			} else {
				$('[name="todoName"]').val('');
			}
		});
		/*
		var currentUser = Meteor.userId();
		Todos.insert({
			name:todoName,
			completed: false,
			createdAt: new Date(),
			createdBy: currentUser,
			listId: currentList
		});*/
	}
});

Template.todoItem.events({
	'click .delete-todo': function(event){
		event.preventDefault();
		var documentId = this._id;
		var confirm = window.confirm("Delete this task?");
		if (confirm){
			Meteor.call('removeListItem', documentId, function(err, rst){
				if (err){
					console.log(err.reason);
				}
			});
		}
	},
	'keyup [name=todoItem]': function(event){
		if (event.which == 13 || event.which == 27){
			$(event.target).blur();
		} else {
			var todoItem = $(event.target).val();
			var documentId = this._id;
			Meteor.call('updateListItem', todoItem, documentId, function(err, rst){
				if (err){
					console.log(err.reason);
				}
			});
		}
	},
	'change [type="checkbox"]': function(){
		var documentId = this._id;
		var isCompleted = this.completed;
		Meteor.call('changeItemStatus', !isCompleted, documentId, function(err, rst){
			if (err){
				console.log(err.reason);
			}
		});
	}
});

Template.addList.events({
	'submit form': function(event){
		event.preventDefault();
		var listName = $('[name="listName"]').val();
		Meteor.call('createNewList', listName, function(err, rst){
			// console.log(rst);
			if (!err){
				// console.log(rst);
				Router.go('listPage', {_id: rst});
				$('[name="listName"]').val("");
			} else {
				console.log(err.reason);
			}
		});
	}
});

Template.navigation.events({
	'click .logout': function(events){
		events.preventDefault();
		Meteor.logout();
		Router.go('login');
	}
});

Template.lists.onCreated(function(){
	this.subscribe('lists');
});