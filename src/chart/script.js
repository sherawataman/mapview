// console.log("script is working")
const graph_world_url = "https://disease.sh/v3/covid-19/historical/all?lastdays=28"
const graph_world_url_week = "https://disease.sh/v3/covid-19/historical/all?lastdays=7"
const graph_vaccine_url = "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=28&fullData=false"
const graph_vaccine_url_week = "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=7&fullData=false"

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
      function period(f){
          var time = f.options[f.selectedIndex].text;
          console.log(time)
          if (time === "Week") {
          getgraphapi(graph_world_url_week)
          get_vaccine_api(graph_vaccine_url_week)
          console.log("hello")
        } else {
          getgraphapi(graph_world_url)
          get_vaccine_api(graph_vaccine_url)
        }

        }
      function periodCountry(f){
        let graph_country_url = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=28`
        let graph_country_url_week = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=7`
        let country_vaccine_url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=28&fullData=false`
        let country_vaccine_url_week = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=7&fullData=false`
          var time = f.options[f.selectedIndex].text;
          console.log(time)
          if (time === "Week") {
          getgraphapi(graph_country_url_week)
          get_vaccine_api(country_vaccine_url_week)
          console.log("hello")
        } else {
          getgraphapi(graph_country_url)
          get_vaccine_api(country_vaccine_url)
        }

        }
      if(country === "World") {
        var f = document.getElementById("sel2")
        period(f)
        f.onchange = function () {period(f)}
        
      }
      else{
        var f = document.getElementById("sel2")
        periodCountry(f)
        f.onchange = function () {periodCountry(f)}
        
        // getgraphapi(graph_country_url)
        // get_vaccine_api(country_vaccine_url)
        // console.log("here", graph_country_url)
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
          label: 'Total Cases',
          data: dataArr,
          backgroundColor: 'blue',
            borderColor: '#e6e6ff',
            borderWidth: 1,
            fill: true
          }]
        },
        options: {
          animations: {
            radius: {
              duration: 400,
              easing: 'linear',
              loop: (context) => context.active
            }
          },
          hoverBackgroundColor: 'yellow',
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          responsive:true,
          scales: {
            xAxes: [{
              gridLines: {
                  display: false
              },
              ticks: {
                stepSize:2
              }
          }],
            yAxes: [{
            ticks: {
              stepSize: 2
            },
            gridLines: {
              display: false
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
  // console.log("yes deaths worling")
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
          label: 'Total Deaths',
          data: deathArr,
          backgroundColor: '#e60000',
          borderColor: '#ffe6e6',
          borderWidth: 1,
          fill: true,
          display: false
      }]
  },
  options: {
    animations: {
      radius: {
        duration: 400,
        easing: 'linear',
        loop: (context) => context.active
      }
    },
    hoverBackgroundColor: 'yellow',
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    responsive:true,
      scales: {
        xAxes: [{
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }
      }],
        yAxes: [{
          ticks: {
            stepSize: 1
          },
          gridlines: {
            color: "rgba(0, 0, 0, 0)"
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
            label: 'Total Doses',
            data: dataArr,
            backgroundColor: '#00ff00',
            borderColor: '#e6ffe6',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
      animations: {
        radius: {
          duration: 400,
          easing: 'linear',
          loop: (context) => context.active
        }
      },
      hoverBackgroundColor: 'yellow',
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'x'
      },
      responsive:true,
        scales: {
          xAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }],
          yAxes: [{
            ticks: {
              stepSize: 1
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
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
get_table_data()
async function  get_table_data(){
  try {
    const url = "https://disease.sh/v3/covid-19/countries"
    const response = await fetch(url)
    let data = await response.json()
    console.log("table data", data)
    tableCreate(data)
    
  } catch (error) {
    console.log(error)
  }
}
function tableCreate(data) {
  let mytable = document.querySelector('#table');
  let headers = [" ",'Country', 'Cases', "Deaths", "Tests"]
  let table = document.createElement('table')
  let headerRow = document.createElement('tr');
  let header;
  headers.forEach((headerText) => {
    header = document.createElement('th')
    // header.onclick = sortTable()
    let textNode = document.createTextNode(headerText)
    header.appendChild(textNode);
    headerRow.appendChild(header);
  })
  table.appendChild(headerRow);
  

     console.log(data)
     let i = 0
    // Object.assign(details, { flag: '', age: "0" });
    data.forEach(item => {
        let row = document.createElement('tr');
      let cell = document.createElement('td')
      let cell1 = document.createElement('td')
      let cell2 = document.createElement('td')
      let cell3 = document.createElement('td')
      let cell4 = document.createElement('td')
      let img = document.createElement('img');
      // console.log(data[i])
      let textNode1 = document.createTextNode(item.country)
      let textNode2 = document.createTextNode(item.cases)
      let textNode3 = document.createTextNode(item.deaths)
      let textNode4 = document.createTextNode(item.tests)
      img.src = item.countryInfo.flag;
      img.height = "20"
      img.width ='25'
      cell.appendChild(img)
      cell1.appendChild(textNode1)
      cell2.appendChild(textNode2)
      cell3.appendChild(textNode3)
      cell4.appendChild(textNode4)
      row.appendChild(cell)
      row.appendChild(cell1)
      row.appendChild(cell2)
      row.appendChild(cell3)
      row.appendChild(cell4)
      table.appendChild(row)
    });
    // for(let i=0; i<data.length;i++) {
    //   let row = document.createElement('tr');
    //   let cell = document.createElement('td')
    //   let img = document.createElement('img');
    //   // console.log(data[i])
    //   let textNode1 = document.createTextNode(data[i].country)
    //   let textNode2 = document.createTextNode(data[i].cases)
    //   let textNode3 = document.createTextNode(data[i].deaths)
    //   let textNode4 = document.createTextNode(data[i].tests)
    //   img.src = data[i].countryInfo.flag;
    //   img.height = "20"
    //   img.width ='20'
    //   cell.appendChild(img)
    //   cell.appendChild(textNode1)
    //   cell.appendChild(textNode2)
    //   cell.appendChild(textNode3)
    //   cell.appendChild(textNode4)
    //   row.appendChild(cell)
    //   table.appendChild(row)
    // }
    
  
  
  table.id = "mytable"
  
  mytable.appendChild(table);
  let t = document.getElementById("mytable")
  let r = t.getElementsByTagName('tr')
  let h1 = r[0].getElementsByTagName('th')[1];
  let h2 = r[0].getElementsByTagName('th')[2];
  let h3 = r[0].getElementsByTagName('th')[3];
  let h4 = r[0].getElementsByTagName('th')[4];
  // console.log(h1)
  // console.log(h2)
  // console.log(h3)
  // console.log(h4)
  h2.onclick = function () {sortTable(2)}
  h3.onclick = function() {sortTable(3)} 
  h4.onclick = function() {sortTable(4)}
  function sortTable(n) {
    console.log("hello")
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("mytable");
    switching = true;
    // console.log(table)
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName('tr');
      // console.log(rows)
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];
        // console.log(x.innerHTML)
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;      
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

}
