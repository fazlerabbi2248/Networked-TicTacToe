<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Tic Tac Toe game</title>
      
    <link rel='stylesheet' href='bootstrap/css/bootstrap.css' />
    <link rel="stylesheet" href="css/style.css" />
  </head>

  <body>


   
      <div id="tic-tac-toe">
          <div class="span3 new_span">
            <div class="row">
              <h1 class="span3">Tic Tac Toe</h1>
              
              <div class="span3">
                <div class="input-prepend input-append">
                  <span class="add-on win_text">Player</span>
                  <strong id="player" class="win_times add-on">X/O</strong>
                </div>
                
                <div class="input-prepend input-append">
                  <span class="add-on win_text">O won</span>
                  <strong id="o_win" class="win_times add-on">0</strong>
                  <span class="add-on">time(s)</span>
                </div>

                <div class="input-prepend input-append">
                  <span class="add-on win_text">X won</span>
                  <strong id="x_win" class="win_times add-on">0</strong>
                  <span class="add-on">time(s)</span>
                </div>
              </div>
            </div>

            <ul class="row" id="game">
              <li id="id0" class="btn span1" >+</li>
              <li id="id1" class="btn span1">+</li>
              <li id="id2" class="btn span1">+</li>
              <li id="id3" class="btn span1">+</li>
              <li id="id4" class="btn span1">+</li>
              <li id="id5" class="btn span1">+</li>
              <li id="id6" class="btn span1">+</li>
              <li id="id7" class="btn span1">+</li>
              <li id="id8" class="btn span1">+</li>
            </ul>
            <div class="clr">&nbsp;</div>
            
         <!--    This #connect is actually also used as button for "RESTART" --> 
          <div class="row"><a href="#" id="restart" class="btn-success btn span3" >Restart</a></div>
            <div class="row"><a href="#" id="connect" class="btn-success btn span3" >Connect</a></div>
            <div class="row"><a href="#" id="disconnect" class="btn-danger btn span3" >Disconnect</a></div>
            
            <br />
            <div id="message" class="alert alert-info" role="alert">
              Click CONNECT to connect to the server.
            </div>
        </div>
    </div>

   

      
    <script src='js/jquery-1.7.2.min.js'></script>
    <script src="js/index.js"></script>
  </body>
</html>