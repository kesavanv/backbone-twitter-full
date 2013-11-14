(function ($) {
	// customize to perform Mustache.js style templating
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	//Model
	var Tweet = Backbone.Model.extend({
		defaults: function () {
			return {
				author: '',
				status: ''
			};
		}
	});

	//Collection
	var TweetsList = Backbone.Collection.extend({
		model: Tweet,
		url: '/tweets'
	});

	var tweets = new TweetsList();

	//View
	var TweetView = Backbone.View.extend({
		model: new Tweet(),
		tagName: 'div',
		className: 'tweet',
		events: {
			'click .edit': 'edit',
			'click .delete': 'delete',
			'blur .status': 'close',
			'keypress .status': 'onEnterUpdate'
		},

		initialize: function () {
			this.template = _.template($('#tweet-template').html());
		},

		edit: function (ev) {
			ev.preventDefault();
			this.$('.status').attr('contenteditable', true).focus();
		},

		delete: function (ev) {
			ev.preventDefault();
			tweets.remove(this.model);
		},

		onEnterUpdate: function (ev) {
			if (ev.keyCode === 13) {
				this.close();
				var oSelf = this;
				// this delay is needed for the browser to update the UI before bluring.
				_.delay(function () {oSelf.$('.status').blur()}, 100);
			}
		},

		close: function (ev) {
			var status = this.$('.status').text();
			this.model.set('status', status);
			this.$('.status').removeAttr('contenteditable');
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var TweetsView = Backbone.View.extend({
		model: tweets,
		el: '#tweets-container',

        initialize: function () {
        	var oSelf = this;
            this.model.on('add', this.render, this);
            this.model.on('remove', this.render, this);

            tweets.fetch({
            	success: function () {oSelf.render();},
            	error: function () {console.log('Cannot retrieve models from server');}
            });
        },

		render: function () {
            var oSelf = this;
            oSelf.$el.empty();
            _.each(this.model.toArray(), function (tweet, i) {
                oSelf.$el.append((new TweetView({model: tweet})).render().$el);
            });
			return this;
		}
	});

	$(document).ready(function () {
		$('#new-tweet').submit(function (ev) {
			var tweet = new Tweet({
				author: $('#author-name').val(),
				status: $('#status-update').val()
			});
			tweets.add(tweet);
			console.log(tweets.toJSON());
			tweet.save({}, {
				success: function () {console.log('Successfully saved Tweets');},
				error: function () {console.log('Failure in saving Tweets');}
			});

			return false;
		});

		var appView = new TweetsView();
	});
})(jQuery);