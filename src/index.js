// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';
// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account
var Cesium = require('cesium/Cesium');
require('./css/main.css');
require('cesium/Widgets/widgets.css');

// import EntityCollection from 'cesium/Source/DataSources/EntityCollection';
// require('axios');
// var logo = require('./images/co.png');
import logo from './images/red.png'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZDk3ODc3Yy0yMTk5LTQ1NjAtOTY5Zi1kNmRiOGMwNzBmMmIiLCJpZCI6Njc4MzIsImlhdCI6MTYzMjExODUyMH0.9dINseSzSb6QPkBf7GCYXduWES88R0d_Q9sYCTNeFaE';
// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
var viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: Cesium.createWorldImagery({
    style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
  }),
  animation: false,
  timeline: false
});
var scene = viewer.scene;
var canvas = viewer.scene.canvas;
if (!scene.pickPositionSupported) {
  window.alert("This browser does not support pickPosition.");
}

var dataSource = new Cesium.CustomDataSource('mydata')
const api_url = "https://disease.sh/v3/covid-19/jhucsse"
let data;
async function getapi(url) {
    
  try {
     // Storing response
     const response = await fetch(url, data);
    
     // Storing data in form of JSON
     data = await response.json();
     
     console.log("main",data);
     //  cluster(dataSource);
     addMarkerBillboards(data, dataSource);
     cluster(dataSource);
     polygonAdd();
    } catch (error) {
      console.log('error',error)
    }
    
    
    
  }
  // Calling that async function
  getapi(api_url);
// 
function addMarkerBillboards(data, dataSource) {
    // Sandcastle.declare(addMarkerBillboards);
    // console.log(data)
    // console.log(data[0].coordinates.longitude)
    let i;
    let entity;
    
    for (i=0; i<data.length; i++) {
      let log = Number(data[i].coordinates.longitude)
      let lat = Number(data[i].coordinates.latitude)
      var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
            '<tr><th>' + "Country" + '</th><td>' + data[i].country + '</td></tr>' +
            '<tr><th>' + "State" + '</th><td>' + data[i].province + '</td></tr>' +
            '<tr><th>' + "Confirmed Cases" + '</th><td>' + data[i].stats.confirmed + '</td></tr>' +
            '<tr><th>' + "Deaths" + '</th><td>' + data[i].stats.deaths + '</td></tr>' +
            '<tr><th>' + "Recovered Cases" + '</th><td>' + data[i].stats.recovered + '</td></tr>' +
            '</tbody></table>';
          if (data[i].stats.confirmed > 500000){
            
            entity = dataSource.entities.add({
              name: data[i].country,
              label: {
                text : data[i].province + ", "+ data[i].country,
                font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, 50)
              },
              position: Cesium.Cartesian3.fromDegrees(log, lat),
              billboard: {
                image: logo,
                scale: 0.05,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              },
              description: 'Country:' + data[i].country
              + '\nstate:' + data[i].province
              + '\n\nConfirmed Cases:' + data[i].stats.confirmed
              + '\nDeaths:' + data[i].stats.deaths
              + '\nRecovered:' + data[i].stats.recovered,
              ellipse : {
                semiMinorAxis : 25.0,
                semiMajorAxis : 40.0,
                material : Cesium.Color.RED.withAlpha(0.5),
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                //       3.0,
                //       5.5e6
                //     ),
              }
              })
              entity.description = description;
              entity.label.show = false;
          }
          else if (data[i].stats.confirmed >100000 && data[i].stats.confirmed < 500000) {
            var label = data[i].province + ", "+ data[i].country
            entity = dataSource.entities.add({
              position: Cesium.Cartesian3.fromDegrees(log, lat),
              label: {
                text : data[i].province + ", "+ data[i].country,
                font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
              pixelOffset : new Cesium.Cartesian2(0, 50)
              },
              billboard: {
                image: logo,
                scale: 0.05,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              },
              description: 'Country:' + data[i].country
              + '\nstate:' + data[i].province
              + '\n\nConfirmed Cases:' + data[i].stats.confirmed
              + '\nDeaths:' + data[i].stats.deaths
              + '\nRecovered:' + data[i].stats.recovered,
              ellipse : {
                semiMinorAxis : 25.0,
                semiMajorAxis : 40.0,
                material : Cesium.Color.ORANGE.withAlpha(0.5),
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                //       3.0,
                //       5.5e6
                //     ),
              }
              })
              entity.description = description;
              entity.label.show = false;

          }
          else if (data[i].stats.confirmed >50000 && data[i].stats.confirmed < 100000) {
            entity = dataSource.entities.add({
              position: Cesium.Cartesian3.fromDegrees(log, lat),
              label: {
                text : data[i].province + ", "+ data[i].country,
                font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, 50)
              },
              billboard: {
                image: logo,
                scale: 0.05,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              },
              description: 'Country:' + data[i].country
              + '\nstate:' + data[i].province
              + '\n\nConfirmed Cases:' + data[i].stats.confirmed
              + '\nDeaths:' + data[i].stats.deaths
              + '\nRecovered:' + data[i].stats.recovered,
              ellipse : {
                semiMinorAxis : 25.0,
                semiMajorAxis : 40.0,
                material : Cesium.Color.YELLOW.withAlpha(0.5),
              }
              })
              entity.description = description;
              entity.label.show = false;
              
          }
          else if (data[i].stats.confirmed <= 50000) {
            
            entity = dataSource.entities.add({
              position: Cesium.Cartesian3.fromDegrees(log, lat),
              label: {
                text : data[i].province + ", "+ data[i].country,
                font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, 50)
              },
              billboard: {
                image: logo,
                scale: 0.01,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              },
              ellipse : {
                semiMinorAxis : 25.0,
                semiMajorAxis : 40.0,
                material : Cesium.Color.GREEN.withAlpha(0.5),
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                //   3.0,
                //   5.5e6
                // ),
              }
              })
              entity.description = description;
              entity.label.show = false;
              
              
          }
          
          
          // console.log(data[i])  
          // entityArray.push(entity)  
        }
        // console.log("1",dataSource.entities._entities._hash)
        // console.log("2",entity)
        // console.log("3", dataSource)
        
        viewer.dataSources.add(dataSource);
        var source = viewer.dataSources.getByName(dataSource._name)
        // console.log("4", source)
        var entity1 = dataSource.entities.values
        // console.log('okay', entity1)
      
    }
    

  console.log("yeah am working")
  // var canvas =
  var previousPickedEntity = undefined;
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function(movement) {

   
    var pickedPrimitive = viewer.scene.pick(movement.endPosition);
    var pickedEntity = (Cesium.defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;
    // Unhighlighted
    if (Cesium.defined(previousPickedEntity)) {
      previousPickedEntity.billboard.scale = 0.01;
      // previousPickedEntity.billboard.color = Cesium.Color.WHITE;
      previousPickedEntity.ellipse.semiMinorAxis = 250.0;
      previousPickedEntity.ellipse.semiMajorAxis = 400.0;
      previousPickedEntity.label.show = false;
  }
    // Highlight the currently picked entity
    if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
        pickedEntity.billboard.scale = 0.2;
        // pickedEntity.billboard.color = Cesium.Color.ORANGERED;
        // pickedEntity.ellipse.distanceDisplayCondition = false;
        pickedEntity.ellipse.semiMinorAxis = 250000.0;
        pickedEntity.ellipse.semiMajorAxis = 400000.0;
        pickedEntity.label.show = true;
        previousPickedEntity = pickedEntity; 
    }
    
    
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            

cluster(dataSource);
function cluster(dataSource) {
  var pixelRange = 50;
  var minimumClusterSize = 2;
  var enabled = true;
              
  dataSource.clustering.enabled = enabled;
  dataSource.clustering.pixelRange = pixelRange;
  dataSource.clustering.minimumClusterSize = minimumClusterSize;
  // cluster.label.show = true;
  // cluster.label.text = entities.length.toLocaleString();
              
  var removeListener;
  var url = 'Assets/Textures/maki/red.png'
  function customStyle() {
    if (Cesium.defined(removeListener)) {
      removeListener();
      removeListener = undefined;
    } else {
      removeListener = dataSource.clustering.clusterEvent.addEventListener(
        function (entities, cluster) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.id = cluster.label.id;
          cluster.billboard.horizontalOrigin =
          Cesium.HorizontalOrigin.LEFT;
          cluster.billboard.image = url
          cluster.billboard.color = new Cesium.Color(1.0, 1.0, 1.0, 0.5)
          cluster.billboard.scale = 0.2
      }
      );
    }
    // force a re-cluster with the new styling
    var pixelRange = dataSource.clustering.pixelRange;
    dataSource.clustering.pixelRange = 0;
    dataSource.clustering.pixelRange = pixelRange;
  }
  // start with custom style
  customStyle(dataSource);
              
                var viewModel = {
                  pixelRange: pixelRange,
                  minimumClusterSize: minimumClusterSize,
                };
                Cesium.knockout.track(viewModel);
              
                var toolbar = document.getElementById("toolbar");
                Cesium.knockout.applyBindings(viewModel, toolbar);
              
                function subscribeParameter(name) {
                  Cesium.knockout
                    .getObservable(viewModel, name)
                    .subscribe(function (newValue) {
                      dataSource.clustering[name] = newValue;
                    });
                }
              
                subscribeParameter("pixelRange");
                subscribeParameter("minimumClusterSize");
              
                var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction(function (movement) {
                  var pickedLabel = viewer.scene.pick(movement.position);
                  if (Cesium.defined(pickedLabel)) {
                    var ids = pickedLabel.id;
                    if (Array.isArray(ids)) {
                      for (var i = 0; i < ids.length; ++i) {
                        ids[i].billboard.color = Cesium.Color.RED;
                      }
                    }
                  }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                
                
              };
