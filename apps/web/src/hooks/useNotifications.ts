import { useEffect } from "react";
import { websocketService } from "@/services/websocketService";
import type { CreateNotificationDto } from "@my-monorepo/shared-dtos";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export const useNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleNotification = (notification: CreateNotificationDto) => {
      if (
        notification.user_id &&
        notification.user_id !== user?.id &&
        notification.payload?.userId !== user?.id
      ) {
      }
      const title = notification.payload?.title || "Nova notificação";

      switch (notification.type) {
        case "TASK_ASSIGNED":
          toast.success(title);
          break;

        case "STATUS_CHANGE":
          toast(title);
          break;

        case "NEW_COMMENT":
          toast(title);
          break;

        default:
          toast(title);
      }
    };

    const unsubscribe = websocketService.onNotification(handleNotification);

    return () => {
      unsubscribe();
    };
  }, []);
};
