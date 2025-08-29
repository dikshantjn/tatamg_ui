import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { API_CONFIG } from "../config/api.config";

const SOCKET_SERVER_URL = API_CONFIG.SOCKET_URL;

export const useSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (!userId) {
      setError("User ID is required for socket connection");
      return;
    }

    try {
      socketRef.current = io(SOCKET_SERVER_URL, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        upgrade: true,
        path: "/socket.io/",
        query: { userId },
      });

      /** 🔹 Main events */
      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected");
        setIsConnected(true);
        setError(null);
        socketRef.current.emit("register", userId);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.warn("⚠️ Socket disconnected:", reason);
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (err) => {
        console.warn("⚠️ Socket connection error:", err.message);
        setIsConnected(false);
        setError(err.message);
      });

      socketRef.current.on("error", (err) => {
        console.warn("⚠️ Socket error:", err.message);
        setError(err.message);
      });

      /** 🔹 Engine.IO low-level errors */
      socketRef.current.io.on("error", (err) => {
        console.warn("⚠️ Transport error:", err.message);
      });

      /** 🔹 Reconnect lifecycle */
      socketRef.current.io.on("reconnect_attempt", (attempt) => {
        console.log(`🔄 Reconnect attempt #${attempt}`);
      });

      socketRef.current.io.on("reconnect", (attempt) => {
        console.log(`✅ Reconnected after ${attempt} tries`);
        setIsConnected(true);
        setError(null);
      });

      socketRef.current.io.on("reconnect_failed", () => {
        console.error("❌ Reconnect failed, giving up");
        setIsConnected(false);
      });
    } catch (err) {
      console.error("❌ Socket initialization error:", err);
      setError(err.message);
    }
  }, [userId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const subscribe = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const unsubscribe = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  const emit = useCallback(
    (event, data) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit(event, data);
      }
    },
    [isConnected]
  );

  /** 🔹 Connect on mount, disconnect on unmount */
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    emit,
  };
};
