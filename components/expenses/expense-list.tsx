'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-blue-100 text-blue-800',
      Transportation: 'bg-green-100 text-green-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Utilities: 'bg-orange-100 text-orange-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Healthcare: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.Other
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No expenses found. Add your first expense to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map(expense => (
        <Card key={expense.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{expense.description}</h3>
                  <Badge className={getCategoryColor(expense.category)}>
                    {expense.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(expense.date), 'PPP')}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  ${expense.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}