(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('admin.docs', {
            url: '/docs',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'API'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/docs/docs.html'
                }
            },
            title: 'API',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-book',
                order: 6
            }
        });
    }
})();
