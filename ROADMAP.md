## Roadmap ##

The roadmap here is a living document of where this generator is intending to go and things needed to be done in the near future;

Since we can't really predict the best way of doing things, this may be flexible and subject to change.

As of now, the things which will receive prioritization are:

- Use an addition `package.json` file in in the`/app`directory with template dependencies so that we can use npm-shrinkwrap and other native npm tools to augment keeping things up to date much more easily. This would be referenced in the base generator (`/app/index.js`) rather than providing dependencies as an array of string literals.
- Provide a default ideal way and examples for using selectors in the Redux side
- Create a generator parameter to instantly augment your Redux application with new empty slices and their boilerplate.
- Tests
- Set up a linter (preferably at this point, with styles referenced in AirBNB React style guide as the defaults)

