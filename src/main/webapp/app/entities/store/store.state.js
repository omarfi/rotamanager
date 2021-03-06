(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('store', {
            parent: 'entity',
            url: '/store?page&sort&search',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Stores'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/store/stores.html',
                    controller: 'StoreController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
            }
        })
        .state('store-detail', {
            parent: 'entity',
            url: '/store/{id}',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Store'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/store/store-detail.html',
                    controller: 'StoreDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Store', function($stateParams, Store) {
                    return Store.get({id : $stateParams.id});
                }]
            }
        })
        .state('store.new', {
            parent: 'store',
            url: '/new',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/store/store-dialog.html',
                    controller: 'StoreDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                storeIdExternal: null,
                                name: null,
                                email: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('store', null, { reload: true });
                }, function() {
                    $state.go('store');
                });
            }]
        })
        .state('store.edit', {
            parent: 'store',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/store/store-dialog.html',
                    controller: 'StoreDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Store', function(Store) {
                            return Store.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('store', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('store.delete', {
            parent: 'store',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/store/store-delete-dialog.html',
                    controller: 'StoreDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Store', function(Store) {
                            return Store.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('store', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
