import { API_URL } from "@/lib/api-client/constants";
import { Notification } from "@/types/interfaces";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

let connection: signalR.HubConnection | null = null;
let startingPromise: Promise<void> | null = null;

export const startNotificationConnection = async (
  token: string,
  onNotification: (notification: Notification) => void
) => {
  try {
    if (!token) {
      console.error("No token provided for SignalR connection");
      return null;
    }

    // Prevent race: if a start is in progress, wait and reuse
    if (startingPromise) {
      console.log("SignalR start in progress, waiting...");
      await startingPromise;
      if (
        connection &&
        connection.state === signalR.HubConnectionState.Connected
      ) {
        return connection;
      }
    }

    // If there is an existing connection, reuse it if possible
    if (connection) {
      if (
        connection.state === signalR.HubConnectionState.Connected ||
        connection.state === signalR.HubConnectionState.Connecting
      ) {
        return connection;
      }
      if (connection.state === signalR.HubConnectionState.Disconnecting) {
        console.log("Waiting for existing SignalR connection to stop...");
        await connection.stop();
      }
      connection = null;
    }

    console.log("Creating new SignalR connection...");
    const hubBaseUrl = API_URL.replace(/\/api$/, "");
    // Create new connection
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBaseUrl}/notificationHub`, {
        accessTokenFactory: () => token,
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

    // Start the connection with race guard
    console.log("Starting SignalR connection...");
    startingPromise = connection.start();
    await startingPromise;
    startingPromise = null;
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
    if (startingPromise) {
      // Avoid stopping before start completes
      await startingPromise;
    }
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
  const handlerRef = useRef(onNotification);
  useEffect(() => {
    handlerRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!token) {
      console.log("No token provided to useNotificationSetup");
      return;
    }

    console.log("Setting up notification connection...");
    startNotificationConnection(token, (n) => {
      handlerRef.current(n);
      console.log("notification in hook", n);
    }).catch((error) => {
      console.error("Failed to setup notification connection:", error);
    });

    return () => {
      stopNotificationConnection().catch((error) => {
        console.error("Failed to stop notification connection:", error);
      });
    };
  }, [token]);
};
