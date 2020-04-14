package com.telnet;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.ReadableMap;

// Internal depedencies
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.net.telnet.TelnetClient;
import org.apache.commons.net.telnet.EchoOptionHandler;
import org.apache.commons.net.telnet.TerminalTypeOptionHandler;
import org.apache.commons.net.telnet.SuppressGAOptionHandler;
import org.apache.commons.net.telnet.InvalidTelnetOptionException;

public class TelnetClientModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public TelnetClient telnetClient = null;
    public TelnetClientConfig telnetClientConfig = null;
    static Thread reader = null;
    static MessageHolder messageHolder = new MessageHolder("");

    TelnetClientModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "TelnetClient";
    }

    public void authenticate(TelnetClient telnetClient, TelnetClientConfig telnetConfig) {
        sendInternalCommand(telnetConfig.getUsername());
        sendInternalCommand(telnetConfig.getPassword());
    }

    public void sendInternalCommand(String command) {
        try {
            OutputStream outputStream = this.telnetClient.getOutputStream();
            writeCommandToStream(outputStream, command);
            Thread.currentThread().sleep(1200); // TODO: Remove
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void connect(ReadableMap config,Callback onSuccessCallback, Callback onErrorCallback) {
        //Parse the data fro
        String ipAddress = config.getString("ipAddress");
        String port = config.getString("port");
        String username = config.getString("username");
        String password = config.getString("password");

        telnetClientConfig = new TelnetClientConfig(ipAddress, Integer.parseInt(port), username, password);
        telnetClient = new TelnetClient("VT100");

        // Connect to telnet terminal
        try {
            this.telnetClient.connect(this.telnetClientConfig.getRemoteIpAddress(), this.telnetClientConfig.getPort());
            this.telnetClient.registerNotifHandler(new TelnetNotificationHandlerImp());
            this.addOptionalConnectionHandlers(this.telnetClient);
            Thread.currentThread().sleep(2000); // TODO: Remove
            Thread reader = new Thread(
                    new TelnetResponseMessageHandler(telnetClient, messageHolder, onSuccessCallback, onErrorCallback));
            reader.start();
            // Thread.currentThread().sleep(3000); // TODO: Remove
        } catch (IOException e) {

            System.err.println("Exception while connecting:" + e.getMessage());
            onErrorCallback.invoke("Exception while connecting:" + e.getMessage());

        } catch (InterruptedException e) {
            System.err.println("Exception while connecting:" + e.getMessage());
            onErrorCallback.invoke("Exception while connecting:" + e.getMessage());
        } catch (InvalidTelnetOptionException e) {
            onErrorCallback.invoke("invalid telnet exception" + e.getMessage());
        }catch (NumberFormatException e){
            System.out.print("Number format exception");
        }

        if (!(this.telnetClientConfig.getUsername().isEmpty() || this.telnetClientConfig.getPassword().isEmpty())) {
            this.authenticate(this.telnetClient, this.telnetClientConfig);
        }
        WritableNativeArray response = new WritableNativeArray();
        response.pushString(ipAddress);
        response.pushString(port);
        response.pushString(username);
        response.pushString(password);


        // onSuccessCallback.invoke("Connection successful");
        onSuccessCallback.invoke(response);

    }

    @ReactMethod
    private void disconnect(Callback onSuccessCallback, Callback onErrorCallback) {
        try {
            if(telnetClient != null){
                telnetClient.disconnect();
            }
                onSuccessCallback.invoke("Successfully disconnected");
        } catch (IOException e) {
            System.err.println("Exception while connecting:" + e.getMessage());
            onErrorCallback.invoke(String.format("Failed to disconnected: {}", e.getMessage()));
        } finally {
            // if(render != null) reader.interrupt();
            // we should look when we have to interrupt reader thread
        }
    }

    @ReactMethod
    public void sendCommand(String command, Callback onSuccessCallback, Callback onErrorCallback) {
        Thread executingCommandThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    messageHolder.reset();
                    OutputStream outputStream = telnetClient.getOutputStream();
                    writeCommandToStream(outputStream, command);
                    Thread.currentThread().sleep(2000); // TODO: Remove

                    StringTokenizer stringTokenizer = new StringTokenizer(messageHolder.getMessage());
                    WritableNativeArray response = new WritableNativeArray();

                    while (stringTokenizer.hasMoreTokens()) {
                        String line = stringTokenizer.nextToken("\r\n");
                        System.out.println(line);
                        if (line.equals(command))
                            continue;
                        if (line.contains("Unknown command or computer name")) {
                            onErrorCallback.invoke(line);
                            break;
                        }

                        if (!line.isEmpty())
                            response.pushString(line);
                    }
                    ;

                    onSuccessCallback.invoke(response);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    onErrorCallback.invoke("Failed to send command, something went wrong. Please try again!");
                } catch (IOException e) {
                    onErrorCallback.invoke("Failed to send command, something went wrong. Please try again!");
                    e.printStackTrace();
                }

            }
        });
        try {
            executingCommandThread.join();
            executingCommandThread.start();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void writeCommandToStream(OutputStream outstr, String command) throws IOException {
        byte[] commandBytes = (command + "\r\n").getBytes();
        int commandBytesLength = command.length() + 1;
        outstr.write(commandBytes, 0, commandBytesLength);
        outstr.flush();
    }

    public void addOptionalConnectionHandlers(TelnetClient telnetClient)
            throws InvalidTelnetOptionException, IOException {
        TerminalTypeOptionHandler ttopt = new TerminalTypeOptionHandler("VT100", false, false, true, false);
        EchoOptionHandler echoopt = new EchoOptionHandler(true, false, true, false);
        SuppressGAOptionHandler gaopt = new SuppressGAOptionHandler(true, true, true, true);

        telnetClient.addOptionHandler(ttopt);
        telnetClient.addOptionHandler(echoopt);
        telnetClient.addOptionHandler(gaopt);
    }
}