import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProposalCard from './ProposalCard';
import { Button } from './ui/Button';
import { Plus, Filter, CheckCircle, XCircle, Search, ThumbsUp, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useProposals } from '../providers/ProposalsProvider';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

interface ProposalsListProps {
  title: string;
  description: string;
  filterStatus?: 'active' | 'upcoming' | 'completed';
}

const ProposalsList: React.FC<ProposalsListProps> = ({ title, description, filterStatus }) => {
  const { proposals } = useProposals();
  const { isConnected } = useAccount();
  const { open: openWalletModal } = useWeb3Modal();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'active' | 'upcoming' | 'completed' | 'all'>(filterStatus || 'all');
  const navigate = useNavigate();
  
  // Apply filter and search
  let filteredProposals = proposals;
  
  // Apply status filter
  if (currentFilter !== 'all') {
    filteredProposals = filteredProposals.filter(proposal => proposal.status === currentFilter);
  }
  
  // Apply search term filter
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filteredProposals = filteredProposals.filter(
      proposal => 
        proposal.title.toLowerCase().includes(term) || 
        proposal.description.toLowerCase().includes(term)
    );
  }
  
  // Stats
  const activeCount = proposals.filter(p => p.status === 'active').length;
  const upcomingCount = proposals.filter(p => p.status === 'upcoming').length;
  const completedCount = proposals.filter(p => p.status === 'completed').length;
  const totalVotes = proposals.reduce((sum, p) => sum + p.votes.for + p.votes.against, 0);
  
  const handleCreateProposal = () => {
    navigate('/create');
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero-bg py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
              <p className="text-primary-100 text-lg mb-6">{description}</p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="inline-flex items-center bg-white text-primary-700 hover:bg-primary-50 relative z-10 pointer-events-auto"
                  onClick={handleCreateProposal}
                >
                  <Plus className="mr-2 h-5 w-5" /> Create Proposal
                </Button>
                {!isConnected && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={openWalletModal}
                    className="border-white text-white hover:bg-white/10"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-md p-3 text-center">
                    <span className="block text-3xl font-bold text-white">{proposals.length}</span>
                    <span className="text-primary-100 text-sm">Total Proposals</span>
                  </div>
                  <div className="bg-white/20 rounded-md p-3 text-center">
                    <span className="block text-3xl font-bold text-white">{totalVotes}</span>
                    <span className="text-primary-100 text-sm">Total Votes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === 'all' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({proposals.length})
              </button>
              <button
                onClick={() => setCurrentFilter('active')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Active ({activeCount})
              </button>
              <button
                onClick={() => setCurrentFilter('upcoming')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === 'upcoming' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setCurrentFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === 'completed' 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Completed ({completedCount})
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No proposals found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No proposals match your search criteria.' : 'Get started by creating a new proposal.'}
            </p>
            <div className="mt-6">
              <Button 
                variant="default" 
                size="md" 
                className="inline-flex items-center relative z-10 pointer-events-auto"
                onClick={handleCreateProposal}
              >
                <Plus className="mr-2 h-4 w-4" /> New Proposal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="inline-flex items-center relative z-10 pointer-events-auto"
                onClick={handleCreateProposal}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Proposal
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default ProposalsList;