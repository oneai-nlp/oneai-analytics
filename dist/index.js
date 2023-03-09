
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./oneai-analytics.cjs.production.min.js')
} else {
  module.exports = require('./oneai-analytics.cjs.development.js')
}
