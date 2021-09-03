App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  minter:null,
  currentAccount:null,
  transaction:0,
  flag:false,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    }
    web3 = new Web3(App.web3Provider);
    web3.eth.defaultAccount = web3.eth.accounts[0];

    App.populateAddress();
    
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('SimpleToken.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
        var voteArtifact = data;
        App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
        App.contracts.vote.setProvider(App.web3Provider);
        App.getMinter();
        App.currentAccount = web3.eth.coinbase;
        jQuery('#current_account').text("Current account : "+web3.eth.coinbase);
        jQuery('#curr_account').text(web3.eth.coinbase);
        return App.bindEvents();
      });
  },

  bindEvents: function() {

    $(document).on('click', '#create_money', function(){ App.handleMint(jQuery('#enter_create_address').val(),jQuery('#create_amount').val()); });
    $(document).on('click', '#send_money', function(){ App.handleTransfer(jQuery('#enter_send_address').val(),jQuery('#send_amount').val()); });
    $(document).on('click', '#balance', function(){ App.handleBalance(); });
  },


  populateAddress : function(){ 
 
    new Web3(new Web3.providers.HttpProvider('http://localhost:9545')).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_create_address').append(optionElement);
          if(web3.eth.coinbase != accounts[i]){
            jQuery('#enter_send_address').append(optionElement);  
          }
      });
    });
  },

  getMinter : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance.minter();
    }).then(function(result) {
      App.minter = result;
      jQuery('#minter').text("Minter : "+result);
      if(App.minter != App.currentAccount){
        jQuery('#create_token').css('display','none');
        jQuery('#send_token').css('width','50%');
        jQuery('#balance_token').css('width','50%');
      }else{
        jQuery('#create_token').css('display','block');
        jQuery('#send_token').css('width','30%');
        jQuery('#balance_token').css('width','30%');
      }
    })
  },

  handleMint: function(addr,value){
      if(App.currentAccount != App.minter){
        alert("Not Authorised to create token");
        return false;
      }
      var tokenInstance;
      App.contracts.vote.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.mint(addr,value);
      }).then( function(result){
        if(result.receipt.status == '0x01' || result.receipt.status == '0x1')
          alert(value +" token created successfully to "+addr);
        else
          alert("Creation failed: " + (result.receipt.status))
      }).catch( function(err){
        console.log(err.message);
      })
  },

  handleTransfer: function(addr,content) {

    if(addr == ""){
      alert("Please select an adrdess");
      return false;
    }
    if(content == ""){
      alert("Please enter valid content");
      return false;
    }

    var tokenInstance;
    App.contracts.vote.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.transfer(addr,content);
    }).then( function(result){

      // Watching Events 
      
      if(result.receipt.status != '0x01' && result.receipt.status != '0x1')
          alert("Transfer failed");
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        var singularText = "token was";
        if(log.args.amount == 1){
          singularText = "token was";
        }
        
        // Look for the event Sent
        // Notification 
        if (log.event == "Sent") {
          var text = 'token transfer: ' +singularText + 
              ' sent from ' + log.args.from +
              ' to ' + log.args.to + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
      return tokenInstance.balances(App.currentAccount);
    }).catch( function(err){
      console.log(err.message);
    })
  },

  handleBalance : function(){
    App.contracts.vote.deployed().then(function(instance) {
      console.log(jQuery('#content_string').val())
      return instance.ownership(jQuery('#content_string').val())
    }).then(function(result) {
      console.log(result)
      jQuery('#owner_account').val(result);
    })
  }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});
