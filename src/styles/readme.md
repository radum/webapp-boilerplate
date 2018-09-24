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

## Namespaces

There are three different namespaces directly relevant:

* .o-: Objects
* .c-: Components
* .u-: Utilities

In short: Every class in either of these three directories gets the appropriate prefix in its classname. All classes in one of these three layers has this kind of prefix. Be sure to follow this convention in your own code as well to keep a consistent naming convention across your code base.

If you want to dive deeper into namespacing classes and want to know why this is a great idea, have a look at this [article](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/).

| Type             	| Prefix   	| Examples              	| Description                                                                                                                                                                   	|
|------------------	|----------	|-----------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Component        	| c-       	| c-card c-checklist    	| Form the backbone of an application and contain all of the cosmetics for a standalone component.                                                                              	|
| Layout module    	| l-       	| l-grid l-container    	| These modules have no cosmetics and are purely used to position c- components and structure an application’s layout.                                                          	|
| Helpers          	| h-       	| h-show h-hide         	| These utility classes have a single function, often using !important to boost their specificity. (Commonly used for positioning or visibility.)                               	|
| States           	| is- has- 	| is-visible has-loaded 	| Indicate different states that a c- component can have. More detail on this concept can be found inside problem 6 below, but                                                  	|
| JavaScript hooks 	| js-      	| js-tab-switcher       	| These indicate that JavaScript behavior is attached to a component. No styles should be associated with them; they are purely used to enable easier manipulation with script. 	|

## BEM & Suit CSS Naming Conventions

```css
/* block */
.c-photo {}

/* element */
.c-photo__img {}

/* modifier */
.c-photo--large {}
```

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
