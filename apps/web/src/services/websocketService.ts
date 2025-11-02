import { io } from "socket.io-client";
import type { CreateNotificationDto } from "@my-monorepo/shared-dtos";

type Socket = any;
type NotificationCallback = (notification: CreateNotificationDto) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: NotificationCallback[] = [];

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io("http://localhost:3009/notifications", {
      auth: {
        token,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connected", (data: any) => {
      console.log("WebSocket conectado:", data);
    });

    this.socket.on("error", (error: any) => {
      console.error("WebSocket erro:", error);
    });

    this.socket.on("notification", (notification: CreateNotificationDto) => {
      console.log("Notificação recebida:", notification);
      this.listeners.forEach((callback) => callback(notification));
    });

    this.socket.on(
      "taskNotification",
      (notification: CreateNotificationDto) => {
        console.log("Task-Notificação recebida:", notification);
        this.listeners.forEach((callback) => callback(notification));
      }
    );

    this.socket.on("connect", () => {
      console.log("WebSocket conectado com sucesso");
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("WebSocket desconectado:", reason);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Erro ao conectar WebSocket:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = [];
      console.log("WebSocket desconectado");
    }
  }

  onNotification(callback: NotificationCallback) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  joinTask(taskId: string) {
    if (!this.socket) return;
    this.socket.emit("joinTask", { taskId });
  }

  leaveTask(taskId: string) {
    if (!this.socket) return;
    this.socket.emit("leaveTask", { taskId });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const websocketService = new WebSocketService();
