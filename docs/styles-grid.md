# Layout Grid

SailGP responsive UI is based on a column-variate grid layout. It has 12 columns on lg and xl devices, 6 columns on medium and 2 columns on small.

From now on will write the sizes as:

* xl
* lg
* md
* sm

## Usage

### HTML Structure

```html
<div class="l-grid">
  <div class="l-grid__inner">
    <div class="l-grid__cell"></div>
    <div class="l-grid__cell"></div>
    <div class="l-grid__cell"></div>
  </div>
</div>
```

#### Nested grid

To nest layout grid, add a new `l-grid__inner` to wrap around nested `l-grid__cell` within an existing `l-grid__cell`.

The nested layout grid behaves exactly like when they are not nested, e.g, they have 12 columns on xl and lg and so on for the rest. They also use the **same gutter size** as their parents, but margins are not re-introduced since they are living within another cell.

```html
<div class="l-grid">
  <div class="l-grid__inner">
    <div class="l-grid__cell">
      <div class="l-grid__inner">
        <div class="l-grid__cell"><span>Second level</span></div>
        <div class="l-grid__cell"><span>Second level</span></div>
      </div>
    </div>
    <div class="l-grid__cell">First level</div>
    <div class="l-grid__cell">First level</div>
  </div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`l-grid` | Mandatory, for the layout grid element
`l-grid__inner` | Mandatory, for wrapping grid cell
`l-grid__cell` | Mandatory, for the layout grid cell
`l-grid__cell--span-<NUMBER_OF_COLUMNS>` | Optional, specifies the number of columns the cell spans
`l-grid__cell--span-<NUMBER_OF_COLUMNS>-<DEVICE_SIZE>` | Optional, specifies the number of columns the cell spans on a type of device
`l-grid__cell--order-<INDEX>` | Optional, specifies the order of the cell
`l-grid__cell--align-<POSITION>` | Optional, specifies the alignment of cell
`l-grid--fixed-column-width` | Optional, specifies the grid should have fixed column width
`l-grid--align-<GRID_POSITION>` | Optional, specifies the alignment of the whole grid

#### `l-grid__cell--span-<NUMBER_OF_COLUMNS>`

You can set the cells span by applying one of the span classes, of the form `l-grid__cell--span-{columns}`, where `{columns}` is an integer between 1 and 12. If the chosen span size is larger than the available number of columns at the current screen size, the cell behaves as if its chosen span size were equal to the available number of columns at that screen size. If the span classes are not set, `l-grid__cell` will fallback to a default span size of 4 columns.


#### `l-grid__cell--span-<NUMBER_OF_COLUMNS>-<DEVICE_SIZE>`

The same as `l-grid__cell--span-<NUMBER_OF_COLUMNS>` but for a specific type of device.


#### `l-grid__cell--order-<INDEX>`

By default, items are positioned in the source order. However, you can reorder them by using the
`l-grid__cell--order-<INDEX>` classes, where `<INDEX>` is an integer between 1 and 12.

#### `l-grid__cell--align-<POSITION>`

Items are defined to stretch, by default, taking up the height of their corresponding row. You can switch to a different
behavior by using one of the `l-grid__cell--align-<POSITION>` alignment classes, where `<POSITION>` is one of
`top`, `middle` or `bottom`.


#### `l-grid--fixed-column-width`

You can designate each column to have a certain width by using `l-grid--fixed-column-width` modifier. The column width can be specified through sass map `$l-grid-column-width` or css custom properties `--l-grid-column-width-{screen_size}`. The column width is set to 72px on all devices by default.


#### `l-grid--align-<GRID_POSITION>`

The grid is by default center aligned. You can add `l-grid--align-left`
or `l-grid--align-right` modifier class to change this behavior. Note, these
modifiers will have no effect when the grid already fills its container.


### Sass Mixins

Mixin | Description
--- | ---
`l-grid($type-of-device, $margin, $max-width)` | Generates CSS for a grid container on certain device size
`l-grid-inner($type-of-device, $margin, $gutter)` | Generates CSS for a grid cell wrapper on certain device size
`l-grid-cell($type-of-device, $default-span, $gutter)` | Generates CSS for a grid cell on certain device size
`l-grid-fixed-column-width($type-of-device, $margin, $gutter, $column-width)` | Generates CSS for a fixed column width container on certain device size
`l-grid-cell-order($order)` | Reorders a cell inside a grid
`l-grid-cell-align($position)` | Aligns a cell vertically inside a grid


#### `l-grid($type-of-device, $margin, $max-width)`

Generates CSS for a grid container on certain device size. The mixin takes three parameters:

- `$size`: the target platform: `xl`, `lg`, `md`  or `sm`.
- `$margin`: the size of the grid margin.
- `$max-width` (optional): the maximum width of the grid, at which point space stops being distributed by the columns.

#### `l-grid-inner($type-of-device, $margin, $max-width)`

Generates CSS for a grid cell wrapper on certain device size. The mixin takes three parameters:
- `$size`: the target platform: `xl`, `lg`, `md`  or `sm`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.

#### `l-grid-cell($type-of-device, $default-span, $gutter)`

Generates CSS for a grid cell on certain device size. The mixin takes three parameters:
- `$size`: the target platform: `xl`, `lg`, `md`  or `sm`.
- `$default-span` (optional, default 4): how many columns this cell should span (1 to 12).
- `$gutter`: the size of the gutter between cells. Be sure to use the same value as for the parent grid.

#### `l-grid-fixed-column-width($type-of-device, $margin, $gutter, $column-width)`

Generates CSS for a fixed column width container on certain device size. The mixin takes four parameters:
- `$size`: the target platform: `xl`, `lg`, `md`  or `sm`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.
- `$column-width`: the width of the column within the grid.

### Sass Variables

Variables | Description
--- | ---
`l-grid-breakpoints` | A SASS Map specifies the breakpoints width
`l-grid-columns` | A SASS Map specifies the number of columns
`l-grid-default-margin` | A SASS Map specifies the space between the edge of the grid and the edge of the first cell
`l-grid-default-gutter` | A SASS Map specifies the space between edges of adjacent cells
`l-grid-column-width` | A SASS Map specifies the column width of grid columns
`l-grid-default-column-span` | Specifies a cell's default span
`l-grid-max-width` | Restricts max width of the layout grid


### CSS Custom Properties

CSS Custom Properties | Description
--- | ---
`l-grid-margin-<DEVICE_SIZE>` | Specifies the space between the edge of the grid and the edge of the first cell
`l-grid-gutter-<DEVICE_SIZE>` | Specifies the space between edges of adjacent cells
