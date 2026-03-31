import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { getGenerationLabel, getGenerationColor } from '@/utils/GenerationUtils';

const StatisticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const responses = await pb.collection('test_responses').getList(1, 500, {
        $autoCancel: false
      });

      const totalResponses = responses.items.length;
      
      // Count by actual generation
      const actualGenCounts = {
        genZ: 0,
        millennials: 0,
        genX: 0,
        boomers: 0
      };
      
      // Count by test result
      const testResultCounts = {
        genZ: 0,
        millennials: 0,
        genX: 0,
        boomers: 0
      };
      
      // Comparison matrix
      const comparisonMatrix = {
        genZ: { genZ: 0, millennials: 0, genX: 0, boomers: 0 },
        millennials: { genZ: 0, millennials: 0, genX: 0, boomers: 0 },
        genX: { genZ: 0, millennials: 0, genX: 0, boomers: 0 },
        boomers: { genZ: 0, millennials: 0, genX: 0, boomers: 0 }
      };

      responses.items.forEach(item => {
        actualGenCounts[item.actual_generation]++;
        testResultCounts[item.test_result]++;
        comparisonMatrix[item.actual_generation][item.test_result]++;
      });

      setStats({
        totalResponses,
        actualGenCounts,
        testResultCounts,
        comparisonMatrix
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Napaka pri nalaganju statistike');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const actualGenData = Object.entries(stats.actualGenCounts).map(([gen, count]) => ({
    name: getGenerationLabel(gen),
    value: count,
    color: getGenerationColor(gen)
  }));

  const testResultData = Object.entries(stats.testResultCounts).map(([gen, count]) => ({
    name: getGenerationLabel(gen),
    value: count,
    color: getGenerationColor(gen)
  }));

  const matchRate = stats.totalResponses > 0
    ? Math.round(
        (Object.entries(stats.comparisonMatrix).reduce((sum, [gen, results]) => {
          return sum + (results[gen] || 0);
        }, 0) / stats.totalResponses) * 100
      )
    : 0;

  return (
    <>
      <Helmet>
        <title>Statistika - Generacijski Test</title>
        <meta name="description" content="Poglej statistiko generacijskega testa in ugotovi, kako drugi razmišljajo o svoji generaciji." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazaj na test
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Statistika
            </h1>
            <p className="text-lg text-muted-foreground">
              Poglej, kako drugi razmišljajo o svoji generaciji
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground">Skupaj testov</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalResponses}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-medium text-muted-foreground">Ujemanje</h3>
              </div>
              <p className="text-3xl font-bold">{matchRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Test = Dejanska generacija</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-medium text-muted-foreground">Najpogostejši rezultat</h3>
              </div>
              <p className="text-3xl font-bold">
                {getGenerationLabel(
                  Object.entries(stats.testResultCounts).sort(([, a], [, b]) => b - a)[0][0]
                )}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Actual Generation Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Dejanske generacije</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actualGenData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {actualGenData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Test Result Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Rezultati testov</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testResultData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {testResultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Comparison Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Primerjava: Dejanska vs. Rezultat testa</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Dejanska generacija
                    </th>
                    {['genZ', 'millennials', 'genX', 'boomers'].map(gen => (
                      <th key={gen} className="text-center p-3 text-sm font-medium text-muted-foreground">
                        {getGenerationLabel(gen)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.comparisonMatrix).map(([actualGen, results]) => (
                    <tr key={actualGen} className="border-b border-border">
                      <td className="p-3 font-medium">{getGenerationLabel(actualGen)}</td>
                      {Object.entries(results).map(([testGen, count]) => {
                        const isMatch = actualGen === testGen;
                        return (
                          <td
                            key={testGen}
                            className={`text-center p-3 ${
                              isMatch ? 'bg-green-50 font-bold text-green-700' : ''
                            }`}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Zeleno označena polja prikazujejo ujemanje med dejansko generacijo in rezultatom testa
            </p>
          </motion.div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazaj na test
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;