import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Proposal } from '../types';
import { useGovernance, TransactionInfo } from '../blockchain/useGovernance';
import { useAccount, useNetwork } from 'wagmi';

interface ProposalsContextType {
  proposals: Proposal[];
  voteFor: (proposalId: string) => Promise<any>;
  voteAgainst: (proposalId: string) => Promise<any>;
  createProposal: (title: string, description: string, deadline: Date) => Promise<any>;
  userVotes: Record<string, 'for' | 'against'>;
  hasVoted: (proposalId: string) => boolean;
  isLoading: boolean;
  isVoting: Record<string, boolean>;
  transactions: TransactionInfo[];
  getExplorerUrl: (txHash: string) => string;
  chain?: {
    id: number;
    name: string;
  };
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined);

export const useProposals = () => {
  const context = useContext(ProposalsContext);
  if (!context) {
    throw new Error('useProposals must be used within a ProposalsProvider');
  }
  return context;
};

interface ProposalsProviderProps {
  initialProposals: Proposal[];
  children: ReactNode;
}

export const ProposalsProvider = ({ initialProposals, children }: ProposalsProviderProps) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { 
    proposals: blockchainProposals,
    userVotes,
    isLoading,
    isVoting,
    voteFor,
    voteAgainst,
    createProposal,
    hasVoted,
    transactions,
    getExplorerUrl
  } = useGovernance();
  
  // Always prioritize blockchain proposals when connected
  const [mergedProposals, setMergedProposals] = useState<Proposal[]>(initialProposals);
  const [localUserVotes, setLocalUserVotes] = useState<Record<string, 'for' | 'against'>>({});
  
  // Load votes from localStorage on initialization
  useEffect(() => {
    try {
      // 1. Load user votes
      const userVoteStorageKey = 'governdao_user_votes';
      const storedVotesJson = localStorage.getItem(userVoteStorageKey);
      if (storedVotesJson) {
        const storedVotes = JSON.parse(storedVotesJson);
        setLocalUserVotes(storedVotes);
        console.log('Loaded user votes from localStorage:', storedVotes);
      }
      
      // 2. Load stored proposals with vote counts
      const proposalsStorageKey = 'governdao_proposals';
      const storedProposalsJson = localStorage.getItem(proposalsStorageKey);
      if (storedProposalsJson) {
        const storedProposals = JSON.parse(storedProposalsJson);
        // Convert string dates back to Date objects
        const parsedProposals = storedProposals.map((p: any) => ({
          ...p,
          deadline: new Date(p.deadline)
        }));
        
        if (parsedProposals.length > 0) {
          setMergedProposals(parsedProposals);
          console.log('Loaded proposals from localStorage:', parsedProposals);
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);
  
  useEffect(() => {
    if (isConnected && blockchainProposals.length > 0) {
      // Only use blockchain proposals when connected
      console.log('Using updated blockchain proposals:', blockchainProposals);
      setMergedProposals(blockchainProposals);
    } else if (!isConnected && initialProposals.length > 0) {
      // Show initial proposals when not connected - just for display purposes
      setMergedProposals(initialProposals);
    }
  }, [isConnected, blockchainProposals, initialProposals]);

  // Combine blockchain userVotes with local userVotes
  const combinedUserVotes = useMemo(() => {
    return { ...localUserVotes, ...userVotes };
  }, [localUserVotes, userVotes]);
  
  // Override hasVoted to check local votes
  const hasVotedLocal = (proposalId: string): boolean => {
    return hasVoted(proposalId) || proposalId in localUserVotes;
  };

  return (
    <ProposalsContext.Provider 
      value={{ 
        proposals: mergedProposals, 
        voteFor, 
        voteAgainst, 
        createProposal,
        userVotes: combinedUserVotes, 
        hasVoted: hasVotedLocal,
        isLoading,
        isVoting,
        transactions,
        getExplorerUrl,
        chain: chain ? { id: chain.id, name: chain.name } : undefined
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
};