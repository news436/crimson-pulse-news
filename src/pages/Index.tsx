
import { useState } from 'react';
import { Search, Globe, Moon, Sun, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');

  const categories = ['Breaking', 'Politics', 'Sports', 'Entertainment', 'Business', 'Technology', 'Health'];
  const states = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Rajasthan', 'Tamil Nadu'];

  const featuredNews = [
    {
      id: 1,
      title: "Major Economic Reform Bill Passed in Parliament",
      summary: "The landmark bill promises to boost economic growth and create millions of jobs across the country.",
      image: "/placeholder.svg",
      category: "Politics",
      state: "Delhi",
      time: "2 hours ago",
      isBreaking: true
    },
    {
      id: 2,
      title: "India Wins Cricket World Cup Semifinal",
      summary: "Spectacular performance leads team to victory in a nail-biting match against Australia.",
      image: "/placeholder.svg",
      category: "Sports",
      state: "All India",
      time: "4 hours ago",
      isBreaking: false
    },
    {
      id: 3,
      title: "Tech Giant Announces New Investment in AI",
      summary: "Multi-billion dollar investment expected to revolutionize artificial intelligence sector.",
      image: "/placeholder.svg",
      category: "Technology",
      state: "Karnataka",
      time: "6 hours ago",
      isBreaking: false
    }
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

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
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:bg-red-700"
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'हिंदी' : 'English'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-red-700"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">NewsToday</h1>
              
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search news..."
                    className="pl-10 bg-white text-black"
                  />
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
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="text-white hover:bg-red-700 whitespace-nowrap"
                >
                  {category}
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
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={featuredNews[0].image} 
                  alt={featuredNews[0].title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge variant="destructive" className="mb-2">
                    {featuredNews[0].category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-2">{featuredNews[0].title}</h2>
                  <p className="text-lg opacity-90 mb-2">{featuredNews[0].summary}</p>
                  <div className="flex items-center text-sm opacity-75">
                    <span>{featuredNews[0].state}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredNews[0].time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {featuredNews.slice(1).map((news) => (
                <div key={news.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {news.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{news.state}</span>
                      <span>{news.time}</span>
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
                {[1, 2, 3].map((i) => (
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
                {states.map((state) => (
                  <Button
                    key={state}
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {state}
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
              <h3 className="text-xl font-bold mb-4">NewsToday</h3>
              <p className="text-gray-400">
                Your trusted source for breaking news and in-depth analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <div className="space-y-1">
                {categories.slice(0, 4).map((cat) => (
                  <div key={cat} className="text-gray-400 hover:text-white cursor-pointer">
                    {cat}
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
            <p>&copy; 2024 NewsToday. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
