"use client"

import { useEffect, useState } from "react"
import type { Task } from "@/lib/types"
import { TaskItem } from "./task-item"
import { Loader2 } from "lucide-react"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
      })
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      // Encontrar a tarefa atual para manter os outros campos
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          completed,
        }),
      })

      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  const handleUpdate = async (id: string, title: string, description: string, due_date: string) => {
    try {
      // Encontrar a tarefa atual para manter os outros campos
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          title,
          description,
          due_date,
        }),
      })

      setTasks(tasks.map((task) => (task.id === id ? { ...task, title, description, due_date } : task)))
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      {tasks === null ? (
        <p className="text-center text-muted-foreground py-10">Nenhuma tarefa encontrada. Adicione uma nova tarefa!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            onUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  )
}

