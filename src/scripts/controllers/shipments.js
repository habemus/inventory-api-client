angular.module('inventoryAdm.controllers')

.controller('ShipmentsCtrl', function ($scope, $mdDialog, AuthSvc, InventoryAPISvc) {
  $scope.title = 'Carregamentos';
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadShipments();
    });
  
  $scope.loadShipments = function () {
    return InventoryAPISvc
      .listShipments(AuthSvc.getAuthToken())
      .then(function (shipments) {
        $scope.shipments = shipments;
      })
      .catch(function (err) {
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadShipments();
            });
        } else {
          throw err;
        }
      });
  };
  
  $scope.openCreateShipmentDialog = function () {
    return $mdDialog.show({
      controller: function ($scope, $q, $mdDialog) {
        
        $scope.shipmentData = {
          // start with one operation
          operations: [{}],
        };
        
        $scope.searchProducts = function (searchText) {
          if ($scope.shipmentData.type === 'exit') {
            return InventoryAPISvc.searchInventory(
              AuthSvc.getAuthToken(),
              searchText
            );
          } else {
            // by default search through all product models
            return InventoryAPISvc.searchProductModels(
              AuthSvc.getAuthToken(),
              searchText
            );
          } 
        };
        
        $scope.searchOrganizationContacts = function (searchText) {
          return InventoryAPISvc.searchOrganizationContacts(
            AuthSvc.getAuthToken(),
            searchText
          );
        };

        
        $scope.close = function () {
          $mdDialog.hide();
        };
        
        $scope.submit = function () {
          var type = $scope.shipmentData.type;
          
          console.log('submit shipment', $scope.shipmentData);
        };
        
        $scope.addScheduledOperation = function () {
          $scope.shipmentData.operations.push({});
        };
        
      },
      templateUrl: 'templates/dialogs/new-shipment.html'
    })
    .then(function () {
      return $scope.loadShipments();
    });
  };
});