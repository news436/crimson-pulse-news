
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink } from 'lucide-react';

interface VideoSectionProps {
  videos: any[];
}

export const VideoSection = ({ videos }: VideoSectionProps) => {
  if (videos.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-600 pb-2">
          Latest Videos
        </h2>
        <Link
          to="/videos"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(0, 6).map((video) => (
          <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="relative">
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <div className="bg-red-600 rounded-full p-3">
                    <Play className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-600">{video.video_type}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100 transition-all"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-700" />
                  </a>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.categories?.name || 'Video'}</span>
                  <span>{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
