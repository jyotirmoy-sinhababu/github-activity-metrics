import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

import UserProfile from '@/components/UserProfile';
import RepositoryList from '@/components/RepositoryList';
import CommitCharts from '@/components/CommitCharts';

type GitHubUser = {
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

type CommitActivity = {
  total: number;
  week: number;
  days: number[];
};

const GithubMetrics = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [commitData, setCommitData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGitHubData = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);
    setCommitData({});

    try {
      // Fetch user data
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      );
      const reposData = await reposResponse.json();
      setRepos(reposData);

      const topRepos = reposData.slice(0, 5);

      const commitCounts: { [key: string]: number } = {};

      // Get the last 30 days
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        commitCounts[dateString] = 0;
      }

      // Fetch commit activity for each repository
      for (const repo of topRepos) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`
          );
          if (commitsResponse.ok) {
            const commitsData: CommitActivity[] = await commitsResponse.json();

            // Process weekly commit data
            if (commitsData && commitsData.length > 0) {
              commitsData.slice(0, 4).forEach((weekData) => {
                const weekStart = new Date(weekData.week * 1000);
                weekData.days.forEach((count, dayIndex) => {
                  const date = new Date(weekStart);
                  date.setDate(date.getDate() + dayIndex);
                  const dateString = date.toISOString().split('T')[0];
                  if (commitCounts[dateString] !== undefined) {
                    commitCounts[dateString] += count;
                  }
                });
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
        }
      }

      setCommitData(commitCounts);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch GitHub data'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGitHubData();
  };

  return (
    <div className='space-y-6 sm:mx-[3%] mx-[1%]'>
      <Card>
        <CardHeader className='text-xl font-sans'>
          Search with user name and get all details.
        </CardHeader>
        <CardContent className='pt-6'>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col sm:flex-row gap-2'
          >
            <Input
              type='text'
              placeholder='Enter GitHub username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='flex-1'
            />
            <Button type='submit' disabled={loading || !username.trim()}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Loading
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md'>
          {error}
        </div>
      )}

      {user && (
        <div className='space-y-6'>
          <UserProfile user={user} />

          <Tabs defaultValue='repositories'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='repositories'>
                Repositories ({repos.length})
              </TabsTrigger>
              <TabsTrigger value='commits'>Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value='repositories' className='mt-4'>
              <RepositoryList repositories={repos} />
            </TabsContent>
            <TabsContent value='commits' className='mt-4'>
              <CommitCharts commitData={commitData} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default GithubMetrics;
