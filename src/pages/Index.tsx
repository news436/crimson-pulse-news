
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Radio, Calendar, Eye, Share2 } from 'lucide-react';
import { NewsHeader } from '@/components/news/NewsHeader';
import { BreakingNewsTicker } from '@/components/news/BreakingNewsTicker';
import { FeaturedArticles } from '@/components/news/FeaturedArticles';
import { CategorySection } from '@/components/news/CategorySection';
import { VideoSection } from '@/components/news/VideoSection';
import { LiveStreamSection } from '@/components/news/LiveStreamSection';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';

const Index = () => {
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      // Fetch breaking news
      const { data: breaking } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name, slug),
          states(name, slug)
        `)
        .eq('status', 'published')
        .eq('is_breaking', true)
        .order('published_at', { ascending: false })
        .limit(5);

      // Fetch featured articles
      const { data: featured } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name, slug),
          states(name, slug)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(6);

      // Fetch recent articles
      const { data: recent } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name, slug),
          states(name, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12);

      // Fetch categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      // Fetch recent videos
      const { data: vids } = await supabase
        .from('videos')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch active live streams
      const { data: streams } = await supabase
        .from('live_streams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      setBreakingNews(breaking || []);
      setFeaturedArticles(featured || []);
      setRecentArticles(recent || []);
      setCategories(cats || []);
      setVideos(vids || []);
      setLiveStreams(streams || []);
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Voice Of Bharat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NewsHeader categories={categories} />
      
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <BreakingNewsTicker news={breakingNews} />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Live Streams */}
        {liveStreams.length > 0 && (
          <LiveStreamSection streams={liveStreams} />
        )}

        {/* Category Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* Latest News */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentArticles.slice(0, 8).map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      {article.featured_image_url && (
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {article.categories && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              {article.categories.name}
                            </Badge>
                          )}
                          {article.is_breaking && (
                            <Badge variant="destructive">Breaking</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-gray-600 text-sm line-clamp-3">{article.summary}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>1.2k views</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Videos Section */}
            {videos.length > 0 && (
              <VideoSection videos={videos} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block p-2 rounded hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <NewsletterSignup />

            {/* Admin Panel Link */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-4">Admin Panel</h3>
                <Link to="/admin">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Access Admin Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">Voice Of Bharat</h3>
              <p className="text-gray-300">
                Your trusted source for latest news and updates from across India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-300 hover:text-white">About Us</Link>
                <Link to="/contact" className="block text-gray-300 hover:text-white">Contact</Link>
                <Link to="/privacy" className="block text-gray-300 hover:text-white">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block text-gray-300 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="block text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="block text-gray-300 hover:text-white">YouTube</a>
                <a href="#" className="block text-gray-300 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 Voice Of Bharat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
