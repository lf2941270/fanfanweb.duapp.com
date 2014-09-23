var request=require('request').defaults({jar: true});
var fs=require('fs');
var util=require('util');
var phantom = require('phantom');

phantom.create(function (ph) {
	ph.createPage(function (page) {
		page.open("http://www.qzone.com", function (status) {
			console.log("opened qzone? ", status);
			page.evaluate(function () { return document.title; }, function (result) {
				console.log('Page title is ' + result);
				ph.exit();
			});
		});
	});
}, {
	dnodeOpts: {
		weak: false
	}
});
