var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var FlexibleLayout = require('famous/views/FlexibleLayout');
var SequentialLayout = require('famous/views/SequentialLayout');
var Scrollview    = require('famous/views/Scrollview');
var ImageSurface  = require('famous/surfaces/ImageSurface');

TutorialOverviewView = function () {
    View.apply(this, arguments);

    this.allItemsInTutorial = [];
    this.sideToSideFlexLayoutViews =[];
    this.sequentialViews = [];

    _createLayouts.call(this);
    _createHeader.call(this);
    _createBody.call(this);
    _addListeners.call(this);

    this.itemsInTutorialList.sequenceFrom(this.allItemsInTutorial);
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
	this.tutorialTitleSurface = new Surface({
		content: '<div>Tutorial Default Title</div><br><span id="authors">authors: John Doe</span>'
	});

	this.tutorialTitleSurface.addClass("tutorialOverview");

	this.tutorialTitleModifier = new StateModifier({
		transform: Transform.translate(320, 0, 0)
	});

	this.tutorialStepsSurface = new Surface({
		content: '<div>14 Steps</div>'
	});

	this.tutorialStepsSurface.addClass("tutorialOverviewSteps");
	this.tutorialStepsSurface.addClass("tutorialOverview");

	this.tutorialStepsModifier = new StateModifier({
		align: [1, 0],
		origin: [1, 0]
	});

	this.layout.header.add(this.tutorialTitleModifier).add(this.tutorialTitleSurface);
	this.layout.header.add(this.tutorialStepsModifier).add(this.tutorialStepsSurface);
}

function _createBody() {

	//////////////////////////////////////
	//All items in the tutorial scrollview, that appears on the left hand side of the
	//tutorial overview
	this.itemsInTutorialList = new Scrollview();

	this.itemsInTutorialListModifier = new StateModifier({
		size: [this.options.itemsListSize, undefined]
		//transform: Transform.translate(300, 0, 0)
	});

	//Should be using a listView instead of a scrollview here... Should standardize that
	//this.layout.content.add(this.itemsInTutorialListModifier).add(this.itemsInTutorialList);

	var itemSurfaceExample = new Surface({
		size: [undefined, 40],
		content: "PSoC 5",
		properties: {
			backgroundColor: 'blue'
		}
	});

	this.allItemsInTutorial.push(itemSurfaceExample);
	itemSurfaceExample.pipe(this.itemsInTutorialList);
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

}

function _addListeners() {
	window.onresize = function(evt) {
		this.flexBodyLayoutModifier.setSize([window.innerWidth-300, undefined]);
	}.bind(this);
}


TutorialOverviewView.prototype = Object.create(View.prototype);
TutorialOverviewView.prototype.constructor = TutorialOverviewView;

TutorialOverviewView.DEFAULT_OPTIONS = {
	headerSize: 150,
	footerSize: 80,
	itemsListSize: 300
};