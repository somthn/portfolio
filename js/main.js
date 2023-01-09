/* ========== navi ========== */
(function () {
		
    //////////////////////
     // Utils
   //////////////////////
     function throttle(fn, delay, scope) {
         // Default delay
         delay = delay || 250;
         var last, defer;
         return function () {
             var context = scope || this,
                 now = +new Date(),
                 args = arguments;
             if (last && now < last + delay) {
                 clearTimeout(defer);
                 defer = setTimeout(function () {
                     last = now;
                     fn.apply(context, args);
                 }, delay);
             } else {
                 last = now;
                 fn.apply(context, args);
             }
         }
     }
 
     function extend(destination, source) {
         for (var k in source) {
             if (source.hasOwnProperty(k)) {
                 destination[k] = source[k];
             }
         }
         return destination;
     }
   
    //////////////////////
     // END Utils
   //////////////////////
   
    //////////////////////
    // Scroll Module
    //////////////////////
 
     var ScrollManager = (function () {
 
         var defaults = {
 
                 steps: null,
                 navigationContainer: null,
                 links: null,
                 scrollToTopBtn: null,
 
                 navigationElementClass: '.Quick-navigation',
                 currentStepClass: 'current',
                 smoothScrollEnabled: true,
                 stepsCheckEnabled: true,
 
                 // Callbacks
                 onScroll: null,
 
                 onStepChange: function (step) {
                     var self = this;
                     var relativeLink = [].filter.call(options.links, function (link) {
                         link.classList.remove(self.currentStepClass);
                         return link.hash === '#' + step.id;
                     });
                     relativeLink[0].classList.add(self.currentStepClass);
                 },
 
                 // Provide a default scroll animation
                 smoothScrollAnimation: function (target) {
                     $('html, body').animate({
                         scrollTop: target
                     }, 'slow');
                 }
             },
 
             options = {};
 
         // Privates
         var _animation = null,
             currentStep = null,
             throttledGetScrollPosition = null;
 
         return {
 
             scrollPosition: 0,
 
             init: function (opts) {
 
                 options = extend(defaults, opts);
 
                 if (options.steps === null) {
                     console.warn('Smooth scrolling require some sections or steps to scroll to :)');
                     return false;
                 }
 
                 // Allow to customize the animation engine ( jQuery / GSAP / velocity / ... )
                 _animation = function (target) {
                     target = typeof target === 'number' ? target : $(target).offset().top;
                     return options.smoothScrollAnimation(target);
                 };
 
                 // Activate smooth scrolling
                 if (options.smoothScrollEnabled)  this.smoothScroll();
 
                 // Scroll to top handling
                 if (options.scrollToTopBtn) {
                     options.scrollToTopBtn.addEventListener('click', function () {
                         options.smoothScrollAnimation(0);
                     });
                 }
 
                 // Throttle for performances gain
                 throttledGetScrollPosition = throttle(this.getScrollPosition).bind(this);
                 window.addEventListener('scroll', throttledGetScrollPosition);
                 window.addEventListener('resize', throttledGetScrollPosition);
 
                 this.getScrollPosition();
             },
 
             getScrollPosition: function () {
                 this.scrollPosition = window.pageYOffset || window.scrollY;
                 if (options.stepsCheckEnabled) this.checkActiveStep();
                 if (typeof  options.onScroll === 'function') options.onScroll(this.scrollPosition);
             },
 
             scrollPercentage: function () {
                 var body = document.body,
                     html = document.documentElement,
                     documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
                         html.clientHeight, html.scrollHeight, html.offsetHeight);
 
                 var percentage = Math.round(this.scrollPosition / (documentHeight - window.innerHeight) * 100);
                 if (percentage < 0)  percentage = 0;
                 if (percentage > 100)  percentage = 100;
                 return percentage;
             },
 
             doSmoothScroll: function (e) {
                 if (e.target.nodeName === 'A') {
                     e.preventDefault();
                     if (location.pathname.replace(/^\//, '') === e.target.pathname.replace(/^\//, '') && location.hostname === e.target.hostname) {
                         var targetStep = document.querySelector(e.target.hash);
                         targetStep ? _animation(targetStep) : console.warn('Hi! You should give an animation callback function to the Scroller module! :)');
                     }
                 }
             },
 
             smoothScroll: function () {
                 if (options.navigationContainer !== null) options.navigationContainer.addEventListener('click', this.doSmoothScroll);
             },
 
             checkActiveStep: function () {
                 var scrollPosition = this.scrollPosition;
 
                 [].forEach.call(options.steps, function (step) {
                     var bBox = step.getBoundingClientRect(),
                         position = step.offsetTop,
                         height = position + bBox.height;
 
                     if (scrollPosition >= position && scrollPosition < height && currentStep !== step) {
                         currentStep = step;
                         step.classList.add(self.currentStepClass);
                         if (typeof options.onStepChange === 'function') options.onStepChange(step);
                     }
                     step.classList.remove(options.currentStepClass);
                 });
             },
 
             destroy: function () {
                 window.removeEventListener('scroll', throttledGetScrollPosition);
                 window.removeEventListener('resize', throttledGetScrollPosition);
                 options.navigationContainer.removeEventListener('click', this.doSmoothScroll);
             }
         }
     })();
      //////////////////////
      // END scroll Module
      //////////////////////
   
   
     //////////////////////
     // APP init
     //////////////////////
 
     var scrollToTopBtn = document.querySelector('.Scroll-to-top'),
         steps = document.querySelectorAll('.js-scroll-step'),
         navigationContainer = document.querySelector('.Quick-navigation'),
         links = navigationContainer.querySelectorAll('a'),
         progressIndicator = document.querySelector('.Scroll-progress-indicator');
 
     ScrollManager.init({
         steps: steps,
         scrollToTopBtn: scrollToTopBtn,
         navigationContainer: navigationContainer,
         links: links,
       
         // Customize onScroll behavior
         onScroll: function () {
             var percentage = ScrollManager.scrollPercentage();
             percentage >= 90 ? scrollToTopBtn.classList.add('visible') : scrollToTopBtn.classList.remove('visible');
 
             if (percentage >= 10) {
                 progressIndicator.innerHTML = percentage + "%";
                 progressIndicator.classList.add('visible');
             } else {
                 progressIndicator.classList.remove('visible');
             }
         },
       
         // Behavior when a step changes
         // default : highlight links 
       
         // onStepChange: function (step) {},
       
         // Customize the animation with jQuery, GSAP or velocity 
      // default : jQuery animate()
      // Eg with GSAP scrollTo plugin
       
         //smoothScrollAnimation: function (target) {
         //		TweenLite.to(window, 2, {scrollTo:{y:target}, ease:Power2.easeOut});
        //}
       
     });
   
     //////////////////////
     // END APP init
     //////////////////////
 
 })();

 /* section A animation */
 var particles= document.getElementById("particles");

 function main(){
     var np = document.documentElement.clientWidth / 29;
     particles.innerHTML = "";
     for (var i = 0; i < np; i++) {
         var w = document.documentElement.clientWidth;
         var h = document.documentElement.clientHeight;
         var rndw = Math.floor(Math.random() * w ) + 1;
         var rndh = Math.floor(Math.random() * h ) + 1;
         var widthpt = Math.floor(Math.random() * 8) + 3;
         var opty = Math.floor(Math.random() * 5) + 2;
         var anima = Math.floor(Math.random() * 12) + 8;
 
         var div = document.createElement("div");
         div.classList.add("particle");
         div.style.marginLeft = rndw+"px";
         div.style.marginTop = rndh+"px";
         div.style.width = widthpt+"px";
         div.style.height = widthpt+"px";
         div.style.background = "white";
         div.style.opacity = opty;
         div.style.animation = "move "+anima+"s ease-in infinite ";
         particles.appendChild(div);
     }
 }
 window.addEventListener("resize", main);
 window.addEventListener("load", main);


 /* ========= section D snow ======== */
 document.addEventListener('scroll',function(){
   let currentScrollValue = document.documentElement.scrollTop; //현재의 스크롤 값 확인
   
 });


 
 /* ========= section E snow ======== */
 (function () {
    'use strict';
    window.addEventListener('load', function() {
      var canvas = document.getElementById('canvas');
  
      if (!canvas || !canvas.getContext) {
        return false;
      }
  
      /********************
        Random Number
      ********************/
  
      function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
  
      /********************
        Var
      ********************/
  
      // canvas 
      var ctx = canvas.getContext('2d');
      var X = canvas.width = window.innerWidth;
      var Y = canvas.height = window.innerHeight;
  
      /********************
        Animation
      ********************/
  
      window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(cb) {
          setTimeout(cb, 17);
        };
  
      /********************
        Ground
      ********************/
      
      function drawGround() {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.rect(0, Y - Y * 0.1, X, Y - Y * -0.1);
        ctx.fill();
      }
  
      /********************
        Moon
      ********************/
      
      var radius = 150;
  
      if (X < 768) {
        radius = 100;
      }
  
      function drawMoon() {
        ctx.save();
        ctx.beginPath();
        var col = '255, 255, 255';
        var g = ctx.createRadialGradient(X / 2, Y / 3, radius, X / 3, Y / 3, 0);
        g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
        g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
        g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
        ctx.fillStyle = g;
        ctx.arc(X / 2, Y / 3, radius, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
      }
  
      /********************
        Snow
      ********************/
      
      // var
      var snowNum = 80;
      var backSnowNum = 80;
      var snows = [];
      var backSnows = [];
  
      if (X < 768) {
        snowNum = 25;
        backSnowNum = 25;
      }
       
      function Snow(ctx, x, y, r, g) {
        this.ctx = ctx;
        this.init(x, y, r, g);
      }
  
      Snow.prototype.init = function(x, y, r, g) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = '255, 255, 255';
        this.v = {
          x: 0,
          y: g
        };
      };
  
      Snow.prototype.updatePosition = function() {
        this.y += this.v.y;
      };
      
      Snow.prototype.wrapPosition = function() {
        if (this.x - this.r > X) {
          this.x = 0;
        }
        if (this.x + this.r < 0) {
          this.x = X;
        }
        if (this.y - this.r > Y) {
          this.y = 0;
        }
        if (this.y + this.r < 0) {
          this.y = Y;
        }
      };
  
      Snow.prototype.draw = function() {
        ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.gradient();
        ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      };
  
      Snow.prototype.gradient = function () {
        var col = this.c;
        var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
        g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
        g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
        return g;
      };
  
      Snow.prototype.resize = function() {
        this.x = rand(0, X);
        this.y = rand(0, Y);
      };
  
      Snow.prototype.render = function() {
        this.updatePosition();
        this.wrapPosition();
        this.draw();
      };
  
      for (var i = 0; i < backSnowNum; i++) {
        var snow = new Snow(ctx, rand(0, X), rand(0, Y), rand(1, 5), Math.random());
        backSnows.push(snow);
      }
      
      for (var i = 0; i < snowNum; i++) {
        var snow = new Snow(ctx, rand(0, X), rand(0, Y), rand(10, 15), Math.random() + 0.3);
        snows.push(snow);
      }
      
      /********************
        Tree
      ********************/
          
      // var 
      
      /********************
        Render
      ********************/
      
      function render(){
        ctx.clearRect(0, 0, X, Y);
        drawMoon();
        drawGround();
        for (var i = 0; i < backSnows.length; i++) {
          backSnows[i].render();
        }
        // for (var i = 0; i < backTrees.length; i++) {
        //   backTrees[i].render();
        // }
        // for (var i = 0; i < trees.length; i++) {
        //   trees[i].render();
        // }
        for (var i = 0; i < snows.length; i++) {
          snows[i].render();
        }
        requestAnimationFrame(render);
      }
  
      render();
  
      /********************
        Event
      ********************/
      
      // resize
      function onResize() {
        X = canvas.width = window.innerWidth;
        Y = canvas.height = window.innerHeight;
        drawMoon();
        drawGround();
        for (var i = 0; i < snows.length; i++) {
            snows[i].resize();
        }
        for (var i = 0; i < backSnows.length; i++) {
          backSnows[i].resize();
        }
        // for (var i = 0; i < backTrees.length; i++) {
        //   backTrees[i].resize();
        // }
        // for (var i = 0; i < trees.length; i++) {
        //   trees[i].resize();
        // }
        for (var i = 0; i < snows.length; i++) {
          snows[i].resize();
        }
      }
  
      window.addEventListener('resize', function() {
        onResize();
      });
  
    });
    // Author
    console.log('File Name / snowyLandscape.js\nCreated Date / January 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
  })();
  