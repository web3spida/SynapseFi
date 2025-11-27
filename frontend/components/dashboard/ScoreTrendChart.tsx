import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditScoreData } from '../../types';

interface Props {
  data: CreditScoreData['trend'];
}

export const ScoreTrendChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#15151E', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#8B5CF6' }}
            cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8B5CF6" 
            strokeWidth={3} 
            dot={{ fill: '#0A0A0F', stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#8B5CF6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};