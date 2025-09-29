import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        month,
        year
      }
    })

    // Get spending for each category in the specified month/year
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Calculate spending by category
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    // Combine budgets with spending data
    const budgetData = budgets.map(budget => ({
      ...budget,
      spent: spendingByCategory[budget.category] || 0,
      remaining: budget.limit - (spendingByCategory[budget.category] || 0),
      percentage: ((spendingByCategory[budget.category] || 0) / budget.limit) * 100
    }))

    return NextResponse.json(budgetData)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category, limit, month, year } = await request.json()

    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: session.user.id,
          category,
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      update: {
        limit: parseFloat(limit)
      },
      create: {
        category,
        limit: parseFloat(limit),
        month: parseInt(month),
        year: parseInt(year),
        userId: session.user.id
      }
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating budget:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}