(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('shift', {
            parent: 'entity',
            url: '/shift',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Shifts'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/shift/shifts.html',
                    controller: 'ShiftController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('shift-detail', {
            parent: 'entity',
            url: '/shift/{id}',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Shift'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/shift/shift-detail.html',
                    controller: 'ShiftDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Shift', function($stateParams, Shift) {
                    return Shift.get({id : $stateParams.id});
                }]
            }
        })
        .state('shift.new', {
            parent: 'shift',
            url: '/new',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/shift/shift-dialog.html',
                    controller: 'ShiftDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                start: null,
                                end: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('shift', null, { reload: true });
                }, function() {
                    $state.go('shift');
                });
            }]
        })
        .state('shift.edit', {
            parent: 'shift',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/shift/shift-dialog.html',
                    controller: 'ShiftDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Shift', function(Shift) {
                            return Shift.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('shift', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('shift.delete', {
            parent: 'shift',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/shift/shift-delete-dialog.html',
                    controller: 'ShiftDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Shift', function(Shift) {
                            return Shift.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('shift', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
