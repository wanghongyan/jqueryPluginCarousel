;(function ($) {
	//定义Carousel的构造函数
	function Carousel (ele, options) {
		this.$ele = $(ele);
		this.timerId = 0;
		this.isScrolling = false;
		this.isMouseDown = false;
		this.sx = 0;
		this.sy = 0;
		this.defaults = {
			current: 0,
			count: 4,
			width: '300px',
			autoScroll: true,
			interval: 2000
		};
		this.options = $.extend({}, this.defaults, options);

		var	carouselWrapper = this.$ele;
		carouselWrapper.css({
			'width': this.options.width,
			'height': this.options.height
		});

	};
	//定义Carousel的方法
	Carousel.prototype.prev = function() {
		var _self = this;
		var index = _self.options.current;
		var next = index -1;

		if (next == -1) {
			_self.$ele.find('.carousel-list').css({'left': -parseInt(_self.options.width, 10) * (_self.options.count) + 'px'});
			next = _self.options.count - 1;
		}

		_self.moveTo(next);
	};
	Carousel.prototype.forward = function() {
		var _self = this;
		var index = _self.options.current;
		var next = index + 1;

		_self.moveTo(next);
	};
	Carousel.prototype.moveTo = function(index) {
		var _self = this;
		if (!_self.isScrolling) {
			var movePos = parseInt(_self.options.width) * index;
			var toolbar = _self.$ele.find('.carousel-toolbar li');

			_self.isScrolling = true;
			_self.$ele.find('.carousel-list').animate({left: -movePos+'px'}, function() {
				if (index == _self.options.count) {
					_self.$ele.find('.carousel-list').css({'left': 0});
					index = 0;
				}

				_self.options.current = index;

				toolbar.each(function(idx, ele) {
					if (idx == index) {
						$(ele).addClass('carousel-toolbar-current');
					} else {
						$(ele).removeClass('carousel-toolbar-current');
					}
				});

				_self.isScrolling = false;

			});
		}
	};
	Carousel.prototype.startTimer = function() {
		var _self = this;
		_self.timerId = setInterval(function() {
			_self.forward();
		}, _self.options.interval);
	};
	Carousel.prototype.stopTimer = function() {
		var _self = this;
		clearInterval(_self.timerId);
	};
	$.fn.Carousel = function (options) {		
		return this.each(function(index, ele) {
			var carousel = new Carousel(ele, options);
			var	carouselWrapper = carousel.$ele;
			var	prev = carouselWrapper.find('.carousel-control-prev');
			var	forward = carouselWrapper.find('.carousel-control-forward');
			var toolbar = carouselWrapper.find('.carousel-toolbar li');

			prev.bind('click', function() {
				carousel.prev();
			});
			forward.bind('click', function() {
				carousel.forward();
			});

			toolbar.each(function(index, ele) {
				$(ele).bind('click', function() {
					carousel.moveTo(index);
				});
			});

			carouselWrapper.hover(function() {
				carousel.stopTimer();
			}, function() {
				carousel.startTimer();
			});

			carouselWrapper.mousedown(function(event) {
				// $.log('mouse down -----');
				// $.log(event);
				carousel.isMouseDown = true;
				carousel.sx = event.clientX;
				carousel.sy = event.clientY;
			});
			carouselWrapper.mousemove(function(event) {
					event.preventDefault();
				if (carousel.isMouseDown) {
					if (event.buttons == 1) {
						// $.log('mouse move -----');
						// $.log(event);

						var offsetX = event.clientX - carousel.sx;
						$.log(offsetX);
						// carousel.$ele.find('.carousel-list').css({'left': -(parseInt(carousel.options.width, 10) * (carousel.options.current) + offsetX) + 'px'});
			
					}
					else {
						carousel.isMouseDown = false;
					}
				}
			});

			if (carousel.options.autoScroll) {
				carousel.startTimer();
			}
			
		});
	}
})(jQuery);