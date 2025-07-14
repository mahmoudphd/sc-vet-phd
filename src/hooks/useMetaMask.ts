import { useState, useEffect } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const useMetaMask = () => {
  const [wallet, setWallet] = useState<string>('');
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request<string[]>({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        setWallet(accounts[0] || '');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (...args: unknown[]) => {
        const accounts = args[0] as string[];
        setWallet(accounts[0] || '');
      });
    }
  }, []);

  return { wallet, error, connectWallet };
};