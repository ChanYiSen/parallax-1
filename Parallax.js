// 'use strict';

function Parallax (scene, options) {

	// Checking scene
	if (arguments.length<1) { throw new Error("Missing argument") };

	var scalarX, scalarY,
			friction,
			limitX, limitY,
			inverseX, inverseY,
			comeBack, hoverOnly, inputElement,
			scene = scene;

	var scope = this;

	// Checking scene typeof
	if ( !Parallax.prototype.isTypeOf(scene, 'HTML') ) {
		throw new Error("First argument must be an HTML Object");
	};

	scene.parallaxScene = this;

	// Set descriptors
	defineDescriptors();

	// Update screen parametrs
	Parallax.prototype.setScreenParameters();

	// Set up position
	scene.style.position = "absolute";

	// Update default coordinates of scene
	Parallax.prototype.updateCoords(scope);

	if (arguments.length>1) {
		// Set options
		setOptions(options);

		// Check addictions
		if (!options.inputElement && !options.hoverOnly) {
			Parallax.prototype.addActiveScene(this);
		} else if (options.inputElement) {
			inputElement.addEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			inputElement.addEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		} else if (options.hoverOnly) {
			scene.addEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			scene.addEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		};

	} else {
		// Set options
		setOptions();
		Parallax.prototype.addActiveScene(this);
	};

	// Try to call back
	try { options.onReady() } catch (err) {};

	function setOptions (options) {

		// Bypass the error
		if (!arguments.length) {
			var options = {};
		};
		scope.scalarX = options.scalarX;
		scope.scalarY = options.scalarY;
		scope.friction = options.friction;
		scope.limitX = options.limitX;
		scope.limitY = options.limitY;
		scope.inverseX = options.inverseX;
		scope.inverseY = options.inverseY;

		scope.comeBack = options.comeBack;

		scope.inputElement = options.inputElement;

		scope.hoverOnly = options.hoverOnly;
	};

	function defineDescriptors () {
	Object.defineProperties(scope, {
		'scalarX': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'number');
				if (check) {
					scalarX = Math.abs(check);
				} else {
					scalarX = 0.15;
				};
			},
			get: function () {
				return scalarX;
			},
			configurable: false
		},
		'scalarY': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'number');
				if (check) {
					scalarY = Math.abs(check);
				} else {
					scalarY = 0.15;
				};
			},
			get: function () {
				return scalarY;
			},
			configurable: false
		},
		'friction': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'number');
				if (check) {
					friction = Math.abs(check);
				} else {
					friction = 200;
				};
			},
			get: function () {
				return friction;
			},
			configurable: false
		},
		'limitX': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'number');
						check = Math.abs(check);
				if (check>0) {
					limitX = check;
				} else {
					limitX = null;
				};
			},
			get: function () {
				return limitX;
			},
			configurable: false
		},
		'limitY': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'number');
						check = Math.abs(check);
				if (check>0) {
					limitY = check;
				} else {
					limitY = null;
				};
			},
			get: function () {
				return limitY;
			},
			configurable: false
		},
		'comeBack': {
			set: function (value) {
				comeBack = !!value;
			},
			get: function () {
				return comeBack;
			},
			configurable: false
		},
		'hoverOnly': {
			set: function (value) {
				scope.deactivate();
				hoverOnly = !!value;
				scope.activate();				
			},
			get: function () {
				return hoverOnly;
			},
			configurable: false
		},
		'inverseX': {
			set: function (value) {
				inverseX = !!value;
			},
			get: function () {
				return inverseX;
			},
			configurable: false
		},
		'inverseY': {
			set: function (value) {
				inverseY = !!value;
			},
			get: function () {
				return inverseY;
			},
			configurable: false
		},
		'inputElement': {
			set: function (value) {
				var check = Parallax.prototype.isTypeOf(value, 'HTML');
				if (!check) {
					inputElement = null;
					return;
				};
				scope.deactivate();
				inputElement = value;
				scope.activate();
			},
			get: function () {
				return inputElement;
			},
			configurable: false
		},
		'scene': {
			set: function (value) {
				return false;
			},
			get: function () {
				return scene;
			},
			configurable: false
		}
	});
	};
};

(function () {
	var screenHeight, screenWidth;

	Parallax.prototype.setScreenParameters = function (e) {
		var screenHeight = document.documentElement.clientHeight;
		var screenWidth = document.documentElement.clientWidth;

		Parallax.prototype.screenHeight = screenHeight;
		Parallax.prototype.screenWidth = screenWidth;
	};

	Object.defineProperties(Parallax.prototype, {
		"screenHeight": {
			set: function (value) {
				try { throw new Error() } catch (err) {
					var stack = err.stack.indexOf("Parallax.setScreenParameters");
				};
				if (stack !== -1) { 
					screenHeight = value;
					return true;
				};
				return false;
			},
			get: function () {
				return screenHeight;
			},
			configurable: false
		},
		"screenWidth": {
			set: function (value) {
				try { throw new Error() } catch (err) {
					var stack = err.stack.indexOf("Parallax.setScreenParameters");
				};
				if (stack !== -1) { 
					screenWidth = value;
					return true;
				};
				return false;
			},
			get: function () {
				return screenWidth;
			},
			configurable: false
		}
	});
})();

(function () {

	var deactivatedList = [];

	Parallax.prototype.activate = function () {
		if (!deactivatedList.length) { return false };
		var boolTest = false;
		for (var i=0; i<deactivatedList.length; i++) {
			if ( deactivatedList[i] === this ) {
				deactivatedList.splice(i,1);
				boolTest = true;
			};
		};
		if (!boolTest) { return false };

		if (!this.hoverOnly && !this.inputElement) {
			Parallax.prototype.addActiveScene(this);
		} else if (this.inputElement) {
			this.inputElement.addEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			this.inputElement.addEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		} else if (this.hoverOnly) {
			this.scene.addEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			this.scene.addEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		};
		return true;
	};

	Parallax.prototype.deactivate = function () {
		var boolTest = false;
		if (deactivatedList.length) {
			for (var i=0; i<deactivatedList.length; i++) {
				if ( deactivatedList[i] === this ) { boolTest = true };
			};
			if (boolTest) { return false };
		};
		deactivatedList.push(this);

		if (!this.hoverOnly && !this.inputElement) {
			Parallax.prototype.removeActiveScene(this);
		} else if (this.inputElement) {
			Parallax.prototype.removeActiveScene(this);
			this.inputElement.removeEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			this.inputElement.removeEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		} else if (this.hoverOnly) {
			Parallax.prototype.removeActiveScene(this);
			this.scene.removeEventListener('mouseover', Parallax.prototype.mouseSceneOver);
			this.scene.removeEventListener('mouseout', Parallax.prototype.mouseSceneOut);
		};
		return true;
	};

})();

Parallax.prototype.isTypeOf = function (element, type) {
	var feedback = null;
	if (!element && element !== 0) { return feedback };
	switch (type) {
		case ('number'):
			var n = parseFloat(element);
			if ( typeof  n === 'number' && isFinite(n) ) feedback = n;
			break;
		case ('function'):
			if ( typeof element === 'function' ) feedback = element;
			break;
		case ('HTML'):
			var targetClass = element.toString().slice(8, 12);
			if ( targetClass === "HTML" ) feedback = element;
			break;
		case ('string'):
			if ( typeof  element === 'string' ) feedback = element;
			break;
	};
	return feedback;
};

Parallax.prototype.updateCoords = function (scope) {
	if (!scope.scene) {
		throw new Error ("Missing scene");
	};

	var coords = scope.scene.getBoundingClientRect();

	scope.defaultX = coords.left;
	scope.defaultY = coords.top;
	return true;
};

Parallax.prototype.mouseLeave = function (e) {
	var start = performance.now();
	var maxFriction,
			scenesList = Parallax.prototype.getActiveScenesList();
	if (!e.relatedTarget) {
		var scenesToComeBack = [];
		for (var i=0; i<scenesList.length; i++) {
			if ( scenesList[i].comeBack ) {
				scenesToComeBack.push( defineComeBackCoords(scenesList[i]) );
			};
		};
		if (scenesToComeBack.length) {
			maxFriction = Parallax.prototype.getMaxFriction(scenesToComeBack);
			Parallax.prototype.renderFrame (start, scenesToComeBack, maxFriction);
		};
	};

	function defineComeBackCoords (scope) {
		var newCoords = {};
		newCoords['obj'] = scope.scene;
		newCoords['newPosX'] = scope.defaultX;
		newCoords['newPosY'] = scope.defaultY;
		newCoords['friction'] = scope.friction;

		return newCoords;
	};
	
};

Parallax.prototype.mouseSceneOver = function (e) {
	if ( e.target.contains(e.relatedTarget) ) { return };
	var scene = e.target.parallaxScene;

	Parallax.prototype.addActiveScene(scene);
};

Parallax.prototype.mouseSceneOut = function (e) {
	if ( e.relatedTarget.contains(e.target) ) { return };
	var scene = e.target.parallaxScene;

	Parallax.prototype.removeActiveScene(scene);
};

(function () {
	var requestId;

	Parallax.prototype.renderFrame = function (start, renderList, maxFriction) {
	if (arguments.length<3) { return };
	cancelAnimationFrame(requestId);
	requestId = requestAnimationFrame(animate);

	function animate (time) {
		var timePass = Math.abs(time - start);
		var timeFraction = timePass/maxFriction;
		if (timeFraction>1) { timeFraction = 1 };
		// timing(timeFraction)
		for (var i=renderList.length;i--;i) {
			render( renderList[i] );
		};

		if (timeFraction<1) { requestAnimationFrame(animate) };

		function render (currentRender) {
			if (currentRender.friction < maxFriction) {
				timeFraction = timePass/currentRender.friction;
				if (timeFraction>=1) { return };
			};			

			var coords = currentRender.obj.getBoundingClientRect();

			currentRender.obj.style.left = coords.left + ( (currentRender.newPosX - coords.left) * timeFraction) + "px";
			currentRender.obj.style.top = coords.top + ( (currentRender.newPosY - coords.top) * timeFraction) + "px";
		};		
	};
};
})();

(function () {
	var resizeTimer;

	Parallax.prototype.screenResizeFunc = function (e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(Parallax.prototype.setScreenParameters, 500);
	};
})();

(function () {
	var activeScenesList = [];

	Parallax.prototype.addActiveScene = function (scene) {
		var boolTest = false;
		for (var i=0; i<activeScenesList.length; i++) {
			if ( activeScenesList[i] === scene ) { boolTest = true };
		};
		if (boolTest) { return false };
		activeScenesList.push(scene);
		return true;
	};

	Parallax.prototype.removeActiveScene = function (scene) {
		for (var i=0; i<activeScenesList.length; i++) {
			if ( activeScenesList[i] === scene ) {
				activeScenesList.splice(i,1);
				return true;
			};
		};
		return false;
	};

	Parallax.prototype.getActiveScenesList = function () {
		return activeScenesList;
	};

})();

Parallax.prototype.getMaxFriction = function (scenesList) {
	if (!scenesList.length) { return 200 };
	var max = 0;
	for (var i=scenesList.length;i--;i) {
		if (scenesList[i].friction>max) {max = scenesList[i].friction};
	};
	return max || 200;
};

Parallax.prototype.mouseFollow = function (e) {
	var scenesList = Parallax.prototype.getActiveScenesList();
	if (!scenesList.length) { return };

	var start = performance.now();

	var pointCoords = [];

	for (var i=scenesList.length;i--;i) {
		pointCoords.push( findNewCoords(scenesList[i]) );
	};

	var maxFriction = Parallax.prototype.getMaxFriction(pointCoords);
	Parallax.prototype.renderFrame (start, pointCoords, maxFriction);

	function findNewCoords (scope) {
			var newCoords = {};

			var limitX, limitY,
					middleX, middleY;

			if (!isFinite(scope.defaultX) || !isFinite(scope.defaultY)) {
				throw new Error("Missing default coords of scene");
			};

			if (!scope.inputElement && !scope.hoverOnly) {
				middleX = scope.screenWidth/2;
				middleY = scope.screenHeight/2;
			} else if (scope.inputElement) {
				middleX = scope.inputElement.offsetWidth/2;
				middleY = scope.inputElement.offsetHeight/2;
			} else if (scope.hoverOnly) {
				middleX = scope.scene.offsetWidth/2;
				middleY = scope.scene.offsetHeight/2;
			};

			if (scope.limitX) {
				limitX = scope.limitX;
			} else if (!limitX) {
				limitX = middleX;
			};

			if (scope.limitY) {
				limitY = scope.limitY;
			} else if (!limitY) {
				limitY = middleX;
			};

			var mX = (e.pageX - middleX)/middleX,
					mY = (e.pageY - middleY)/middleY;

			if (scope.inverseX) { mX = mX*(-1) };
			if (scope.inverseY) { mY = mY*(-1) };

			var newPosX = scope.defaultX + (mX*limitX*scope.scalarX),
					newPosY = scope.defaultY + (mY*limitY*scope.scalarY);

			newCoords['obj'] = scope.scene;
			newCoords['newPosX'] = newPosX;
			newCoords['newPosY'] = newPosY;
			newCoords['friction'] = scope.friction;

			return newCoords;
		};
};

(function () {
	window.addEventListener ('resize', Parallax.prototype.screenResizeFunc);
	document.addEventListener ('mousemove', Parallax.prototype.mouseFollow);
	document.addEventListener ('mouseout', Parallax.prototype.mouseLeave);
	document.addEventListener ('DOMContentLoaded', Parallax.prototype.setScreenParameters);

	Object.freeze(Parallax.prototype);
})();
