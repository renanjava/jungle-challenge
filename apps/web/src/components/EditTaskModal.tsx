/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "@/schemas/create-task.schema";
import type {
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from "@my-monorepo/shared-dtos";
import type { ITask } from "@/interfaces/tasks.interface";

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateTaskDto) => void;
  task: ITask | null;
  isLoading?: boolean;
}

export function EditTaskModal({
  open,
  onOpenChange,
  onSubmit,
  task,
  isLoading = false,
}: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      priority: "MEDIUM",
      status: "TODO",
    },
  });

  useEffect(() => {
    if (task && open) {
      const formattedDeadline = new Date(task.deadline)
        .toISOString()
        .split("T")[0];

      setValue("title", task.title);
      setValue("description", task.description);
      setValue("deadline", formattedDeadline);
      setValue("priority", task.priority);
      setValue("status", task.status);
    }
  }, [task, open, setValue]);

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const handleFormSubmit = (data: CreateTaskFormValues) => {
    onSubmit(data as any);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Atualize os campos abaixo para editar a tarefa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Digite o título da tarefa"
                disabled={isLoading}
                {...register("title")}
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva a tarefa..."
                rows={4}
                disabled={isLoading}
                {...register("description")}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Prazo *</Label>
              <Input
                id="deadline"
                type="date"
                disabled={isLoading}
                min={new Date().toISOString().split("T")[0]}
                {...register("deadline")}
              />
              {errors.deadline && (
                <span className="text-sm text-red-500">
                  {errors.deadline.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridade *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("priority", val as TaskPriority)
                  }
                  value={task?.priority}
                  disabled={isLoading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <span className="text-sm text-red-500">
                    {errors.priority.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  onValueChange={(val) => setValue("status", val as TaskStatus)}
                  value={task?.status}
                  disabled={isLoading}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">A Fazer</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                    <SelectItem value="REVIEW">Em Revisão</SelectItem>
                    <SelectItem value="DONE">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <span className="text-sm text-red-500">
                    {errors.status.message}
                  </span>
                )}
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
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
