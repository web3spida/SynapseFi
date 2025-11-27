import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  score: number;
}

export const CreditScoreGauge: React.FC<Props> = ({ score }) => {
  const data = [{ value: score, fill: '#8B5CF6' }];
  const maxScore = 850;
  
  // Calculate percentage for color intensity or gradients if needed
  const percentage = (score / maxScore) * 100;

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="75%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, maxScore]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#1E1E2E' }}
            clockWise
            dataKey="value"
            cornerRadius={10}
            fill="#8B5CF6"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
        <span className="text-text-tertiary text-sm font-medium uppercase tracking-wider">Credit Score</span>
        <h2 className="text-6xl font-bold font-mono text-white tracking-tight mt-2">{score}</h2>
        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
          <span className="text-xs font-medium text-success">Excellent</span>
        </div>
        <span className="text-text-tertiary text-xs mt-2">out of 850</span>
      </div>
    </div>
  );
};