import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Loader2, MessageSquare } from "lucide-react";
import { useCommentsGetAll } from "@/hooks/useCommentsGetAll";
import { useAuth } from "@/context/AuthContext";
import { useCreateComments } from "@/hooks/useCreateComments";
import { websocketService } from "@/services/websocketService";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export function CommentsModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}: CommentsModalProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { data, isLoading } = useCommentsGetAll(taskId);
  const { mutate, isPending } = useCreateComments();
  const { user } = useAuth();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    mutate(
      {
        data: { text: newComment, user_id: user!.id },
        id: taskId,
      },
      {
        onSuccess: () => {
          setNewComment("");
          setIsAddingComment(false);
        },
      }
    );
  };

  const comments = data?.data || [];
  useEffect(() => {
    if (isOpen) {
      websocketService.joinTask(taskId);
    }
    return () => {
      websocketService.leaveTask(taskId);
    };
  }, [isOpen, taskId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Comentários - {taskTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {!isAddingComment ? (
            <Button
              onClick={() => setIsAddingComment(true)}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Comentário
            </Button>
          ) : (
            <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
              <Textarea
                placeholder="Digite seu comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingComment(false);
                    setNewComment("");
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-blue-600">
                        {comment.user_id.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <span className="text-xs text-muted-foreground">
                            Usuário: {comment.user_id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
