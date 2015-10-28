Template.register.events({
	'submit form': function(events){
		events.preventDefault();
		var email = $('[name="email"]').val();
		var password = $('[name="password"]').val();
		Accounts.createUser({
			email: email,
			password: password
		}, function(err, rst){
			if (err){
				console.log(err.reason);
			} else {
				Router.go('home');
			}
		});
	}
});

Template.login.events({
	'submit form': function(events){
		events.preventDefault();
		var email = $('[name="email"]').val();
		var password = $('[name="password"]').val();
		Meteor.loginWithPassword(email, password, function(err, rst){
			if (err){
				console.log(err.reason);
			} else {
				Router.go('home');
			}
		});
	}
});