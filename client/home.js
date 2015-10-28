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
		var currentUser = Meteor.userId();
		Todos.insert({
			name:todoName,
			completed: false,
			createdAt: new Date(),
			createdBy: currentUser,
			listId: currentList
		});
		$('[name="todoName"]').val('');
		
	}
});

Template.todoItem.events({
	'click .delete-todo': function(event){
		event.preventDefault();
		var documentId = this._id;
		var confirm = window.confirm("Delete this task?");
		if (confirm){
			Todos.remove({_id:documentId});
		}
	},
	'keyup [name=todoItem]': function(event){
		if (event.which == 13 || event.which == 27){
			$(event.target).blur();
		} else {
			var todoItem = $(event.target).val();
			var documentId = this._id;
			Todos.update({_id:documentId}, {$set: {name:todoItem}});
		}
	},
	'change [type="checkbox"]': function(){
		var documentId = this._id;
		var isCompleted = this.completed;
		if (isCompleted){
			Todos.update({_id:documentId}, {$set: {completed:false}});
		} else {
			Todos.update({_id:documentId}, {$set: {completed:true}});
		}
	}
});

Template.addList.events({
	'submit form': function(event){
		event.preventDefault();
		var listName = $('[name="listName"]').val();
		var currentUser = Meteor.userId();
		Lists.insert({
			name: listName,
			createdBy: currentUser
		}, function(err, rst){
			if (!err){
				Router.go('listPage', {_id: rst});
			}
			
		});
		$('[name="listName"]').val("");
	}
});

Template.navigation.events({
	'click .logout': function(events){
		events.preventDefault();
		Meteor.logout();
		Router.go('login');
	}
});