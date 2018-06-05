// anonymous, self-invoking function to limit scope
(function() {
  var CreateView = {};
  CreateView.remoteHost = "http://127.0.0.1:3000/"

  /* Renders the newsfeed into the given $newsfeed element. */
  CreateView.render = function($createContainer,$contractContainer) {
    $createContainer.css("display", "block");
    $contractContainer.css("display", "none");
    var form = document.getElementsByClassName("input-append").item(0);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var percentSum = 0;
      var answer = {}
      answer["tokens"] = []

      var ethPercentage = document.querySelector('#ethField').value
      var zrxPercentage = document.querySelector('#zrxField').value
      percentSum += Number(ethPercentage)
      percentSum += Number(zrxPercentage)
      
      answer["tokens"].push({"token": "eth", "percentage" : ethPercentage})
      answer["tokens"].push({"token": "zrx", "percentage" : zrxPercentage})
      
      answer["rebalance"] = document.getElementById("rebalance").value

      if ( percentSum > 100){
        document.getElementById("total").value = "Err"
        percentSum = 0;
      } else {
        document.getElementById("total").value = percentSum;
      }

      console.log(answer)
      $contractContainer.css("display", "block");
    });

    var xmlPrices = new XMLHttpRequest(); 
    pricesDict = []
    coinIndex = {"WETH": Number(0), "ZRX": Number(1)}
    xmlPrices.addEventListener('load', function() {
      if (xmlPrices.status === 200) {
        var prices = JSON.parse(xmlPrices.responseText)

        for (let i in prices){
          let index = coinIndex[prices[i]["symbol"]]

          if (pricesDict[index] !== undefined){
            if (prices[i]["price"] > 0){
              pricesDict[index][0].push(prices[i]["timestamp"]);
              pricesDict[index][1].push(prices[i]["price"]);
            }

          } else  {
            if (prices[i]["price"] > 0){
              pricesDict[index] = []
              pricesDict[index][0] = [];
              pricesDict[index][0].push(prices[i]["timestamp"]);

              pricesDict[index][1] = [];
              pricesDict[index][1].push(prices[i]["price"]);
            }
          }
        } 

        var traceEth = {
          x: pricesDict[0][0],
          y: pricesDict[0][1],
          type: 'scatter',
          name: 'weth'
        };
        var traceZrx = {
          x: pricesDict[1][0],
          y: pricesDict[1][1],
          type: 'scatter',
          name: 'zrx'
        };
        var data = [traceEth, traceZrx];
        Plotly.newPlot('price-predictions', data);
      }
    });

    xmlPrices.open("GET", '/prices', true)
    xmlPrices.send()

  };

  window.CreateView = CreateView;
})();
