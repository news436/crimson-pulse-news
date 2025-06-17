
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, Users, Eye, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalVideos: 0,
    subscriberCount: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch articles count
        const { count: totalArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        const { count: publishedArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Fetch videos count
        const { count: totalVideos } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true });

        // Fetch newsletter subscribers count
        const { count: subscriberCount } = await supabase
          .from('newsletter_subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch total views from analytics
        const { count: totalViews } = await supabase
          .from('analytics')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'view');

        setStats({
          totalArticles: totalArticles || 0,
          publishedArticles: publishedArticles || 0,
          totalVideos: totalVideos || 0,
          subscriberCount: subscriberCount || 0,
          totalViews: totalViews || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      description: `${stats.publishedArticles} published`,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Videos',
      value: stats.totalVideos,
      description: 'Total video content',
      icon: Video,
      color: 'text-green-600'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.subscriberCount,
      description: 'Active subscribers',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      description: 'Article views tracked',
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest content and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New article published</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Video uploaded</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New subscriber</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Create New Article</div>
                <div className="text-xs text-gray-500">Start writing a new news article</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Upload Video</div>
                <div className="text-xs text-gray-500">Add a new video to the platform</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Manage Categories</div>
                <div className="text-xs text-gray-500">Organize content categories</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
