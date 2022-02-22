/**
 * note
 * -related to restart button. there are two restart button
 *  if the game isn't connected to the server, the restart button appeared is #restart
 *  but if the game is connected to the server, the restart button appeared to the player
 *  is actually #connect which having this.html("Restart")
*/

var x = "x"
var o = "o"
var count = 0;
var o_win = 0;  // the number of o wins
var x_win = 0;  // the number of x wins
var connected = false;  // true if connected to the server
var ready = false;      // true if it's time for this player turn
var started = false;    // true if both players are connected
var roundFinished = false;  // true if the round is finished and need to restart if want to continue
var player = 'X/O';     // default player. both player x and o can be played on the same page
var lastMove = '';      // to store the last move made by another player

$(document).ready(function() {
  $("#disconnect").hide();
  $("#restart").hide();
  
  // when a position in the board is clicked
  $('#game li').click(function() {
    // if it is not connected and the player is the default player
    if (!connected && player == 'X/O') {
      // if O has won the game
      if ($("#id0").hasClass('o') && $("#id1").hasClass('o') && $("#id2").hasClass('o') || 
          $("#id3").hasClass('o') && $("#id4").hasClass('o') && $("#id5").hasClass('o') || 
          $("#id6").hasClass('o') && $("#id7").hasClass('o') && $("#id8").hasClass('o') || 
          $("#id0").hasClass('o') && $("#id3").hasClass('o') && $("#id6").hasClass('o') || 
          $("#id1").hasClass('o') && $("#id4").hasClass('o') && $("#id7").hasClass('o') || 
          $("#id2").hasClass('o') && $("#id5").hasClass('o') && $("#id8").hasClass('o') || 
          $("#id0").hasClass('o') && $("#id4").hasClass('o') && $("#id8").hasClass('o') || 
          $("#id2").hasClass('o') && $("#id4").hasClass('o') && $("#id6").hasClass('o')) {
        alert('O has won the game. Start a new game')
        $("#restart").click();
        
      // if X has won the game
      } else if ($("#id0").hasClass('x') && $("#id1").hasClass('x') && $("#id2").hasClass('x') || 
                 $("#id3").hasClass('x') && $("#id4").hasClass('x') && $("#id5").hasClass('x') || 
                 $("#id6").hasClass('x') && $("#id7").hasClass('x') && $("#id8").hasClass('x') || 
                 $("#id0").hasClass('x') && $("#id3").hasClass('x') && $("#id6").hasClass('x') || 
                 $("#id1").hasClass('x') && $("#id4").hasClass('x') && $("#id7").hasClass('x') || 
                 $("#id2").hasClass('x') && $("#id5").hasClass('x') && $("#id8").hasClass('x') || 
                 $("#id0").hasClass('x') && $("#id4").hasClass('x') && $("#id8").hasClass('x') || 
                 $("#id2").hasClass('x') && $("#id4").hasClass('x') && $("#id6").hasClass('x')) {
        alert('X has won the game. Start a new game')
        $("#restart").click();
        
      // if it is a tie
      } else if (count == 9) {
        alert('Its a tie. It will restart.')
        $("#restart").click();
      
      // if the clicked position is already used
      } else if ($(this).hasClass('disable')) {
        alert('Already selected')
      
      // if it is X turn. remember that the count starts from 0
      } else if (count % 2 == 0) {
        count++;
        $(this).text(x)
        $(this).addClass('disable x btn-info')
        if ($("#id0").hasClass('x') && $("#id1").hasClass('x') && $("#id2").hasClass('x') || 
            $("#id3").hasClass('x') && $("#id4").hasClass('x') && $("#id5").hasClass('x') || 
            $("#id6").hasClass('x') && $("#id7").hasClass('x') && $("#id8").hasClass('x') || 
            $("#id0").hasClass('x') && $("#id3").hasClass('x') && $("#id6").hasClass('x') || 
            $("#id1").hasClass('x') && $("#id4").hasClass('x') && $("#id7").hasClass('x') || 
            $("#id2").hasClass('x') && $("#id5").hasClass('x') && $("#id8").hasClass('x') || 
            $("#id0").hasClass('x') && $("#id4").hasClass('x') && $("#id8").hasClass('x') || 
            $("#id2").hasClass('x') && $("#id4").hasClass('x') && $("#id6").hasClass('x')) {
          alert('X wins');
          count = 0;
          x_win++;
          $('#x_win').text(x_win)
        }
      
      // if count % 2 == 1. it is O turn
      } else {
        count++
        $(this).text(o)
        $(this).addClass('disable o btn-primary')
        if ($("#id0").hasClass('o') && $("#id1").hasClass('o') && $("#id2").hasClass('o') || 
            $("#id3").hasClass('o') && $("#id4").hasClass('o') && $("#id5").hasClass('o') || 
            $("#id6").hasClass('o') && $("#id7").hasClass('o') && $("#id8").hasClass('o') || 
            $("#id0").hasClass('o') && $("#id3").hasClass('o') && $("#id6").hasClass('o') || 
            $("#id1").hasClass('o') && $("#id4").hasClass('o') && $("#id7").hasClass('o') || 
            $("#id2").hasClass('o') && $("#id5").hasClass('o') && $("#id8").hasClass('o') || 
            $("#id0").hasClass('o') && $("#id4").hasClass('o') && $("#id8").hasClass('o') || 
            $("#id2").hasClass('o') && $("#id4").hasClass('o') && $("#id6").hasClass('o')) {
          alert('O wins')
          count = 0
          o_win++
          $('#o_win').text(o_win)
        }
      }
      
      // if the board is not empty
      if (count == 1)
        $("#restart").show();
    
    // if it is not connected to the server, but the player is not the default player
    // it means that the game just got disconnected from the server
    } else if (!connected) {
      alert("The game is disconnected. Start a new game.");
      $("#restart").click();
    
    // if it is connected to the server
    } else {
      // if a round finished. there is already a winner or it's tied
      if ( roundFinished ) {
        alert("Click RESTART to restart the game.");
      
      // if it's this player's turn
      } else if ( ready ) {
        if ($(this).hasClass('disable')) {
          alert('Already selected');
        } else if (player == 'X') {
          getServer("MOVE X " + $(this).prop('id')[2]);
          $(this).text('x');
          $(this).addClass('disable x btn-info');
        } else if (player == 'O') {
          getServer("MOVE O " + $(this).prop('id')[2]);
          $(this).text('o');
          $(this).addClass('disable o btn-primary');
        }
      
      // if it's not the time for this player's turn yet
      } else {
        // even the opponent isn't connected yet
        if ( !started )
          alert("Wait for O to connect.");
        // waiting for the opponent's move
        else
          alert("Wait for your opponent's move.");
      }
    }
  });
  
  $("#connect").click(function() {
    // if it's really the connect button labeled as connect, not the connect button labeled as restart button
    if ( $("#connect").html() == "Connect" ) {
      // just remind the player that after it's connected to the server, the score data will be lost
      // since the player already make some move, so this alert appear
      if ( count > 0 ) {
        goConnect = confirm("If the connection succeed. The current score data will be removed.\nAre you sure to connect?")
        if ( goConnect ) 
          getServer();
      } else {  // no movement made by user, just connect it to the server
        getServer();
      }
    
    // if it's #connect button which has this.html("Restart")
    } else {
      roundFinished = false;  // set it back to false, because after the winner is decided, roundFinished = true
      $("#connect").hide();
      $("#disconnect").show();
      getServer("RESTART " + player);
    }
  });
  
  $("#disconnect").click(function() {
    doDisconnect = confirm("Are you sure to disconnect?");
    
    if ( doDisconnect ) {     // the player agree to disconnect
      connected = false;
      $("#connect").html("Connect");
      $("#connect").show();
      $("#restart").show();
      
      getServer("DISCONNECT");
      roundFinished = true;
      $(this).hide();
    }
  });
  
  $("#restart").click(function() {
    $("#game li").text("+");
    $("#game li").removeClass('disable');
    $("#game li").removeClass('o');
    $("#game li").removeClass('x');
    $("#game li").removeClass('btn-primary');
    $("#game li").removeClass('btn-info');
    count = 0;
    $("#restart").hide();
    
    // if the restart button is clicked right after the game is disconnected from the server
    // the data hasn't been restored to the default values yet
    if (player != 'X/O') {
      ready = false;
      started = false;
      roundFinished = false;
      lastMove = '';
      x_win = 0;
      o_win = 0;
      player = 'X/O';
      
      $('#o_win').html(o_win);
      $('#x_win').html(x_win);
      $("#player").html(player);
      $("#message").html("Click CONNECT to connect to the server.");
    }
  });
});

function getServer(arg0, arg1) {
  input = ''; // variable which contains the data to be sent by using ajax json
  
  // if arg0 is not specified by function call
  if (typeof arg0 === 'undefined') {
    input += 'command=CONNECT';
    arg0 = '';
  } else {
    input += 'command=' + arg0;
  }
  

  if (typeof arg1 === 'undefined') {
    input += '&server=localhost';
    arg1 = '';
  } else {
    input += '&server=' + arg1;
  }
  
  $.ajax({
      type	   : 'get',
      url		   : 'ajax/connect.php',
      data     : input,
      dataType : 'json',
      success	 : function(response) {
        if (arg0.startsWith("STATUS")) {
          // the server will respond "READY" if both X and O player are connected
          // this respond is got by the player X which always perform checkPlayerStatus() 
          // until the O player is connected
          if (response[0].startsWith("READY")) {
            started = true;
            ready = true;
          
          // repeat doing it again
          } else {
            checkPlayerStatus();
          }
        } else if(arg0.startsWith("TURN")) {
          if ( response == null ) {
            connected = false;
            roundFinished = true;
            $("#connect").html("Connect");
            $("#connect").show();
            $("#restart").show();
            $("#disconnect").hide();
            alert("Your opponent is disconnected. The game ends.");
            $("#message").html("Click RESTART to restart the game without server");
          } else if (response[0].startsWith("READY")) {
            ready = true;
            
            if (response[1].startsWith("WINNER")) {
              if (response[1][7] == '-') {
                alert("It's a tie.");
                $("#message").html("It's a tie.");
              } else if (player != response[1][7]) {
                alert("You lose.");
                if ( player == 'X' ) {
                  $("#message").html("O Wins.");
                  $('#o_win').text(response[1][9]);
                } else {
                  $("#message").html("X Wins.");
                  $('#x_win').text(response[1][9]);
                }
              }
                
              $("#connect").html("RESTART");
              $("#connect").show();
              roundFinished = true;
            }
          }
          
          if ( !roundFinished )
            if (!ready) checkPlayerTurn();
        } else if (arg0 == 'CONNECT' || arg0 == '') {
            if (response == null) {
              alert("Connection failed.");
            } else if (response[0].startsWith("WELCOME")) {
              mark = response[0].charAt(8);
              //alert(mark);
              player = mark.toUpperCase();
              //alert(player);
              connected = true;

              $("#game li").text("+");
              $("#game li").removeClass('disable');
              $("#game li").removeClass('o');
              $("#game li").removeClass('x');
              $("#game li").removeClass('btn-primary');
              $("#game li").removeClass('btn-info');
              count = 0;
              o_win = 0;
              x_win = 0;

              $("#player").html(player);
              $("#connect").hide();
              $("#restart").hide();
              $("#disconnect").show();
            
              if (player == 'X') {
                checkPlayerStatus();
              } else {
                started = true;
                ready = false;
                checkPlayerTurn();
              }
            }
        } else if (arg0.startsWith("MOVE")) {
          if ( response == null ) {
            connected = false;
            $("#connect").html("Connect");
            $("#connect").show();
            $("#restart").show();
            $("#disconnect").hide();
            alert("Your opponent is disconnected. The game ends.");
            $("#message").html("Click RESTART to restart the game without server");
            roundFinished = true;
            
            $("#id" + arg0[7]).text('+');
            if (player == 'X')
              $("#id" + arg0[7]).removeClass('disable x btn-info');
            else
              $("#id" + arg0[7]).removeClass('disable o btn-primary');
          } else {
            if (response.length > 1) {
              if (response[1].startsWith("WINNER")) {
                if ( response[1][7] != '-' ) {
                  alert("You win.");
                  if ( player == 'X' ) {
                    $("#message").html("X Wins");
                    $('#x_win').text(response[1][9]);
                  } else {
                    $("#message").html("O Wins");
                    $('#o_win').text(response[1][9]);
                  }
                }

                roundFinished = true;
                $("#connect").html("RESTART");
                $("#connect").show();
              }
            } 
            
            if (response != null) {              
              ready = false;
              checkPlayerTurn();
            }
          }
        } else if (arg0.startsWith("RESTART")) {
          if ( response == null ) {
            connected = false;
            $("#connect").html("Connect");
            $("#connect").show();
            $("#restart").show();
            $("#disconnect").hide();
            alert("Your opponent is disconnected. The game ends.");
            
            $("#restart").click();
          } else {
            $("#message").html(response[0].substr(8));

            if (response[1].startsWith("WAIT") || response[1].startsWith("READY")) {
              $("#game li").text("+");
              $("#game li").removeClass('disable');
              $("#game li").removeClass('o');
              $("#game li").removeClass('x');
              $("#game li").removeClass('btn-primary');
              $("#game li").removeClass('btn-info');
            }

            ready = false;
            if ( response[1].startsWith("READY") ) {
              ready = true;
            } else if (response[1].startsWith("RESTART_WAIT")) {
              checkRestartStatus();
            } else if (response[1].startsWith("WAIT")) {
              checkPlayerTurn();
            }
          }
        }
        
        if ( response != null ) {
          if (response[0].startsWith("MESSAGE")) {
            $("#message").addClass('alert-info');
            $("#message").removeClass('alert-error');

            $("#message").html(response[0].substr(8));
          }

          if (response.length > 1) {
            if (response[1].startsWith("MESSAGE")) {
              if (!$("#message").hasClass('alert-info'))
                $("#message").addClass('alert-info');
              if ($("#message").hasClass('alert-error'))
                $("#message").removeClass('alert-error');

              $("#message").html(response[1].substr(8));
            }
          }

          if (response.length > 2) {
            if (response[2].startsWith("MOVE")) {
              if (lastMove == response[2]) {
                ready = false;
                checkPlayerTurn();
              } else {
                if (response[2][5] == 'X') {
                  $("#id" + response[2][7]).text(x);
                  $("#id" + response[2][7]).addClass('disable x btn-info');
                } else {
                  $("#id" + response[2][7]).text(o);
                  $("#id" + response[2][7]).addClass('disable o btn-primary');
                }
              }

              lastMove = response[2];
            } else if(response[2] == '') {
              ready = false;
              checkPlayerTurn();
            }
          }
        }
      }
  });
}

function checkPlayerStatus() {
  if ( !started ) {
    setTimeout(getServer("STATUS " + player), 200);
  }
}

function checkPlayerTurn() {
  if ( !ready ) {
    setTimeout(getServer("TURN " + player), 200);
  }
}

function checkRestartStatus() {
  setTimeout(getServer("RESTART " + player), 200);
}