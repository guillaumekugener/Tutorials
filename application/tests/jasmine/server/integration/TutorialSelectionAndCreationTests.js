// (function () {
// 	"use strict";
// 	describe("tests for tutorial creation", function() {
// 		it("should be created with a name", function() {
// 			spyOn(Tutorials, "insert").andReturn(1);

// 			var newTutorialInfo = {
// 				name: "Test Tutorial"
// 			};

// 			Meteor.methodMap.newTutorial(newTutorialInfo);

// 			expect(Tutorials.insert).toHaveBeenCalledWith({name: "Test Tutorial"});
// 		});
// 	});
// })();