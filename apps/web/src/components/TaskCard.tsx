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
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}
            >
              {priority.label}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Prazo: {new Date(task.deadline).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <Button
          //onClick={() => onShowDetails(task.id)}
          //className="bg-green-600 hover:bg-green-700"
          >
            Exibir Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
