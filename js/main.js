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


 /* ================ section A animation ================== */

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


/*
  Proper Parallax
*/
function getTop(elem) {
  let box = elem.getBoundingClientRect();
  let body = document.body;
  let docEl = document.documentElement;
  let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  let clientTop = docEl.clientTop || body.clientTop || 0;
  let top = box.top + scrollTop - clientTop;
  return Math.round(top);
}
function parallaxImages() {
  // Set the scroll for each parallax individually
  let plx = document.getElementsByClassName('parallax');
  for (i = 0; i < plx.length; i++) {
    let height = plx[i].clientHeight;
    let img = plx[i].getAttribute('data-plx-img');
    let plxImg = document.createElement("div");
    plxImg.className += " plx-img";
    plxImg.style.height = (height + (height / 2)) + 'px';
    plxImg.style.backgroundImage = 'url(' + img + ')';
    plx[i].insertBefore(plxImg, plx[i].firstChild);
  }
}
window.addEventListener('load', parallaxImages);
function plxScroll() {
  let scrolled = window.scrollY;
  let win_height_padded = window.innerHeight * 1.25;
  // Set the scroll for each parallax individually
  let plx = document.getElementsByClassName('parallax');
  for (i = 0; i < plx.length; i++) {
    let offsetTop = plx[i].getBoundingClientRect().top + scrolled;
    //let orientation = plx[i].getAttribute('data-plx-o');
    if (scrolled + win_height_padded >= offsetTop) {
      let plxImg = plx[i].getElementsByClassName('plx-img')[0];
      if (plxImg) {
        let plxImgHeight = plxImg.clientHeight;
        let singleScroll = (scrolled - offsetTop) - plxImgHeight / 5;
        plxImg.style.top = (singleScroll / 5) + "px";
      }
    }
  }
}
window.addEventListener('load', plxScroll);
window.addEventListener('resize', plxScroll);
window.addEventListener('scroll', plxScroll);





 /* ============= section D ============= */

let modal = document.getElementsByClassName("item-txt"); //modal 가져오기
let openModal = document.getElementsByClassName("item-img"); //modal 띄우기 위한 버튼 가져오기
let closeBtn = document.getElementsByClassName("item-txt-btn"); //modal 닫는 버튼
let funcs = [];

//modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
const modalToggle = (num) => {
  return () => { //modal 띄우기
    openModal[num].onclick = () => {
      modal[num].style.display = "block"
      console.log(num);
    }

    //modal 닫기
    closeBtn[num].onclick = () => {
      modal[num].style.display = "none";
    }
  }
}

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의
for(let i = 0; i < openModal.length; i++){
  funcs[i] = modalToggle(i);
}

// 원하는 Modal 수만큼 funcs 함수를 호출
for(let j = 0; j < openModal.length; j++){
  funcs[j]();
}

 
 /* ==================== section E snow ==================== */

/* ---- particles.js config ---- */
window.addEventListener('DOMContentLoaded', (event) => {
    particlesJS("particles-js", {
        "particles": {
          "number": {
            "value":40,
            "density": {
              "enable": false,
              "value_area": 1972.8691040806818
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.43292125643369117,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 11.565905665290902,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": false,
            "distance": 561.194221302933,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 3,
            "direction": "bottom",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 1282.7296486924183,
              "rotateY": 1362.9002517356944
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false,
              "mode": "bubble"
            },
            "onclick": {
              "enable": false,
              "mode": "bubble"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });  
      
      /* ---- stats.js config ---- */
});
