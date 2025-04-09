import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Clock } from 'lucide-react';

type Repository = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
};

type RepositoryListProps = {
  repositories: Repository[];
};

const RepositoryList = ({ repositories }: RepositoryListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const languageColors: Record<string, string> = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-500',
    Python: 'bg-green-500',
    Java: 'bg-red-500',
    'C#': 'bg-purple-500',
    PHP: 'bg-indigo-400',
    Ruby: 'bg-red-600',
    Go: 'bg-cyan-500',
    Rust: 'bg-orange-600',
    Swift: 'bg-orange-500',
    Kotlin: 'bg-purple-400',
    HTML: 'bg-orange-600',
    CSS: 'bg-pink-500',
  };

  if (repositories.length === 0) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-muted-foreground'>
          No repositories found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {repositories.map((repo) => (
        <Card key={repo.id}>
          <CardHeader className='pb-2'>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className='text-xl'>
                  <a
                    href={repo.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline'
                  >
                    {repo.name}
                  </a>
                </CardTitle>
                {repo.description && (
                  <CardDescription className='mt-1'>
                    {repo.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-3'>
              {repo.language && (
                <div className='flex items-center gap-1.5'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      languageColors[repo.language] || 'bg-gray-400'
                    }`}
                  ></div>
                  <span className='text-sm'>{repo.language}</span>
                </div>
              )}

              <Badge variant='outline' className='flex items-center gap-1'>
                <Star className='h-3.5 w-3.5' />
                {repo.stargazers_count}
              </Badge>

              <Badge variant='outline' className='flex items-center gap-1'>
                <GitFork className='h-3.5 w-3.5' />
                {repo.forks_count}
              </Badge>

              <Badge variant='outline' className='flex items-center gap-1'>
                <Clock className='h-3.5 w-3.5' />
                Updated {formatDate(repo.updated_at)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RepositoryList;
