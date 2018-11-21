# Styles Guidelines

## Architecture

Architecting a CSS project is probably one of the most difficult things you will have to do in a project’s life.
Keeping the architecture consistent and meaningful is even harder.
~ from [Sass Guidelines](https://sass-guidelin.es/#architecture)

This project uses a mixture of ITCSS, BEM and [Suit CSS](https://suitcss.github.io/).

### Folder/File Structure

Folder/File structure follows ITCSS, and everything else its a mixture of BEM and Suit CSS.

```
.
├── /styles/
│   ├── /settings/    # Preprocessor variables and methods (no actual CSS output), global variables, site-wide settings, config switches, etc,
│   ├── /tools/       # Mixins and functions (no actual CSS output),
│   ├── /generic/     # CSS resets which might include Normalize.css, or your own batch of code, low-specificity, far-reaching rulesets,
│   ├── /elements/    # Single HTML element selectors without classes, unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`),
│   ├── /objects/     # Classes for page structure (OOCSS methodology), objects, abstractions, and design patterns (e.g. `.o-list-bare {}`).
│   ├── /components/  # Aesthetic classes for styling any & all page elements, complete chunks of UI (e.g. `.c-carousel {}`)
│   ├── /utilities/   # High-specificity, very explicit selectors. Overrides and helper classes (e.g. `.u-hidden {}`)
│   ├── /trumps/      # The most specific styles for overriding anything else in the triangle
```

| Folder     | Description |
| ---------- | ----------- |
| Settings   | Used with preprocessors and contain font, colors definitions, etc. |
| Tools      | Globally used mixins and functions. It’s important not to output any CSS in the first 2 layers. |
| Generic    | Reset and/or normalize styles, box-sizing definition, etc. This is the first layer which generates actual CSS. |
| Elements   | Styling for bare HTML elements (like H1, A, etc.). These come with default styling from the browser so we can redefine them here. |
| Objects    | Class-based selectors which define undecorated design patterns, for example media object known from OOCSS   |
| Components | Aesthetic classes for styling any & all page elements. This is where majority of our work takes place and our UI components are often composed of Objects and Components |
| Utilities  | Mixins, functions used throught the entire project |
| Trumps     | Utilities and helper classes with ability to override anything which goes before in the triangle, eg. hide helper class |

## External dependencies

### Reset

Internally we use [Normalize](https://necolas.github.io/normalize.css/). But other options are there and can be used:

- https://github.com/jgthms/minireset.css
- https://github.com/csstools/sanitize.css
- https://github.com/twbs/bootstrap/blob/v4-dev/scss/_reboot.scss
- https://github.com/csstools/postcss-normalize

## Getting started

There are a handful of things we need to do before we’re ready to go.

### _settings.config.scss

This is a configuration file that used to handle the state, location, or environment of your project. This handles very high-level settings that don’t necessarily affect the CSS itself, but can be used to manipulate things depending on where you are running things (e.g. turning a debugging mode on, or telling your CI sever that you’re compiling for production).

### _settings.global.scss

This is an example globals file; it contains any settings that are available to your entire project. These variables and settings could be font families, colours, border-radius values, etc.

### _components.buttons.scss

You don’t need to really do much with this file other than ensure you don’t let it into your final project!

This file exists to show you how you might build components into the project.

## BEM & Suit CSS Naming Conventions

A very popular and super-helpful convention for naming CSS components is [BEM](http://getbem.com/introduction/) , developed by the Yandex, the popular Russian search engine. The naming convention is very simple:

```
[BLOCK]__[ELEMENT]–[MODIFIER]
```

```css
/* block */
.c-photo {}

/* element */
.c-photo__img {}

/* modifier */
.c-photo--large {}
```

### Explicit rules around Sass nesting

Nesting in Sass can be very convenient, but runs the risk of poor output with overly long selector strings.

We follow the [Inception Rule](http://thesassway.com/beginner/the-inception-rule) and **never nested Sass more than three layers deep**.

#### Grandchild Selectors 

```scss
// Good
.Block__Element–Modifier {
}

// Bad
.Block__Element__Element–Modifier {
}
```

#### Wrapper naming

```html
// See _Namespaces_ bellow
<ul class="l-grid">
    <li class="l-grid__item">
        <div class="c-card">
            <div class="c-card__header">
                […]
            </div>
            <div class="c-card__body">
                […]
            </div>
        </div>
    </li>
</ul>
```

#### Nesting components, Cross-Component… Components

A component should not know about the implementation of its dependencies. The appearance of dependencies must be configured using the interface they provide.

The most [robust](https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/) [option](https://github.com/suitcss/suit/blob/master/doc/components.md#styling-dependencies) would be to use something that is called in BEM a [mix](https://en.bem.info/forum/4/) or [adopted child](http://simurai.com/blog/2015/05/11/nesting-components) as Simurai calls it.

```html
<header class="c-header">
	<button class="c-header-item c-button">Button</button>
</header>
```

```scss
// What would we do if we don’t want to create an own child, but still have one.
// Right, we could adopt one. In our example we adopt a Button component as our own child.
// We didn’t create it, but now we can tweak.. erm.. I mean “raise” it like it’s our own

// born in button.scss (with its own font-size)
.c-button {
  font-size: 1em;
}

// raised in header.css (adopted component where we override properties we need, and we don't touch the original one)
.c-header .header-item {
  font-size: .75em;
}
```

or as an alternative

```html
<header class="c-header">
	<button class="c-header__c-button c-button">Button</button>
</header>
```

It is a bit uncommon that the same HTML element shares classes from two different components. And it’s not without any risks. More about them later. But I really like this approach because it keeps the components independent without having to know about each other.

Another nice thing is that if we want to add other components to the Header that also need the same adjustments, we can reuse the same Header-item class, like for example on a text Input.

Depending on what properties we wanna change, it might not always be ideal. For example, because the Button already had font-size defined, we had to increase specificity by using .Header .Header-item. But that would also override variations like .Button--small. That might be how we want it, but there are also situations where we’d like the variation to always be “stronger”. An example would be when changing colors.

**The recommandation** would be to aviod this type of sittuation

The cosmetics of a truly modular UI element should be totally agnostic of the element’s parent container — it should look the same regardless of where you drop it. Adding a class from another component for bespoke styling, as the “mix” approach does, violates the [open/closed principle](https://en.wikipedia.org/wiki/Open/closed_principle) of component-driven design — i.e there should be no dependency on another module for aesthetics.

Your best bet is to use a modifier for these small cosmetic differences, because you may well find that you wish to reuse them elsewhere as your project grows.

Even if you never use those additional classes again, at least you won’t be tied to the parent container, specificity or source order to apply the modifications.

Of course, the other option is to go back to your designer and tell them that the button should be consistent with the rest of the buttons on the website and to avoid this issue altogether :troll:.

#### When to use a modifier or New Component

One of the biggest problems is deciding where a component ends and a new one begins.

It’s very easy to over-modularize and make everything a component. I recommend starting with modifiers, but if you find that your specific component CSS file is getting difficult to manage, then it’s probably time to break out a few of those modifiers. A good indicator is when you find yourself having to reset all of the “block” CSS in order to style your new modifier — this, to me, suggests new component time.

#### Not all elements should have a class

&lt;p&gt; tags for example should never have a class.

The general rule of thump is those elments that will probably never change to something else (&lt;p&gt;, &lt;i&gt;, &lt;span&gt;, &lt;ul&gt;&lt;li&gt; sometimes) should not have a class.

Adding a class to everything although it gives you control, pollutes your markup with classes. Most cases the markup never changes.

#### Responsive suffixes

An example of this might be a dropdown menu that converts to a set of tabs at a given breakpoint, or offscreen navigation that switches to a menu bar at a given breakpoint.

Essentially, one component would have two very different cosmetic treatments, dictated by a media query.

[A good option](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/) to follow could be to suffix the class (using the same suffixes as sass-mq map is defined)

```html
<ul class="c-image-list@sm c-carousel@lg">
```

## Namespaces

There are three different namespaces directly relevant:

* **.o-: Objects** _(o-list-inline)_ - TODO: Document
* **.c-: Components** _(c-card c-checklist)_ - Form the backbone of an application and contain all of the cosmetics for a standalone component.
* **.l-: Layout** _(l-grid l-container)_ - These modules have no cosmetics and are purely used to position c- components and structure an application’s layout.
* **.u-: Utilities** _(u-show u-hide)_ - These utility classes have a single function, sometimes using !important to boost their specificity.
* **.is-: OR .has-: State** _(is-visible has-loaded)_ - Indicate different states that a c- component can have.
* **.t-: Theme** _(t-dark-mode)_ - TODO: Document
* **.js-: Javascript hooks** _(js-tab-switcher)_ - These indicate that JavaScript behavior is attached to a component. No styles should be associated with them; they are purely used to enable easier manipulation with script.

In short: Every class in either of these three directories gets the appropriate prefix in its classname. All classes in one of these three layers has this kind of prefix. Be sure to follow this convention in your own code as well to keep a consistent naming convention across your code base.

If you want to dive deeper into namespacing classes and want to know why this is a great idea, have a look at this [article](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/).

| Type             	| Prefix   	| Examples              	| Description                                                                                                                                                                   	|
|------------------	|----------	|-----------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Component        	| c-       	| c-card c-checklist    	| Form the backbone of an application and contain all of the cosmetics for a standalone component.                                                                              	|
| Layout module    	| l-       	| l-grid l-container    	| These modules have no cosmetics and are purely used to position c- components and structure an application’s layout.                                                          	|
| Helpers          	| h-       	| h-show h-hide         	| These utility classes have a single function, often using !important to boost their specificity. (Commonly used for positioning or visibility.)                               	|
| States           	| is- has- 	| is-visible has-loaded 	| Indicate different states that a c- component can have. More detail on this concept can be found inside problem 6 below, but                                                  	|
| JavaScript hooks 	| js-      	| js-tab-switcher       	| These indicate that JavaScript behavior is attached to a component. No styles should be associated with them; they are purely used to enable easier manipulation with script. 	|

## Syntax & Formatting

Most of these rules are blunt copies of [Sass Guidelines](https://sass-guidelin.es/) or INUITCSS rules, so read those first. Bellow are just a few more important ones with some changes.

Roughly, we want (shamelessly inspired by CSS Guidelines):

* one (1) tab indents , no spaces;
* ideally, 80-characters wide lines;
* properly written multi-line CSS rules;
* meaningful use of whitespace.

```css
// Yep
.foo {
	display: block;
	overflow: hidden;
	padding: 0 1em;
}

// Nope
.foo {
  display: block; overflow: hidden;

  padding: 0 1em;
}
```

### Numbers

In Sass, number is a data type including everything from unitless numbers to lengths, durations, frequencies, angles and so on. This allows calculations to be run on such measures.

#### ZEROS

Numbers should display leading zeros before a decimal value less than one. Never display trailing zeros.

```css
// Yep
.foo {
	padding: 2em;
	opacity: 0.5;
}

// Nope
.foo {
	padding: 2.0em;
	opacity: .5;
}
```

#### UNITS

When dealing with lengths, a 0 value should never ever have a unit.

```scss
// Yep
$length: 0;

// Nope
$length: 0em;
```

#### CALCULATIONS

Top-level numeric calculations should always be wrapped in parentheses. Not only does this requirement dramatically improve readability, it also prevents some edge cases by forcing Sass to evaluate the contents of the parentheses.

```css
// Yep
.foo {
  width: (100% / 3);
}

// Nope
.foo {
  width: 100% / 3;
}
```

#### MAGIC NUMBERS

“Magic number” is an [old school programming](http://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants) term for unnamed numerical constant. Basically, it’s just a random number that happens to just work™ yet is not tied to any logical explanation.

Needless to say magic numbers are a plague and should be avoided at all costs. When you cannot manage to find a reasonable explanation for why a number works, add an extensive comment explaining how you got there and why you think it works. Admitting you don’t know why something works is still more helpful to the next developer than them having to figure out what’s going on from scratch.

```css
/**
 * 1. Magic number. This value is the lowest I could find to align the top of
 * `.foo` with its parent. Ideally, we should fix it properly.
 */
.foo {
  top: 0.327em; /* 1 */
}
```

On topic, CSS-Tricks has a [terrific article](http://css-tricks.com/magic-numbers-in-css/) about magic numbers in CSS that I encourage you to read.

### CSS: order

To keep everything maintainable and easy to read css properties should be ordered as follows:

**Layout:**	The position of the element in space. Eg.: position, top, z-index.
**Box:**	The element itself. Eg.: display, overflow, box-sizing.
**Visual:**	Design of the element. Eg.: color, border, background.
**Type:**	Typesetting of the element. Eg.: font-family, text-transform.

```css
.button {
	position: relative;
	z-index: 10;

	display: inline-flex;
	margin: 1rem 0;
	padding: 0 0.5rem;

	background: #3f55aa;
	border-radius: 0.5rem;
	border: 1px solid white;
	color: white;
	transition: opacity 100ms ease;

	font-family: sans-serif;
	font-size: 1rem;
	text-transform: uppercase;
}
```

## Rhythm in WEB typography

Resources:

* https://betterwebtype.com/rhythm-in-web-typography

Tools: 

* http://nowodzinski.pl/syncope/
* https://archetypeapp.com/
* https://www.gridlover.net/

Typography kits:

* http://matejlatin.github.io/Gutenberg/

### Vertical rhythm

Here is an example on how we should calculate the values for our typography.

```css
h3 {
  font-size: 55px; // Desired font size
  line-height: 60px; // = 2 × 30px (main body text  line-height), basically the next multiplied value above font-size
  margin-top: 90px; // = 3 × 30px
  margin-bottom: 30px; // = 1 × 30px
}
```


