'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { DollarSign, TrendingDown, Receipt, Target } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { TrendChart } from '@/components/dashboard/trend-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Loading } from '@/components/ui/loading'

interface DashboardData {
  totalBalance: number
  monthlyExpenses: number
  recentTransactions: any[]
  spendingByCategory: { category: string; amount: number }[]
  monthlyTrend: { month: string; amount: number }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <Loading />
  }

  if (!data) {
    return <div>Error loading dashboard data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value={`$${data.totalBalance.toFixed(2)}`}
          description="Income minus expenses"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${data.monthlyExpenses.toFixed(2)}`}
          description="Current month spending"
          icon={<TrendingDown className="h-6 w-6 text-red-500" />}
        />
        <StatsCard
          title="Total Transactions"
          value={data.recentTransactions.length.toString()}
          description="Recent transactions"
          icon={<Receipt className="h-6 w-6 text-blue-500" />}
        />
        <StatsCard
          title="Categories"
          value={data.spendingByCategory.length.toString()}
          description="Active spending categories"
          icon={<Target className="h-6 w-6 text-green-500" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {data.spendingByCategory.length > 0 ? (
              <ExpenseChart data={data.spendingByCategory} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={data.monthlyTrend} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="font-semibold text-red-600">
                  -${transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
            {data.recentTransactions.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No transactions yet. Start by adding your first expense!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}