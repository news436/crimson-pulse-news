
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface BreakingNewsTickerProps {
  news: any[];
}

export const BreakingNewsTicker = ({ news }: BreakingNewsTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 bg-red-700 px-3 py-1 rounded mr-4">
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <span className="font-bold text-sm">BREAKING</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {news.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className={`inline-block mr-8 hover:text-red-200 transition-colors ${
                    index === currentIndex ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
