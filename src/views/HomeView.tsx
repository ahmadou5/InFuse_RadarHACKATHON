'use client';
import { TransactionService } from '@/lib/services/transaction.service';
import { UserService } from '@/lib/services/user.service';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useMemo } from 'react';

import { Loading } from '@/components/LoadingScreen';
import { GetUserSentTransaction } from '@/lib/solana.lib';

export const Homeview = () => {
  const address = useMemo(
    () => new PublicKey('3SztGJVq9WFKdENT4ogtAN8dkrF1yDi5uQyPQiQKAKLe'),
    []
  );

  const connection = useMemo(
    () =>
      new Connection(
        'https://mainnet.helius-rpc.com/?api-key=e5fc821c-2b64-4d66-9d88-7cf162a5ffc8',
        { commitment: 'confirmed' }
      ),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      await GetUserSentTransaction(connection, address);
      await UserService.GetUser();
      await TransactionService.GetTransactionByAddress(
        '3SztGJVq9WFKdENT4ogtAN8dkrF1yDi5uQyPQiQKAKLe'
      );
    };

    fetchData();
  }, [address, connection]);

  return (
    <div className="min-h-screen">
      <Loading />
    </div>
  );
};
