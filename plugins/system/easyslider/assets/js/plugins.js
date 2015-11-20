/**
 * @version    $Id$
 * @package    JSN_EasySlider
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

void function ( exports, $, Backbone ) {

	var Model = Backbone.Model;
	var Collection = Backbone.Collection;

	try {
		exports.log = _(console.log).bind(console);
	}
	catch (e) {}

	Backbone.Model = Model.extend({
		constructor: function () {
			Model.apply(this, arguments);
			this.on('change', function () {
				this.parent && this.parent.trigger.apply(this.parent, _(arguments).splice(0, 0, 'change'));
			});
		}
	});
	Backbone.Collection = Collection.extend({
		constructor: function () {
			Collection.apply(this, arguments);
			this.on('change', this._triggerParentChange);
			this.on('add', this._triggerParentChange);
			this.on('remove', this._triggerParentChange);
		},
		_triggerParentChange: function () {
			this.parent && this.parent.trigger.apply(this.parent, _(arguments).splice(0, 0, 'change'));
		}
	});

	var BackboneGet = Backbone.Model.prototype.get;
	var BackboneSet = Backbone.Model.prototype.set;

	_( Backbone.Model.prototype ).extend({
		get: function ( key ) {
			if ( key.indexOf('.') > -1 || key.indexOf('[') > -1 ) {
				var obj = this.toJSON();
				eval(' var result = obj.' + key.replace(/\s+/g,''));
				return result;
				var obj = this;
				var a = ('obj.' + key).replace(/\.([^\s\.\[]*)/g, '.get("$1")').replace(/\[(.*)]/g, '.at($1)');
				eval(' var result = ' + a);
			}
			else return BackboneGet.apply(this, arguments);
		},
		set: function ( key, value ) {
			if ( typeof key == 'string' && key.indexOf('.') > -1 ) {
				var keys = key.split('.'),
					obj = result = {};
				while ( keys.length ) {
					var k = keys.shift();
					keys.length ? obj = obj[ k ] = {} : obj[ k ] = value;
				}
				return this.set(result);
			}
			else
				return BackboneSet.apply(this, arguments)
		}
	});

	_( Backbone.Collection.prototype).extend({
		comparator: function( model ) {
			return model.get('index');
		}
	});

	_( Backbone.View.prototype ).extend({
		defer: function( fn ) {
			_.defer(_.bind(fn, this));
			return this;
		},
		render: function () {
			this.trigger('render');
			return this;
		},
		hasView: function ( view ) {
			return this.subViews && this.subViews.indexOf(view) > -1;
		},
		attachView: function ( view, selector ) {
			this.subViews || (this.subViews = []);
			this.hasView(view) || this.subViews.push(view);
			view.setElement(this.$(selector));
			view.superView = this;
			return view;
		},
		appendView: function ( view, selector ) {
			this.subViews || (this.subViews = []);
			this.hasView(view) || this.subViews.push(view);
			view.superView = this;
			view.$el.appendTo(selector ? this.$(selector) : this.el);
			return view;
		},
		prependView: function ( view, selector ) {
			this.subViews || (this.subViews = []);
			this.hasView(view) || this.subViews.push(view);
			view.superView = this;
			view.$el.prependTo(selector ? this.$(selector) : this.el);
			return view;
		},
		onRender: function () {
		},
		remove: _.compose(Backbone.View.prototype.remove, function () {
			this.superView &&
			this.superView.subViews &&
			this.superView.subViews.splice(this.superView.subViews.indexOf(this), 1);
			this.subViews && _(this.subViews).each(function(subView) {
				if (typeof subView !== 'undefined' && _(subView.remove).isFunction())
					subView.remove();
			});
		}),
		wipe: function () {
			for ( var key in this )
				delete this[ key ];
			return this;
		}
	});

	Backbone.ItemView = Backbone.View.extend({
		template: false,
		constructor: function ( options ) {
			_(this).extend(_.pick(options, 'template'));
			if ( this.template ) switch ( typeof this.template ) {
				case 'string':
					this.template = _.template(this.template.match('<') ? this.template : $(this.template).html());
					break;
			}
			Backbone.View.apply(this, arguments);
			this.listenTo(this.model, 'remove', this.remove);
		},
		render: function ( model ) {
			this.trigger('before:render', model);
			if ( this.template ) {
				var model = model || this.model;
				var data = model instanceof Backbone.Model ? model.toJSON() : model || {};
				this.$el.html(this.template(data));
			}
			this.trigger('render', model);
			this.onRender();
			return this;
		}
	});

	Backbone.CollectionView = Backbone.View.extend({
		itemView: Backbone.ItemView,
		constructor: function ( options ) {
			Backbone.View.apply(this, arguments);
			this.listenTo(this.collection, 'add', this.add);
			this.defer(this.reset);
		},
		reset: function ( collection ) {
			_(this.subViews).invoke('remove');
			(collection || this.collection).each(this.add, this);
			return this;
		},
		add: function ( model ) {
			return this.appendView(new this.itemView({ model: model }));
		}
	});


	$.fn.clickOutside = function ( callback, context ) {
		return typeof callback != 'function' ? this : this.each(function ( index, element ) {
			$(window).on('mousedown', function clickHandler( e ) {
				if ( !$(element).is(e.target) && !$(e.target).parents('.' + $(element).attr('class').replace(/\s+/g, '.')).length )
					$(window).off('mousedown', clickHandler),
						callback.call(context, e);
			});
		});
	};

	/*
	* JSNES_cuboid
	* ------------
	* jQuery plugin to create 3D cube using HTML5/CSS3 transforms
	* */
	$.fn.JSNES_cuboid = function( width, height, depth ) {
		return this.each(function() {

			depth || (depth = width);

			var halfWidth = width / 2;
			var halfHeight = height / 2;
			var halfDepth = depth / 2;
			var setback = 0;

			var $cuboid = $('<div class="jsn-es-cuboid">').appendTo(this)
				.css({
					width: width + 'px',
					height: height + 'px'
				});
			$(this).css({
				transform: 'translateZ('+ (-halfDepth) +'px)'
			})

			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-front">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) translateZ('+ (halfDepth) +'px)',
					width: width + 'px',
					height: height + 'px'
				});
			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-back">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) rotateY(180deg) translateZ('+ (halfDepth) +'px)',
					width: width + 'px',
					height: height + 'px'
				});
			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-left">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) rotateY(-90deg) translateZ('+ (halfWidth) +'px)',
					marginLeft: -halfDepth + 'px',
					width: depth + 'px',
					height: height + 'px'
				});
			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-right">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) rotateY(90deg) translateZ('+ (halfWidth) +'px)',
					marginLeft: -halfDepth + 'px',
					width: depth + 'px',
					height: height + 'px'
				});
			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-top">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) rotateX(90deg) translateZ('+ halfHeight +'px)',
					marginTop: -halfDepth + 'px',
					width: width + 'px',
					height: depth + 'px'
				});
			$('<div class="jsn-es-cuboid-face jsn-es-cuboid-bottom">').appendTo($cuboid)
				.css({
					transform: 'translateZ('+ setback +'px) rotateX(-90deg) translateZ('+ halfHeight +'px)',
					marginTop: -halfDepth + 'px',
					width: width + 'px',
					height: depth + 'px'
				});
		});
	};

}(this, JSNESjQuery, Backbone);