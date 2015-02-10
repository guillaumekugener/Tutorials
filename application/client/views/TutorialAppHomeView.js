var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
var FlexibleLayout = require("famous/views/FlexibleLayout");
var ImageSurface  = require("famous/surfaces/ImageSurface");
var Scrollview    = require('famous/views/Scrollview');

var Lightbox      = require('famous/views/Lightbox');
var Easing        = require('famous/transitions/Easing');
var SequentialLayout = require('famous/views/SequentialLayout');

var headerViews = [];
var tutorialsInView = [];

/*
* The main application view that contains all of the views and the majority of the
* event listeners that controls moving views around and passing data to the right views
* based on users actions
*/
TutorialAppHomeView = function () {
    View.apply(this, arguments);

    this.onPlayback = false;

    _createBlankBackgroundScreen.call(this);
    _createLayout.call(this);
    _createLightbox.call(this);
    _createHeader.call(this);
    _createBodyView.call(this);
    _createNewTutorialPopUp.call(this);
    _createStepsListView.call(this);
    _createTutorialSelectedHeader.call(this);
    _createAddItemsInTutorialView.call(this);
    _createNavigationMenu.call(this);


    _addListeners.call(this);

    this.onHomeScreen = true;
    this.centered = true;

    this.flexibleHeader.sequenceFrom(headerViews);

}
//Creating a slightly transparent background for when the user first selects a tutorial
function _createBlankBackgroundScreen() {
	this.blankScreenView = new View();

	var whiteSurface = new Surface({
		size: [undefined, undefined],
		content: '<=== Select or create a step!',
		properties: {
			backgroundColor: 'red',
			color: 'white'
		}
	});

	var backgroundModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		opacity: 0.2,
		transform: Transform.translate(0, 0, 200)
	});

	this.blankScreenView.add(backgroundModifier).add(whiteSurface);
}

/*
* Function to create the basic header footer layout of the application
*/
function _createLayout() {
	this.layout = new HeaderFooterLayout({
		headerSize: this.options.headerSize,
		footerSize: this.options.footerSize
	});

	this.layoutModifier = new StateModifier({});

	this.add(this.layoutModifier).add(this.layout);
}

/*
* Creating the main header of the landing page of the application. This inclues a menu
* icon on the left, a search bar in the middle, and a plus icon on the right side
* Menu icon: not totally determined what this will do yet, but should be where the
* 			user is able to check his/her profile and do more administrative things
* Search bar: reactive search to look up tutorials by name
* Add icon: clicked so that the user can start creating a tutorial
*/
function _createHeader() {
	this.headerView = new View();

	//Add a white background to the header view, so that we can not see any views behind it
	var headerBackgroundSurface = new Surface({
		size: [undefined, undefined],
		classes: ['navbarStyling']
	});

	var headerBackgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 5)
	});

	this.layout.header.add(headerBackgroundModifier).add(headerBackgroundSurface);

	//Create a flexible layout. This is what I have been using in order to handle for scaling of
	//views when the window is squished or enlarged. Works very well
	this.flexibleHeader = new FlexibleLayout({
		ratios: [1, 4, 10, 2, 3]
	});

	this.flexibleHeaderModifier = new StateModifier({
		size: [undefined, this.options.headerSize],
		transform: Transform.translate(0, 5, 10)
	});

	this.headerView.add(this.flexibleHeaderModifier).add(this.flexibleHeader);

	var iconView = new View();

	var mainMenuIcon = new ImageSurface({
		size: [25, 25],
		content: 'img/menuIcon.png'
	});

	var mainMenuIconModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0]
	});

	iconView.add(mainMenuIconModifier).add(mainMenuIcon);
	headerViews.push(iconView);

	this.headerSearchBarView = new SearchBarView();
	this.headerSearchBarView.setPlaceholder("search for a tutorial...");

	var gapView1 = new View();
	headerViews.push(gapView1);

	headerViews.push(this.headerSearchBarView);

	var addIconView = new View();

	var addIconSurface = new Surface({
		size: [undefined, 30],
		content: 'Create new tutorial',
		classes: ['navBarCreationButton']
	});

	var addIconModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(-5, 0, 5)
	});

	addIconSurface.on('click', function() {
		if (this.onHomeScreen) {
			this.showCreateNewTutorialPopUp();
		}
	}.bind(this));

	addIconView.add(addIconModifier).add(addIconSurface);
	var gapView2 = new View();
	headerViews.push(gapView2);

	headerViews.push(addIconView);

	this.navbarLightBox.show(this.headerView);
	//this.layout.header.add(this.flexibleHeader);
}

/*
* This function creates the header view that appears in place of the main header view
* after that the user has clicked on a tutorial.
*/
function _createTutorialSelectedHeader() {
	this.viewsInSelectedTutorial = [];

	this.tutorialSelectedHeaderView = new View();

	var headerBackgroundSurface = new Surface({
		size: [undefined, undefined],
		classes: ['navbarStyling']
	});

	this.tutorialSelectedHeaderView.add(headerBackgroundSurface);

	this.flexibleTutorialSelectedHeaderView = new FlexibleLayout({
		ratios: [1, 4, 10, 4, 1]
	});

	this.flexibleTutorialSelectedHeaderViewModifier = new StateModifier({
		size: [undefined, this.options.headerSize],
		transform: Transform.translate(0, 5, 10)
	});

	this.tutorialSelectedHeaderView.add(this.flexibleTutorialSelectedHeaderViewModifier).add(this.flexibleTutorialSelectedHeaderView);

	var iconView = new View();

	var mainMenuIcon = new ImageSurface({
		size: [25, 25],
		content: 'img/menuIcon.png'
	});

	var mainMenuIconModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0]
	});

	mainMenuIcon.on('click', function() {
		if (this.centered) {
			// this.slideMainViewToRight();	
			this.slideMenuUpIntoView();		
		}
		else {
			this.slideMainViewBackToCenter();
			this.hideMenuDownBelowScreen();
		}

		this.centered = !this.centered;

	}.bind(this));

	iconView.add(mainMenuIconModifier).add(mainMenuIcon);
	this.viewsInSelectedTutorial.push(iconView);

	this.selectedTutorialNavBarTitleSurface = new Surface({
		size: [undefined, undefined],
		content: '',
		properties: {
			textAlign: 'center',
			color: 'white'
		}
	});

	this.previousStepView = new View();

	this.previousStepView.surface = new Surface({
		size: [undefined, 25],
		content: '<< Previous Step',
		classes: ['npStepButton']
	});

	var self = this;

	this.previousStepView.surface.on('click', function() {
		if (this.onPlayback) {
			var currentStepInfo = this.playbackCreationView.getCurrentStep();
			console.log('current step' + currentStepInfo.currentStep);

			if (currentStepInfo.currentStep !== 1) {
				var previousStep = currentStepInfo.currentStep - 1;
				this.playbackCreationView.setToStep(previousStep);
				this.stepCreationView.setToStep(previousStep);
			}

		}
		else {
			var currentStep = this.stepCreationView.getCurrentStep();
			this.stepCreationView.saveStepInformation();
			//Modify the current step (save the info)
			///
			if (currentStep !== 1) {
				var previousStep = currentStep - 1;
				this.stepCreationView.setToStep(previousStep);	
			}
		}

	}.bind(this));

	this.previousStepView.add(this.previousStepView.surface);

	this.viewsInSelectedTutorial.push(this.previousStepView);
	this.viewsInSelectedTutorial.push(this.selectedTutorialNavBarTitleSurface);

	var addIconView = new View();

	var addIconSurface = new ImageSurface({
		size: [25, 25],
		content: 'img/plus.png'
	});

	var addIconModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0]
	});

	addIconView.add(addIconModifier).add(addIconSurface);
	this.nextStepView = new View();
	
	this.nextStepView.surface = new Surface({
		size: [undefined, 25],
		content: 'Next step >>',
		classes: ['npStepButton']
	});

	this.nextStepView.surface.on('click', function() {
		/*
		* The button should do one of two things:
		*	1. Move to the next step of the tutorial (obviously)
		*	2. If the user is on the last step, should create a new step
		* It should also either automatically save the user's changes or ask if they want to save their edits
		* (automatically will probably be the implementation);
		*/
		if (this.onPlayback) {
			console.log('in playback next');
			var currentStepInfo = this.playbackCreationView.getCurrentStep();
			if (!currentStepInfo.lastStep) {
				var nextStep = currentStepInfo.currentStep + 1;
				this.playbackCreationView.setToStep(nextStep);
				//Why we need to change stepCreation view to have the sentence view change is an absolute mystery to 
				//me right now. Will work on changing this but no idea why it is behaving this way currently....
				this.stepCreationView.setToStep(nextStep);		
			}

		}
		else {
			var currentStep = this.stepCreationView.getCurrentStep();
			this.stepCreationView.saveStepInformation();
			//Modify the current step (save the info)
			///
			var nextStep = currentStep + 1;
			this.stepCreationView.setToStep(nextStep);
		}

	}.bind(this));

	this.nextStepView.add(this.nextStepView.surface);

	this.viewsInSelectedTutorial.push(this.nextStepView);

	this.viewsInSelectedTutorial.push(addIconView);

	this.flexibleTutorialSelectedHeaderView.sequenceFrom(this.viewsInSelectedTutorial);

}

/*
* Creat the main body view, that contains a list of all of the tutorials that exist on the database
* A lightbox is used to manage the appearing and disappearing of views in the body
*/
function _createBodyView() {
	this.alltutorialsScrollView = new AllTutorialsView();

	this.alltutorialsScrollviewModifier = new StateModifier({
		transform: Transform.translate(0, 0, 0)
	});

	this.stepCreationView = new StepCreationView();

	this.stepCreationModifier = new StateModifier({
		transform: Transform.translate(0, 0, 0)
	});

	//Create the creationView that is used for the playback


	this.playbackViewofTutorial = new FlexibleLayout({
		ratios: [1, 20, 1]
	});

	var playbackViews = [];

	this.playbackViewofTutorial.sequenceFrom(playbackViews);
	var leftGapView = new View();
	var rightGapView = new View();
	this.playbackCreationView = new PlayBackView();

	playbackViews.push(leftGapView);
	playbackViews.push(this.playbackCreationView);
	playbackViews.push(rightGapView);

	this.playbackViewModifier = new StateModifier({});

	this.lightbox.show(this.alltutorialsScrollView);
}

/*
* Create the light boxes for the navbar and for the body view that handles the flow and animation
* of views in and out of the application
*/
function _createLightbox() {
	this.lightbox = new Lightbox(this.options.lightboxOpts);
	this.navbarLightBox = new Lightbox(this.options.navbarLightBoxOpts);

	this.layout.content.add(this.lightbox);
	this.layout.header.add(this.navbarLightBox);
}

/*
* All of the listerns on the top level view. The actions of each of the listeners is described above
* it in the function*/
function _addListeners() {
	//Fires when the user selects a tutorial on the landing page that contains all of the tutorials
	//in the database. It switches the navbar as well as the main body view. It also sets the current
	//tutorial variable on the views below it so that they load in the right data
	this.alltutorialsScrollView.on('tutorialWasSelectedOrUnselected', function() {
		var tutorialName = this.alltutorialsScrollView.selected;
		this.stepCreationView.setTutorialTitle(tutorialName);
		this.changeToSelectedTutorialNavBar(tutorialName);
		//this.slideMenuUpIntoView();
		this.matchStepsInScrollviewToTutorial(tutorialName, this.stepsListView);
		//this.showBlankScreen();
		// this.slideMainViewToRight();
		this.stepCreationView.setTutorialTitle(tutorialName);
		this.showStepCreationView();
		this.stepCreationView.setPlaybackMode(false);
		this.stepCreationView.setToStep1();
	}.bind(this));

	this.alltutorialsScrollView.on('tutorialSelectedForPlayback', function() {
		var totalSteps = this.alltutorialsScrollView.getTotalStepsForTutorialViewed();
		var tutorialName = this.alltutorialsScrollView.selected;
		this.playbackCreationView.setTutorialTitle(tutorialName);
		this.changeToSelectedTutorialNavBar(tutorialName);
		this.showTutorialPlaybackView();
		this.playbackCreationView.setToStep(1);
		this.playbackCreationView.setTotalSteps(totalSteps);

		this.stepCreationView.setTutorialTitle(tutorialName);
		this.stepCreationView.setToStep(1);
		this.stepCreationView.setPlaybackMode(true);
		//this.playbackCreationView.clearAllFields();
		this.setPlayback(true);
	}.bind(this));

	var self = this;
	//When the a pop up window needs to be hidden (in this case, the add new tutorial pop up)
	this.createNewTutorialPopUpView.on('hideForm', function() {
		this.createNewTutorialPopUpViewModifier.setVisible(false);
	}.bind(this));

	//A new tutorial was created and named. Show the step 0 view to allow users to add items to their 
	//newly created tutorial
	this.createNewTutorialPopUpView.on('finishedForm', function() {
		var formInfo = this.createNewTutorialPopUpView.getFieldInfo();
		var tutorialName = formInfo.name;
		console.log(tutorialName);
		this.stepCreationView.setTutorialTitle(tutorialName);
		this.changeToSelectedTutorialNavBar(tutorialName);
		//this.showBlankScreen();
		//this.slideMainViewToRight();
		this.stepCreationView.setTutorialTitle(tutorialName);

		this.hideMenuDownBelowScreen();
		this.showStepZeroScreen(tutorialName);
	}.bind(this));

	//When the user wants to return to see all the tutorials (the landing page)
	this.navigationMenu.on('homeButtonClicked', function() {
		this.centered = true;
		this.slideMainViewBackToCenter();
		this.hideMenuDownBelowScreen();
		this.lightbox.show(this.alltutorialsScrollView);
		this.navbarLightBox.show(this.headerView);
		this.setPlayback(false);
	}.bind(this));

	//When the user wants to add a new step to a tutorial, this event occurs
	this.stepsListView.on('createANewStep', function() {
		this.centered = true;
		this.stepCreationView.clearAllFields();
		this.showStepCreationView();
		this.slideMainViewBackToCenter();
	}.bind(this));

	//When the user selects a tutorial step in the steps menu on the left hand side
	this.stepsListView.on('stepSelectedOrUnselected', function() {
		var stepNumber = this.stepsListView.getSelected();
		var tutorialName = this.alltutorialsScrollView.selected;

		var stepName = stepNumber;
		this.centered = true;
		Meteor.call('getTutorialSteps', tutorialName, function(error, result) {
			var stepOfInterestInfo = result[stepNumber];
			self.stepCreationView.populateWithStepInfo(stepOfInterestInfo);
			self.showStepCreationView();
			self.slideMainViewBackToCenter();
			self.stepCreationView.setTitle('Step ' + stepName, tutorialName);
		});
	}.bind(this));

	//Fires when the user has created a new step on the tutorial
	this.stepCreationView.on('createdAndAddedStepToTutorial', function() {
		this.showBlankScreen();
		//this.slideMainViewToRight();
		this.slideMenuUpIntoView();
		var tutorialName = this.alltutorialsScrollView.selected;
		Meteor.call('getTutorialSteps', tutorialName, function(error, result) {
			var lengthTotal = result.length;
			var newestStep = result[lengthTotal-1];

			self.stepsListView.addItemToList(self.stepsListView, newestStep, lengthTotal-1);
		});
	}.bind(this));

	//This event fires after the user has added their inital items to a newly created tutorial
	this.step0View.on('continueToStepCreationFromStep0', function() {
		//this.showBlankScreen();
		// this.slideMainViewToRight();
		//this.slideMenuUpIntoView();
		this.showStepCreationView();
		this.stepCreationView.setToStep1();
	}.bind(this));

	//Add the listener on the search bar at the top of the view with all of the tutorials
	//as it should filter which tutorials are in the view based on the criteria
	this.headerSearchBarView.on('userSearched', function() {
		var criteria = this.headerSearchBarView.getContent();
		this.alltutorialsScrollView.getMatchingTutorials(criteria);
	}.bind(this));
}

/*
* Creating the pop up view for when a user wants to add a new tutorial from the home screen.
* This uses the GeneralPopView view class that will be part of the packages in future applications
* To quickly create pop-ups
*/
function _createNewTutorialPopUp() {
	var inputViewForPopUp = new CreateNewTutorialPopUpView();
	this.createNewTutorialPopUpView = new GeneralPopUpView(inputViewForPopUp);

	this.createNewTutorialPopUpViewModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		transform: Transform.translate(0, 0, 10)
	});

	this.add(this.createNewTutorialPopUpViewModifier).add(this.createNewTutorialPopUpView);

	this.createNewTutorialPopUpViewModifier.setVisible(false);
}

/*
* Creates the list of steps view that appears on the left side of the screen after a specific tutorial
* has been created
*/
function _createStepsListView() {
	this.stepsListView = new StepsListView();

	this.stepsListModifier = new StateModifier({
		align: [0, 0],
		origin: [0, 0],
		size: [300, undefined],
		transform: Transform.translate(-300, 0, -5)
	});

	this.add(this.stepsListModifier).add(this.stepsListView);
}

/*
* Create the step 0 view, that displays when the user wants to create a new tutorial. This view
* appears once the user has given their tutorial a name
*/
function _createAddItemsInTutorialView() {
	this.step0View = new AddItemsInTutorialView();
}

/*
* Creates the left hand side navigation bar that allows the user to navigate back to the main home screen
* or to their account
*/
function _createNavigationMenu() {
	//Make it into a sequential layout where the opaque view is the second view added
	this.navBarSequentialLayout = new SequentialLayout({

	});

	this.navigationMenu = new SideMenuView();

	this.navigationMenuModifier = new StateModifier({
		align: [0, 0],
		origin: [0, 0],
		size: [300, undefined],
		transform: Transform.translate(-300, 0, -5)
	});

	this.add(this.navigationMenuModifier).add(this.navigationMenu);
}


TutorialAppHomeView.prototype = Object.create(View.prototype);
TutorialAppHomeView.prototype.constructor = TutorialAppHomeView;

/*
* Switches the top navigation bar to the nav bar that allows for easy navigation between
* tutorials.
*
* parameters: tutorialName: name of the tutorial whose steps should be loaded
*/
TutorialAppHomeView.prototype.changeToSelectedTutorialNavBar = function(tutorialName) {
	this.selectedTutorialNavBarTitleSurface.setContent(tutorialName);
	this.navbarLightBox.show(this.tutorialSelectedHeaderView);
}

/*
* Show the step creation view (nouns and verbs view) on the main screen
*/
TutorialAppHomeView.prototype.showStepCreationView = function() {
	this.lightbox.show(this.stepCreationView);
	this.hideMenuDownBelowScreen();
}

/*
* Show tutorial playback view
*/
TutorialAppHomeView.prototype.showTutorialPlaybackView = function() {
	this.lightbox.show(this.playbackViewofTutorial);
	this.hideMenuDownBelowScreen();
}

/*
* Show a white surface in the body when no step is currently seleceted
*/
TutorialAppHomeView.prototype.showBlankScreen = function() {
	this.lightbox.show(this.blankScreenView);
}

/*
* Show the scrollview that contains all of the tutorials that exist (the landing page up to this point)
*/
TutorialAppHomeView.prototype.showHomeScreenView = function() {
	this.lightbox.show(this.alltutorialsScrollView);
}

/*
* Display the pop-up to create a new tutorial
*/
TutorialAppHomeView.prototype.showCreateNewTutorialPopUp = function() {
	this.createNewTutorialPopUpViewModifier.setVisible(true);
}

/*
* Remove the create a new tutorial pop up from view
*/
TutorialAppHomeView.prototype.hideCreateNewTutorialPopUp = function () {
	this.createNewTutorialPopUpViewModifier.setVisible(false);
}

/*
* Slide the main view to the right to display a menu
*/
TutorialAppHomeView.prototype.slideMainViewToRight = function() {
	this.layoutModifier.setTransform(Transform.translate(300, 40, 0), {
		duration: 300,
		curve: 'easeOut'
	});
}

/*
* Slide the main view back to the center, hiding the menu on the left hand side
*/
TutorialAppHomeView.prototype.slideMainViewBackToCenter = function() {
	this.layoutModifier.setTransform(Transform.translate(0, 0, 0), {
		duration: 300,
		curve: 'easeOut'
	});
}

/*
* Load the correct tutorial steps into the menu on the left hand side when a tutorial has been
* selected
*
* parameters:
* tutorialName: the name of the tutorial that has been selected
* listview: the instance of the StepsListView (this needs to be passed in so that functions have)
* 	access to the correct variables and can change the information that is being displayed
*/
TutorialAppHomeView.prototype.matchStepsInScrollviewToTutorial = function(tutorialName, listview) {
	listview.clearPreviousStepsList();
	if (tutorialName !== undefined) {
		Meteor.call('getTutorialSteps', tutorialName, function(error, result) {
			listview.changeSteps(listview, result);
		});
	}
}

/*
* Slide the left hand side menu so that the user can see it
*/
TutorialAppHomeView.prototype.slideMenuUpIntoView = function() {
	// this.stepsListModifier.setTransform(Transform.translate(0, 0, 10), {
	// 	duration: 300,
	// 	curve: 'easeOut'
	// });

	this.slideMainViewToRight();

	this.navigationMenuModifier.setTransform(Transform.translate(0, 0, 100), {
		duration: 300,
		curve: 'easeOut'
	});
}

/*
* Hide the left hand side menu for the user's view
*/
TutorialAppHomeView.prototype.hideMenuDownBelowScreen = function() {
	// this.stepsListModifier.setTransform(Transform.translate(-300, 0, -5), {
	// 	duration: 300,
	// 	curve: 'easeOut'
	// });

	this.slideMainViewBackToCenter();

	this.navigationMenuModifier.setTransform(Transform.translate(-300, 0, -5), {
		duration: 300,
		curve: 'easeOut'
	});
}

/*
* Sets the account field in the navigation bar to the email of the person signed in
*
* param:
*	name: the email (or username)
*/
TutorialAppHomeView.prototype.setAccountName = function(name) {
	this.navigationMenu.setAccountName(name);
}

/*
* Show the step 0 screen where we add items to a newly created tutorial
*/
TutorialAppHomeView.prototype.showStepZeroScreen = function(tutorialName) {
	this.lightbox.show(this.step0View);
	this.step0View.setTutorialName(tutorialName);
}

/*
* Set on playback to true or false;
*/
TutorialAppHomeView.prototype.setPlayback = function(value) {
	this.onPlayback = value;
}


TutorialAppHomeView.DEFAULT_OPTIONS = {
	headerSize: 44,
	footerSize: 0,
	lightboxOpts: {
        inTransform: Transform.translate(300, 0, 0),
        outTransform: Transform.translate(300, 0, 0),
        inTransition: { duration: 500, curve: Easing.outBack },
        outTransition: { duration: 200, curve: Easing.inQuad }
	},
	navbarLightBoxOpts: {
	    inTransform: Transform.translate(300, 0, 0),
	    outTransform: Transform.translate(300, 0, 0),
	    inTransition: { duration: 500, curve: Easing.outBack },
	    outTransition: { duration: 200, curve: Easing.inQuad }
	}
};