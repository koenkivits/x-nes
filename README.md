# &lt;x-nes&gt;

You once had a NES in your home, now you can have one on your web page. ``&lt;x-nes&gt;`` is the web component you didn't know you needed.

[![x-nes screenshot](http://koen.kivits.com/x-nes/screenshot.png)](http://koen.kivits.com/x-nes)

## Installation

``&lt;x-nes&gt;`` can be installed through npm:

```
npm install x-nes
```

## Usage

Using ``&lt;x-nes&gt;`` is easy. Simply import a piece of HTML and then start using the tag:

```html
&lt;link rel="import" href="./node_modules/x-nes/dist/x-nes.html"&gt;

&lt;x-nes src="./roms/supermario.nes"&gt;
```

See [the demo](http://koen.kivits.com/x-nes/) for an example.

The following attributes are supported:

| Name          | type              | Description
-------------------------------------------------
| autoplay      | boolean           | If ``true``, ROM will automatically load and play.
| muted         | boolean           | If ``true``, sound will be disabled.
| preload       | "none" or "auto"  | If "auto", ROM will be preloaded (but not played).
| poster        | string            | Path to image to use when ROM is not playing yet.
| src           | string            | Required. Path to INES ROM (usually .nes) file.

## Browser support

``&lt;x-nes&gt;`` works in Chrome and Opera without any dependencies. Other modern browsers require the [webcomponent.js polyfill](http://webcomponents.org/) (the most recent versions of IE and Firefox have been tested).

## Build it yourself

``&lt;x-nes&gt; can be built by installing the dependencies, then running make:

```
npm install
make
```

This will create ``x-nes.html`` in the ``dist/`` directory.

## My game favorite game doesn't work!

``&lt;x-nes&gt;`` is built on NESNES. If you find any problems, please file an issue there.

## Icon credits

The icons were borrowed from the [plyr HTML5 media player]. Do check it out!