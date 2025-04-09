import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Users, GitFork } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type UserProfileProps = {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  };
};

const UserProfile = ({ user }: UserProfileProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col md:flex-row gap-6 items-start'>
          <Avatar className='h-24 w-24 border'>
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>
              {user.login.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='space-y-2 flex-1'>
            <div>
              <h2 className='text-2xl font-bold'>{user.name || user.login}</h2>
              <a
                href={user.html_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:underline'
              >
                @{user.login}
              </a>
            </div>

            {user.bio && <p>{user.bio}</p>}

            <div className='flex flex-wrap gap-3 mt-3'>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <CalendarIcon className='h-3 w-3' />
                Joined {formatDate(user.created_at)}
              </Badge>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <GitFork className='h-3 w-3' />
                {user.public_repos} Repositories
              </Badge>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Users className='h-3 w-3' />
                {user.followers} Followers
              </Badge>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Users className='h-3 w-3' />
                {user.following} Following
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
