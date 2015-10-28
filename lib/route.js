Router.configure({
	layoutTemplate: 'main'
});

Router.route('/register', {
	name:'register',
	template:'register'
});
Router.route('/login');
Router.route('/', {
	path:'/',
	name:'home',
	template: 'home'
});

Router.route('/list', {
	data: function(){
		console.log('this is a list page.');
	}
});

Router.route('/list/:_id', {
	name: 'listPage',
	template: 'listPage',
	data: function(){
		var currentList = this.params._id;
		return Lists.findOne({_id:currentList});
	}
});