'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Target, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

interface Budget {
  id: string
  category: string
  limit: number
  month: number
  year: number
  spent?: number
  remaining?: number
}

export default function BudgetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchBudgets()
    }
  }, [status, router])

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets')
      if (response.ok) {
        const data = await response.json()
        setBudgets(data)
      }
    } catch (err) {
      setError('Failed to load budget data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          category: '',
          limit: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        })
        setShowForm(false)
        fetchBudgets()
      } else {
        setError('Failed to add budget')
      }
    } catch (err) {
      setError('Failed to add budget')
    }
  }

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1]
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Set and track your monthly spending limits</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Budget</CardTitle>
            <CardDescription>Set a monthly budget for a spending category</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Monthly Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="limit"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.limit}
                      onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={formData.month.toString()} onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {getMonthName(month)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">Add Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Start managing your spending by setting monthly budgets for different categories.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Set Your First Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const spent = budget.spent || 0
            const remaining = budget.remaining || budget.limit
            const percentage = (spent / budget.limit) * 100

            return (
              <Card key={budget.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{budget.category}</h3>
                        <p className="text-sm text-gray-600">
                          {getMonthName(budget.month)} {budget.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${budget.limit.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Monthly Limit</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${spent.toFixed(2)}</span>
                        <span>Remaining: ${remaining.toFixed(2)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>{percentage.toFixed(1)}%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {percentage >= 90 && (
                      <Alert>
                        <AlertDescription>
                          ⚠️ You're close to your budget limit for {budget.category}!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
