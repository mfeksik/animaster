addListeners();

function addListeners() {
    let anim;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.stop();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);

            customAnimation.play(block);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    const _steps = [];
    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transformDuration = null;
    }
    function clearSteps() {
        _steps.length = 0;
    }
    function executeSteps(element, steps) {
        let totalDelay = 0;

        steps.forEach(step => {
            setTimeout(() => {
                switch(step.type) {
                    case 'move':
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(step.params, null);
                        break;
                    case 'fadeIn':
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                    case 'fadeOut':
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    case 'scale':
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(null, step.params);
                        break;
                }
            }, totalDelay);
            totalDelay += step.duration;
        });
    }
    return {
        move : function(element, duration, translation) {
            this.addMove(duration, translation);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        fadeIn : function(element, duration) {
            this.addFadeIn(duration);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        scale : function(element, duration, ratio) {
            this.addScale(duration, ratio);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        fadeOut : function(element, duration) {
            this.addFadeOut(duration);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        heartBeating : function(element) {
            let interval = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 5 / 7);
                }, 500);
            }, 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            }
        },
        moveAndHide : function(element, duration) {
            this.addMove(duration * 0.4, {x: 100, y: 20});
            this.addFadeOut(duration * 0.6);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        showAndHide : function(element, duration) {
            this.addFadeIn(duration / 3);
            this.addFadeOut(duration / 3);
            this.play(element);
            clearSteps.call(this);
            return this;
        },
        addMove : function(duration, translation) {
            _steps.push({
                type: 'move',
                duration: duration,
                params: translation
            });
            return this;
        },
        addFadeIn : function(duration) {
            _steps.push({
                type: 'fadeIn',
                duration: duration,
                params: null
            });
            return this;
        },

        addFadeOut : function(duration) {
            _steps.push({
                type: 'fadeOut',
                duration: duration,
                params: null
            });
            return this;
        },

        addScale : function(duration, ratio) {
            _steps.push({
                type: 'scale',
                duration: duration,
                params: ratio
            });
            return this;
        },
        play : function(element) {
            if (_steps.length > 0) {
                executeSteps(element, _steps);
            }
            return this;
        },


        resetFadeIn : resetFadeIn,
        resetFadeOut : resetFadeOut,
        resetMoveAndScale : resetMoveAndScale
    }
}