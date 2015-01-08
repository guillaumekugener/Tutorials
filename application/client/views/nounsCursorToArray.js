nounsCursorToArray = function(cursor, listView) {
	var Surface = require('famous/core/Surface');

	cursor.observe({
		added: function(doc) {
			listView.addItemToList(listView, doc);
		},
		changed: function(doc) {

		},
		removed: function(doc) {

		},
		movedTo: function(doc) {

		}
	});
}