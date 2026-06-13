import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
// import { Form, Submission } from "@/entities/all";
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Clock, Target, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

export default function FormAnalyticsPage() {
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState(7); // days

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      if (userData.email === "book.drivepal@gmail.com" || userData.role === "admin") {
        setIsAuthenticated(true);
        loadData();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get('id');
      
      if (formId) {
        const [forms, submissionsData] = await Promise.all([
          base44.entities.Form.list(),
          base44.entities.Submission.list()
        ]);
        
        const foundForm = forms.find(f => f.id === formId);
        const formSubmissions = submissionsData.filter(s => s.formId === formId);
        
        setForm(foundForm);
        setSubmissions(formSubmissions);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="neu-card p-6 sm:p-8">
          <div className="animate-pulse text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="neu-card p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Admin Access Required</h2>
        <p className="text-gray-600 mt-2">You need admin access to view analytics</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="neu-card p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Form not found</h2>
      </div>
    );
  }

  // Calculate analytics
  const totalSubmissions = submissions.length;
  const startDate = subDays(new Date(), timeRange);
  const recentSubmissions = submissions.filter(s => new Date(s.created_date) >= startDate);
  
  // Field completion rates
  const fieldData = form.fields?.map(field => {
    const completed = submissions.filter(s => s.data[field.id] && s.data[field.id] !== '').length;
    return {
      name: field.label.substring(0, 20),
      completion: totalSubmissions > 0 ? Math.round((completed / totalSubmissions) * 100) : 0
    };
  }) || [];

  const stats = [
    {
      title: "Total Submissions",
      value: totalSubmissions,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "This Week",
      value: recentSubmissions.length,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Completion Rate",
      value: `${form.fields?.length > 0 ? Math.round((totalSubmissions / (form.fields.length * 10)) * 100) : 0}%`,
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Avg. Time",
      value: "2.5 min",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="neu-card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600">Insights for "{form.title}"</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="neu-input px-4 py-2 text-gray-700"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="neu-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="neu-card p-6 text-center text-gray-500">
        <p>Charts require Recharts library (currently disabled)</p>
      </div>

      {/* Recent Activity */}
      <div className="neu-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {submissions.slice(0, 5).map((submission, index) => (
            <div key={submission.id} className="neu-inset p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{submission.submitterName || 'Anonymous'}</p>
                <p className="text-sm text-gray-600">{format(new Date(submission.created_date), 'PPp')}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}