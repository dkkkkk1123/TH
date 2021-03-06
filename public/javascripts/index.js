$(document).ready(function () {
  var timeDataArray = [],
    accXDataArray = [],    //Temperature Data
    accYDataArray = [],    //Humidity Data
    accZDataArray = [];     
  var data = {
    labels: timeDataArray,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: accXDataArray
      }

       
     ,
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: accYDataArray
      }
    
        ,
      {
        fill: false,
        label: 'Dust',
        yAxisID: 'Dust',
        borderColor: "rgba(255, 0, 0, 1)",
        pointBoarderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
        pointHoverBorderColor: "rgba(255, 0, 0, 1)",
        data: accZDataArray
      }
      
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature&Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature',
          display: true
        },
        position: 'left',
      }

      , {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity',
            display: true
          },
          position: 'right'
        }
        
        , {
          id: 'Dust',
          type: 'linear',
          scaleLabel: {
            labelString: 'Dust',
            display: true
          },
          position: 'right'
        }
      
      ]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });


  /*var ws = new WebSocket('wss://' + WonWookHub.azure-devices.net);*/

  var ws = new WebSocket('wss://' + location.host);

  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }

  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
     
      timeDataArray.push(obj.myidx);
      accXDataArray.push(obj.Temperature);
      // only keep no more than 50 points in the line chart
      // Data를 50개 이내로 유지하기 위해서 쉬프트시킨다.
      const maxLen = 50;
      var len = timeDataArray.length;
      if (len > maxLen) {
        timeDataArray.shift();
        accXDataArray.shift();
      }

    
      // ACC Y
      if (obj.Humidity) {
        accYDataArray.push(obj.Humidity);    //humidityData
      }
      if (accYDataArray.length > maxLen) {
        accYDataArray.shift();
      }
      
      // ACC Z
      if (obj.Dust) {
        accZDataArray.push(obj.Dust);
      }
      if (accZDataArray.length > maxLen) {
        accZDataArray.shift();
      }
      
      // LineChart Update
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
