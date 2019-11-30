$(function(){
	$('.header__slider').slick({
		infinite: true,
		fade: true,
		prevArrow: '<img class="slider__arrow slider__arrow--prev" src="img/arrow.svg" alt="previous slide"></img>',
		nextArrow: '<img class="slider__arrow slider__arrow--next" src="img/arrow.svg" alt="next slide"></img>'
	});
});