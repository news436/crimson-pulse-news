
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Video, Radio, TrendingUp, Eye } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    breakingNews: 0,
    totalVideos: 0,
    activeStreams: 0,
    totalViews: 0,
    todayViews: 0
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch article stats
      const { data: articles } = await supabase
        .from('articles')
        .select('status, is_breaking, created_at');

      const { data: videos } = await supabase
        .from('videos')
        .select('id');

      const { data: streams } = await supabase
        .from('live_streams')
        .select('is_active');

      const { data: analytics } = await supabase
        .from('analytics')
        .select('created_at');

      // Calculate stats
      const totalArticles = articles?.length || 0;
      const publishedArticles = articles?.filter(a => a.status === 'published').length || 0;
      const draftArticles = articles?.filter(a => a.status === 'draft').length || 0;
      const breakingNews = articles?.filter(a => a.is_breaking).length || 0;
      const totalVideos = videos?.length || 0;
      const activeStreams = streams?.filter(s => s.is_active).length || 0;
      const totalViews = analytics?.length || 0;
      
      const today = new Date().toDateString();
      const todayViews = analytics?.filter(a => 
        new Date(a.created_at).toDateString() === today
      ).length || 0;

      setStats({
        totalArticles,
        publishedArticles,
        draftArticles,
        breakingNews,
        totalVideos,
        activeStreams,
        totalViews,
        todayViews
      });

      // Fetch recent articles
      const { data: recent } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name),
          states(name),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentArticles(recent || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedArticles} published, {stats.draftArticles} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breaking News</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.breakingNews}</div>
            <p className="text-xs text-muted-foreground">Active breaking news</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos}</div>
            <p className="text-xs text-muted-foreground">Total video content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Streams</CardTitle>
            <Radio className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeStreams}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Page Views</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Views:</span>
                <span className="font-bold">{stats.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Today's Views:</span>
                <span className="font-bold text-blue-600">{stats.todayViews.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                Create New Article
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                Manage Categories
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                View Analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{article.title}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <span>by {article.profiles?.full_name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{article.categories?.name || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                    {article.status}
                  </Badge>
                  {article.is_breaking && <Badge variant="destructive">Breaking</Badge>}
                  {article.is_featured && <Badge>Featured</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
