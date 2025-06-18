
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, User, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsHeaderProps {
  categories: any[];
}

export const NewsHeader = ({ categories }: NewsHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b-2 border-red-600">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>{new Date().toLocaleDateString(t('date.format'), { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:text-red-200 hover:bg-red-700"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:text-red-200 hover:bg-red-700"
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'हिं' : 'EN'}
              </Button>
              <Link to="/auth" className="hover:text-red-200">Login</Link>
              <Link to="/newsletter" className="hover:text-red-200">{t('newsletter.title')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">VOB</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-600">Voice Of Bharat</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">भारत की आवाज़</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-red-600 hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-800 border-t">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center py-4 space-y-2 md:space-y-0 md:space-x-8">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium transition-colors"
              >
                {t('nav.home')}
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                >
                  {t(`nav.${category.slug}`) || category.name}
                </Link>
              ))}
              <Link
                to="/videos"
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
              >
                {t('nav.videos')}
              </Link>
              <Link
                to="/live"
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
              >
                {t('nav.live')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 border-t p-4`}>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 dark:bg-gray-800 dark:border-gray-700"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 bg-red-600 hover:bg-red-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
};
