import React from 'react';
import { Calendar, Users, CheckCircle, XCircle, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { Proposal } from '../types';
import { Card } from './ui/Card';
import * as Progress from '@radix-ui/react-progress';
import { Link } from 'react-router-dom';
import { useProposals } from '../providers/ProposalsProvider';
import { Button } from './ui/Button';

interface ProposalCardProps {
  proposal: Proposal;
  children?: React.ReactNode;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, children }) => {
  const { transactions, getExplorerUrl } = useProposals();
  
  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'completed':
        return 'completed';
      case 'upcoming':
        return 'upcoming';
      default:
        return 'completed';
    }
  };

  const totalVotes = proposal.votes.for + proposal.votes.against;
  const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getRemainingTime = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
  };

  // Find the latest transaction related to this proposal
  const latestTransaction = transactions.find(tx => tx.proposalId === proposal.id);
  
  // Is deadline close? (less than 24 hours)
  const isDeadlineClose = () => {
    const now = new Date();
    const diff = proposal.deadline.getTime() - now.getTime();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  return (
    <Card className="group overflow-hidden flex flex-col card-hover-effect">
      <div className="flex justify-between items-start mb-3">
        <span className={`status-badge ${getStatusColor(proposal.status)}`}>
          {proposal.status}
        </span>
        <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">#{proposal.id}</span>
      </div>
      
      <Link to={`/proposals/${proposal.id}`} className="block group-hover:no-underline">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {proposal.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{proposal.description}</p>
      </Link>
      
      <div className="text-sm text-gray-500 mb-4 space-y-2">
        <div className="flex items-center p-2 rounded-md bg-gray-50">
          <Clock className="w-4 h-4 mr-2 text-primary-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Deadline: {formatDate(proposal.deadline)}</span>
            <span className={`text-xs font-medium ${isDeadlineClose() ? 'text-red-500' : 'text-gray-700'}`}>
              {getRemainingTime(proposal.deadline)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center p-2 rounded-md bg-gray-50">
          <Users className="w-4 h-4 mr-2 text-primary-500" />
          <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast</span>
        </div>
      </div>
      
      <div className="mt-2">
        {children || (
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span data-for-count={proposal.id}>{proposal.votes.for}</span>
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="w-3 h-3 mr-1" />
                <span data-against-count={proposal.id}>{proposal.votes.against}</span>
              </span>
            </div>
          </div>
        )}
        
        <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-1 progress-animated">
          <div className="flex h-full">
            <Progress.Root className="relative overflow-hidden" value={forPercentage}>
              <Progress.Indicator
                className="h-full bg-gradient-to-r from-green-400 to-green-600 progress-indicator"
                style={{ width: `${forPercentage}%` }}
              />
            </Progress.Root>
            <Progress.Root className="relative overflow-hidden" value={againstPercentage}>
              <Progress.Indicator
                className="h-full bg-gradient-to-r from-red-400 to-red-600 progress-indicator"
                style={{ width: `${againstPercentage}%` }}
              />
            </Progress.Root>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>For</span>
          <span>Against</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <Link 
          to={`/proposals/${proposal.id}`} 
          className="text-primary-600 font-medium text-sm flex items-center hover:text-primary-700 transition-colors"
        >
          View details <ArrowRight className="ml-1 w-4 h-4" />
        </Link>

        {latestTransaction && (
          <a 
            href={getExplorerUrl(latestTransaction.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
          >
            <Button variant="ghost" size="sm" className="py-1 h-7 flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="border-b border-dotted border-primary-300">Blockchain</span>
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
};

export default ProposalCard;