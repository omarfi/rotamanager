'use strict';

describe('Controller Tests', function() {

    describe('Shift Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockShift, MockRota, MockEmployee;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockShift = jasmine.createSpy('MockShift');
            MockRota = jasmine.createSpy('MockRota');
            MockEmployee = jasmine.createSpy('MockEmployee');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Shift': MockShift,
                'Rota': MockRota,
                'Employee': MockEmployee
            };
            createController = function() {
                $injector.get('$controller')("ShiftDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'rotamanagerApp:shiftUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
