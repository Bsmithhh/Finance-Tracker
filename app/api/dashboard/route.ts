import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    
    // Get current month's data
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1)
    const endOfMonth = new Date(currentYear, currentMonth, 0)

    // Total balance (income - expenses)
    const totalIncome = await prisma.income.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true }
    })

    const totalExpenses = await prisma.expense.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true }
    })

    const totalBalance = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0)

    // Monthly expense summary
    const monthlyExpenses = await prisma.expense.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { amount: true }
    })

    // Recent transactions
    const recentExpenses = await prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 10
    })

    // Spending by category (current month)
    const expensesByCategory = await prisma.expense.groupBy({
      by: ['category'],
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { amount: true }
    })

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1)
      const endDate = new Date(currentYear, currentMonth - i, 0)
      
      const monthExpenses = await prisma.expense.aggregate({
        where: {
          userId: session.user.id,
          date: {
            gte: date,
            lte: endDate
          }
        },
        _sum: { amount: true }
      })

      monthlyTrend.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        amount: monthExpenses._sum.amount || 0
      })
    }

    return NextResponse.json({
      totalBalance,
      monthlyExpenses: monthlyExpenses._sum.amount || 0,
      recentTransactions: recentExpenses,
      spendingByCategory: expensesByCategory.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0
      })),
      monthlyTrend
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}