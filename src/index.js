// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';
// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account
var Cesium = require('cesium/Cesium');
require('./css/main.css');
require('cesium/Widgets/widgets.css');
require('./chart/script');

// import EntityCollection from 'cesium/Source/DataSources/EntityCollection';
// require('axios');
var logo = '/src/images/red.png'

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
var camera = new Cesium.Camera(scene);
if (!scene.pickPositionSupported) {
  window.alert("This browser does not support pickPosition.");
}

var dataSource = new Cesium.CustomDataSource('mydata')
const api_url = "https://disease.sh/v3/covid-19/jhucsse"
const world_api = "https://disease.sh/v3/covid-19/all"
let data;

async function getapi(url, data) {
    
  try {
     // Storing response
     const response = await fetch(url);
    
     // Storing data in form of JSON
     data = await response.json();
     
     console.log("here")
     console.log("main",data);
     //  cluster(dataSource);
     addMarkerBillboards(data, dataSource);
     cluster(dataSource);
     polygonAdd();
     let ele = document.getElementById('sel');
  for (let i = 0; i <=data.length; i++) {
    ele.innerHTML = ele.innerHTML + '<option value="' + data[i].country + '">' + data[i].country + '</option>'
  }
    //  populateSelect(data);
    } catch (error) {
      console.log('error',error)
    }
    
    
    
  }
async function getworldapi(url){
  try {
    const response = await fetch(url);
    let data2 = await response.json();
    document.getElementById('total cases').innerHTML = data2.cases
    document.getElementById('deaths').innerHTML = data2.deaths
    document.getElementById('recovered').innerHTML = data2.recovered
    document.getElementById('active').innerHTML = data2.active
    document.getElementById('critical').innerHTML = data2.critical
    // console.log(data2); 
  } catch (error) {
    console.log('error', error)
  }
}
var myVar = setInterval(myTimer, 600000);

function myTimer() {
  var d = new Date();
  var t = d.toLocaleTimeString();
  document.getElementById("update").innerHTML = t;
}
  // Calling that async function
  getapi(api_url);
  getworldapi(world_api)
  viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(77.10898, 28.646519, 8500000.0)
  });
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
          if (Number(data[i].stats.confirmed) > 500000){
            
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
                scale: 0.04,
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
          else if (Number(data[i].stats.confirmed) >100000 && Number(data[i].stats.confirmed) < 500000) {
            
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
                scale: 0.04,
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
          else if (Number(data[i].stats.confirmed) >50000 && Number(data[i].stats.confirmed) < 100000) {
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
                scale: 0.04,
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
          else if (Number(data[i].stats.confirmed) <= 50000) {
            
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
                scale: 0.04,
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
       
      
    }
    

  // console.log("yeah am working")
  // var canvas =
  var previousPickedEntity = undefined;
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function(movement) {

   
    var pickedPrimitive = viewer.scene.pick(movement.endPosition);
    var pickedEntity = (Cesium.defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;
    // Unhighlighted
    if (Cesium.defined(previousPickedEntity)) {
      previousPickedEntity.billboard.scale = 0.04;
      // previousPickedEntity.billboard.color = Cesium.Color.WHITE;
      previousPickedEntity.ellipse.semiMinorAxis = 250.0;
      previousPickedEntity.ellipse.semiMajorAxis = 400.0;
      previousPickedEntity.label.show = false;
  }
    // Highlight the currently picked entity
    if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
        pickedEntity.billboard.scale = 0.1;
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
  var pixelRange = 60;
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
          cluster.point.show = true;
          cluster.point.id = cluster.label.id;
          cluster.point.horizontalOrigin =
          Cesium.HorizontalOrigin.LEFT;
          // cluster.billboard.verticalOrigin =
          // Cesium.VerticalOrigin.BOTTOM;
          // cluster.billboard.image = url
          cluster.point.color = Cesium.Color.RED.withAlpha(-0.5)
          
          // cluster.point.color = new Cesium.Color(1.0, 1.0, 1.0, 0.5)
          cluster.point.pixelSize = 50.0
          // cluster.point.scale = 100.0
          cluster.point.heightReference =  Cesium.HeightReference.CLAMP_TO_GROUND;
          
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
function populateSelect(data) {
  let ele = document.getElementById('sel');
  console.log("here")
  for (let i = 0; i <=data.length; i++) {
    ele.innerHTML = ele.innerHTML + '<option value="' + data[i].country + '">' + data[i].country + '</option>'
  }
}


              
              