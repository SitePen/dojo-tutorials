// Provide the UI class
dojo.provide("tweetview.TweetView");

// Dependencies here
dojo.require("tweetview._ViewMixin");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("dojo.DeferredList");
dojo.require("dojo.io.script");

// Require localization for time
dojo.require("dojo.i18n");
dojo.requireLocalization("dojo.cldr", "gregorian", "", "");

// Declare the class;  inherits from ScrollableView
dojo.declare("tweetview.TweetView", [dojox.mobile.ScrollableView, tweetview._ViewMixin], {
	
	// Create a template string for tweets:
	tweetTemplateString: '<img src="${avatar}" alt="${name}" class="tweetviewAvatar" />' + 
	'<div class="tweetviewTime" data-dojo-time="${created_at}">${time}</div>' +
	'<div class="tweetviewContent"> ' +
		'<div class="tweetviewUser">${user}</div>' + 
		'<div class="tweetviewText">${text}</div>' + 
	'</div><div class="tweetviewClear"></div>',
	
	// Icon for loading...
	iconLoading: dojo.moduleUrl("tweetview", "resources/images/loading.gif"),
	// iconLoading: dojo.moduleUrl("tweetview", "resources/images/androidLoading.gif"),
	
	// URL to pull tweets from; simple template included
	serviceUrl: "http://twitter.com/statuses/user_timeline/${account}.json?since_id=${since_id}",

	// When the widgets have started....
	startup: function() {
		// Retain functionality of startup in dojox.mobile.ScrollableView
		this.inherited(arguments);
		
		// Get the refresh button and image
		//this.refreshButton = dijit.byId(dojo.query(".tweetviewRefresh",this.domNode)[0].id);
		this.refreshButton = dijit.byId(this.getElements("tweetviewRefresh", this.domNode)[0].id);
		this.iconImage = this.refreshButton.iconNode.src;
		
		// Add a click handler to the button that calls refresh
		dojo.connect(this.refreshButton, "onClick", this, "refresh");
		
		// Add CSS class for styling
		dojo.addClass(this.domNode, "tweetviewPane");
		
		// Get the list widget
		this.listNode = this.getListNode();
		
		// Hide the list because it's not populated with list items yet
		this.showListNode(false);
		
		// Get localization for tweet times
		// Get the i18n
		this.l10n = dojo.i18n.getLocalization("dojo.cldr", "gregorian");
		
		// Every 60 seconds, update the times
		setInterval(dojo.hitch(this, function() {
			//dojo.query(".tweetviewTime",this.domNode).forEach(function(timeNode) {
			dojo.forEach(this.getElements("tweetviewTime",this.domNode), function(timeNode) {
				timeNode.innerHTML = this.formatTime(dojo.attr(timeNode, "data-dojo-time"));
			},this);
		}),60000);
		
	},
	
	// Contacts twitter to receive tweets
	refresh: function() {
		// Updates the refresh icon
		this.refreshButton.iconNode.src = this.iconLoading;
		
		// Button has been "pressed"
		this.refreshButton.set("selected", true);
		
		// For every account, add the deferred to the list
		var defs = [], accounts = tweetview.ACCOUNTS;
		for(var account in accounts) {
			// If the account is enabled...
			if(accounts[account].enabled) {
				// Get tweets!
				defs.push(dojo.io.script.get({
					callbackParamName: "callback",
					preventCache: true,
					timeout: 3000,
					url: this.substitute(this.serviceUrl, { account: account, since_id: accounts[account].since || 1 })
				}));
			}
		}
		
		// Create a deferredlist to handle when all tweets are returned
		// Add this.onTweetsReceived as the callback
		new dojo.DeferredList(defs).then(dojo.hitch(this, this.onTweetsReceived));
	},
	
	// Fires when tweets are received from the controller
	updateContent: function(rawTweetData) {
		// For every tweet received....
		dojo.forEach(rawTweetData, function(tweet) {
			// Get the user's screen name
			var screenName = tweet.searchUser || tweet.user.screen_name;
			
			// Create a new list item, inject into list
			var item = new dojox.mobile.ListItem({
				"class": "tweetviewListItem user-" + screenName
			}).placeAt(this.listNode,"first");
			
			// Update the list item's content using our template for tweets
			item.containerNode.innerHTML = this.substitute(this.tweetTemplateString, {
				text: this.formatTweet(tweet.text),
				user: tweet.from_user || screenName,
				name: tweet.from_user || tweet.user.name,
				avatar: tweet.profile_image_url || tweet.user.profile_image_url,
				time: this.formatTime(tweet.created_at),
				created_at: tweet.created_at,
				id: tweet.id
			});
		}, this);
		// Show the list now that we have content for it
		this.showListNode(true);
	},
	
	// Adds the proper tweet linkification to a string
	formatTweet: function(tweetText) {
		return tweetText.
		replace(/(https?:\/\/\S+)/gi,'<a href="$1">$1</a>').
		replace(/(^|\s)@(\w+)/g,'$1<a href="http://twitter.com/$2">@$2</a>').
		replace(/(^|\s)#(\w+)/g,'$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
	},
	
	// Formats the time as received by Twitter
	formatTime: function(date) {
		// Get now
		var now = new Date();
		
		// Push string date into an Date object
		var tweetDate = new Date(date);
		
		// Time measurement: seconds
		var secondsDifferent = Math.floor((now - tweetDate) / 1000);
		if(secondsDifferent < 60) {
			return secondsDifferent + " " + (this.l10n['field-second']) + (secondsDifferent > 1 ? "s" : "");
		}
		
		// Time measurement: Minutes
		var minutesDifferent = Math.floor(secondsDifferent / 60);
		if(minutesDifferent < 60) {
			return minutesDifferent + " " + this.l10n['field-minute'] + (minutesDifferent > 1 ? "s" : "");
		}
		
		// Time measurement: Hours
		var hoursDifferent = Math.floor(minutesDifferent / 60);
		if(hoursDifferent < 24) {
			return hoursDifferent + " " + this.l10n['field-hour'] + (hoursDifferent > 1 ? "s" : "");
		}
		
		// Time measurement: Days
		var daysDifferent = Math.floor(hoursDifferent / 24);
		return daysDifferent + " " + this.l10n['field-day'] + (daysDifferent > 1 ? "s" : "");
	},
	
	// Merges tweets into one array, sorts them
	sortTweets: function(deflist) {
		// Create an array for our tweets
		var allTweets = [];
		
		// For each def list result...
		dojo.forEach(deflist, function(def) {
			// Define which property to check
			// Tweet is just "def[1]", Mentions is def[1].results
			var tweets = (def[1].results ? def[1].results : def[1]);
			
			// If we received any results in this array....
			if(tweets.length) {
				// Get the username and update the since
				var username = !tweets[0].user ? def[1].query.replace("%40","") : tweets[0].user.screen_name;
				
				// Update the since for this user
				tweetview.ACCOUNTS[username].since = tweets[0].id_str;
				
				// If this is a search, we need to add the username to the tweet
				if(def[1].query) {
					dojo.forEach(tweets, function(tweet) { tweet.searchUser = username; });
				}
				
				// Join into one big array
				allTweets = allTweets.concat(tweets);
			}
		},this);
		
		// Sort them by date tweeted
		allTweets.sort(function(a, b) {
			var atime = new Date(a.created_at),
				btime = new Date(b.created_at);

			// Common sorting algorithms like this would return b - a, not a - b.
			// However, we want larger times to be prioritized, not smaller times,
			// so we're doing A's time minus B's time.
			return atime - btime;
		});

		// Return the tweets
		return allTweets;
	},
	
	// Event for when content is loaded from Twitter
	onTweetsReceived: function(rawTweetData) {
		// Sort tweets
		tweetData = this.sortTweets(rawTweetData);
		
		// Set the refresh icon back
		this.refreshButton.iconNode.src = this.iconImage;
		this.refreshButton.set("selected", true);
		
		// If we receive new tweets...
		if(tweetData.length) {
			// Update content
			this.updateContent(tweetData);
		}
	},
	
	// Updates a tweet's viewability by user account enable change
	onUserChange: function(account,isOn) {
		//dojo.query("li.user-" + account,this.domNode)[(isOn ? "remove" : "add") + "Class"]("tweetviewHidden");
		dojo.forEach(this.getElements("user-" + account,this.domNode), function(node){ 
			dojo[(isOn ? "remove" : "add") + "Class"](node,"tweetviewHidden"); 
		});
	}
		
});
