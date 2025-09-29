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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: session.user.id
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

    const incomes = await prisma.income.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(incomes)
  } catch (error) {
    console.error('Error fetching incomes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, description, source, date } = await request.json()

    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        description,
        source,
        date: new Date(date),
        userId: session.user.id
      }
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}