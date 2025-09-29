import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, PieChart, TrendingUp, Shield, Smartphone, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-primary block">Financial Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track expenses, set budgets, and gain insights into your spending habits 
            with our comprehensive expense tracking solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Today
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to track, analyze, and optimize your spending
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>
                  Easily categorize and track all your expenses with our intuitive interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Budget Management</CardTitle>
                <CardDescription>
                  Set monthly budgets and get alerts when you're approaching limits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Gain insights with detailed reports and spending trend analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your financial data is encrypted and securely stored with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Mobile Responsive</CardTitle>
                <CardDescription>
                  Access your financial data anywhere with our fully responsive design
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  See your spending patterns update in real-time as you add new expenses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Trusted by Thousands of Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">$2.5M+</div>
              <div className="text-primary-foreground/80">Expenses Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-foreground/80">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have already transformed their financial habits
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Start Your Financial Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExpenseTracker</span>
          </div>
          <p className="text-gray-400">
            © 2024 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}