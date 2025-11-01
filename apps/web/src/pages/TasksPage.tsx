import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { useTasksGetAll } from "@/hooks/useTasksGetAll";
import type { ITask } from "@/interfaces/tasks.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useEffect } from "react";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { EditTaskModal } from "@/components/EditTaskModal";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import { CustomToaster } from "@/components/CustomToaster";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useCreateTaskAssignment } from "@/hooks/useCreateTaskAssignment";
import { useAuth } from "@/context/AuthContext";
import type { CreateTaskFormValues } from "@/schemas/create-task.schema";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

const ITEMS_PER_PAGE = 6;

export function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useTasksGetAll(
    currentPage,
    ITEMS_PER_PAGE
  );

  const { mutate: createTask } = useCreateTask();
  const { mutate: joinTask } = useCreateTaskAssignment();
  const { user } = useAuth();

  const filteredTasks = useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    if (searchTerm) {
      filtered = filtered.filter((task: ITask) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((task: ITask) => task.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      filtered = filtered.filter(
        (task: ITask) => task.priority === priorityFilter
      );
    }

    return filtered;
  }, [data?.data, searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL";

  const totalPages = data?.totalPages || 0;
  const total = data?.total || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);

  const handleCreateTask = async (newTaskData: CreateTaskFormValues) => {
    try {
      setIsCreating(true);
      createTask(newTaskData);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinTask = (taskId: string) => {
    if (!user?.id) {
      console.error("Usuário não autenticado");
      return;
    }

    joinTask({
      user_id: user.id,
      task_id: taskId,
    });
  };

  const handleEditTask = (task: ITask) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (updatedData: CreateTaskFormValues) => {
    if (!taskToEdit) return;

    try {
      setIsEditing(true);
      console.log("Atualizar tarefa:", taskToEdit.id, updatedData);
      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteTask = (task: ITask) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      setIsDeleting(true);
      console.log("Excluir tarefa:", taskToDelete.id);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas tarefas e projetos
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <CreateTaskModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleCreateTask}
          isLoading={isCreating}
        />

        <EditTaskModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdateTask}
          task={taskToEdit}
          isLoading={isEditing}
        />

        <DeleteTaskDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          task={taskToDelete}
          isLoading={isDeleting}
        />

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Status</SelectItem>
                  <SelectItem value="TODO">A Fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas Prioridades</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredTasks.length} de {total} tarefa(s)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Tarefas</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {total} tarefas
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!error && isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredTasks.length > 0 ? (
                <>
                  {filteredTasks.map((task: ITask) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onJoinTask={handleJoinTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {hasActiveFilters
                      ? "Nenhuma tarefa encontrada com os filtros aplicados."
                      : "Nenhuma tarefa cadastrada."}
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-center">
                  Ocorreu um erro ao carregar as tarefas.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <CustomToaster />
    </MainLayout>
  );
}
