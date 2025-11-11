import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityLineChartProps {
  data: any[];
  loading?: boolean;
}

export const ActivityLineChart = ({ data, loading }: ActivityLineChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 rounded-3xl shadow-lg border-2 border-border/50 hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividade dos Últimos 7 Dias</CardTitle>
        <CardDescription>Atualizações em serviços, artigos e projetos</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="day" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }} 
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Line 
              type="monotone" 
              dataKey="services" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              name="Serviços" 
              dot={{ r: 4 }} 
            />
            <Line 
              type="monotone" 
              dataKey="articles" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="Artigos" 
              dot={{ r: 4 }} 
            />
            <Line 
              type="monotone" 
              dataKey="projects" 
              stroke="#A855F7" 
              strokeWidth={2} 
              name="Projetos" 
              dot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
