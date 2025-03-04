import TaskList from "@/components/task-list"
import { AddTaskForm } from "@/components/add-task-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerenciador de Tarefas</h1>
      <AddTaskForm />
      <TaskList />
    </main>
  )
}

