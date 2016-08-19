angular.module('inventoryAdm.controllers')

.controller('ProductModelsCtrl', function ($scope, $mdDialog, AuthSvc, InventoryAPISvc) {
  $scope.title = 'Produtos';
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadProductModels();
    });
    
  $scope.loadProductModels = function () {
    return InventoryAPISvc
      .listProductModels(AuthSvc.getAuthToken())
      .then(function (productModels) {
        $scope.productModels = productModels;
      })
      .catch(function (err) {
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadProductModels();
            });
        } else {
          throw err;
        }
      });
  };
  
  $scope.openCreateProductModelDialog = function () {
    $mdDialog.show({
      controller: function ($scope, $mdDialog) {
        $scope.productModelData = {};
        
        $scope.close = function () {
          $mdDialog.hide();
        };
        
        $scope.submit = function () {
          var name = $scope.productModelData.name;
          var sku  = $scope.productModelData.sku;
          
          if (!name || !sku) {
            return;
          }
          
          InventoryAPISvc.createProductModel(
            AuthSvc.getAuthToken(),
            {
              name: name,
              sku: sku,
            }
          )
          .then(function () {
            $mdDialog.hide();
          })
          .catch(function (err) {
            alert('houve um erro ao criar um modelo de produto');
            console.warn(err);
          });
        };
      },
      templateUrl: 'templates/dialogs/new-product-model.html',
    })
    .then(function () {
      $scope.loadProductModels();
    });
  };
});