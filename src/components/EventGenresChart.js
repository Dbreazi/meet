import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);

  // List of event genres (you can adjust these as needed)
  const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];

  // Function to calculate the number of events per genre
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

  // Set data when events change
  useEffect(() => {
    setData(getData());
  }, [events]); // Re-run when events change

  // Function to render customized labels (genre name and percentage)
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;
    return percent ? (
      <text
        x={x}
        y={y}
        fill="#8884d8"
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
          label={renderCustomizedLabel}  // Use the customized label function
          outerRadius={130}
        >
          {/* Add colors for each genre */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0AFFF'][index % 5]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
