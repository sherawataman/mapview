// console.log("script is working")
let graph_world_url = "https://disease.sh/v3/covid-19/historical/all?lastdays=7"
let graph_vaccine_url = "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=7&fullData=false"
async function getgraphapi(url) {
    
    try {
       // Storing response
       const response = await fetch(url);
      
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
         const response = await fetch(url);
        
         // Storing data in form of JSON
          var data = await response.json();
          console.log("vaccine data", data);
          graph_vaccine(data)       
         
        } catch (error) {
          console.log('error',error)
        }
        
        
        
      }
getgraphapi(graph_world_url)
get_vaccine_api(graph_vaccine_url)
function graph(data) {
    let keyArr = Object.keys(data.cases);
    let dataArr = Object.values(data.cases);
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
    var ctx = document.getElementById('myChart').getContext('2d');
    var ctx_deaths = document.getElementById('myChart2').getContext('2d');
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
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
        
      responsive:false,
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
let deathKeyArr = Object.keys(data.deaths);
let deathArr =  Object.values(data.deaths);
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
new Chart(ctx_deaths, {
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
    responsive:false,
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
    var ctx = document.getElementById('myChart3').getContext('2d');
    new Chart(ctx, {
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
      responsive:false,
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
}