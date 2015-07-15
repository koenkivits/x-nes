# &lt;x-nes&gt;

You once had a NES in your home, now you can have one on your web page. ``<x-nes>`` is the web component you didn't know you needed.

[![x-nes screenshot](http://koen.kivits.com/x-nes/screenshot.png)](http://koen.kivits.com/x-nes)

## Installation

``<x-nes>`` can be installed through npm or bower:

```
npm install x-nes
bower install x-nes
```

## Usage

Using ``<x-nes>`` is easy. Simply import a piece of HTML and then start using the tag:

```html
<link rel="import" href="./node_modules/x-nes/dist/x-nes.html">

<x-nes src="./roms/supermario.nes">
```

See [the demo](http://koen.kivits.com/x-nes/) for an example.

The following attributes are supported:

| Name          | type              | Description
|---------------|-------------------|------------
| autoplay      | boolean           | If ``true``, ROM will automatically load and play.
| muted         | boolean           | If ``true``, sound will be disabled.
| preload       | "none" or "auto"  | If "auto", ROM will be preloaded (but not played).
| poster        | string            | Path to image to use when ROM is not playing yet.
| src           | string            | Required. Path to INES ROM (usually .nes) file.

## Browser support

``<x-nes>`` works in Chrome and Opera without any dependencies. Other modern browsers require the [webcomponent.js polyfill](http://webcomponents.org/) (the most recent versions of IE and Firefox have been tested).

## Build it yourself

``<x-nes>`` can be built by installing the dependencies, then running make:

```
npm install
make
```

This will create ``x-nes.html`` in the ``dist/`` directory.

## My game favorite game doesn't work!

``<x-nes>`` is built on NESNES. If you find any problems, please file an issue [there](https://github.com/koenkivits/nesnes).

## Icon credits

The icons were borrowed from the [plyr HTML5 media player](https://github.com/selz/plyr). Do check it out!