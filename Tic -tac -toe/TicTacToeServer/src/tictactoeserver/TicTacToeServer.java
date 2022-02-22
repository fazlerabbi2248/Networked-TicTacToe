/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tictactoeserver;

/**
 *
 * @author Fazle Rabbi
 */


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class TicTacToeServer {
    public static void main(String[] args) throws Exception {
        char[] board = { '-', '-', '-', 
                         '-', '-', '-', 
                         '-', '-', '-' };
        ServerSocket listener = new ServerSocket(8901); // use TCP communication
        Socket socket;
        BufferedReader input;
        PrintWriter output;
        String strOutput = "";
        String mark;    // is it O or X
        String lastMove = "";   // store the last move made by the opponent
        char winner = ' ';  // ' ' if no winner decided, '-' if tie, 'X' if X win 'O' if O win
        char turn = 'X';
        int o_win = 0;  // counting the number of O wins
        int x_win = 0;  // counting the number of X wins
        String command; // command read from the client
        boolean isXReady = false,
                isOReady = false,
                isXRestarted = false,
                isORestarted = false;

        System.out.println("Tic Tac Toe Server is Running");
        try {
            while(true) {
                socket = listener.accept(); // listen to the client
                input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                command = input.readLine();
                
                if ( command.equals("DISCONNECT")) {
                    output = new PrintWriter(socket.getOutputStream(), true);
                    output.println("MESSAGE Click RESTART to restart the game without server");
                    System.out.println("QUIT");
                    break;
                } else if ( command.equals("CONNECT")) {
                    if ( !(isXReady && isOReady) ) {    // first player to connect
                        // the first one to connect is decided as player X
                        if ( isXReady )
                            mark = "O";
                        else
                            mark = "X";

                        try {
                            output = new PrintWriter(socket.getOutputStream(), true);
                            if ( isXReady )
                                isOReady = true;
                            else
                                isXReady = true;    // the first player is connected. set the flag to be true

                            strOutput += "WELCOME " + mark;
                            System.out.println("Player " + mark + " is connected");
                            if ( !isOReady ) 
                                strOutput += ";MESSAGE Waiting for opponent to connect";

                            output.println(strOutput);
                            strOutput = "";
                        } catch (IOException e) {
                            //System.out.println("Player died: " + e);
                        }
                    
                    // if there is another player trying to connect while there are already two 
                    // player connected to the server
                    } else {
                        output = new PrintWriter(socket.getOutputStream(), true);
                        output.println("MESSAGE The server is busy.");
                    }
                } else if ( command.startsWith("STATUS") ) {    // check status whether both player is ready
                    output = new PrintWriter(socket.getOutputStream(), true);
                    if (isOReady) {                        
                        if (command.charAt(7) == turn)
                            output.println("READY;MESSAGE Your turn.");
                        else
                            output.println("READY;MESSAGE Wait for X move.");
                    } else {
                        output.println("WAIT O");
                    }
                } else if ( command.startsWith("TURN") ) {  // check whose turn is this
                    output = new PrintWriter(socket.getOutputStream(), true);
                    // if the winner is already decided when the turn comes to the player
                    if (winner != ' ') {
                        int total;
                        if ( winner == 'X' )
                            // the value of x_win is decided when X player made a move which
                            // made him/her win
                            total = x_win;
                        else if ( winner == 'O' )
                            // the value of o_win is decided when O player made a move which
                            // made him/her win
                            total = o_win;
                        else
                            // no changes in value of x_win and o_win, it is a tie
                            total = 0;
                        
                        output.println("READY;WINNER " + winner + " " + total + ";" + lastMove);
                    } else if (command.charAt(5) == turn) { 
                        // the winner isn't decided yet and it's the requesting client turn
                        output.println("READY;MESSAGE Your turn.;" + lastMove);
                    } else {
                        // the winner isn't decided yet and it's not the requesting client turn
                        if ( lastMove.equals("") )
                            output.println("WAIT;MESSAGE Wait for " + turn + " move.");
                        else
                            output.println("WAIT;MESSAGE Valid move. Wait for " + turn + " move.");
                    }
                } else if ( command.startsWith("MOVE") ) { // set a position of a board as a player's position
                    // client's request format "MOVE X 3"
                    // X is the player
                    // 3 is the location/position
                    int location = Integer.parseInt(command.substring(7));
                    board[location] = command.charAt(5);
                    lastMove = command; // set the lastMove value, needed for the opponent to know this player move
                    output = new PrintWriter(socket.getOutputStream(), true);
                    
                    System.out.println(command.charAt(5) + " moved.");
                    for ( int i = 0; i < 9; i++ ) {
                        System.out.print(board[i] + " ");
                        if (i % 3 == 2)
                            System.out.println();
                    }
                    System.out.println();
                    
                    // if O's move makes O win
                    if ((board[0] == 'O' && board[1] == 'O' && board[2] == 'O') ||
                        (board[3] == 'O' && board[4] == 'O' && board[5] == 'O') ||
                        (board[6] == 'O' && board[7] == 'O' && board[8] == 'O') ||
                        (board[0] == 'O' && board[3] == 'O' && board[6] == 'O') ||
                        (board[1] == 'O' && board[4] == 'O' && board[7] == 'O') ||
                        (board[2] == 'O' && board[5] == 'O' && board[8] == 'O') ||
                        (board[0] == 'O' && board[4] == 'O' && board[8] == 'O') ||
                        (board[2] == 'O' && board[4] == 'O' && board[6] == 'O') ) {
                        winner = 'O';
                        o_win++;    // increment the number of x wins
                        output.println("MESSAGE O Wins.;WINNER O " + o_win);
                        System.out.println("Player O Win");
                        
                        // set both restarted flags to be false, needed for later if both player
                        // accept to restart the game without resetting the value of o_win and x_win
                        isXRestarted = isORestarted = false;
                    // if X's move makes X win
                    } else if ((board[0] == 'X' && board[1] == 'X' && board[2] == 'X') ||
                        (board[3] == 'X' && board[4] == 'X' && board[5] == 'X') ||
                        (board[6] == 'X' && board[7] == 'X' && board[8] == 'X') ||
                        (board[0] == 'X' && board[3] == 'X' && board[6] == 'X') ||
                        (board[1] == 'X' && board[4] == 'X' && board[7] == 'X') ||
                        (board[2] == 'X' && board[5] == 'X' && board[8] == 'X') ||
                        (board[0] == 'X' && board[4] == 'X' && board[8] == 'X') ||
                        (board[2] == 'X' && board[4] == 'X' && board[6] == 'X') ) {
                        winner = 'X';
                        x_win++;    // increment the number of x wins
                        output.println("MESSAGE X Wins.;WINNER X " + x_win);
                        System.out.println("Player X Win");
                        
                        isXRestarted = isORestarted = false;
                    // if O's or X's move makes it tie
                    } else if ((board[0] != '-' && board[1] != '-' && board[2] != '-') &&
                        (board[3] != '-' && board[4] != '-' && board[5] != '-') &&
                        (board[6] != '-' && board[7] != '-' && board[8] != '-')) {
                        winner = '-';
                        output.println("MESSAGE It's a tie.;WINNER - 0");
                        System.out.println("It's a tie");
                        
                        isXRestarted = isORestarted = false;
                    }
                    
                    if ( command.charAt(5) == 'X' )
                        turn = 'O';
                    else
                        turn = 'X';

                    output.println("MESSAGE Valid move. Wait for " + turn + " move.");
                } else if ( command.startsWith("RESTART") ) {
                    output = new PrintWriter(socket.getOutputStream(), true);
                    // The game will only be restarted if both player agrees to restart the game
                    if (command.charAt(8) == 'O')
                        isORestarted = true;
                    else if (command.charAt(8) == 'X')
                        isXRestarted = true;
                    
                    // reset the value
                    if (isXRestarted && isORestarted) {
                        turn = 'X';
                        winner = ' ';
                        lastMove = "";
                        board[0] = '-';
                        board[1] = '-';
                        board[2] = '-';
                        board[3] = '-';
                        board[4] = '-';
                        board[5] = '-';
                        board[6] = '-';
                        board[7] = '-';
                        board[8] = '-';
                        if ( command.charAt(8) == 'O' )
                            // tell O to wait for X move. the first move is by player X
                            output.println("MESSAGE Wait for " + turn + " move.;WAIT X");
                        else
                            // tell X to move first
                            output.println("MESSAGE Your move.;READY");
                        
                        System.out.println("The game is restarted.");
                    } else {
                        // if only one of both player requested to restart the game. one must wait for agreement
                        if (isXRestarted) {
                            output.println("MESSAGE Wait for O player to restart.;RESTART_WAIT O");
                            System.out.println("Player X request to restart the game.");
                        } else {
                            output.println("MESSAGE Wait for X player to restart.;RESTART_WAIT X");
                            System.out.println("Player O request to restart the game.");
                        }
                    }
                } 
            }
        } finally {
            listener.close();   // close the communication
        }
    }
}
