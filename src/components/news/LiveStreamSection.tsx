
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, ExternalLink } from 'lucide-react';

interface LiveStreamSectionProps {
  streams: any[];
}

export const LiveStreamSection = ({ streams }: LiveStreamSectionProps) => {
  if (streams.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2 flex items-center">
        <Radio className="h-6 w-6 text-red-600 mr-2" />
        Live Now
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <Card key={stream.id} className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="p-4">
              <div className="relative">
                {stream.thumbnail_url ? (
                  <img
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-red-100 rounded-lg flex items-center justify-center">
                    <Radio className="h-12 w-12 text-red-600" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-600 animate-pulse">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2">{stream.title}</h3>
                {stream.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{stream.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Started: {new Date(stream.created_at).toLocaleTimeString()}
                  </span>
                  <a
                    href={stream.stream_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Watch Live
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
