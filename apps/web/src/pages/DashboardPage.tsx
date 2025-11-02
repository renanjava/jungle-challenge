import { MainLayout } from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
} from "lucide-react";

export function DashboardPage() {
  const { user } = useAuth();

  useNotifications();

  const stats = [
    {
      label: "Tarefas Totais",
      value: "X",
      icon: CheckCircle,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "Em Andamento",
      value: "X",
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      label: "Urgentes",
      value: "X",
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    {
      label: "Concluídas",
      value: "X",
      icon: TrendingUp,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
  ];

  const recentActivity = [
    {
      icon: Users,
      title: "Nova atribuição",
      description: "Você foi atribuído à tarefa 'Implementar WebSocket'",
      time: "Há 5 minutos",
      color: "text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Novo comentário",
      description: "Maria comentou na tarefa 'Review do código'",
      time: "Há 1 hora",
      color: "text-purple-600",
    },
    {
      icon: CheckCircle,
      title: "Status alterado",
      description: "Tarefa 'Correção de bugs' foi marcada como concluída",
      time: "Há 2 horas",
      color: "text-green-600",
    },
    {
      icon: Bell,
      title: "Lembrete",
      description: "Prazo da tarefa 'Documentação' vence amanhã",
      time: "Há 3 horas",
      color: "text-orange-600",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.name || user?.email?.split("@")[0] || "Usuário"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao seu painel de controle. Aqui está um resumo das suas
            atividades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgLight} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Atividades Recentes (Apenas exemplos)
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${activity.color} mt-1`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">Sistema Online</h3>
              </div>
              <p className="text-sm text-blue-100">
                WebSocket conectado! Você receberá notificações em tempo real
                sobre atualizações nas suas tarefas.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Resumo Semanal (Apenas exemplos)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Taxa de Conclusão
                  </span>
                  <span className="font-semibold text-green-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tarefas Criadas</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comentários</span>
                  <span className="font-semibold text-gray-900">34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Colaborações</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Informações da Conta
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    ID do Usuário
                  </p>
                  <p className="text-sm font-mono text-gray-900 mt-1 break-all">
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-2">💡 Dica do Dia</h3>
          <p className="text-purple-800">
            Use notificações em tempo real para se manter atualizado sobre
            mudanças nas tarefas. Você receberá alertas quando alguém comentar,
            alterar o status ou entrar em uma tarefa que você está participando!
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
