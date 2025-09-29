'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/expenses/expense-form'
import { ExpenseList } from '@/components/expenses/expense-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/ui/loading'
import { useToast } from '@/hooks/use-toast'

const CATEGORIES = ['All', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Other']

export default function ExpensesPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.id) {
      fetchExpenses()
    }
  }, [session, filters])

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.category !== 'All') params.append('category', filters.category)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/expenses?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch expenses',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingExpense ? `/api/expenses/${editingExpense.id}` : '/api/expenses'
      const method = editingExpense ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchExpenses()
        setShowForm(false)
        setEditingExpense(null)
        toast({
          title: 'Success',
          description: editingExpense ? 'Expense updated successfully' : 'Expense added successfully'
        })
      } else {
        throw new Error('Failed to save expense')
      }
    } catch (error) {
      console.error('Error saving expense:', error)
      toast({
        title: 'Error',
        description: 'Failed to save expense',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchExpenses()
        toast({
          title: 'Success',
          description: 'Expense deleted successfully'
        })
      } else {
        throw new Error('Failed to delete expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  if (status === 'loading' || loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <ExpenseForm
          onSubmit={handleSubmit}
          initialData={editingExpense}
          onCancel={handleCancel}
        />
      )}

      {/* Expenses List */}
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}