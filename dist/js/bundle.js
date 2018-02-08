/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	var FadeTransition = Barba.BaseTransition.extend({
		start: function() {
		    Promise
			    .all([this.newContainerLoading, this.fadeOut()])
			    .then(this.fadeIn.bind(this));
		},

		fadeOut: function () {
			const oldContainer = this.oldContainer
			return new Promise(function (resolve) {
				anime({
					targets: oldContainer,
					opacity: 0,
					easing: 'linear',
					duration: 400,
					complete: function () {
						resolve()
					}
				})
			})
		},

		fadeIn: function () {
			const _this = this
			const oldContainer = this.oldContainer
			const newContainer = this.newContainer

			window.scrollTo(0, 0)
			oldContainer.style.display = 'none'
			newContainer.style.visibility = 'visible'
			newContainer.style.opacity = 0
			newContainer.style.transform = 'translateX(-100px)'

			const page_header = newContainer.querySelector('#page-header')

			if (page_header) {
				page_header.style.opacity = 0
				anime({
					targets: page_header,
					opacity: 1,
					translateY: [-100, 0],
					easing: 'easeOutQuart',
					duration: 1000,
					delay: 300
				})
			}

			anime({
				targets: newContainer,
				opacity: 1,
				translateX: 0,
				easing: 'easeOutQuart',
				duration: 1000,
				complete: function () {
					_this.done()
				}
			})
		},

	});

	Barba.Pjax.getTransition = function() {
	   return FadeTransition;
	};

	document.addEventListener('DOMContentLoaded', function (e) {
		Barba.Pjax.start();
	});

/***/ })
/******/ ]);