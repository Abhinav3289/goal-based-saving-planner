
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import GoalsSection from '@/components/GoalsSection';
import { Goal, Contribution, ExchangeRate } from '@/types';
import { fetchExchangeRate } from '@/utils/exchangeRate';
import { formatCurrency } from '@/utils/calculations';
import { useDashboardCalculations } from '@/hooks/useDashboardCalculations';

const Index = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [dashboardCurrency, setDashboardCurrency] = useState<'USD' | 'INR'>('USD');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddContributionOpen, setIsAddContributionOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const { toast } = useToast();

  const {
    totalTarget,
    totalSaved,
    overallProgress,
    equivalentTarget,
    equivalentSaved,
  } = useDashboardCalculations(goals, dashboardCurrency, exchangeRate);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('savings-goals');
    const savedRate = localStorage.getItem('exchange-rate');
    const savedCurrency = localStorage.getItem('dashboard-currency');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    
    if (savedRate) {
      setExchangeRate(JSON.parse(savedRate));
    } else {
      fetchRate();
    }

    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'INR')) {
      setDashboardCurrency(savedCurrency);
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savings-goals', JSON.stringify(goals));
  }, [goals]);

  // Save dashboard currency preference
  useEffect(() => {
    localStorage.setItem('dashboard-currency', dashboardCurrency);
  }, [dashboardCurrency]);

  const fetchRate = async () => {
    setIsLoadingRate(true);
    try {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      localStorage.setItem('exchange-rate', JSON.stringify(rate));
      toast({
        title: "Exchange rate updated",
        description: `1 USD = ₹${rate.rate.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Failed to fetch exchange rate",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRate(false);
    }
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'contributions' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      contributions: [],
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Goal created",
      description: `Your ${goalData.name} goal has been added!`,
    });
  };

  const addContribution = (goalId: string, contribution: Omit<Contribution, 'id'>) => {
    const newContribution: Contribution = {
      ...contribution,
      id: crypto.randomUUID(),
    };
    
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, contributions: [...goal.contributions, newContribution] }
        : goal
    ));
    
    toast({
      title: "Contribution added",
      description: `Added ${formatCurrency(contribution.amount, contribution.currency)} to your goal!`,
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "Your goal has been removed",
    });
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader
        dashboardCurrency={dashboardCurrency}
        onCurrencyChange={setDashboardCurrency}
        exchangeRate={exchangeRate}
        onRefreshRate={fetchRate}
        isLoadingRate={isLoadingRate}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardStats
          totalTarget={totalTarget}
          totalSaved={totalSaved}
          overallProgress={overallProgress}
          dashboardCurrency={dashboardCurrency}
          equivalentTarget={equivalentTarget}
          equivalentSaved={equivalentSaved}
        />

        <GoalsSection
          goals={goals}
          exchangeRate={exchangeRate}
          onAddGoal={() => setIsAddGoalOpen(true)}
          onAddContribution={(goalId) => {
            setSelectedGoalId(goalId);
            setIsAddContributionOpen(true);
          }}
          onDeleteGoal={deleteGoal}
        />
      </div>

    </div>
  );
};

export default Index;
