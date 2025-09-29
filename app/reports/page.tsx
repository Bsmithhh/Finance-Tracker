'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Expense {
  id: string
  amount: number
  category: string
  date: string
}

interface Income {
  id: string
  amount: number
  source: string
  date: string
}

interface CategoryData {
  category: string
  total: number
  percentage: number
}

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeframe, setTimeframe] = useState('30')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router, timeframe])

  const fetchData = async () => {
    try {
      const [expensesResponse, incomesResponse] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/income')
      ])

      if (expensesResponse.ok && incomesResponse.ok) {
        const expensesData = await expensesResponse.json()
        const incomesData = await incomesResponse.json()
        
        // Filter data based on timeframe
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - parseInt(timeframe))
        
        const filteredExpenses = expensesData.filter((expense: Expense) => 
          new Date(expense.date) >= daysAgo
        )
        const filteredIncomes = incomesData.filter((income: Income) => 
          new Date(income.date) >= daysAgo
        )
        
        setExpenses(filteredExpenses)
        setIncomes(filteredIncomes)
      }
    } catch (err) {
      setError('Failed to load report data')
    } finally {
      setIsLoading(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const netIncome = totalIncome - totalExpenses

  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const categoryData: CategoryData[] = Object.entries(categoryBreakdown)
    .map(([category, total]) => ({
      category,
      total,
      percentage: (total / totalExpenses) * 100
    }))
    .sort((a, b) => b.total - a.total)

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case '7': return 'Last 7 days'
      case '30': return 'Last 30 days'
      case '90': return 'Last 90 days'
      case '365': return 'Last year'
      default: return 'Last 30 days'
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Get insights into your spending patterns and financial health</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{getTimeframeLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{getTimeframeLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{getTimeframeLabel()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Breakdown of your expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No spending data yet</h3>
              <p className="text-gray-600">Start tracking your expenses to see category breakdowns.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${item.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest spending transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expenses recorded yet</p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-red-600">-${expense.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Income</CardTitle>
            <CardDescription>Your latest income transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {incomes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No income recorded yet</p>
            ) : (
              <div className="space-y-3">
                {incomes.slice(0, 5).map((income) => (
                  <div key={income.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{income.source}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">+${income.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicator */}
      {totalIncome > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
            <CardDescription>Your spending vs income ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Spending Ratio</span>
                <span className="font-semibold">
                  {((totalExpenses / totalIncome) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (totalExpenses / totalIncome) > 0.9 ? 'bg-red-500' :
                    (totalExpenses / totalIncome) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totalExpenses > totalIncome ? (
                  <span className="text-red-600">⚠️ You&apos;re spending more than you earn</span>
                ) : (totalExpenses / totalIncome) > 0.9 ? (
                  <span className="text-yellow-600">⚠️ You&apos;re close to spending all your income</span>
                ) : (
                  <span className="text-green-600">✅ Good financial health - you&apos;re saving money</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
