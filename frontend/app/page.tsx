import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, TrendingUp, FileText, MessageSquare, BarChart3, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">SmartPrep.AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
            Personalized Career Preparation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ace Your Dream Job with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Personalized
            </span>{" "}
            Preparation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your career prospects with personalized resume optimization, interview prep and
            comprehensive skill assessments powered by advanced technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
              Watch Demo
            </Button> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Land Your Dream Job</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Comprehensive tools and intelligent analytics to boost your placement success rate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Smart Resume Analysis</CardTitle>
                <CardDescription>
                  AI-powered resume optimization with keyword suggestions and ATS compatibility checks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Mock Interviews</CardTitle>
                <CardDescription>
                  Practice with AI-driven mock interviews tailored to specific companies and roles
                </CardDescription>
              </CardHeader>
                <Badge className="ml-4 mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
                  Coming soon
                </Badge>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track your improvement with detailed analytics and performance insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Role-Specific Quizzes</CardTitle>
                <CardDescription>Targeted practice questions based on real company interview patterns</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Job Recommendations</CardTitle>
                <CardDescription>AI-curated job suggestions based on your skills and career goals</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>University Integration</CardTitle>
                <CardDescription>
                  Seamless integration for educational institutions to track student progress
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories from Our Users</h2>
            <p className="text-xl text-gray-600">See how SmartPrep.AI has transformed careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "SmartPrep.AI helped me optimize my resume and practice for interviews. I landed my dream job at
                  Google within 2 months!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">AS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Arjun Sharma</p>
                    <p className="text-sm text-gray-500">Software Engineer at Google</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The mock interviews were incredibly realistic. The AI feedback helped me improve my communication
                  skills significantly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">PK</span>
                  </div>
                  <div>
                    <p className="font-semibold">Priya Kumari</p>
                    <p className="text-sm text-gray-500">Data Analyst at Microsoft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a university placement officer, SmartPrep.AI has revolutionized how we prepare our students. 95%
                  placement rate this year!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">RG</span>
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Rajesh Gupta</p>
                    <p className="text-sm text-gray-500">IIT Delhi Placement Officer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have landed their dream jobs with SmartPrep.AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Your Journey
              </Button>
            </Link>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg bg-transparent"
            >
              Schedule Demo
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold">SmartPrep.AI</span>
              </div>
              <p className="text-gray-400">Empowering careers with AI-driven preparation tools</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartPrep.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
