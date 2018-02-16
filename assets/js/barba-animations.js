var Barba = require('barba.js');
var anime = require('animejs');
var fitvids = require('fitvids');

var FadeTransition = Barba.BaseTransition.extend({
    start: function () {
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

Barba.Pjax.getTransition = function () {
    return FadeTransition;
};

Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    fitvids('.embed-container');
});

document.addEventListener('DOMContentLoaded', function (e) {
    Barba.Pjax.start();
});