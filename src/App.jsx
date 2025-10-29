import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import FinancialCalculators from './pages/FinancialCalculators'
import HealthCalculators from './pages/HealthCalculators'
import MathCalculators from './pages/MathCalculators'
import OtherCalculators from './pages/OtherCalculators'
import AllCalculators from './pages/AllCalculators'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'

// Individual Calculator Pages
import BMICalculator from './pages/calculators/BMICalculator'
import BMRCalculator from './pages/calculators/BMRCalculator'
import BodyFatCalculator from './pages/calculators/BodyFatCalculator'
import MacroCalculator from './pages/calculators/MacroCalculator'
import CalorieCalculator from './pages/calculators/CalorieCalculator'
import IdealWeightCalculator from './pages/calculators/IdealWeightCalculator'
import MortgageCalculator from './pages/calculators/MortgageCalculator'
import AutoLoanCalculator from './pages/calculators/AutoLoanCalculator'
import SimpleInterestCalculator from './pages/calculators/SimpleInterestCalculator'
import CompoundInterestCalculator from './pages/calculators/CompoundInterestCalculator'
import InterestCalculator from './pages/calculators/InterestCalculator'
import InvestmentCalculator from './pages/calculators/InvestmentCalculator'
import PaymentCalculator from './pages/calculators/PaymentCalculator'
import RetirementCalculator from './pages/calculators/RetirementCalculator'
import CreditCardCalculator from './pages/calculators/CreditCardCalculator'
import DebtPayoffCalculator from './pages/calculators/DebtPayoffCalculator'
import BudgetCalculator from './pages/calculators/BudgetCalculator'
import Calculator401k from './pages/calculators/Calculator401k'
import PercentageCalculator from './pages/calculators/PercentageCalculator'
import FractionCalculator from './pages/calculators/FractionCalculator'
import RatioCalculator from './pages/calculators/RatioCalculator'
import ScientificCalculator from './pages/calculators/ScientificCalculator'
import StatisticsCalculator from './pages/calculators/StatisticsCalculator'
import UnitConverter from './pages/calculators/UnitConverter'
import AgeCalculator from './pages/calculators/AgeCalculator'
import DateCalculator from './pages/calculators/DateCalculator'
import TimeCalculator from './pages/calculators/TimeCalculator'
import PregnancyCalculator from './pages/calculators/PregnancyCalculator'
import GPACalculator from './pages/calculators/GPACalculator'
import GradeCalculator from './pages/calculators/GradeCalculator'
import FAQs from './pages/FAQs'

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/financial" element={<FinancialCalculators />} />
        <Route path="/health" element={<HealthCalculators />} />
        <Route path="/math" element={<MathCalculators />} />
        <Route path="/other" element={<OtherCalculators />} />
        <Route path="/all-calculators" element={<AllCalculators />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        {/* Health Calculators */}
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/bmr-calculator" element={<BMRCalculator />} />
        <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
        <Route path="/macro-calculator" element={<MacroCalculator />} />
        <Route path="/calorie-calculator" element={<CalorieCalculator />} />
        <Route path="/ideal-weight-calculator" element={<IdealWeightCalculator />} />
        
        {/* Financial Calculators */}
        <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
        <Route path="/auto-loan-calculator" element={<AutoLoanCalculator />} />
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculator />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
        <Route path="/interest-calculator" element={<InterestCalculator />} />
        <Route path="/investment-calculator" element={<InvestmentCalculator />} />
        <Route path="/payment-calculator" element={<PaymentCalculator />} />
        <Route path="/retirement-calculator" element={<RetirementCalculator />} />
        <Route path="/credit-card-calculator" element={<CreditCardCalculator />} />
        <Route path="/debt-payoff-calculator" element={<DebtPayoffCalculator />} />
        <Route path="/budget-calculator" element={<BudgetCalculator />} />
        <Route path="/401k-calculator" element={<Calculator401k />} />
        
        {/* Math Calculators */}
        <Route path="/percentage-calculator" element={<PercentageCalculator />} />
        <Route path="/fraction-calculator" element={<FractionCalculator />} />
        <Route path="/ratio-calculator" element={<RatioCalculator />} />
        <Route path="/scientific-calculator" element={<ScientificCalculator />} />
        <Route path="/statistics-calculator" element={<StatisticsCalculator />} />
        <Route path="/unit-converter" element={<UnitConverter />} />
        
        {/* Other Calculators */}
        <Route path="/age-calculator" element={<AgeCalculator />} />
        <Route path="/date-calculator" element={<DateCalculator />} />
        <Route path="/time-calculator" element={<TimeCalculator />} />
        <Route path="/pregnancy-calculator" element={<PregnancyCalculator />} />
        <Route path="/gpa-calculator" element={<GPACalculator />} />
        <Route path="/grade-calculator" element={<GradeCalculator />} />
        <Route path="/faqs" element={<FAQs />} />
        
        {/* Policy Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
      </Routes>
    </Layout>
  )
}

export default App