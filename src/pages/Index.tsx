
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Moon, Sun, Play, TrendingUp, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch published articles
      const { data: articlesData } = await supabase
        .from('articles')
        .select(`
          *,
          categories(name, slug),
          states(name, slug),
          profiles(full_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      // Fetch states
      const { data: statesData } = await supabase
        .from('states')
        .select('*')
        .order('name');

      setArticles(articlesData || []);
      setCategories(categoriesData || []);
      setStates(statesData || []);
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) throw error;

      setEmail('');
      alert('Thank you for subscribing to our newsletter!');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      alert('Error subscribing to newsletter. Please try again.');
    }
  };

  // Use real articles if available, otherwise fallback to dummy data
  const displayArticles = articles.length > 0 ? articles : [
    {
      id: 1,
      title: "Major Economic Reform Bill Passed in Parliament",
      summary: "The landmark bill promises to boost economic growth and create millions of jobs across the country.",
      featured_image_url: "/placeholder.svg",
      categories: { name: "Politics" },
      states: { name: "Delhi" },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_breaking: true
    },
    {
      id: 2,
      title: "India Wins Cricket World Cup Semifinal",
      summary: "Spectacular performance leads team to victory in a nail-biting match against Australia.",
      featured_image_url: "/placeholder.svg",
      categories: { name: "Sports" },
      states: { name: "All India" },
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      is_breaking: false
    }
  ];

  const displayCategories = categories.length > 0 ? categories : [
    { name: 'Breaking' }, { name: 'Politics' }, { name: 'Sports' }, 
    { name: 'Entertainment' }, { name: 'Business' }, { name: 'Technology' }, { name: 'Health' }
  ];

  const displayStates = states.length > 0 ? states : [
    { name: 'Maharashtra' }, { name: 'Uttar Pradesh' }, { name: 'Karnataka' }, 
    { name: 'Gujarat' }, { name: 'Rajasthan' }, { name: 'Tamil Nadu' }
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-2 border-b border-red-500">
            <div className="flex items-center space-x-4">
              <span className="text-sm">LIVE TV</span>
              <Badge variant="destructive" className="animate-pulse bg-red-800">
                🔴 LIVE
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{userProfile?.full_name || user.email}</span>
                  </div>
                  {userProfile?.role && ['admin', 'editor'].includes(userProfile.role) && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-red-700">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </Link>
              )}
              
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-white hover:bg-red-700">
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'हिंदी' : 'English'}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-white hover:bg-red-700">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">Voice Of Bharat</h1>
              
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search news..." className="pl-10 bg-white text-black" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm opacity-90">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="py-3">
            <div className="flex space-x-6 overflow-x-auto">
              {displayCategories.map(category => (
                <Button key={category.name} variant="ghost" className="text-white hover:bg-red-700 whitespace-nowrap">
                  {category.name}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breaking News Ticker */}
            <div className="bg-black text-white p-3 rounded-lg mb-6 overflow-hidden">
              <div className="flex items-center">
                <Badge variant="destructive" className="mr-3 animate-pulse">
                  BREAKING
                </Badge>
                <div className="animate-scroll">
                  <span>Parliament passes major economic reform bill • Cricket team advances to finals • Tech sector sees record investment</span>
                </div>
              </div>
            </div>

            {/* Featured Article */}
            {displayArticles.length > 0 && (
              <div className="mb-8">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img src={displayArticles[0].featured_image_url} alt={displayArticles[0].title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge variant="destructive" className="mb-2">
                      {displayArticles[0].categories?.name || 'News'}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">{displayArticles[0].title}</h2>
                    <p className="text-lg opacity-90 mb-2">{displayArticles[0].summary}</p>
                    <div className="flex items-center text-sm opacity-75">
                      <span>{displayArticles[0].states?.name || 'India'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(displayArticles[0].created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {displayArticles.slice(1).map(article => (
                <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img src={article.featured_image_url || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {article.categories?.name || 'News'}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.states?.name || 'India'}</span>
                      <span>{new Date(article.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Videos Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <Play className="h-6 w-6 mr-2 text-red-600" />
                Latest Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <Play className="h-12 w-12 text-red-600" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Video Title {i}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Brief description of the video content
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Newsletter Subscription */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">
                Newsletter
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Get daily news updates delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* State-wise News */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                State News
              </h3>
              <div className="space-y-2">
                {displayStates.map(state => (
                  <Button key={state.name} variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                    {state.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                Trending
              </h3>
              <div className="space-y-3">
                {['Market hits all-time high', 'New policy announcement', 'Celebrity wedding news'].map((trend, i) => (
                  <div key={i} className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer">
                    {trend}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Voice Of Bharat</h3>
              <p className="text-gray-400">
                Your trusted source for breaking news and in-depth analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <div className="space-y-1">
                {displayCategories.slice(0, 4).map(cat => (
                  <div key={cat.name} className="text-gray-400 hover:text-white cursor-pointer">
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-1 text-gray-400">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Contact</div>
                <div className="hover:text-white cursor-pointer">Privacy Policy</div>
                <div className="hover:text-white cursor-pointer">Terms of Service</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="space-y-1 text-gray-400">
                <div className="hover:text-white cursor-pointer">Facebook</div>
                <div className="hover:text-white cursor-pointer">Twitter</div>
                <div className="hover:text-white cursor-pointer">YouTube</div>
                <div className="hover:text-white cursor-pointer">Instagram</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; 2024 Voice Of Bharat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
