(function(){
  const app = angular.module('basagasApp', []);

  app.controller('OrderController', ['$http', function($http){
    const ctrl = this;
    const DELIVERY_FEE = 45;
    const BASE_PRICES = {2:70,3:104,5:184,7:250};

    ctrl.order = { quantity:1, cylinderSize:2, paymentType:'pay-per-refill' };
    ctrl.confirmation = null;

    ctrl.total = function(){
      let base = (BASE_PRICES[ctrl.order.cylinderSize]||0) * (ctrl.order.quantity||0) + DELIVERY_FEE;
      if(ctrl.order.paymentType === 'subscription') base *= 0.9;
      return base;
    };

    ctrl.submit = function(){
      $http.post('/api/orders', ctrl.order).then(function(res){
        ctrl.confirmation = res.data;
      }, function(){
        ctrl.confirmation = { error: 'Submission failed' };
      });
    };
  }]);
})();
