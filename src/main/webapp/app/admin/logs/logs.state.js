(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('admin.logs', {
            parent: 'admin',
            url: '/logs',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Logs'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/logs/logs.html',
                    controller: 'LogsController',
                    controllerAs: 'vm'
                }
            },
            title: 'Logs',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-list-alt',
                order: 5
            }
        });
    }
})();
