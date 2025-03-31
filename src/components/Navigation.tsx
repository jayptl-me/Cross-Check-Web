import React, { useState, useEffect } from 'react';
import { Home, FileText, Plus, Vote, PieChart, User, Menu, X, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { Button } from './ui/Button';
import { useNetwork } from '../providers/Web3Provider';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  // Modified navItems to identify Create separately
  const standardNavItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/proposals', icon: FileText, label: 'Proposals' },
    { path: '/vote', icon: Vote, label: 'Vote' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/results', icon: PieChart, label: 'Results' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];
  
  const handleWalletClick = async () => {
    if (isConnected) {
      try {
        await disconnect();
        // Clear any stored connection data
        localStorage.removeItem('wagmi.connected');
        localStorage.removeItem('wagmi.store');
        localStorage.removeItem('wagmi.wallet');
        localStorage.removeItem('wc@2:client:0.3//session');
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    } else {
      open();
    }
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`bg-surface sticky top-0 z-10 transition-all duration-300 ${
      scrolled ? 'shadow-md' : 'border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white transform transition-transform group-hover:rotate-12">
                <Vote className="h-5 w-5" />
              </div>
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">Cross-Check</span>
                <span className="text-xs text-primary-600 font-medium">Governance DAO</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="hidden md:flex md:space-x-1">
              {standardNavItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link-hover ${
                    isActive(path)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive(path) ? 'text-primary-600' : 'text-gray-500'}`} />
                  {label}
                </Link>
              ))}
            </div>
            
            <div className="ml-6">
              <Button 
                onClick={handleWalletClick}
                variant={isConnected ? "outline" : "default"}
                size="md"
                className={`btn-gradient ${isConnected ? 'border-primary-300 hover:border-primary-400' : ''}`}
              >
                <span className="flex items-center">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="font-medium">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                    </>
                  ) : (
                    <>Connect Wallet</>
                  )}
                </span>
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-primary-50 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 shadow-lg animate-fadeIn">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {standardNavItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive(path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-8 h-8 rounded-full ${isActive(path) ? 'bg-primary-100' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
                  <Icon className={`w-4 h-4 ${isActive(path) ? 'text-primary-600' : 'text-gray-500'}`} />
                </div>
                {label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="px-4 py-3">
              <Button 
                onClick={handleWalletClick}
                variant={isConnected ? "outline" : "default"}
                size="md"
                fullWidth
                className="btn-gradient"
              >
                <span className="flex items-center justify-center">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="font-medium">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                    </>
                  ) : (
                    <>Connect Wallet</>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;