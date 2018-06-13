// anonymous, self-invoking function to limit scope
(function() {
  var DepositView = {};
  DepositView.remoteHost = "http://127.0.0.1:3000/"

  /* Renders the newsfeed into the given $newsfeed element. */
  DepositView.render = function($depositContainer) {
    $depositContainer.css("display", "block");
    $body = $(document.body)
    $body.find('#createIndex').css("display", "block");
    const createIndexButton = document.body.querySelector('#createIndex');
    // const ethDisplay = document.querySelector('#ethDisplay');
    createIndexButton.addEventListener('click', function(event){
      // const balance = ethDisplay.balance 
      // console.log("balance: " + balance);
      // if (balance > 0){
      console.log("creating index...")
      $depositContainer.css("display", "none");
      CreateView.render($body.find('#create-view'));
      // }
    });
    // TODO: replace with database call.
    // var xmlQuestions = new XMLHttpRequest(); 
  };

  window.DepositView = DepositView;
})();




