
package tictactoeclient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 *
 * @author Fazle Rabbi
 */
public class TicTacToeClient {
    private static int PORT = 8901;
    private Socket socket;
    private BufferedReader in;
    private PrintWriter out;

    public TicTacToeClient(String serverAddress) throws Exception {
        socket = new Socket(serverAddress, PORT);
        in = new BufferedReader(new InputStreamReader(
            socket.getInputStream()));
        out = new PrintWriter(socket.getOutputStream(), true);
    }
    
    public void play(String command) throws Exception {
        String response;
        try {
            // write the request to server
            out.println(command);
            // read the response from server
            response = in.readLine();
            System.out.println(response);
        }
        finally {
            socket.close();
        }
    }
    
    public static void main(String[] args) throws Exception {
        String serverAddress = args[0];
        TicTacToeClient client = new TicTacToeClient(serverAddress);
        client.play(args[1]);
    }
}