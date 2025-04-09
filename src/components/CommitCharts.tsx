import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type CommitChartProps = {
  commitData: { [key: string]: number };
};

const CommitCharts = ({ commitData }: CommitChartProps) => {
  const chartData = Object.entries(commitData)
    .map(([date, count]) => ({
      date,
      count,
      displayDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalCommits = Object.values(commitData).reduce(
    (sum, count) => sum + count,
    0
  );

  const maxCommitDay = Object.entries(commitData).reduce(
    (max, [date, count]) => (count > max.count ? { date, count } : max),
    { date: '', count: 0 }
  );

  const formatMaxCommitDate = () => {
    if (maxCommitDay.count === 0) return 'N/A';
    return new Date(maxCommitDay.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-muted-foreground'>
          No commit data available.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>
          Daily commit activity over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div className='bg-muted/50 p-4 rounded-lg'>
            <div className='text-sm text-muted-foreground'>Total Commits</div>
            <div className='text-2xl font-bold'>{totalCommits}</div>
          </div>
          <div className='bg-muted/50 p-4 rounded-lg'>
            <div className='text-sm text-muted-foreground'>Most Active Day</div>
            <div className='text-2xl font-bold'>
              {maxCommitDay.count > 0
                ? `${formatMaxCommitDate()} (${maxCommitDay.count})`
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className='h-[300px] w-full'>
          <ChartContainer
            config={{
              commits: {
                label: 'Commits',
                color: 'hsl(var(--primary))',
              },
            }}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='displayDate'
                  angle={-45}
                  textAnchor='end'
                  height={70}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value, index) =>
                    index % 3 === 0 ? value : ''
                  }
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <ChartTooltip
                          content={
                            <ChartTooltipContent>
                              <p className='text-sm font-medium'>
                                {new Date(data.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                              <div className='flex items-center justify-between space-x-2'>
                                <span className='text-xs text-muted-foreground'>
                                  Commits
                                </span>
                                <span className='font-medium'>
                                  {data.count}
                                </span>
                              </div>
                            </ChartTooltipContent>
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey='count'
                  fill='hsl(var(--primary))'
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitCharts;
