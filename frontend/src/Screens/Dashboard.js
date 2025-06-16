import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../Components/Card";

const anomalyData = [
  { time: "00:00", Violence: 2, Vandalism: 1, Smoking: 0 },
  { time: "06:00", Violence: 5, Vandalism: 3, Smoking: 2 },
  { time: "12:00", Violence: 9, Vandalism: 5, Smoking: 3 },
  { time: "18:00", Violence: 7, Vandalism: 2, Smoking: 5 },
  { time: "23:59", Violence: 4, Vandalism: 4, Smoking: 1 },
];

const weeklySummary = [
  { day: "Mon", total: 15 },
  { day: "Tue", total: 22 },
  { day: "Wed", total: 30 },
  { day: "Thu", total: 28 },
  { day: "Fri", total: 35 },
  { day: "Sat", total: 25 },
  { day: "Sun", total: 20 },
];

const Dashboard = () => {
  return (
    <div className="h-screen overflow-y-auto flex-1 p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">Anomaly Detection Dashboard</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-100 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-semibold text-blue-800">24</p>
            <p className="text-gray-700">Anomalies Today</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-semibold text-yellow-800">160</p>
            <p className="text-gray-700">Anomalies This Week</p>
          </CardContent>
        </Card>
        <Card className="bg-red-100 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-semibold text-red-800">625</p>
            <p className="text-gray-700">Anomalies This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Time of Day Trend */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Time of Day Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={anomalyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Violence" stroke="#ff6b6b" strokeWidth={2} animationDuration={1000} />
            <Line type="monotone" dataKey="Vandalism" stroke="#ffa502" strokeWidth={2} animationDuration={1000} />
            <Line type="monotone" dataKey="Smoking" stroke="#3742fa" strokeWidth={2} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Anomaly Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklySummary} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#1e90ff" radius={[8, 8, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:scale-[1.02] transition duration-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Most Frequent Anomaly Today</h3>
            <p className="text-blue-600 text-xl font-bold">Violence</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-[1.02] transition duration-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Average Detection Time</h3>
            <p className="text-green-600 text-xl font-bold">3.2s</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
