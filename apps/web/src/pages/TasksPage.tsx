import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

export function TasksPage() {
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
            <p className="text-muted-foreground">
              Suas tarefas aparecerão aqui...
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
