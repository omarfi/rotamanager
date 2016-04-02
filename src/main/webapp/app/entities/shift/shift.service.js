(function() {
    'use strict';
    angular
        .module('rotamanagerApp')
        .factory('Shift', Shift);

    Shift.$inject = ['$resource', 'DateUtils'];

    function Shift ($resource, DateUtils) {
        var resourceUrl =  'api/shifts/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.start = DateUtils.convertDateTimeFromServer(data.start);
                    data.end = DateUtils.convertDateTimeFromServer(data.end);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
