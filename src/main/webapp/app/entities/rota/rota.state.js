(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('rota', {
            parent: 'entity',
            url: '/rota',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Rotas'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/rota/rotas.html',
                    controller: 'RotaController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('rota-detail', {
            parent: 'entity',
            url: '/rota/{id}',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Rota'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/rota/rota-detail.html',
                    controller: 'RotaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Rota', function($stateParams, Rota) {
                    return Rota.get({id : $stateParams.id});
                }]
            }
        })
        .state('rota.new', {
            parent: 'rota',
            url: '/new',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/rota/rota-dialog.html',
                    controller: 'RotaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                month: null,
                                year: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('rota', null, { reload: true });
                }, function() {
                    $state.go('rota');
                });
            }]
        })
        .state('rota.edit', {
            parent: 'rota',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/rota/rota-dialog.html',
                    controller: 'RotaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Rota', function(Rota) {
                            return Rota.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('rota', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('rota.delete', {
            parent: 'rota',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/rota/rota-delete-dialog.html',
                    controller: 'RotaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Rota', function(Rota) {
                            return Rota.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('rota', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
