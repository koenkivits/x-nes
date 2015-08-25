var NesNes = require("nesnes");
var fullscreen = initFullscreen();
var currentDoc;

if ( document.currentScript ) {
	// native browser support
	currentDoc = document.currentScript.ownerDocument;
}
if ( document._currentScript ) {
	// polyfill support
	currentDoc = document._currentScript.ownerDocument;
}

/**
 * Element attributes.
 */
var attributes = {
	/**
	 * If true, automatically load and play ROM.
	 */
	autoplay: {
		type: "boolean"
	},

	/**
	 * Enables or disables sound.
	 */
	muted: {
		type: "boolean",
		change: function() {
			this.nesnes.output.audio.setEnabled( !this.muted );
			toggleClassName( this, "nes-muted", this.muted );
		}
	},

	/**
	 * Either "none" (default) or "auto". If "auto" ROM gets preloaded.
	 */
	preload: {},

	/**
	 * The poster image URL for the ROM. This is the image being displayed if the
	 * ROM hasn't been started yet.
	 */
	poster: {
		change: function() {
			if ( !this.nesnes.running ) {
				var canvas = this.shadowRoot.querySelector( "canvas" ),
				    ctx = canvas.getContext( "2d" ),
				    img = new Image();

				img.src = this.getAttribute( "poster" );
				img.onload = function() {
					ctx.drawImage( img, 0, 0 );
				};
			}
		}
	},

	/**
	 * URL to the ROM (.nes) file.
	 */
	src: {
		change: function() {
			if ( this.played ) {
				this.load( true );
			}
		}
	}
};

/**
 * Additional DOM properties.
 */
var properties = {
	/**
	 * Has playback been paused (boolean)?
	 */
	paused: {
		get: function() {
			return this.nesnes.paused;
		},
		set: function( value ) {}
	},
	/**
	 * Has playback started at any point in time (boolean)?
	 */
	played: {
		get: function() {
			return !!this.nesnes.cartridge;
		},
		set: function( value ) {}
	},
	/**
	 * Volume of audio output (float).
	 */
	volume: {
		get: function() {
			return this.nesnes.output.audio.volume;
		},
		set: function( value ) {
			this.nesnes.output.audio.setVolume( value );
		}
	}
};

// also expose attributes as DOM properties
addAttributeProperties( properties, attributes );

/**
 * Events that will be bound on shadow root elements.
 * Event syntax is "eventName selector", where eventName is the name of the event and
 * selector is a CSS selector. Note that events are *not* delegated, and only the first
 * matched element gets an event listener. If no selector is given, event is bound to
 * root element.
 */
var events = {
	/**
	 * Toggle play on click on canvas.
	 */
	"click canvas": function() {
		if ( !this.played || this.paused ) {
			this.play();
		} else {
			this.pause();
		}
	},

	/**
	 * Play/pause buttons.
	 */
	"click .nes-play": function() {
		this.play();
	},
	"click .nes-pause": function() {
		this.pause();
	},

	/**
	 * Audio control.
	 */
	"click .nes-audio-enable": function() {
		this.muted = false;
	},
	"click .nes-audio-disable": function() {
		this.muted = true;
	},
	"input .nes-volume": function( e ) {
		var target = e.currentTarget;
		this.nesnes.output.audio.setVolume( parseInt( target.value, 10 ) / 10 );
	},

	/**
	 * Fullscreen enter/exit.
	 */
	"click .nes-fullscreen-enter": function() {
		this[ fullscreen.request ]();
	},
	"click .nes-fullscreen-exit": function() {
		document[ fullscreen.exit ]();
	}
};

var nesPrototype = Object.create( HTMLElement.prototype, properties );

/********************************************************************************
 * Public methods.
 */

/**
 * Set up element and initialize attributes and events.
 */
nesPrototype.createdCallback = function() {
	initShadowRoot( this );
	initAttributes( this );
	initMouseTimeout( this );

	toggleClassName( this, "nes-inactive", true );

	if ( this.autoplay ) {
		this.play();
	} else if ( this.preload === "auto" ) {
		this.load();
	}
};

/**
 * Trigger attribute 'change' callbacks, if any.
 */
nesPrototype.attributeChangedCallback = function( name, oldValue, newValue, namespace ) {
	if ( attributes[ name ] && attributes[ name ].change ) {
		attributes[ name ].change.call( this );
	}
};

/**
 * Play ROM.
 * If ROM has not been loaded yet, load it first (note: this also means that the 
 * playback starts asynchronously)
*/
nesPrototype.play = function() {
	if ( this.played ) {
		toggleClassName( this, "nes-inactive", false );

		this.nesnes.play();
		togglePlaying( this );
	} else {
		this.load( true );
	}
};

/**
 * Pause ROM.
 */
nesPrototype.pause = function() {
	this.nesnes.pause();
	togglePlaying( this );
};

/**
 * Load ROM.
 * @param {boolean} play - If true, start playing once loaded.
 */
nesPrototype.load = function( play ) {
	var self = this;

	toggleClassName( this, "nes-loading", true );
	this.nesnes.load( this.getAttribute("src"), function() {
		if ( play ) {
			self.play();
		}

		toggleClassName( self, "nes-loading", false );
	});
};

/********************************************************************************
 * Private methods.
 */

 /**
  * Toggle playing class for styling purposes.
  */
function togglePlaying( el ) {
	toggleClassName( el, "nes-paused", el.nesnes.paused );
	toggleClassName( el, "nes-playing", !el.nesnes.paused );
}

/**
 * Toggle a class.
 */
function toggleClassName( el, className, flag ) {
	var classList = el.shadowRoot.querySelector(".nes-wrapper").classList;

	if ( flag ) {
		classList.add( className );
	} else {
		classList.remove( className );
	}
}

/**
 * Initialize shadow root, events and emulator.
 */
function initShadowRoot( el ) {
	var template = currentDoc.querySelector("template"),
	    root = el.createShadowRoot();

	root.appendChild( document.importNode( template.content, true ) );

	// in polyfill styling is shimmed manually
	// it took me forever to find that this isn't done automatically, though there
	// is a closed issue about it: https://github.com/webcomponents/webcomponentsjs/issues/140
	if ( typeof WebComponents !== "undefined" && WebComponents.ShadowCSS ) {
		WebComponents.ShadowCSS.shimStyling( template.content, "x-nes" );

		// .. we need to remove the previous style element manually, too
		var style = root.querySelector( "style" );
		style.parentNode.removeChild( style );
	}

	initEvents( el );

	// set a class for when fullscreen is not available at all
	toggleClassName( el, "nes-no-fullscreen", !fullscreen.request );
	toggleClassName( el, "nes-no-audio", typeof AudioContext === "undefined" );

	el.nesnes = new NesNes( root.querySelector("canvas") );
}

/**
 * Initialize attributes.
 */
function initAttributes( el ) {
	var value;

	for ( var attr in attributes ) {
		value = el.getAttribute( attr );
		if ( typeof value === "string" ) {
			el.attributeChangedCallback( attr, null, value );
		}
	}
}

/**
 * Bind events to element and subelements.
 */
function initEvents( el ) {
	var split, eventName, selector, target,
	    root = el.shadowRoot;

	for ( var key in events ) {
		split = key.split( " " );
		eventName = split[ 0 ];
		selector = split[ 1 ];

		// no selector? use root element
		target = selector ? root.querySelector( selector ) : el;

		target.addEventListener(
			eventName,
			getEventListener( events[ key ] )
		);
	}

	/**
	 * Respond to fullscreen events, if possible.
	 */
	if ( fullscreen.event ) {
		document.addEventListener( fullscreen.event, function() {
			toggleClassName(
				el,
				"nes-fullscreen",
				isFullscreen( el )
			);

			// 'resize' event isn't enough for Chrome when document is
			// already fullscreen
			scaleCanvas( el );
		});

		window.addEventListener( "resize", function() {
			scaleCanvas( el );
		});
	}

	/**
	 * Returns the callback, but bound to our root element.
	 */
	function getEventListener( callback ) {
		return function( e ) {
			callback.call( el, e );
		};
	}
}

/**
 * Check if an element is the fullscreen element.
 */
function isFullscreen( el ) {
	return ( document[ fullscreen.element ] === unwrap(el) );
}

/**
 * Get a raw DOM element, regardless of Web Component polyfill.
 */
function unwrap( el ) {
	if ( typeof ShadowDOMPolyfill !== "undefined" ) {
		return ShadowDOMPolyfill.unwrap( el );
	}

	return el;
}

/**
 * Initialize mousemove listener that hides controls after a period of mouse
 * inactivity.
 */
function initMouseTimeout( el ) {
	var mouseTimeout;
	el.addEventListener( "mousemove", function() {
		clearTimeout( mouseTimeout );
		mouseTimeout = setTimeout(function() {
			toggleClassName( el, "nes-mouse-inactive", true );
		}, 1500);

		toggleClassName( el, "nes-mouse-inactive", false );
	});
}


/**
 * Scale x-nes canvas to fit screen.
 * Could be done in pure CSS (using object-fit), but using CSS transforms gives us\
 * better canvas performance.
 */
function scaleCanvas( el ) {
	var canvas = el.shadowRoot.querySelector( "canvas" ),
		style = canvas.style,
		dx = window.innerWidth / canvas.offsetWidth,
		dy = window.innerHeight / canvas.offsetHeight,
		scale = Math.min( dx, dy ),
		value = "scale(" + scale + ")";

	if ( isFullscreen( el ) ) {
		transform( canvas, value );
	} else {
		transform( canvas, null );
	}
}

/**
 * Transform an element with cross-browser support.
 */
function transform( el, value ) {
	var style = el.style;

	style.transform = value;
	style.webkitTransform = value;
	style.oTransform = value;
	style.msTransform = value;
}

/**
 * Expose element attributes as DOM properties.
 * @param {object} properties - An object like the second argument for Object.defineProperties.
 * @param {object} attributes - Object representing element attributes. See top of file.
 */
function addAttributeProperties( properties, attributes ) {
	for( var attr in attributes ) {
		addProperty( attr );
	}

	function addProperty( attr ) {
		var desc = attributes[ attr ];
		var prop = {
			get: function() {
				var result = this.getAttribute( attr );

				// special case for boolean attributes
				if ( desc.type === "boolean" ) {
					// if string, attribute is set (and thus true)
					result = ( typeof result === "string" );
				}

				return result;
			},
			set: function( value ) {
				// special case for boolean attributes
				if ( desc.type === "boolean" ) {
					if ( !value ) {
						// 'false' is represented by removing attribute
						this.removeAttribute( attr );
						return;
					} else {
						// true is represented by setting attribute
						value = "";
					}
				}

				this.setAttribute( attr, String( value ) );
			}
		};

		// extend properties object with our new attribute property
		properties[ attr ] = prop;
	}
}

/**
 * Initialize full screen variables in supported browsers.
 */
function initFullscreen() {
	var el = document.createElement( "div" );
	if ( el.requestFullScreen ) {
		// standards
		return {
			"request": "requestFullScreen",
			"exit": "exitFullScreen",
			"event": "fullscreenchange",
			"element": "fullscreenElement"
		};
	} else if ( el.webkitRequestFullScreen ) {
		// Webkit / Blink
		return {
			"request": "webkitRequestFullScreen",
			"exit": "webkitExitFullscreen",
			"event": "webkitfullscreenchange",
			"element": "webkitFullscreenElement"
		};
	} else if ( el.mozRequestFullScreen ) {
		// Firefox
		return {
			"request": "mozRequestFullScreen",
			"exit": "mozCancelFullScreen",
			"event": "mozfullscreenchange",
			"element": "mozFullScreenElement"
		};
	} else if ( el.msRequestFullScreen ) {
		// IE
		return {
			"request": "msRequestFullScreen",
			"exit": "msExitFullscreen",
			"event": "msfullscreenchange",
			"element": "msFullscreenElement"
		};
	} else {
		return {};
	}
}

document.registerElement("x-nes", {
	prototype: nesPrototype
});