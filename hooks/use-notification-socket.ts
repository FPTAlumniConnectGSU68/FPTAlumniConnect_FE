import { API_URL } from "@/lib/api-client/constants";
import * as signalR from "@microsoft/signalr";
import { Notification } from "@/types/interfaces";
import { useEffect } from "react";

let connection: signalR.HubConnection | null = null;

export const startNotificationConnection = async (
  token: string,
  onNotification: (notification: Notification) => void
) => {
  try {
    if (!token) {
      console.error("No token provided for SignalR connection");
      return null;
    }

    // If there's an existing connection, stop it first
    if (connection) {
      console.log("Stopping existing SignalR connection...");
      await connection.stop();
      connection = null;
    }

    console.log("Creating new SignalR connection...");

    // Create new connection
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notificationHub`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true, // Try skipping negotiation
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retry with increasing delays
      .configureLogging(signalR.LogLevel.Debug) // Enable debug logging
      .build();

    // Set up connection event handlers
    connection.onreconnecting((error) => {
      console.log("Reconnecting to SignalR hub...", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("Reconnected to SignalR hub.", connectionId);
    });

    connection.onclose((error) => {
      console.log("SignalR connection closed.", error);
    });

    // Set up notification handler
    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("Received notification:", notification);
      onNotification(notification);
    });

    // Start the connection
    console.log("Starting SignalR connection...");
    await connection.start();
    console.log("SignalR connected successfully");

    return connection;
  } catch (error) {
    console.error("SignalR connection error:", error);
    // Try to get more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    throw error;
  }
};

export const stopNotificationConnection = async () => {
  try {
    if (connection) {
      console.log("Stopping SignalR connection...");
      await connection.stop();
      connection = null;
      console.log("SignalR connection stopped");
    }
  } catch (error) {
    console.error("Error stopping SignalR connection:", error);
    throw error;
  }
};

// React hook for components to use notifications
export const useNotificationSetup = (
  token: string,
  onNotification: (notification: Notification) => void
) => {
  useEffect(() => {
    if (!token) {
      console.log("No token provided to useNotificationSetup");
      return;
    }

    console.log("Setting up notification connection...");
    startNotificationConnection(token, onNotification).catch((error) => {
      console.error("Failed to setup notification connection:", error);
    });

    return () => {
      stopNotificationConnection().catch((error) => {
        console.error("Failed to stop notification connection:", error);
      });
    };
  }, [token, onNotification]);
};
