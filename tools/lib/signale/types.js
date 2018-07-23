'use strict';
const figures = require('figures');

module.exports = {
  error: {
    badge: figures.cross,
    color: 'red',
    label: 'error',
    level: 8
  },
  fatal: {
    badge: figures.cross,
    color: 'red',
    label: 'fatal',
    level: 8
  },
  fav: {
    badge: figures('❤'),
    color: 'magenta',
    label: 'favorite',
    level: 1
  },
  info: {
    badge: figures.info,
    color: 'blue',
    label: 'info',
    level: 3
  },
  star: {
    badge: figures.star,
    color: 'yellow',
    label: 'star',
    level: 1
  },
  success: {
    badge: figures.tick,
    color: 'green',
    label: 'success',
    level: 8
  },
  warn: {
    badge: figures.warning,
    color: 'yellow',
    label: 'warning',
    level: 5
  },
  complete: {
    badge: figures.checkboxOn,
    color: 'cyan',
    label: 'complete',
    level: 8
  },
  pending: {
    badge: figures.checkboxOff,
    color: 'magenta',
    label: 'pending',
    level: 8
  },
  note: {
    badge: figures.bullet,
    color: 'blue',
    label: 'note',
    level: 3
  },
  start: {
    // badge: figures.play,
    badge: figures('●'),
    color: 'green',
    label: 'start',
    level: 8
  },
  pause: {
    badge: figures.squareSmallFilled,
    color: 'yellow',
    label: 'pause',
    level: 8
  },
  debug: {
    badge: figures('⬤'),
    color: 'red',
    label: 'debug',
    level: 2
  },
  await: {
    badge: figures.ellipsis,
    color: 'blue',
    label: 'awaiting',
    level: 4
  },
  watch: {
    badge: figures.ellipsis,
    color: 'yellow',
    label: 'watching',
    level: 8
  },
  log: {
    badge: '',
    color: '',
    label: '',
    level: 8
  }
};
