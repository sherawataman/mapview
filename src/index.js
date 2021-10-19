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
  timeline: false,
  baseLayerPicker:false
});
var layers = viewer.scene.imageryLayers;
var blackMarble = layers.addImageryProvider(
  new Cesium.IonImageryProvider({ assetId: 3845 })
);

blackMarble.alpha = 0;
// balckMarble.blue = 1
// layers.upper(blackMarble)
blackMarble.contrast = 1.24;
blackMarble.brightness = 1.5;
blackMarble.hue = 0
blackMarble.saturation =1.0
blackMarble.gamma = 1.0
var scene = viewer.scene;
  scene.skyBox.destroy();
  scene.skyBox = undefined; 
  scene.globe.enableLighting = true;  
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
     
     
     console.log("main",data);
     //  cluster(dataSource);
     populateSelect(data);
     addMarkerBillboards(data, dataSource);
     cluster(dataSource);
     polygonAdd();
     let info = document.getElementsByClassName("table1")
     info.style.visibility = 'visible';
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
    setTimeout(function() {
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(77.10898, 28.646519, 8500000.0)
      })
    }, 2000)
    

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
      var description = '<img\
                        width="90"\
                        style="float:left; margin: 0 1em 1em 0; background-color: #242B31"\
                        src="https://i2.wp.com/www.queppelin.com/wp-content/uploads/2019/08/logo.png?fit=136%2C44&ssl=1"/>\
            <table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter" style="background-color: #242B31;"><tbody style="background-color: #242B31;">' +
            '<tr style="background-color: #242B31;"><th>' + "Country" + '</th><td style="color: green">' + data[i].country + '</td></tr>' +
            '<tr style="background-color: #242B31;"><th>' + "State" + '</th><td style="color: yellow">' + data[i].province + '</td></tr>' +
            '<tr style="background-color: #242B31;"><th>' + "Confirmed Cases" + '</th><td style="color: skyblue">' + data[i].stats.confirmed + '</td></tr>' +
            '<tr style="background-color: #242B31;"><th>' + "Deaths" + '</th><td style="color: red">' + data[i].stats.deaths + '</td></tr>' +
            // '<tr style="background-color: #242B31;"><th>' + "Recovered Cases" + '</th><td>' + data[i].stats.recovered + '</td></tr>' +
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
              point : {
                pixelSize : 25,
                color : Cesium.Color.RED.withAlpha(-0.6),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                // outlineColor : Cesium.Color.WHITE,
                // outlineWidth : 2
            },
              // billboard: {
              //   image: logo,
              //   scale: 0.04,
              //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              // },
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
              point : {
                pixelSize : 20,
                color : Cesium.Color.ORANGE.withAlpha(-1),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                // outlineColor : Cesium.Color.WHITE,
                // outlineWidth : 2
            },
              // billboard: {
              //   image: logo,
              //   scale: 0.04,
              //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              // },
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
              point : {
                pixelSize : 15,
                color : Cesium.Color.YELLOW.withAlpha(-1),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                // outlineColor : Cesium.Color.WHITE,
                // outlineWidth : 2
            },
              // billboard: {
              //   image: logo,
              //   scale: 0.04,
              //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              // },
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
              point : {
                pixelSize : 15,
                color : Cesium.Color.GREEN.withAlpha(-1),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                // outlineColor : Cesium.Color.WHITE,
                // outlineWidth : 2
            },
              // billboard: {
              //   image: logo,
              //   scale: 0.04,
              //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
              // },
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
      // previousPickedEntity.billboard.scale = 0.04;
      previousPickedEntity.point.pixelSize = 25;
      // previousPickedEntity.billboard.color = Cesium.Color.WHITE;
      previousPickedEntity.ellipse.semiMinorAxis = 250.0;
      previousPickedEntity.ellipse.semiMajorAxis = 400.0;
      previousPickedEntity.label.show = false;
  }
    // Highlight the currently picked entity
    if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
        // pickedEntity.billboard.scale = 0.1;
        pickedEntity.point.pixelSize = 20;
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
          cluster.point.color = Cesium.Color.RED.withAlpha(0.5)
          
          // cluster.point.color = new Cesium.Color(1.0, 1.0, 1.0, 0.5)
          cluster.point.pixelSize = 40.0
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
  console.log("here", data[0].country)
  let i;
  let ele = document.getElementById('sel');
  let countries = []
  for (i = 0; i <=data.length; i++) {
    if(data[i]?.country === data[i-1]?.country){
      continue
    } else {
      countries.push(data[i]?.country)
      ele.innerHTML = ele.innerHTML + '<option value="' + data[i]?.country + '">' + data[i]?.country + '</option>'
      
    }
  }
  countries.pop()
  console.log(countries)
}

