'use strict';

var util = require('util');

var cheerio = require('cheerio');

var Crawler = require('../index');

var c;
var pages = 2;
var u = 'http://www.zgjtb.com/gonglu/node_123%s.htm';
var urls = [];

for (var i = 1; i <= pages; i++) {
	var p = i == 1 ? '' : '_' + i;
	urls.push(util.format(u, p));
}

c = new Crawler({ interval: 1500 });

c.addTasks(urls);

c.addRule('http://www\\.zgjtb\\.com/gonglu/node_123[_]?[0-9]*\\.htm', function (data) {
	var $ = cheerio.load(data);
	var links = Crawler.getLinks($('.p-list .p-li-ul'));
	links = links.slice(0, 3);
	links = links.map(function (link) {
		return 'http://www.zgjtb.com/gonglu/' + link;
	});
	c.addTasks(links);
});

c.addRule('http://www\\.zgjtb\\.com/gonglu/[0-9]{4}-[0-9]{1,2}.*\\.htm', function (data) {
	var $ = cheerio.load(data);
	var title = $('.lbox2 .t-title h1').text();
	var info = $('.lbox2 .t-title p').text();
	console.log(title + ' ' + info);
});

c.start(function () {
	console.log('news-site-zgjtb finished.')
});