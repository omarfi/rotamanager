(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('admin.user-management', {
            url: '/user-management',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'rotamanager'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/user-management/user-management.html',
                    controller: 'UserManagementController',
                    controllerAs: 'vm'
                }
            },
            title: 'User Management',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-user',
                order: 0
            }
        })
        .state('admin.user-management-detail', {
            url: '/user/:username',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'rotamanager'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/user-management/user-management-detail.html',
                    controller: 'UserManagementDetailController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('admin.user-management.new', {
            url: '/new',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/user-management/user-management-dialog.html',
                    controller: 'UserManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null, username: null, firstName: null, lastName: null, email: null,
                                activated: true, langKey: null, createdBy: null, createdDate: null,
                                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                                resetKey: null, authorities: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('admin.user-management', null, { reload: true });
                }, function() {
                    $state.go('admin.user-management');
                });
            }]
        })
        .state('admin.user-management.edit', {
            url: '/{username}/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/user-management/user-management-dialog.html',
                    controller: 'UserManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['User', function(User) {
                            return User.get({username : $stateParams.username});
                        }]
                    }
                }).result.then(function() {
                    $state.go('admin.user-management', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('admin.user-management.delete', {
            url: '/{username}/delete',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/user-management/user-management-delete-dialog.html',
                    controller: 'UserManagementDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['User', function(User) {
                            return User.get({username : $stateParams.username});
                        }]
                    }
                }).result.then(function() {
                    $state.go('admin.user-management', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }
})();
