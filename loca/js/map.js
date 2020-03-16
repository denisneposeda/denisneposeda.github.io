ymaps.ready(function () {
    // Создание экземпляра карты и его привязка к созданному контейнеру.
    var myMap = new ymaps.Map('map', {
			center: [55.751574, 37.573856],
			zoom: 9,
			behaviors: ['default', 'scrollZoom'],
			controls: ['zoomControl', 'fullscreenControl']
		}, {
			searchControlProvider: 'yandex#search'
		}),

        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="baloon">' +
				'<a class="baloon-close" href="#">&times;</a>' +
				'$[[options.contentLayout observeSize minWidth=280 maxWidth=280]]' +              
            '</div>', {
                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.baloon', this.getParentElement());
                    this.applyElementOffset();
                    this._$element.find('.baloon-close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },
                clear: function () {
                    this._$element.find('.baloon-close')
                        .off('click');
                    this.constructor.superclass.clear.call(this);
                },
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                    if(!this._isElement(this._$element)) {
                        return;
                    }
                    this.applyElementOffset();
                    this.events.fire('shapechange');
                },
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight)
                    });
                },
                onCloseClick: function (e) {
                    e.preventDefault();
                    this.events.fire('userclose');
                },
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight
                        ]
                    ]));
                },
                _isElement: function (element) {
                    return element && element[0];
                }
            }),

        // Создание вложенного макета содержимого балуна.
        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="row row-xs align-items-center mb-3">' +
				'<div class="col-auto">' +
					'<div class="results-block_image image image-con" style="background-image: url(./img/data/company-img_01.jpg);"></div>' +
				'</div>' +
				'<div class="col"><span class="results-block_desc">$[properties.balloonDescMin]</span><span class="h5">$[properties.balloonTitle]</span><span class="results-block_company">$[properties.balloonCompany]</span></div>' +
			'</div>' +
			'<span class="baloon-desc">$[properties.balloonDesc]</span>' +
			'<div class="row row-xs mt-4 mb-3">' +
				'<div class="col-auto"><span class="text-xxsmall text-primary">$[properties.balloonPhone]</span></div>' +
				'<div class="col-auto"><span class="text-xxsmall text-primary">$[properties.balloonAddress]</span></div>' +
			'</div>' +
			'<div class="row row-xs align-items-center">' +
				'<div class="col-auto mr-auto"><strong class="text-xxsmall text-info">$[properties.balloonShedule]</strong></div>' +
				'<div class="col-auto"><svg class="icon icon-eye_small"><use xlink:href="#icon-eye_small"></use></svg><span class="text-xsmall text-info">$[properties.balloonViews]</span></div>' +
				'<div class="col-auto"><span class="badge badge-rating badge-$[properties.balloonRatingColor]">$[properties.balloonRating]</span></div>' +
				'<div class="col-auto"><strong class="text-xxsmall">$[properties.balloonReviews]</strong></div>' +
			'</div>'
		),

		HintLayout = ymaps.templateLayoutFactory.createClass( "<div class='my-hint'>" +
            "<span class='my-hint_text'>{{ properties.balloonTitle }}</di>" +
            "</div>", {
                getShape: function () {
                    var el = this.getElement(),
                        result = null;
                    if (el) {
                        var firstChild = el.firstChild;
                        result = new ymaps.shape.Rectangle(
                            new ymaps.geometry.pixel.Rectangle([
                                [0, 0],
                                [firstChild.offsetWidth, firstChild.offsetHeight]
                            ])
                        );
                    }
                    return result;
                }
            }
        ),
		
		clusterer = new ymaps.Clusterer({
			clusterIconLayout: 'default#image',
			clusterIconImageHref: 'img/icon/icon-map.png',
			clusterIconImageSize: [43, 50],
			clusterIconImageOffset: [-21, -25],
			clusterBalloonLayout: MyBalloonLayout,
			clusterBalloonContentLayout: 'cluster#balloonCarousel',
			clusterBalloonContentLayoutWidth: 280,
			clusterBalloonItemContentLayout: MyBalloonContentLayout,
			clusterBalloonPagerVisible: true,
			clusterDisableClickZoom: true,
			clusterOpenBalloonOnClick: true,
			clusterBalloonPanelMaxMapArea: 0,
			clusterBalloonPagerSize: 6
		}),
		
		points = [
            [55.831903,37.411961], [55.763338,37.565466], [55.763338,37.565466], [55.744522,37.616378], [55.780898,37.642889], [55.793559,37.435983],  [55.800584,37.675638], [55.716733,37.589988],  [55.775724,37.560840], [55.822144,37.433781], [55.874170,37.669838], [55.716770,37.482338], [55.780850,37.750210], [55.875445,37.549348], [55.662903,37.702087], [55.746099,37.434113], [55.838660,37.712326], [55.774838,37.415725], [55.871539,37.630223], [55.657037,37.571271], [55.691046,37.711026], [55.803972,37.659610], [55.616448,37.452759], [55.781329,37.442781], [55.844708,37.748870]
		],
		points_2 = [
			[55.810906,37.654142],  [55.865386,37.713329], [55.847121,37.525797],  [55.778655,37.710743], [55.623415,37.717934], [55.863193,37.737000], [55.866770,37.760113], [55.698261,37.730838], [55.633800,37.564769], [55.639996,37.539400], [55.690230,37.405853], [55.775970,37.512900], [55.775777,37.442180], [55.811814,37.440448], [55.751841,37.404853], [55.627303,37.728976], [55.816515,37.597163], [55.664352,37.689397], [55.679195,37.600961], [55.673873,37.658425], [55.681006,37.605126], [55.876327,37.431744], [55.843363,37.778445], [55.723123,37.406067], [55.858585,37.484980]
		],
		geoObjects = [];

		
		for(var i = 0, len = points.length; i < len; i++) {
			geoObjects[i] = new ymaps.Placemark(points[i], {
                balloonTitle: 'Mistercats ' + i,
				balloonDescMin: 'Ошеломительный фаст-фуд ',
				balloonCompany: 'ООО РОГА И КОПЫТА ',
				balloonDesc: 'Поставка топлива • Обсуживание оборудования • ГСМ • Дизель • Топливо• Завтрак • Меню',
				balloonPhone: '+375 33 666 98 08',
				balloonAddress: 'Рокосовского 120-2, 3 этаж',
				balloonShedule: 'открыто до 21:00',
				balloonRating: '4.5',
				balloonRatingColor: 'success',
				balloonReviews: '6 отзывов',
				balloonViews: '100',
				type: 'company'
            }, {
				balloonShadow: false,
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
				balloonPanelMaxMapArea: 0,
				hideIconOnBalloonOpen: false,
				balloonOffset: [30, -10],
				iconLayout: 'default#image',
				iconImageHref: 'img/icon/icon-map.png',
				iconImageSize: [43, 50],
				iconImageOffset: [0, 0],
				hintLayout: HintLayout
			});
		}

		for(var i = 0, len = points_2.length; i < len; i++) {
			geoObjects[i + points.length] = new ymaps.Placemark(points_2[i], {
                balloonTitle: 'Mistercats ' + (i + points.length),
				balloonDescMin: 'Ошеломительный фаст-фуд ',
				balloonCompany: 'ООО РОГА И КОПЫТА ',
				balloonDesc: 'Поставка топлива • Обсуживание оборудования • ГСМ • Дизель • Топливо• Завтрак • Меню',
				balloonPhone: '+375 33 666 98 08',
				balloonAddress: 'Рокосовского 120-2, 3 этаж',
				balloonShedule: 'открыто до 21:00',
				balloonRating: '4.5',
				balloonRatingColor: 'success',
				balloonReviews: '6 отзывов',
				balloonViews: '100',
				type: 'private'
            }, {
				balloonShadow: false,
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
				balloonPanelMaxMapArea: 0,
				hideIconOnBalloonOpen: false,
				balloonOffset: [30, -10],
				iconLayout: 'default#image',
				iconImageHref: 'img/icon/icon-map_2.png',
				iconImageSize: [59, 64],
				iconImageOffset: [0, 0],
				hintLayout: HintLayout
			});
		}

		clusterer.add(geoObjects);
		myMap.geoObjects.add(clusterer);
        myMap.setBounds(clusterer.getBounds(), {
			checkZoomRange: true
		});
});