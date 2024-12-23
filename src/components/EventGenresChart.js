// src/components/EventGenresChart.js

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

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          fill="#8884d8"
          labelLine={false}
          label
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
