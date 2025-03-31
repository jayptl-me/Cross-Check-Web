import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProposalsList from './components/ProposalsList';
import CreateProposal from './components/CreateProposal';
import ProposalDetail from './components/ProposalDetail';
import VotePage from './components/VotePage';
import ResultsPage from './components/ResultsPage';
import ProfilePage from './components/ProfilePage';
import Settings from './components/Settings';
import { Web3Provider } from './providers/Web3Provider';
import { ProposalsProvider } from './providers/ProposalsProvider';
import { Proposal } from './types';

// Mock data for demonstration
const defaultMockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Implement Community Treasury',
    description: 'Proposal to establish a community-managed treasury for funding future development initiatives and community projects. This will allow for decentralized allocation of resources.',
    deadline: new Date('2025-04-20'),
    status: 'active',
    votes: { for: 0, against: 0 },
    creator: '0x1234...5678'
  },
  {
    id: '2',
    title: 'Protocol Upgrade v2.0',
    description: 'Major protocol upgrade to improve scalability and reduce gas fees for all transactions. This upgrade introduces layer 2 solutions.',
    deadline: new Date('2025-04-15'),
    status: 'active',
    votes: { for: 0, against: 0 },
    creator: '0x8765...4321'
  },
  {
    id: '3',
    title: 'Governance Parameter Updates',
    description: 'Update the voting threshold and quorum requirements for proposal approvals to better reflect the growing community size.',
    deadline: new Date('2025-05-01'),
    status: 'active',
    votes: { for: 0, against: 0 },
    creator: '0xabcd...1234'
  },
  {
    id: '4',
    title: 'Strategic Partnership with DeFi Protocol',
    description: 'Establish a strategic partnership with a leading DeFi protocol to enhance liquidity and cross-platform interoperability.',
    deadline: new Date('2025-04-25'),
    status: 'active',
    votes: { for: 0, against: 0 },
    creator: '0x2468...1357'
  },
  // New proposals

];

function App() {
  const [initialProposals, setInitialProposals] = useState<Proposal[]>(defaultMockProposals);
  
  // On component mount, check if we have saved proposals in localStorage
  useEffect(() => {
    try {
      const storedProposalsJson = localStorage.getItem('governdao_proposals');
      if (storedProposalsJson) {
        const storedProposals = JSON.parse(storedProposalsJson);
        if (storedProposals.length > 0) {
          console.log('Loading persisted proposals from localStorage');
          
          // Convert string dates back to Date objects
          const parsedProposals = storedProposals.map((proposal: any) => ({
            ...proposal,
            deadline: new Date(proposal.deadline)
          }));
          
          setInitialProposals(parsedProposals);
        }
      }
    } catch (error) {
      console.error('Failed to load proposals from localStorage:', error);
    }
  }, []);

  return (
    <Web3Provider>
      <ProposalsProvider initialProposals={initialProposals}>
        <Router>
          <div className="min-h-screen bg-background">
            <Navigation />
            
            <Routes>
              <Route path="/" element={<ProposalsList title="Active Proposals" description="Vote on current proposals or create new ones for the community." filterStatus="active" />} />
              <Route path="/proposals" element={<ProposalsList title="All Proposals" description="Browse and vote on all community proposals." />} />
              <Route path="/proposals/:id" element={<ProposalDetail />} />
              <Route path="/create" element={<CreateProposal />} />
              <Route path="/vote" element={<VotePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </ProposalsProvider>
    </Web3Provider>
  );
}

export default App;