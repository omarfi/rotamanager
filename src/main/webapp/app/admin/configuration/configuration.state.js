(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('admin.jhi-configuration', {
            url: '/configuration',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Configuration'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/configuration/configuration.html',
                    controller: 'JhiConfigurationController',
                    controllerAs: 'vm'
                }
            },
            title: 'Configuration',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-list-alt',
                order: 3
            }
        });
    }
})();
