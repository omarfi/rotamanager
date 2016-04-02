'use strict';

describe('Controller Tests', function() {

    describe('Rota Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockRota, MockShift, MockStore;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockRota = jasmine.createSpy('MockRota');
            MockShift = jasmine.createSpy('MockShift');
            MockStore = jasmine.createSpy('MockStore');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Rota': MockRota,
                'Shift': MockShift,
                'Store': MockStore
            };
            createController = function() {
                $injector.get('$controller')("RotaDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'rotamanagerApp:rotaUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
