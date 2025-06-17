
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Eye, Users, TrendingUp, MousePointer } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    todayViews: 0,
    weeklyViews: [],
    topArticles: [],
    viewsByCategory: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total views
      const { count: totalViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'view');

      // Fetch today's views
      const today = new Date().toISOString().split('T')[0];
      const { count: todayViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'view')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      // Fetch weekly views data
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: weeklyData } = await supabase
        .from('analytics')
        .select('created_at')
        .eq('event_type', 'view')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at');

      // Process weekly data
      const weeklyViews = processWeeklyData(weeklyData || []);

      // Fetch top articles
      const { data: topArticlesData } = await supabase
        .from('analytics')
        .select(`
          article_id,
          articles(title)
        `)
        .eq('event_type', 'view')
        .not('article_id', 'is', null);

      const topArticles = processTopArticles(topArticlesData || []);

      setAnalytics({
        totalViews: totalViews || 0,
        todayViews: todayViews || 0,
        weeklyViews,
        topArticles,
        viewsByCategory: [] // This would require more complex query
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processWeeklyData = (data: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = days.map(day => ({ day, views: 0 }));
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const dayIndex = date.getDay();
      weeklyData[dayIndex].views++;
    });
    
    return weeklyData;
  };

  const processTopArticles = (data: any[]) => {
    const articleCounts: { [key: string]: { title: string; views: number } } = {};
    
    data.forEach(item => {
      if (item.article_id && item.articles?.title) {
        if (articleCounts[item.article_id]) {
          articleCounts[item.article_id].views++;
        } else {
          articleCounts[item.article_id] = {
            title: item.articles.title,
            views: 1
          };
        }
      }
    });
    
    return Object.values(articleCounts)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500">All time page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.todayViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Views today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-gray-500">Real-time users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-gray-500">Percentage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Views</CardTitle>
            <CardDescription>Page views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Articles</CardTitle>
            <CardDescription>Most viewed articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topArticles.length > 0 ? (
                analytics.topArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{article.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{article.views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No article views recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Info */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Information</CardTitle>
          <CardDescription>Understanding your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Data Collection</h4>
              <p className="text-sm text-gray-600">
                Analytics data is collected when users view articles on your website. 
                This includes page views, user interactions, and basic usage patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Privacy</h4>
              <p className="text-sm text-gray-600">
                We collect minimal data needed for analytics while respecting user privacy. 
                No personal information is stored beyond basic usage statistics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
