import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
//import { TaskPriority, TaskStatus } from "@my-monorepo/shared-dtos";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    deadline: string;
    priority: string;
    status: string;
  }) => void;
  isLoading?: boolean;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [status, setStatus] = useState<string>("TODO");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
      deadline,
      priority,
      status,
    });

    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("MEDIUM");
    setStatus("TODO");
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Digite o título da tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva a tarefa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">
                Prazo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                disabled={isLoading}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">
                  Prioridade <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as string)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"LOW"}>Baixa</SelectItem>
                    <SelectItem value={"MEDIUM"}>Média</SelectItem>
                    <SelectItem value={"HIGH"}>Alta</SelectItem>
                    <SelectItem value={"URGENT"}>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as string)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"TODO"}>A Fazer</SelectItem>
                    <SelectItem value={"IN_PROGRESS"}>Em Progresso</SelectItem>
                    <SelectItem value={"REVIEW"}>Em Revisão</SelectItem>
                    <SelectItem value={"DONE"}>Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
