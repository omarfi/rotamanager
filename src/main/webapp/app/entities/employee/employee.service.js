(function() {
    'use strict';
    angular
        .module('rotamanagerApp')
        .factory('Employee', Employee);

    Employee.$inject = ['$resource', 'DateUtils'];

    function Employee ($resource, DateUtils) {
        var resourceUrl =  'api/employees/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.hiredDate = DateUtils.convertLocalDateFromServer(data.hiredDate);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.hiredDate = DateUtils.convertLocalDateToServer(data.hiredDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.hiredDate = DateUtils.convertLocalDateToServer(data.hiredDate);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
