Meteor.publish('lists', function(){
	var currentUser = this.userId;
	return Lists.find({createdBy: currentUser});
});

Meteor.publish('todos', function(currentList){
	var currentUser = this.userId;
	return Todos.find({createdBy: currentUser, listId: currentList});
});


Meteor.methods({
	createNewList: function(listName){
		var currentUser = Meteor.userId();
		// console.log("in server function createNewList");
		if (listName == ""){
			throw new Meteor.Error("listname-empty", "listname can not be empty.");
		}
		check(listName, String);
		var data = {
			name: listName,
			createdBy: currentUser
		};
		if (Lists.findOne(data)){
			throw new Meteor.Error("listname-already-exists", "listname can not be duplicated.");
		}
		if (!currentUser){
			throw new Meteor.Error("not-logged-in", "You're not logged-in");
		}
		return Lists.insert(data);
		/*		, function(err, rst){
			if (err){
				throw err;	
			} else {
				console.log("server: " + rst);
				return rst;
			}
		});*/
	},
	createListItem: function(todoName, listId){
		var currentUser = Meteor.userId();
		if (!currentUser){
			throw new Meteor.Error("not-logged-in", "You're not logged-in");
		}
		if (!Lists.findOne({_id: listId})){
			throw new Meteor.Error("list-not-exist", "Can not find the listId.");
		}
		check(todoName, String);
		if (todoName == ""){
			throw new Meteor.Error("todoName-empty", "todoName can not be empty.");
		}
		var data = {
			name:todoName,
			completed: false,
			createdAt: new Date(),
			createdBy: currentUser,
			listId: listId
		};
		if (Todos.findOne({name:todoName,createdBy: currentUser})){
			throw new Meteor.Error("todoName-already-exists", "task name can not be duplicated.");
		}
		return Todos.insert(data);
	},
	updateListItem: function(todoName, itemId){
		var currentUser = Meteor.userId();
		if (!currentUser){
			throw new Meteor.Error("not-logged-in", "You're not logged-in");
		}
		var rcd = Todos.findOne({_id: itemId, createdBy: currentUser});
		if (!rcd){
			throw new Meteor.Error("task-not-exist", "Can not find the itemId for current user. " + itemId);
		}
		check(todoName, String);
		if (todoName == ""){
			throw new Meteor.Error("todoName-empty", "todoName can not be empty.");
		}
		var data = {
			"$set": {name : todoName}
		};
		if (rcd.name == todoName){
			throw new Meteor.Error("todoName-not-changed", "task name is same, no need to update.");
		}
		return Todos.update({_id: itemId}, data);
	},
	changeItemStatus: function(status, itemId){
		var currentUser = Meteor.userId();
		if (!currentUser){
			throw new Meteor.Error("not-logged-in", "You're not logged-in");
		}
		var rcd = Todos.findOne({_id: itemId, createdBy: currentUser});
		if (!rcd){
			throw new Meteor.Error("task-not-exist", "Can not find the itemId for current user.");
		}
		check(status, Boolean);
		var data = {
			"$set": {completed : status}
		};
		return Todos.update({_id: itemId}, data);
	},
	removeListItem: function(itemId){
		var currentUser = Meteor.userId();
		if (!currentUser){
			throw new Meteor.Error("not-logged-in", "You're not logged-in");
		}
		var rcd = Todos.findOne({_id: itemId, createdBy: currentUser});
		if (!rcd){
			throw new Meteor.Error("task-not-exist", "Can not find the itemId for current user.");
		}
		return Todos.remove({_id: itemId});
	}
});