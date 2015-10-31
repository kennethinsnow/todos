Template.register.events({
	'submit form': function(events){
		events.preventDefault();
	}
});

Template.login.events({
	'submit form': function(events){
		events.preventDefault();
	}
});

Template.login.onCreated(function(){
	console.log("The 'login' template was just created.");
});

Template.login.onRendered(function(){
    var validator = $('.login').validate({
    	submitHandler: function(event){
    		var email = $('[name="email"]').val();
    		var password = $('[name="password"]').val();
    		Meteor.loginWithPassword(email, password, function(err, rst){
    			if (err){
    				if (err.reason == "User not found"){
	    				validator.showErrors({
	    					email: err.reason
	    				});
    				}
    				if (err.reason == "Incorrect password"){
	    				validator.showErrors({
	    					password: err.reason
	    				});
    				}
    			} else {
    				var currentRoute = Router.current().route.getName();
    				if (currentRoute == 'login'){
    					Router.go('home');
    				}
    			}
    		});
    	}
    });
});

Template.login.onDestroyed(function(){
    console.log("The 'login' template was just destroyed.");
});

Template.register.onRendered(function(){
    var validator = $('.register').validate({
    	submitHandler: function(event){
    		var email = $('[name="email"]').val();
    		var password = $('[name="password"]').val();
    		Accounts.createUser({
    			email: email,
    			password: password
    		}, function(err, rst){
    			if (err){
    				if (err.reason == "Email already exists."){
	    				validator.showErrors({
	    					email: "That email is already registered."
	    				});
    				}
    			} else {
    				Router.go('home');
    			}
    		});
    	}
    });
});

$.validator.setDefaults({
	rules: {
		email: {
			required: true,
			email: true
		},
		password: {
			required: true,
			minlength: 6
		}
	},
	messages: {
		email: {
			required: "You must enter an email address.",
			email: "You've entered an invalid email address."
		},
		password: {
			required: "You must enter a password.",
			minlength: "your password must be at least {0} characters."
		}
	}
});