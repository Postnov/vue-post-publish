function DPSlider (selector, options) {

	this.selector        = document.querySelector(selector) || document.querySelector('.dp-slider');
	this.options         = options || {};

	var slider           = this.selector,

	    wrapperSlider      = slider.querySelector('.dp-slider__wrapper'),
		slides             = wrapperSlider.children,
		sliderWidth        = 0,
		selectorWidth       = slider.clientWidth,

		//opitons
		slidePerView      = this.options.slidePerView || 1,
		dots              = this.options.dots || false,
		nav               = this.options.nav || false,
		navSpeed          = this.options.navSpeed || 500,

		translateWidth    = selectorWidth / slidePerView,
	    initialTranslate  = 0;



	//Each slides for set width slide and calc common width
	Object.keys(slides).forEach(function(i) {
		//get item width
		slides[i].style.width = (selectorWidth / slidePerView) + 'px';

		//calc width all slide
		sliderWidth += parseFloat(slides[i].style.width);
	});



	// Methods

	this.resetWidth = function() {
		sliderWidth = 0;
		slides = wrapperSlider.children;

		//Each slides for set width slide and calc common width
		Object.keys(slides).forEach(function(i) {

			//get item width
			slides[i].style.width = (selectorWidth / slidePerView) + 'px';

			//calc width all slide
			sliderWidth += parseFloat(slides[i].style.width);
		});

		//set common width
		wrapperSlider.style.width = sliderWidth + 'px';
	};


	this.translateToEnd = function() {
		var translateLast = parseFloat(wrapperSlider.style.width) - (selectorWidth / slidePerView);
		wrapperSlider.style.transform = "translateX(-"+ translateLast + "px)";
	}

	this.translateToStart = function() {
		initialTranslate = 0;
		wrapperSlider.style.transform = "translateX(-"+ 0 + "px)";
	}



	//set common width
	wrapperSlider.style.width = sliderWidth + 'px';


	//set transition duration
	wrapperSlider.style.transitionDuration = navSpeed + 'ms';


	//if parametr dots is true
	if (dots === true) {

		var dotsEl = document.createElement('div');
		dotsEl.classList.add('dp-slider__dots');



		Object.keys(slides).forEach(function(i) {
			//add dots
			var dotsBtn = document.createElement('button');
			dotsBtn.innerText = ++i;
			dotsEl.appendChild(dotsBtn);
		});

		slider.appendChild(dotsEl);


		/* Dots Translate */
		slider.querySelectorAll('.dp-slider__dots button').forEach(function(item) {

			item.addEventListener('click', function() {
				var translateDot = this.innerText * translateWidth;
				translateDot -= translateWidth;
				if (translateDot > wrapperSlider.style.width) {
					wrapperSlider.style.transform = "translateX(-"+ wrapperSlider.style.width +")";
				}else {
					wrapperSlider.style.transform = "translateX(-"+ translateDot + "px)";
				}

				initialTranslate = translateDot;
			});
		});

	}//end condition dots


	//if parametr nav is true
	if (nav === true) {

		var navEl 	= document.createElement('div'),
		    prevEl  	= document.createElement('button'),
		    nextEl 	= document.createElement('button');

		navEl.classList.add('dp-slider__nav');
		prevEl.classList.add('dp-slider__prev');
		nextEl.classList.add('dp-slider__next');

		prevEl.innerHTML = 'prev';
		nextEl.innerHTML = 'next';

		navEl.appendChild(prevEl);
		navEl.appendChild(nextEl);
		slider.appendChild(navEl);

		//event next slide
		nextEl.addEventListener('click', function () {

			//the coordinates of the penultimate element
			var penultimateCoord = parseFloat(wrapperSlider.style.width) - translateWidth;

			if (+penultimateCoord.toFixed() > +initialTranslate.toFixed()) {
				initialTranslate += translateWidth;
				wrapperSlider.style.transform = "translateX(-"+ initialTranslate + "px)";
			}

		});

		//event prev slide
		prevEl.addEventListener('click', function () {

			if (initialTranslate.toFixed() === translateWidth.toFixed()) {
				wrapperSlider.style.transform = "translateX(0px)";
				initialTranslate = 0;
			}else {
				if (initialTranslate > 0) initialTranslate -= translateWidth;
				wrapperSlider.style.transform = "translateX(-"+ initialTranslate + "px)";
			}

		});

	}//end condition nav
};// end constructor
