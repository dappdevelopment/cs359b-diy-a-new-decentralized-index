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
          if (prices[i]["price"] > 0){

            if (pricesDict[index] !== undefined){
                pricesDict[index].push(prices[i]);
            } else  {
                pricesDict[index] = []
                pricesDict[index].push(prices[i]);
            }
          }
        } 

        const operation = (list1, list2, isUnion = false) =>list1.filter( a => isUnion === list2.some( b => a.timestamp === b.timestamp ) );

        const inBoth = (list1, list2) => operation(list1, list2, true)
      
        let newPricesZRX = inBoth(pricesDict[1], pricesDict[0])
        let newPricesWETH = inBoth(pricesDict[0], pricesDict[1])

        let wethPrices = [] //weth prices
        let zrxPrices = [] //zrx prices
        let timeStamps = [] //timestamps

        for (let i = 0; i < 240; i++){
          timeStamps.push(newPricesZRX[i]["timestamp"])
          zrxPrices.push(newPricesZRX[i]["price"])
          wethPrices.push(newPricesWETH[i]["price"])
        }

        let ethQuantity = Number(document.querySelector("#ethField").value)/100;
        let zrxQuantity = Number(document.querySelector("#zrxField").value)/100;

        let divisorEth = wethPrices[0];
        for (let i in wethPrices) {
          wethPrices[i] = wethPrices[i] / divisorEth;
        }

        let divisorZrx = zrxPrices[0];
        for (let i in zrxPrices) {
          zrxPrices[i] = zrxPrices[i] / divisorZrx;
        }

        var combinedPrices = []
        for (let i = 0; i < 240; i++){
          let comPrice = ( ethQuantity * wethPrices[i] ) + (zrxQuantity * zrxPrices[i])
          combinedPrices.push(comPrice);
        }

        // var traceEth = {
        //   x: timeStamps,
        //   y: wethPrices,
        //   type: 'scatter',
        //   name: 'weth'
        //   // line: {
        //   //   dash: 'dot',
        //   // }
        // };
        
        // var traceZrx = {
        //   x: timeStamps,
        //   y: zrxPrices,
        //   type: 'scatter',
        //   name: 'zrx'
        //   // line: {
        //   //   dash: 'dot',
        //   // }
        // };
        

        var traceEthAndZrx = {
          x: timeStamps,
          y: combinedPrices,
          type: 'scatter',
          name: 'weth + zrx'
        };

        var layout = {
          title: 'Index Performance Forecast',
          yaxis: {
            title: 'Value of $1 Invested at Inception'
          }
        };

        let data = [traceEthAndZrx]
        Plotly.newPlot('price-predictions', data, layout);
      }
    });

    xmlPrices.open("GET", '/prices', true)
    xmlPrices.send()

  };

  window.CreateView = CreateView;
})();
