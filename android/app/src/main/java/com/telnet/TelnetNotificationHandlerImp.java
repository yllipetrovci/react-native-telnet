package com.telnet;

import org.apache.commons.net.telnet.TelnetNotificationHandler;

public class TelnetNotificationHandlerImp implements TelnetNotificationHandler {

    /***
     * Callback method called when TelnetClient receives an option
     * negotiation command.
     *
     * @param negotiation_code - type of negotiation command received
     * (RECEIVED_DO, RECEIVED_DONT, RECEIVED_WILL, RECEIVED_WONT, RECEIVED_COMMAND)
     * @param option_code - code of the option negotiated
     ***/
    @Override
    public void receivedNegotiation(int negotiation_code, int option_code)
    {
        String command = null;
        switch (negotiation_code) {
            case org.apache.commons.net.telnet.TelnetNotificationHandler.RECEIVED_DO:
                command = "DO";
                break;
            case org.apache.commons.net.telnet.TelnetNotificationHandler.RECEIVED_DONT:
                command = "DONT";
                break;
            case org.apache.commons.net.telnet.TelnetNotificationHandler.RECEIVED_WILL:
                command = "WILL";
                break;
            case org.apache.commons.net.telnet.TelnetNotificationHandler.RECEIVED_WONT:
                command = "WONT";
                break;
            case org.apache.commons.net.telnet.TelnetNotificationHandler.RECEIVED_COMMAND:
                command = "COMMAND";
                break;
            default:
                command = Integer.toString(negotiation_code); // Should not happen
                break;
        }


        System.out.println("command:"+command+" option code:"+option_code);
    }
}
