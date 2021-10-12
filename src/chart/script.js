// console.log("script is working")
const graph_world_url = "https://disease.sh/v3/covid-19/historical/all?lastdays=7"
const graph_vaccine_url = "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=7&fullData=false"

async function getgraphapi(url) {
    
    try {
       // Storing response
       let response = await fetch(url);
      
       // Storing data in form of JSON
        var data = await response.json();
        console.log("graph data", data);
        graph(data)       
       
      } catch (error) {
        console.log('error',error)
      }
      
      
      
    }
    async function get_vaccine_api(url) {
    
      try {
         // Storing response
         let response = await fetch(url);
        
         // Storing data in form of JSON
          var data = await response.json();
          console.log("vaccine data", data);
          graph_vaccine(data)       
         
        } catch (error) {
          console.log('error',error)
        }
        
        
        
      }
      var e = document.getElementById("sel");
      show(e)
      e.onchange = function() {show(e)};
function show(e) {
      var country = e.options[e.selectedIndex].text;

      if(country === "World") {
        getgraphapi(graph_world_url)
        get_vaccine_api(graph_vaccine_url)
      }
      else{
        let graph_country_url = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=7`
        let country_vaccine_url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=7&fullData=false`
        getgraphapi(graph_country_url)
        get_vaccine_api(country_vaccine_url)
        console.log("here", graph_country_url)
      }
}
      
function graph(data) {
  if(window.chart instanceof Chart) {
    // console.log("yes working")
    window.chart.destroy()
  }
    let keyArr 
    let dataArr 
    if(data.timeline){
      keyArr = Object.keys(data.timeline.cases);
      dataArr = Object.values(data.timeline.cases);
      // console.log("yes")
    } else{
      keyArr = Object.keys(data.cases);
      dataArr = Object.values(data.cases);
    }
    let dateArr = []
    console.log(dataArr)
      keyArr.forEach( (d) => {
        if (!isNaN(Date.parse(d))) {
            let date = new Date(d)
            // console.log("1",date);
            date = date.toString().split(" ")
            // console.log("2",date)
            // console.log(date.slice(1, 3).join(" "))
            dateArr.push(date.slice(1, 3).join(" "))
        }    
    })
    
   
    var ctx = document.getElementById('myChart').getContext('2d');
    window.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateArr,
        datasets: [{
          label: 'Weekly Cases',
          data: dataArr,
          backgroundColor: '#e6e6ff',
            borderColor: 'blue',
            borderWidth: 1,
            fill: true
          }]
        },
        options: {
        
          responsive:true,
          scales: {
            yAxes: [{
            ticks: {
              stepSize: 1
            }
          }],
          y: {
            beginAtZero: true,
            display: false
          }
        }
      }
});
//
let deathKeyArr 
let deathArr 
if(data.timeline){
  deathKeyArr = Object.keys(data.timeline.deaths);
  deathArr = Object.values(data.timeline.deaths);
  console.log("yes deaths worling")
} else{
  deathKeyArr = Object.keys(data.deaths);
  deathArr = Object.values(data.deaths);
}
let deathDateArr = []
deathKeyArr.forEach( (d) => {
  if (!isNaN(Date.parse(d))) {
    let date = new Date(d)
    // console.log("1",date);
    date = date.toString().split(" ")
    // console.log("2",date)
    // console.log(date.slice(1, 3).join(" "))
    deathDateArr.push(date.slice(1, 3).join(" "))
  }    
})
if(window.chart2 instanceof Chart) {
  // console.log("yes working")
  window.chart2.destroy()
}
var ctx_deaths = document.getElementById('myChart2').getContext('2d');
window.chart2 = new Chart(ctx_deaths, {
  type: 'line',
  data: {
      labels: deathDateArr,
      datasets: [{
          label: 'Weekly Deaths',
          data: deathArr,
          backgroundColor: '#ffe6e6',
          borderColor: '#e60000',
          borderWidth: 1,
          fill: true,
          display: false
      }]
  },
  options: {
    responsive:true,
      scales: {
        yAxes: [{
          ticks: {
            stepSize: 2
          }
        }],
          y: {
              beginAtZero: true,
              display: false
          }
      }
  }
});

}

function graph_vaccine(data){
  let keyArr = Object.keys(data);
  let dataArr = Object.values(data);
  if(data.timeline){
    keyArr = Object.keys(data.timeline);
    dataArr = Object.values(data.timeline);
    console.log("yes")
  } else{
    keyArr = Object.keys(data);
    dataArr = Object.values(data);
  }
  let dateArr = []
    keyArr.forEach( (d) => {
      if (!isNaN(Date.parse(d))) {
          let date = new Date(d)
          // console.log("1",date);
          date = date.toString().split(" ")
          // console.log("2",date)
          // console.log(date.slice(1, 3).join(" "))
          dateArr.push(date.slice(1, 3).join(" "))
      }    
  })
  console.log(dataArr)
  if(window.chart3 instanceof Chart) {
    // console.log("yes working")
    window.chart3.destroy()
  }
  var ctx = document.getElementById('myChart3').getContext('2d');
  window.chart3 =  new Chart(ctx, {
    type: 'line',
    data: {
        labels: dateArr,
        datasets: [{
            label: 'Weekly Doses',
            data: dataArr,
            backgroundColor: '#e6ffe6',
            borderColor: '#00ff00',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
      responsive:true,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }],
            y: {
                beginAtZero: true,
                display: false
            }
        }
    }
});
// chart.data.labels = dateArr;
//   chart.data.datasets[0].data = dataArr;
  
//   chart.update();
}
