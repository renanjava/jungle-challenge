import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { useTasksGetAll } from "@/hooks/useTasksGetAll";
import type { ITask } from "@/interfaces/tasks.interface";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

export function TasksPage() {
  const { data, isLoading, error } = useTasksGetAll();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas tarefas e projetos
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-6">
              {!error && isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-2">
                      <Skeleton className="h-4 w-1/3" /> {}
                      <Skeleton className="h-3 w-2/3" /> {}
                    </div>
                  ))}
                </div>
              ) : (
                data?.map((task: ITask) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
              {error && (
                <p className="text-red-500">
                  Ocorreu um erro ao carregar as tarefas.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
