# &lt;x-nes&gt;

``&lt;x-nes&gt;`` is the NES emulator web component your website needs.

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

See [this page](http://koen.kivits.com/x-nes/) for examples.

The following attributes are supported:

| Name          | type              | Description
-------------------------------------------------
| autoplay      | boolean           | If ``true``, ROM will automatically load and play.
| muted         | boolean           | If ``true``, sound will be disabled.
| preload       | "none" or "auto"  | If "auto", ROM will be preloaded (but not played).
| poster        | string            | Path to image to use when ROM is not playing yet.
| src           | string            | Required. Path to INES ROM (usually .nes) file.

## Browser support

``&lt;x-nes&gt;`` works in Chrome and Opera without any dependencies. Other modern browsers require the [webcomponent.js polyfill](http://webcomponents.org/).

## Build it yourself

``&lt;x-nes&gt; can be built by installing the dependencies, then running make:

```
npm install
make
```

This will create ``x-nes.html`` in the ``dist/`` directory.

## My game favorite game doesn't work!

``&lt;x-nes&gt;`` is built on NESNES. If you find any problems, please file an issue there.