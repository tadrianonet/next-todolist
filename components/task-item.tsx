"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Edit, Save, Trash, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Importe os componentes do AlertDialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onToggleComplete: (id: string, completed: boolean) => void
  onUpdate: (id: string, title: string, description: string, due_date: string) => void
}

export function TaskItem({ task, onDelete, onToggleComplete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(task.due_date ? parseISO(task.due_date) : undefined)

  // Adicione um estado para controlar a abertura do diálogo de confirmação
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id!, title, description, dueDate ? dueDate.toISOString() : task.due_date)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description || "")
    setDueDate(task.due_date ? parseISO(task.due_date) : undefined)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  return (
    <Card className={`${task.completed ? "bg-muted/50" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id!, checked === true)}
            className="mt-1"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da tarefa" />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                  rows={3}
                />
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? (
                          format(dueDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data de vencimento</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`mt-1 text-sm ${task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                  >
                    {task.description}
                  </p>
                )}
                <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium">Data de vencimento:</span>{" "}
                    {task.due_date ? formatDate(task.due_date) : "Não definida"}
                  </p>
                  <p>
                    <span className="font-medium">Criada em:</span> {formatDate(task.created_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        {isEditing ? (
          <>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <>
              <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash className="h-4 w-4 mr-1" /> Excluir
              </Button>

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a tarefa "{task.title}"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(task.id!)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

