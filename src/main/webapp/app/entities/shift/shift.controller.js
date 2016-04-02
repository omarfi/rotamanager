(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('ShiftController', ShiftController);

    ShiftController.$inject = ['$scope', '$state', 'Shift', 'ShiftSearch'];

    function ShiftController ($scope, $state, Shift, ShiftSearch) {
        var vm = this;
        vm.shifts = [];
        vm.loadAll = function() {
            Shift.query(function(result) {
                vm.shifts = result;
            });
        };

        vm.search = function () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            ShiftSearch.query({query: vm.searchQuery}, function(result) {
                vm.shifts = result;
            });
        };
        vm.loadAll();
        
    }
})();
