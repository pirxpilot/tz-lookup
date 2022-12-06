[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

This is a fork of [tz-lookup] module. It's been gently touched to enable
client side (in browser) usage.

tz-lookup
=========

This is a little module that allows you to look up the current time zone of a
location, given it's latitude and longitude. I wrote it because the existing
Node module that does this (`tzwhere`) was far too slow to be useful in a
production setting. This module attempts to ameliorate that.

Usage
-----

To install:

    npm install tz-lookup

To use:
```javascript
const { tz, init } = require("tz-lookup");
await init(); // need to initialize the data
const tz = tz(42.7235, -73.6931));
assert(tz === "America/New_York")
```

Or you can use async version - init is done as needed:
```javascript
const { tzAsync: tz } = require("tz-lookup");
const tz = async tz(42.7235, -73.6931));
assert(tz === "America/New_York")
```


**Please take note of the following:**

*   The exported function call will throw an error if the latitude or longitude
    provided are out of bounds.
    Otherwise it will return an IANA timezone database string.
*   The timezones returned by this module are approximate: since the timezone
    database is so large, lossy compression is necessary for fast lookups. In
    particular, the compression used may be of insufficient resolution for
    several very small timezones and favors country timezones over GMT offsets
    (and so may exaggerate the distance of territorial waters). However, the
    level of accuracy should be adequate for most purposes. (For example, this
    module is used by the [Dark Sky API][1] for global timezone lookups.)

If you find a real-world case where this module's accuracy is inadequate,
please open an issue (or, better yet, submit a pull request with a failing
test) and I'll see what I can do to increase the accuracy for you.

[1]: https://darksky.net/dev/

Sources
-------

Versions prior to 6.0.7 used timezone data from Eric Muller's excellent [TZ
timezone maps][2]. As of 6.0.7, we now use timezone data from @evansiroky's
also-excellent [timezone-boundary-builder][3]. To regenerate the compressed
database, simply run `rebuild.sh`.

[2]: http://efele.net/maps/tz/
[3]: https://github.com/evansiroky/timezone-boundary-builder/

License
-------

To the extent possible by law, The Dark Sky Company, LLC has [waived all
copyright and related or neighboring rights][cc0] to this library.

[cc0]: http://creativecommons.org/publicdomain/zero/1.0/
[tz-lookup]: https://www.npmjs.com/package/tz-lookup

[npm-image]: https://img.shields.io/npm/v/@pirxpilot/tz-lookup
[npm-url]: https://npmjs.org/package/@pirxpilot/tz-lookup

[build-url]: https://github.com/pirxpilot/tz-lookup/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/workflow/status/pirxpilot/tz-lookup/check

[deps-image]: https://img.shields.io/librariesio/release/npm/@pirxpilot/tz-lookup
[deps-url]: https://libraries.io/npm/@pirxpilot%2Ftz-lookup
