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
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: session.user.id
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (startDate) {
      where.date = {
        gte: new Date(startDate)
      }
    }

    if (endDate) {
      where.date = {
        ...where.date,
        lte: new Date(endDate)
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, description, category, date } = await request.json()

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        userId: session.user.id
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}