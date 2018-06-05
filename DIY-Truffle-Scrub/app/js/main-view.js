// anonymous, self-invoking function to limit scope
(function() {
  var MainView = {};

  MainView.render = function($body) {
    const homeButton = document.querySelector('#homeButton')
    homeButton.addEventListener('click', function(){
      $body.find('#create-view').css("display", "none");    
      // DepositView.render($body.find('#deposit-view'));
    });
    // $body.find('#contract-view').css("display", "none"); 
    CreateView.render($body.find('#create-view'), $body.find('#contract-view'));
  };

  window.MainView = MainView;
})();
