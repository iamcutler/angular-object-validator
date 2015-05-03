## AngularJS Object Validator

AngularJS object validator.
This is the initial implementation however, I'll be working further to improve functionality and abilities as well as observing nested objects.
Better documentation will also be introduced in the near future.

[![Build Status](https://travis-ci.org/iamcutler/angular-object-validator.svg?branch=master)](https://travis-ci.org/iamcutler/angular-object-validator)
[![Coverage Status](https://coveralls.io/repos/iamcutler/angular-object-validator/badge.svg)](https://coveralls.io/r/iamcutler/angular-object-validator)

## Installation
```npm
install angular-object-validator
```

## Allowed validations:
 * required

### Data types:
 * number
 * array
 * string
 * object
 * boolean

### Calculations:
 * min
 * max
 * greaterThan
 * lessThan
 * greaterThanOrEquals
 * lessThanOrEquals

## Example usage:

You can pass a single object or an array of objects to be validated.

    app.controller('AppCtrl', function(ObjectValidator) {
        // Set validation rules.
        var rules = [
            {
                "quantity": [
                    { 'required': 'Quantity received must be present' },
                    { '{lessThanOrEquals:quantityOrdered}': 'Quantity received must be less than or equal to quantity ordered' }
                ]
            }
        ];

        ObjectValidator.validate([{}, {}, {}], rules).then(function() {
            // Validation passed
        }).catch(function(errors) {
            // Errors are returned as an array
        });
    });
