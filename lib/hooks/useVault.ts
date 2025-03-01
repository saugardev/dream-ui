import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { vaultAbi } from '@/abi/vault';
import { tokenAbi } from '@/abi/token';
import { parseEther } from 'viem';

// Contract addresses on Base Sepolia
const VAULT_CONTRACT_ADDRESS = '0x58E0A1975bD38f57D3ccaB2BEA04ebab2a1E0976' as `0x${string}`;
const TOKEN_CONTRACT_ADDRESS = '0x39c773e0FBA55907c2Be1661b9f030E3D15b6779' as `0x${string}`;

// Constants from the contract are defined in the smart contract

export function useVault() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  
  // Contract write hook
  const { writeContractAsync, isPending, data: txHash } = useWriteContract();

  // Get max positions
  const { data: maxPositions } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: vaultAbi,
    functionName: 'MAX_POSITIONS',
  });

  // Get user collateral for a specific asset
  const useUserCollateral = (assetAddress?: `0x${string}`) => {
    return useReadContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: vaultAbi,
      functionName: 'userCollateral',
      args: address && assetAddress ? [address, assetAddress] : undefined,
      query: {
        enabled: Boolean(address && assetAddress),
      },
    });
  };

  // Get user's CDP borrowed amount
  const useUserCdpBorrowed = () => {
    return useReadContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: vaultAbi,
      functionName: 'cdpBorrowed',
      args: address ? [address] : undefined,
      query: {
        enabled: Boolean(address),
      },
    });
  };

  // Get pool collateral for a specific asset
  const usePoolCollateral = (assetAddress?: `0x${string}`) => {
    return useReadContract({
      address: VAULT_CONTRACT_ADDRESS,
      abi: vaultAbi,
      functionName: 'poolCollateral',
      args: assetAddress ? [assetAddress] : undefined,
      query: {
        enabled: Boolean(assetAddress),
      },
    });
  };

  // Get CDP token total supply
  const useCdpTotalSupply = () => {
    return useReadContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: tokenAbi,
      functionName: 'totalSupply',
    });
  };

  // Calculate user health factor
  const useUserHealthFactor = () => {
    // This would require multiple contract calls and calculations
    // For simplicity, we'll return a mock value for now
    return { data: 200 }; // 200% health factor
  };

  // Approve token for vault
  const approveToken = async (assetAddress: `0x${string}`, amount: string) => {
    try {
      setLoading(true);
      const hash = await writeContractAsync({
        address: assetAddress,
        abi: tokenAbi,
        functionName: 'approve',
        args: [VAULT_CONTRACT_ADDRESS, parseEther(amount)],
      });
      return hash;
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Deposit
  const deposit = async (assetAddress: `0x${string}`, amount: string) => {
    try {
      setLoading(true);
      // First approve the token
      await approveToken(assetAddress, amount);
      
      // Then deposit
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultAbi,
        functionName: 'deposit',
        args: [assetAddress, parseEther(amount)],
      });
      return hash;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Borrow
  const borrow = async (amount: string) => {
    try {
      setLoading(true);
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultAbi,
        functionName: 'borrow',
        args: [parseEther(amount)],
      });
      return hash;
    } catch (error) {
      console.error('Error borrowing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Repay
  const repay = async (amount: string) => {
    try {
      setLoading(true);
      // First approve the CDP token
      await approveToken(TOKEN_CONTRACT_ADDRESS, amount);
      
      // Then repay
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultAbi,
        functionName: 'repay',
        args: [parseEther(amount)],
      });
      return hash;
    } catch (error) {
      console.error('Error repaying:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw
  const withdraw = async (assetAddress: `0x${string}`, amount: string) => {
    try {
      setLoading(true);
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultAbi,
        functionName: 'withdraw',
        args: [assetAddress, parseEther(amount)],
      });
      return hash;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Liquidate
  const liquidate = async (userAddress: `0x${string}`) => {
    try {
      setLoading(true);
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultAbi,
        functionName: 'liquidate',
        args: [userAddress],
      });
      return hash;
    } catch (error) {
      console.error('Error liquidating:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get max borrowable amount based on user's collateral
  const getMaxBorrowAmount = async () => {
    if (!address) return "0";
    
    // This would require complex calculations based on user's collateral
    // For simplicity, we'll return a mock value for now
    return "10000";
  };

  return {
    maxPositions,
    useUserCollateral,
    useUserCdpBorrowed,
    usePoolCollateral,
    useCdpTotalSupply,
    useUserHealthFactor,
    approveToken,
    deposit,
    borrow,
    repay,
    withdraw,
    liquidate,
    getMaxBorrowAmount,
    loading,
    isPending,
    txHash,
    vaultAddress: VAULT_CONTRACT_ADDRESS,
    tokenAddress: TOKEN_CONTRACT_ADDRESS,
  };
} 