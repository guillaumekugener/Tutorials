var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var FlexibleLayout = require('famous/views/FlexibleLayout');
var SequentialLayout = require('famous/views/SequentialLayout');
var Scrollview    = require('famous/views/Scrollview');
var ImageSurface  = require('famous/surfaces/ImageSurface');

/*
* The view that appears to the right of the list of all of the tutorials in the tutorial list
* that shows the basic info of the tutorials (title, number of steps, authors, items in the tutorial,
* and images that are used in it)
*/

TutorialOverviewView = function () {
    View.apply(this, arguments);

    //this.allItemsInTutorial = [];
    this.tutorialBeingViewed = undefined;
    this.sideToSideFlexLayoutViews =[];
    this.sequentialViews = [];

    _createLayouts.call(this);
    _createHeader.call(this);
    _createBody.call(this);
    _addListeners.call(this);

    //this.itemsInTutorialList.sequenceFrom(this.allItemsInTutorial);
    this.mainSequentialLayoutInBody.sequenceFrom(this.sequentialViews);
    this.sideToSideFlexLayoutInBody.sequenceFrom(this.sideToSideFlexLayoutViews);
}

function _createLayouts() {
	this.layout = new HeaderFooterLayout({
		headerSize: this.options.headerSize,
		footerSize: this.options.footerSize
	});

	this.add(this.layout);

	this.mainSequentialLayoutInBody = new SequentialLayout({
		direction: 0
	});

	this.inBodyHeaderFooter = new HeaderFooterLayout({
		headerSize: 20,
		footerSize: 20
	});

	this.sideToSideFlexLayoutInBody = new FlexibleLayout({
		ratios: [1, 7, 1, 20, 1]
	});
}

function _createHeader() {
	var backgroundSurface = new Surface({
		properties: {
			backgroundColor: 'white'
		}
	});

	this.layout.header.add(backgroundSurface);

	this.tutorialTitleSurface = new Surface({
		content: '<div>the tutorial title will apear here</div><br><span id="authors">authors will appear here</span>',
		classes: ['titleHeader']
	});

	this.tutorialTitleSurface.addClass("tutorialOverview");

	this.tutorialTitleModifier = new StateModifier({
		transform: Transform.translate(320, 0, 1)
	});

	this.tutorialStepsSurface = new Surface({
		content: '<div>-- Steps</div>',
		classes: ['titleHeader'],
		size: [400, undefined]
	});

	this.tutorialStepsSurface.addClass("tutorialOverviewSteps");
	this.tutorialStepsSurface.addClass("tutorialOverview");

	this.tutorialStepsModifier = new StateModifier({
		align: [1, 0],
		origin: [1, 0],
		transform: Transform.translate(0, 0, 1)
	});

	this.layout.header.add(this.tutorialTitleModifier).add(this.tutorialTitleSurface);
	this.layout.header.add(this.tutorialStepsModifier).add(this.tutorialStepsSurface);
}

function _createBody() {

	//////////////////////////////////////
	//All items in the tutorial scrollview, that appears on the left hand side of the
	//tutorial overview
	this.itemsInTutorialList = new SearchableItemsListView(true);
	this.itemsInTutorialList.lookThroughTutorial();
	this.itemsInTutorialList.removeSearchBar();

	this.itemsInTutorialListModifier = new StateModifier({
		size: [this.options.itemsListSize, undefined]
		//transform: Transform.translate(300, 0, 0)
	});

	//Should be using a listView instead of a scrollview here... Should standardize that
	//this.layout.content.add(this.itemsInTutorialListModifier).add(this.itemsInTutorialList);

	// var itemSurfaceExample = new Surface({
	// 	size: [undefined, 40],
	// 	content: "PSoC 5",
	// 	properties: {
	// 		backgroundColor: 'blue'
	// 	}
	// });

	// this.allItemsInTutorial.push(itemSurfaceExample);
	// itemSurfaceExample.pipe(this.itemsInTutorialList);
	////////////////////////////


	//Create sequential layout components
	var leftHandGap = new Surface({
		size: [300, undefined],
	});

	this.sequentialViews.push(leftHandGap);

	var bfView = new View();

	var bfViewModifier = new StateModifier({
		size: [undefined, undefined]
	});

	bfView.add(bfViewModifier).add(this.inBodyHeaderFooter);

	this.sequentialViews.push(bfView);
	/////

	///Add the flexible layout to the body
	this.flexBodyLayoutModifier = new StateModifier({
		size: [window.innerWidth-300, undefined]
	});

	var inBodyBackgroundTop = new Surface({
		properties: {
			backgroundColor: 'white'
		}
	});

	var inBodyBackgroundTopModifier = new StateModifier({
		transform: Transform.translate(0, 0, 1)
	});
	this.inBodyHeaderFooter.header.add(inBodyBackgroundTopModifier).add(inBodyBackgroundTop);

	var inBodyBackgroundBottom = new Surface({
		properties: {
			backgroundColor: 'white'
		}
	});

	var inBodyBackgroundBottomModifier = new StateModifier({
		transform: Transform.translate(0, 0, 1)
	});

	this.inBodyHeaderFooter.footer.add(inBodyBackgroundBottomModifier).add(inBodyBackgroundBottom);

	this.inBodyHeaderFooter.content.add(this.flexBodyLayoutModifier).add(this.sideToSideFlexLayoutInBody);
	//

	//Finally, add the gaps, the scrollview and the image surface
	var leftGap = new View();

	this.sideToSideFlexLayoutViews.push(leftGap);

	this.sideToSideFlexLayoutViews.push(this.itemsInTutorialList);

	var middleGap = new View();

	this.sideToSideFlexLayoutViews.push(middleGap);

	var oneImageSurface = new ImageSurface();

	this.sideToSideFlexLayoutViews.push(oneImageSurface);

	var rightGap = new View();

	this.sideToSideFlexLayoutViews.push(rightGap);

	this.layout.content.add(this.mainSequentialLayoutInBody);

	var footerBackground = new Surface({
		properties: {
			backgroundColor: 'white'
		}
	});

	var footerBackgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 1)
	});

	this.layout.footer.add(footerBackgroundModifier).add(footerBackground);

	//Add the continue to full tutorial button
	this.viewFullTutorialButtonSurface = new Surface({
		content: "view complete tutorial",
		size: [300, 60]
	});

	this.viewFullTutorialButtonSurface.addClass("continuePositiveButtonSurface");

	var viewFullTutorialButtonModifier = new StateModifier({
		align: [1, 0.5],
		origin: [1, 0.5],
		transform: Transform.translate(-20, 0, 2)
	});

	this.layout.footer.add(viewFullTutorialButtonModifier).add(this.viewFullTutorialButtonSurface);

	//Add the playback button
	this.playbackOfTutorialButtonSurface = new Surface({
		content: "tutorial playback",
		size: [300, 60],
		classes: ['playbackButtonSurface']
	});

	var playbackButtonModifier = new StateModifier({
		align: [0, 0.5],
		origin: [0, 0.5],
		transform: Transform.translate(320, 0, 2)
	});

	this.layout.footer.add(playbackButtonModifier).add(this.playbackOfTutorialButtonSurface);
}

function _addListeners() {

	//In order to correctly resize the view in the overview area
	window.onresize = function(evt) {
		this.flexBodyLayoutModifier.setSize([window.innerWidth-300, undefined]);
	}.bind(this);

	//Add the continue to complete tutorial listener. Listener that causes user to go from
	//tutorial overview screen to the tutorial steps screen
	this.viewFullTutorialButtonSurface.on('click', function() {
		this._eventOutput.emit('continueToStepsView');
	}.bind(this));

	this.playbackOfTutorialButtonSurface.on('click', function() {
		this._eventOutput.emit('continueToTutorialPlayback');
	}.bind(this));

	//When the user uses the search bar to look through all of the items in a tutorial, this event
	//is fired for every key up (every time they type);
	// this.itemsInTutorialList.on('userSearchedForItemInTutorial', function() {
	// 	var self = this;
	// 	var criteria = this.itemsInTutorialList.getUsersSearchCriteria();
	// 	this.itemsInTutorialList.clearListOfElements();
		
	// 	Meteor.call('getTutorialMatchingItems', this.tutorialBeingViewed, criteria, function(error, result) {
	// 		for (var i = 0; i< result.length; i++) {
	// 			self.itemsInTutorialList.addItemToFilteredList(result[i]);
	// 		}
	// 	});
	// }.bind(this));
}


TutorialOverviewView.prototype = Object.create(View.prototype);
TutorialOverviewView.prototype.constructor = TutorialOverviewView;

/*
* Populates the searchable list with all the elements in the tutorial
*/
TutorialOverviewView.prototype.populateList = function(tutorialName) {
	var self = this;

	Meteor.call('getTutorialMatchingItems', tutorialName, '', function(error, result) {
		for (var i = 0; i< result.length; i++) {
			self.itemsInTutorialList.addItemToFilteredList(result[i]);
		}
	});
}

/*
* Set the title information in the tutorial overview to be the information of the selected tutorial
*/
TutorialOverviewView.prototype.setTitleInformation = function(doc) {
	this.tutorialBeingViewed = doc.title;

	console.log(doc);

	var parsedAuthors = doc.author;
	var newContent = '<div>'+doc.title+'</div><br><span id="authors">authors: '+parsedAuthors+'</span>';

	this.tutorialTitleSurface.setContent(newContent);

	this.tutorialStepsSurface.setContent('<div>'+doc.numberOfSteps+' Steps</div>');

	
	this.itemsInTutorialList.clearListOfElements();
	this.itemsInTutorialList.setPlaceholder('search for items in tutorial');
}


TutorialOverviewView.DEFAULT_OPTIONS = {
	headerSize: 150,
	footerSize: 80,
	itemsListSize: 300
};