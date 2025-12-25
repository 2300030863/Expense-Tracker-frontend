import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, DollarSign, TrendingUp, PieChart, Shield, 
  Users, Tag, CreditCard, Calendar, Repeat, UserCheck,
  Lock, ChevronRight, ChevronLeft, X, Play, Coffee,
  ShoppingCart, Home, Car, Utensils, Film
} from 'lucide-react'

function Welcome() {
  const navigate = useNavigate()
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Welcome to Expense Tracker",
      description: "Learn how to manage your finances effectively with our step-by-step guide",
      icon: DollarSign,
      color: "blue"
    },
    {
      title: "Step 1: Create Your Account",
      description: "Register with your email and choose your role: USER (basic tracking), OWNER (group management), or ADMIN (system administration)",
      icon: UserCheck,
      color: "green",
      details: [
        "USER: Track personal expenses and manage budgets",
        "OWNER: Create groups, invite members, manage shared expenses",
        "ADMIN: Full system access, manage all users and data"
      ]
    },
    {
      title: "Step 2: Set Up Categories",
      description: "Organize your expenses with pre-defined or custom categories",
      icon: Tag,
      color: "purple",
      categories: [
        { name: "Food & Dining", icon: Utensils, color: "orange" },
        { name: "Transportation", icon: Car, color: "blue" },
        { name: "Shopping", icon: ShoppingCart, color: "pink" },
        { name: "Housing", icon: Home, color: "green" },
        { name: "Entertainment", icon: Film, color: "purple" },
        { name: "Coffee & Snacks", icon: Coffee, color: "brown" }
      ]
    },
    {
      title: "Step 3: Create Accounts",
      description: "Add your bank accounts, cash, credit cards, and wallets to track balances",
      icon: CreditCard,
      color: "indigo",
      details: [
        "Cash Wallet: Track physical money",
        "Bank Account: Monitor bank balances",
        "Credit Card: Manage credit expenses",
        "Digital Wallet: Track UPI and online payments"
      ]
    },
    {
      title: "Step 4: Record Transactions",
      description: "Add income and expenses with details like amount, category, account, and notes",
      icon: TrendingUp,
      color: "green",
      workflow: [
        "Select transaction type (Income/Expense)",
        "Choose category and account",
        "Enter amount and date",
        "Add description and save"
      ]
    },
    {
      title: "Step 5: Set Budget Goals",
      description: "Create monthly or yearly budgets for different categories to control spending",
      icon: PieChart,
      color: "red",
      details: [
        "Set spending limits per category",
        "Track budget usage in real-time",
        "Get alerts when approaching limits",
        "View budget vs actual spending"
      ]
    },
    {
      title: "Step 6: Recurring Transactions",
      description: "Automate regular expenses like rent, subscriptions, and salary",
      icon: Repeat,
      color: "teal",
      details: [
        "Set frequency (Daily, Weekly, Monthly, Yearly)",
        "Auto-create transactions on schedule",
        "Manage subscriptions easily",
        "Never forget regular payments"
      ]
    },
    {
      title: "Step 7: View Reports & Analytics",
      description: "Analyze spending patterns with beautiful charts and detailed reports",
      icon: PieChart,
      color: "purple",
      features: [
        "Expense breakdown by category",
        "Income vs expense trends",
        "Monthly comparison charts",
        "Export reports as PDF/Excel"
      ]
    },
    {
      title: "How It All Works Together",
      description: "See the complete expense tracking workflow in action",
      icon: Shield,
      color: "blue",
      workflow: [
        "1. Register → Choose your role",
        "2. Create accounts → Add payment methods",
        "3. Set categories → Organize expenses",
        "4. Add transactions → Track daily spending",
        "5. Set budgets → Control spending",
        "6. View reports → Analyze patterns",
        "7. Optimize → Make better financial decisions"
      ]
    }
  ]

  const currentStep = tutorialSteps[tutorialStep]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection) => {
    const newStep = tutorialStep + newDirection
    if (newStep >= 0 && newStep < tutorialSteps.length) {
      setPage([page + newDirection, newDirection])
      setTutorialStep(newStep)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <DollarSign className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Expense Tracker</h1>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium min-h-[44px]"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Take Control of Your
              <motion.span 
                className="text-blue-600"
                animate={{ color: ["#2563eb", "#7c3aed", "#2563eb"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}Finances
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600"
              variants={itemVariants}
            >
              Track expenses, manage budgets, and gain insights into your spending habits with our powerful expense tracking platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base sm:text-lg font-medium min-h-[48px]"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(true)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-base sm:text-lg font-medium flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Play className="w-5 h-5" />
                Watch Tutorial
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 sm:pt-8"
              variants={containerVariants}
            >
              {[
                { icon: TrendingUp, title: "Track Spending", desc: "Monitor your expenses in real-time", color: "green" },
                { icon: PieChart, title: "Visual Reports", desc: "Beautiful charts and insights", color: "purple" },
                { icon: DollarSign, title: "Budget Goals", desc: "Set and achieve financial targets", color: "blue" },
                { icon: Shield, title: "Secure & Safe", desc: "Your data is protected", color: "red" }
              ].map((feature, index) => {
                const bgColorClass = feature.color === 'green' ? 'bg-green-100' : 
                                    feature.color === 'purple' ? 'bg-purple-100' : 
                                    feature.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                const textColorClass = feature.color === 'green' ? 'text-green-600' : 
                                      feature.color === 'purple' ? 'text-purple-600' : 
                                      feature.color === 'blue' ? 'text-blue-600' : 'text-red-600'
                return (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className={`w-10 h-10 ${bgColorClass} rounded-lg flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className={`w-5 h-5 ${textColorClass}`} />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              )})
            }
            </motion.div>
          </motion.div>

          {/* Right Animation */}
          <motion.div 
            className="flex justify-center items-center"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-md">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="relative bg-white p-8 rounded-3xl shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg mb-6"
                  variants={pulseVariants}
                  animate="pulse"
                >
                  <DollarSign className="w-16 h-16 text-white" />
                </motion.div>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Income</div>
                      <div className="font-bold text-green-600">₹50,000</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 bg-red-50 p-3 rounded-lg"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Expenses</div>
                      <div className="font-bold text-red-600">₹35,000</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Savings</div>
                      <div className="font-bold text-blue-600">₹15,000</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {[
            { value: "10K+", label: "Active Users", color: "blue" },
            { value: "₹100M+", label: "Tracked Expenses", color: "green" },
            { value: "99.9%", label: "Uptime", color: "purple" }
          ].map((stat, index) => {
            const colorClass = stat.color === 'blue' ? 'text-blue-600' : 
                              stat.color === 'green' ? 'text-green-600' : 'text-purple-600'
            return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className={`text-3xl sm:text-4xl font-bold ${colorClass}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm sm:text-base text-gray-600 mt-2">{stat.label}</div>
            </motion.div>
          )})
        }
        </motion.div>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTutorial(false)}
            >
              <motion.div
                className="bg-white rounded-none sm:rounded-2xl max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 100 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tutorial Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="flex-shrink-0"
                      >
                        <currentStep.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm opacity-90">Step {tutorialStep + 1} of {tutorialSteps.length}</div>
                        <h3 className="text-lg sm:text-2xl font-bold truncate">{currentStep.title}</h3>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowTutorial(false)}
                      className="p-2 hover:bg-white/20 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-white h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((tutorialStep + 1) / tutorialSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Tutorial Content */}
                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-250px)] sm:max-h-[60vh]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={tutorialStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-lg text-gray-700 mb-6">{currentStep.description}</p>

                      {/* Step-specific content */}
                      {currentStep.details && (
                        <motion.div 
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {currentStep.details.map((detail, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
                              variants={itemVariants}
                              whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
                            >
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 flex-1">{detail}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {currentStep.categories && (
                        <motion.div 
                          className="grid grid-cols-2 md:grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {currentStep.categories.map((cat, index) => {
                            const bgClass = cat.color === 'orange' ? 'bg-orange-50' : 
                                           cat.color === 'blue' ? 'bg-blue-50' : 
                                           cat.color === 'pink' ? 'bg-pink-50' : 
                                           cat.color === 'green' ? 'bg-green-50' : 
                                           cat.color === 'purple' ? 'bg-purple-50' : 'bg-amber-50'
                            const iconClass = cat.color === 'orange' ? 'text-orange-600' : 
                                             cat.color === 'blue' ? 'text-blue-600' : 
                                             cat.color === 'pink' ? 'text-pink-600' : 
                                             cat.color === 'green' ? 'text-green-600' : 
                                             cat.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                            return (
                            <motion.div
                              key={index}
                              className={`p-4 ${bgClass} rounded-lg text-center`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <cat.icon className={`w-8 h-8 ${iconClass} mx-auto mb-2`} />
                              <div className="font-semibold text-gray-800">{cat.name}</div>
                            </motion.div>
                          )})
                        }
                        </motion.div>
                      )}

                      {currentStep.workflow && (
                        <motion.div 
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {currentStep.workflow.map((step, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg"
                              variants={itemVariants}
                              whileHover={{ x: 10 }}
                            >
                              <ChevronRight className="w-6 h-6 text-purple-600" />
                              <p className="text-gray-700">{step}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {currentStep.features && (
                        <motion.div 
                          className="grid grid-cols-2 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {currentStep.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              className="p-4 border-2 border-purple-200 rounded-lg"
                              variants={itemVariants}
                              whileHover={{ borderColor: "#7c3aed", scale: 1.05 }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                                <p className="text-gray-700">{feature}</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Tutorial Navigation */}
                <div className="border-t p-4 sm:p-6 flex items-center justify-between bg-gray-50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(-1)}
                    disabled={tutorialStep === 0}
                    className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 min-h-[44px]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </motion.button>

                  <div className="flex gap-2">
                    {tutorialSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === tutorialStep ? 'bg-blue-600' : 'bg-gray-300'}`}
                        whileHover={{ scale: 1.5 }}
                        onClick={() => setTutorialStep(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>

                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => paginate(1)}
                      className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 sm:gap-2 min-h-[44px]"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowTutorial(false)
                        navigate('/register')
                      }}
                      className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 sm:gap-2 min-h-[44px]"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Welcome
