package com.telnet;

public class MessageHolder {
    public StringBuilder stringBuilder;
    public String initialMessage;

    public  MessageHolder() {
        this.initialMessage = "";
        this.stringBuilder = new StringBuilder(initialMessage);
    }

    public  MessageHolder(String initialMessage) {
        this.initialMessage = initialMessage;
        this.stringBuilder = new StringBuilder(initialMessage);
    }
 
    public void appendMessage(String message) {
        stringBuilder.append(message);
    }

    public String getMessage() {
        return stringBuilder.toString();
    }

    public void reset() {
        this.stringBuilder = new StringBuilder(initialMessage);
    }
    public void resetWithInitialMessage() {
        this.initialMessage = initialMessage;
        this.stringBuilder = new StringBuilder(initialMessage);
    }
}