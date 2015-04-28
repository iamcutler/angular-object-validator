describe('AngularObjectValidator', function () {
    var $scope,
        Validator,
        items = [
            {
                "id": "98h34t98h35g9h345",
                "lineItemId": "982h34t90h34g983049h",
                "description": "Item description 1",
                "quantityOrdered": '1000.20',
                "quantityOutstanding": '200.00',
                "quantityReceived": '800.20',
                "uom": "EA",
                "unitPrice": "6.99",
                "deliveryDate": "2015-02-15",
                "totalPrice": "34.95",
                "status": "Received"
            }
        ];

    beforeEach(module('angular-object-validator'));

    beforeEach(inject(function ($rootScope, _ObjectValidator_) {
        $scope = $rootScope.$new();
        Validator = _ObjectValidator_;
    }));

    describe('validate method', function () {
        var validate,
            rules = [
                {
                    "id": [
                        { 'required': 'property must be present' },
                        { 'min:10': 'property be a minimum 10' },

                    ]
                }
            ];

        describe('validation fails', function () {
            it('required', function () {
                items[0].id = '';

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property must be present');
            });

            it('min', function () {
                items[0].quantityOrdered = 8;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property be a minimum 10');
            });

            it('max', function () {
                rules = [
                    {
                        "quantityOrdered": [
                            { 'max:10': 'property be a maximum 10' }
                        ]
                    }
                ];

                items[0].quantityOrdered = 11;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property be a maximum 10');
            });

            it('option/condition', function () {
                rules = [
                    {
                        "quantityOrdered": [
                            { 'required|string': 'property is required and a string' }
                        ]
                    }
                ];

                items[0].quantityOrdered = '';

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property is required and a string');
            });

            it('lessThan', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { '{lessThan:quantityOrdered}': 'property should be less than quantity ordered' }
                        ]
                    }
                ];

                items[0].quantityOrdered = 20;
                items[0].quantityReceived = 20;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be less than quantity ordered');
            });

            it('greaterThan', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { '{greaterThan:quantityOrdered}': 'property should be greater than quantity ordered' }
                        ]
                    }
                ];

                items[0].quantityOrdered = 20;
                items[0].quantityReceived = 20;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be greater than quantity ordered');
            });

            it('lessThanOrEquals', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { '{lessThanOrEquals:quantityOrdered}': 'property should be less than or equal quantity ordered' }
                        ]
                    }
                ];

                items[0].quantityOrdered = 20;
                items[0].quantityReceived = 21;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be less than or equal quantity ordered');
            });

            it('greatherThanOrEquals', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { '{greaterThanOrEquals:quantityOrdered}': 'property should be greater than or equal quantity ordered' }
                        ]
                    }
                ];

                items[0].quantityOrdered = 20;
                items[0].quantityReceived = 19;

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be greater than or equal quantity ordered');
            });

            it('array', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { 'array': 'property should be an array' }
                        ]
                    }
                ];

                items[0].quantityReceived = '';

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be an array');
            });

            it('boolean', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { 'boolean': 'property should be a boolean' }
                        ]
                    }
                ];

                items[0].quantityReceived = '';

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be a boolean');
            });

            it('object', function () {
                rules = [
                    {
                        "quantityReceived": [
                            { 'object': 'property should be a object' }
                        ]
                    }
                ];

                items[0].quantityReceived = '';

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property should be a object');
            });

            it('invalid property sent in to compare', function () {
                rules = [
                    {
                        "quantityOrdered": [
                            { '{lessThan:notaproperty}': 'property is missing' }
                        ]
                    }
                ];

                Validator.validate(items, rules).catch(function (error) {
                    validate = error;
                });
                $scope.$digest();

                expect(validate).toContain('property is missing');
            });
        });
    });
});