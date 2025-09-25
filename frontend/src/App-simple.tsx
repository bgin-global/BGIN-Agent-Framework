import { useState, useEffect } from 'react'

function App() {
  const [sessions, setSessions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, agentsRes] = await Promise.all([
        fetch('http://localhost:4000/api/sessions'),
        fetch('http://localhost:4000/api/agents')
      ]);
      
      const sessionsData = await sessionsRes.json();
      const agentsData = await agentsRes.json();
      
      setSessions(sessionsData.sessions || []);
      setAgents(agentsData.agents || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-xl">Loading BGIN Multi-Agent System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          BGIN GovHack MVP
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#sessions" className="text-lg hover:text-purple-300 transition duration-300">Sessions</a></li>
            <li><a href="#agents" className="text-lg hover:text-purple-300 transition duration-300">Agents</a></li>
            <li><a href="#status" className="text-lg hover:text-purple-300 transition duration-300">Status</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section id="hero" className="text-center py-20">
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Multi-Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">Privacy Research</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Collaborative AI agents for privacy-preserving blockchain governance research across BGIN Block 13 sessions.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
              Start Research
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
              View Agents
            </button>
          </div>
        </section>

        <section id="sessions" className="py-16">
          <h3 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Block 13 Sessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session: any) => (
              <div key={session.id} className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <h4 className="text-2xl font-bold mb-3 text-purple-300">{session.name}</h4>
                <p className="text-gray-300 mb-4">{session.description || 'Governance research session'}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    session.status === 'live' ? 'bg-green-600' : 
                    session.status === 'active' ? 'bg-blue-600' : 
                    'bg-yellow-600'
                  } text-white`}>
                    {session.status}
                  </span>
                  <span className="text-sm text-gray-400">{session.participants_count || 0} participants</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="agents" className="py-16 bg-gray-800 rounded-lg shadow-xl">
          <h3 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-600">
            Multi-Agent System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent: any) => (
              <div key={agent.id} className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h5 className="text-xl font-semibold mb-3 text-purple-300">{agent.name}</h5>
                <p className="text-gray-300 text-sm mb-4">
                  {agent.agent_type === 'archive' && 'Manages knowledge retrieval and synthesis. Ensures data integrity and accessibility.'}
                  {agent.agent_type === 'codex' && 'Analyzes policies, standards, and governance models. Provides regulatory insights.'}
                  {agent.agent_type === 'discourse' && 'Facilitates community discussions and consensus building. Integrates with forums.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{agent.session_id} session</span>
                  <span className="text-sm text-green-400">Active</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="status" className="py-16">
          <h3 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
            System Status
          </h3>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-green-400">Backend API</h4>
                <p className="text-gray-300">Running on port 4000</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-green-400">Frontend</h4>
                <p className="text-gray-300">React app running</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠</span>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-yellow-400">Database</h4>
                <p className="text-gray-300">Mock mode (install Docker for full functionality)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; 2025 BGIN GovHack MVP. Multi-Agent Privacy Research System.</p>
      </footer>
    </div>
  );
}

export default App;
