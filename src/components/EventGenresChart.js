import { useState, useEffect, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);

  
  const genres = useMemo(() => ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'], []);

 
  useEffect(() => {
    const getData = () => {
      const data = genres.map((genre) => {
        const filteredEvents = events.filter(event => event.summary.includes(genre));
        return {
          name: genre,
          value: filteredEvents.length
        };
      });
      return data;
    };

    setData(getData());
  }, [events, genres]); 

  
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // Add some extra space between the outer edge and the label
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    
    const sliceColor = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0AFFF'][index % 5];
  
    return percent ? (
      <text
        x={x}
        y={y}
        fill={sliceColor} 
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
  <Pie
    data={data}
    dataKey="value"
    nameKey="name"
    fill="#8884d8"
    labelLine={false} 
    label={renderCustomizedLabel}  
    outerRadius={120} 
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0AFFF'][index % 5]} />
    ))}
  </Pie>
</PieChart>

    </ResponsiveContainer>
  );
};

export default EventGenresChart;
