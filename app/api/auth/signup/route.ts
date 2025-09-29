import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Create sample data for new user
    await createSampleData(user.id)

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createSampleData(userId: string) {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // Sample expenses
  const sampleExpenses = [
    { amount: 45.99, description: "Grocery shopping", category: "Food", date: new Date(2024, 11, 15) },
    { amount: 25.00, description: "Gas station", category: "Transportation", date: new Date(2024, 11, 14) },
    { amount: 15.50, description: "Coffee shop", category: "Food", date: new Date(2024, 11, 13) },
    { amount: 89.99, description: "Electric bill", category: "Utilities", date: new Date(2024, 11, 10) },
    { amount: 120.00, description: "Internet bill", category: "Utilities", date: new Date(2024, 11, 8) },
    { amount: 35.99, description: "Movie tickets", category: "Entertainment", date: new Date(2024, 11, 5) },
    { amount: 67.50, description: "Restaurant dinner", category: "Food", date: new Date(2024, 11, 3) },
    { amount: 199.99, description: "New shoes", category: "Shopping", date: new Date(2024, 10, 28) },
    { amount: 85.00, description: "Doctor visit", category: "Healthcare", date: new Date(2024, 10, 25) },
    { amount: 42.30, description: "Uber ride", category: "Transportation", date: new Date(2024, 10, 20) },
  ]

  await prisma.expense.createMany({
    data: sampleExpenses.map(expense => ({
      ...expense,
      userId
    }))
  })

  // Sample income
  const sampleIncomes = [
    { amount: 4500.00, description: "Monthly Salary", source: "Job", date: new Date(2024, 11, 1) },
    { amount: 4500.00, description: "Monthly Salary", source: "Job", date: new Date(2024, 10, 1) },
    { amount: 500.00, description: "Freelance Project", source: "Freelance", date: new Date(2024, 10, 15) },
  ]

  await prisma.income.createMany({
    data: sampleIncomes.map(income => ({
      ...income,
      userId
    }))
  })

  // Sample budgets
  const sampleBudgets = [
    { category: "Food", limit: 500, month: currentMonth, year: currentYear },
    { category: "Transportation", limit: 200, month: currentMonth, year: currentYear },
    { category: "Entertainment", limit: 150, month: currentMonth, year: currentYear },
    { category: "Utilities", limit: 300, month: currentMonth, year: currentYear },
    { category: "Shopping", limit: 400, month: currentMonth, year: currentYear },
    { category: "Healthcare", limit: 200, month: currentMonth, year: currentYear },
  ]

  await prisma.budget.createMany({
    data: sampleBudgets.map(budget => ({
      ...budget,
      userId
    }))
  })
}