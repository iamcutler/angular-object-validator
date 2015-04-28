angular.module('angular-object-validator', [])
.factory('ObjectValidator', ['$q', function($q) {
    var validations = {
            errors: []
        },
        API = {
            validate: validate
        };

    return API;

    function validate(items, rules) {
        items = items || [];
        var defer = $q.defer(),
            currentItem,
            currentValue,
            currentValidationKey,
            conditions,
            validateArgs,
            validationMessage;

        // Clear validations
        validations.errors = [];

        // Check if items is a single object
        if(!Array.isArray(items)) {
            items = [items];
        }

        for(var i = 0; i < items.length; i++) {
            currentItem = items[i];
            // Loop validation rules
            for(var r = 0, rule, currentRule; r < rules.length; r++) {
                currentRule = rules[r];
                // Check if properties are present
                if(currentItem.hasOwnProperty(Object.keys(currentRule)[0])) {
                    for(rule in currentRule) {
                        // Loop through currrent validations
                        currentRule[rule].map(function (currentValidation) {
                            currentValue = currentItem[Object.keys(currentRule)[0]];
                            currentValidationKey = Object.keys(currentValidation)[0];
                            validationMessage = currentValidation[Object.keys(currentValidation)[0]];

                            // Check for conditions or args
                            if(currentValidationKey.indexOf('|') >= 0) {
                                // --------------------------------------------
                                // Conditional
                                // --------------------------------------------
                                conditions = currentValidationKey.split('|');

                                for(var c = 0; c < conditions.length; c++) {
                                    // Loop though conditional validations
                                    validator(conditions[c], validationMessage, currentValue);
                                }
                            } else if(currentValidationKey.indexOf(':') >= 0 && currentValidationKey.indexOf('{') === -1) {
                                // --------------------------------------------
                                // Argument passed
                                // --------------------------------------------
                                validateArgs = currentValidationKey.split(':');

                                validator(validateArgs[0], validationMessage, currentValue, validateArgs[1]);
                            } else if(currentValidationKey[0].toString() == '{') {
                                // --------------------------------------------
                                // Calculation expression
                                // --------------------------------------------
                                validateArgs = currentValidationKey.replace('{', '').replace('}', '').split(':');

                                // Check if item has property to compare
                                if(currentItem.hasOwnProperty(validateArgs[1])) {
                                    validator(validateArgs[0], validationMessage, currentValue, currentItem[validateArgs[1]]);
                                } else {
                                    validator(validateArgs[0], validationMessage, currentValue, null);
                                }
                            } else {
                                validator(currentValidationKey, validationMessage, currentValue);
                            }
                        });
                    }
                }
            }
        }

        // Check if errors are present
        if(validations.errors.length === 0) {
            defer.resolve();
        } else {
            defer.reject(validations.errors);
        }

        return defer.promise;
    }

    function validator(key, rule, value, arg) {
        var required = (key == 'required' && value === '' || value === undefined || value === null),
            string = (key == 'string' && typeof value !== 'string'),
            number = (key == 'number' && typeof value !== 'number'),
            boolean = (key == 'boolean' && typeof value !== 'boolean'),
            object = (key == 'object' && typeof value !== 'object'),
            array = (key == 'array' && !(value instanceof Array)),
            min = (key == 'min' && Number(value) <= Number(arg)),
            max = (key == 'max' && Number(value) >= Number(arg)),
            lessThan = (key == 'lessThan' && arg === null || key == 'lessThan' && (Number(value) + 1) > Number(arg)),
            greaterThan = (key == 'greaterThan' && arg === null || key == 'greaterThan' && (Number(value) - 1) < Number(arg)),
            lessThanOrEquals = (key == 'lessThanOrEquals' && arg === null || key == 'lessThanOrEquals' && Number(value) > Number(arg)),
            greaterThanOrEquals = (key == 'greaterThanOrEquals' && arg === null || key == 'greaterThanOrEquals' && Number(value) < Number(arg));

        if(required || string || number || boolean || object || array || min || max || lessThan || greaterThan || lessThanOrEquals || greaterThanOrEquals) {
            validations.errors.push(rule);
        }
    }
}]);