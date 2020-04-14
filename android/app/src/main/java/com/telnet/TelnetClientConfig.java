package com.telnet;

import java.io.Serializable;

public class TelnetClientConfig implements Serializable {

    private String remoteIpAddress;
    private int port;
    private String username;
    private String password;

    public TelnetClientConfig(String remoteIpAddress, int port, String username, String password) {
        this.remoteIpAddress = remoteIpAddress;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    public TelnetClientConfig(String remoteIpAddress, int port) {
        this.remoteIpAddress = remoteIpAddress;
        this.port = port;
    }

    public String getRemoteIpAddress() {
        return remoteIpAddress;
    }

    public void setRemoteIpAddress(String remoteIpAddress) {
        this.remoteIpAddress = remoteIpAddress;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return String.format("TelnetConfig = [ ipAddress: {}, port: {}, username: {}, password: {} ]");
    }
}
