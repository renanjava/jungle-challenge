import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { ITask } from "@/interfaces/tasks.interface";

const priorityConfig = {
  LOW: { label: "Baixa", color: "bg-blue-100 text-blue-800" },
  MEDIUM: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
  HIGH: { label: "Alta", color: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-800" },
};

const statusConfig = {
  TODO: { label: "A Fazer", color: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "Em Progresso", color: "bg-blue-100 text-blue-800" },
  REVIEW: { label: "Em Revisão", color: "bg-purple-100 text-purple-800" },
  DONE: { label: "Concluída", color: "bg-green-100 text-green-800" },
};

interface TaskCardProps {
  task: ITask;
  //: (id: string) => void;
}

export function TaskCard({ task /*onShowDetails*/ }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <CardTitle className="text-lg flex-1 min-w-0">{task.title}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${priority.color}`}
            >
              {priority.label}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Prazo: {new Date(task.deadline).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 w-full sm:w-auto"
            >
              Exibir Comentários
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              Ingressar na tarefa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
