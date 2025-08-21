(function(){
  const app = angular.module('basagasApp', []);

  let orderCtrlRef, trackingCtrlRef;

  app.controller('OrderController', ['$http', function($http){
    const ctrl = this;
    orderCtrlRef = ctrl;
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

    ctrl.useLocation = function(target){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
          const latlng = {lat: pos.coords.latitude, lng: pos.coords.longitude};
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({location: latlng}, function(results){
            if(results[0]){
              if(target === 'pickup'){
                ctrl.order.pickupAddress = results[0].formatted_address;
                if(orderMap){
                  orderMap.setCenter(latlng);
                  pickupMarker.setPosition(latlng);
                }
              } else {
                ctrl.order.dropoffAddress = results[0].formatted_address;
                if(orderMap){
                  dropoffMarker.setPosition(latlng);
                }
              }
            }
          });
        });
      }
    };
  }]);

  app.controller('LoginController', ['$http', function($http){
    const ctrl = this;
    ctrl.credentials = {};
    ctrl.error = null;
    ctrl.login = function(){
      $http.post('/api/login', ctrl.credentials).then(function(){
        window.location = '/tracking.html';
      }, function(){
        ctrl.error = 'Invalid email or password';
      });
    };
  }]);

  app.controller('TrackingController', ['$http', '$interval', function($http, $interval){
    const ctrl = this;
    trackingCtrlRef = ctrl;
    ctrl.cylinders = [];
    ctrl.driver = null;

    $http.get('/api/tracking').then(function(res){
      ctrl.cylinders = res.data.cylinders;
      ctrl.driver = res.data.driver;
      if(trackingMap && ctrl.driver){
        ctrl.driverMarker = new google.maps.Marker({map: trackingMap, title:'Driver', position: ctrl.driver});
        trackingMap.setCenter(ctrl.driver);
      }
    }, function(){
      window.location = '/login.html';
    });

    ctrl.updateDriver = function(){
      if(ctrl.driverMarker){
        const pos = ctrl.driverMarker.getPosition();
        const newPos = {lat: pos.lat()+0.001, lng: pos.lng()+0.001};
        ctrl.driverMarker.setPosition(newPos);
      }
    };
    $interval(ctrl.updateDriver, 5000);
  }]);
})();

let orderMap, pickupMarker, dropoffMarker;
function initOrderMap(){
  const ctrl = orderCtrlRef;
  orderMap = new google.maps.Map(document.getElementById('order-map'), {
    center:{lat:-26.2041,lng:28.0473}, zoom:12
  });
  pickupMarker = new google.maps.Marker({map: orderMap});
  dropoffMarker = new google.maps.Marker({map: orderMap});
  const pickupInput = document.getElementById('pickup');
  const dropoffInput = document.getElementById('dropoff');
  const pickupAuto = new google.maps.places.Autocomplete(pickupInput);
  const dropoffAuto = new google.maps.places.Autocomplete(dropoffInput);
  pickupAuto.addListener('place_changed', function(){
    const place = pickupAuto.getPlace();
    if(place.geometry){
      orderMap.setCenter(place.geometry.location);
      pickupMarker.setPosition(place.geometry.location);
      ctrl.order.pickupAddress = place.formatted_address;
    }
  });
  dropoffAuto.addListener('place_changed', function(){
    const place = dropoffAuto.getPlace();
    if(place.geometry){
      dropoffMarker.setPosition(place.geometry.location);
      ctrl.order.dropoffAddress = place.formatted_address;
    }
  });
}

let trackingMap;
function initTrackingMap(){
  trackingMap = new google.maps.Map(document.getElementById('tracking-map'), {
    center:{lat:-26.2041,lng:28.0473}, zoom:12
  });
  const ctrl = trackingCtrlRef;
  if(ctrl && ctrl.driver){
    ctrl.driverMarker = new google.maps.Marker({map: trackingMap, title:'Driver', position: ctrl.driver});
    trackingMap.setCenter(ctrl.driver);
  }
}
