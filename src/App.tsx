import './App.css';

import GithubMetrics from './pages/githubMetrics/GithubMetrics';

function App() {
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-[3%] mb-[2%]'>
        <p className=' font-sans text-3xl font-bold mb-6 text-center'>
          Github Activity Metrics
        </p>
      </div>
      <GithubMetrics />
    </>
  );
}

export default App;
