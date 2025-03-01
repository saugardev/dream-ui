import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { vaultAbi } from '@/abi/vault';
import { parseEther } from 'viem';

// Mock contract address - replace with actual address
const VAULT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

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

  // User collateral read hook - must be called with a specific asset in the component
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

  // Deposit
  const deposit = async (assetAddress: `0x${string}`, amount: string) => {
    try {
      setLoading(true);
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

  return {
    maxPositions,
    useUserCollateral,
    deposit,
    borrow,
    repay,
    withdraw,
    liquidate,
    loading,
    isPending,
    txHash,
  };
} 