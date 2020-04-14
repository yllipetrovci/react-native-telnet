package com.telnet;

import org.apache.commons.net.telnet.TelnetClient;

import java.io.IOException;
import java.io.InputStream;
// React package
import com.facebook.react.bridge.Callback;


public class TelnetResponseMessageHandler implements Runnable {
    private TelnetClient telnetClient = null;
    private MessageHolder messageHolder = null;
    private Callback onSuccessCallback;
    private Callback onErrorCallback;


    // TODO: Add onSuccessfulCallback and onErrorCallback
   TelnetResponseMessageHandler(TelnetClient telnetClient, MessageHolder messageHolder, Callback onSuccessCallback, Callback onErrorCallback) {
        this.telnetClient = telnetClient;
        this.messageHolder = messageHolder;
        this.onSuccessCallback = onSuccessCallback;
        this.onErrorCallback = onErrorCallback;
    }

    /***
     * Reader thread.
     * Reads lines from the TelnetClient and echoes them
     * on the screen.
     ***/
    @Override
    public void run() {
        InputStream instr = telnetClient.getInputStream();
        try {
            byte[] buff = new byte[1024];
            int ret_read = 0;

            do {
                if (!Thread.currentThread().isInterrupted()) {
                    ret_read = instr.read(buff);
                    if (ret_read > 0) {
//                    System.out.print(new String(buff, 0, ret_read));
                        messageHolder.appendMessage(new String(buff, 0, ret_read));
                    }
                }
            }
            while (ret_read > 0 && !Thread.currentThread().isInterrupted());
        } catch (IOException e) {
            System.err.println("Exception while reading socket:" + e.getMessage());
            // TODO: onErrorCallback - call
            this.onErrorCallback.invoke("Exception while reading socket:" + e.getMessage());
        }
    }
}

