(function() {
    'use strict';
    angular
        .module('rotamanagerApp')
        .factory('Rota', Rota);

    Rota.$inject = ['$resource'];

    function Rota ($resource) {
        var resourceUrl =  'api/rotas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
