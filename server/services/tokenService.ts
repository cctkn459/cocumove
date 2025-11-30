import { db } from '../db';
import { tokenWallets, tokenTransactions } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface TokenTransaction {
  fromUserId?: string;
  toUserId: string;
  amount: number;
  type: 'ride_completion' | 'referral' | 'bonus' | 'withdrawal';
  description?: string;
  rideId?: string;
}

export const getWallet = async (userId: string) => {
  try {
    const wallet = await db
      .select()
      .from(tokenWallets)
      .where(eq(tokenWallets.userId, userId))
      .limit(1);

    return wallet[0];
  } catch (error) {
    throw error;
  }
};

export const addTokens = async (userId: string, amount: number, transaction: Omit<TokenTransaction, 'toUserId'>) => {
  try {
    // Obtener billetera actual
    const wallet = await getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Actualizar saldo
    const currentBalance = parseFloat(wallet.balance as any);
    const newBalance = currentBalance + amount;

    const updatedWallet = await db
      .update(tokenWallets)
      .set({
        balance: String(newBalance) as any,
        totalEarned: String(parseFloat(wallet.totalEarned as any) + amount) as any,
        updatedAt: new Date(),
      })
      .where(eq(tokenWallets.userId, userId))
      .returning();

    // Registrar transacción
    await db
      .insert(tokenTransactions)
      .values({
        toUserId: userId,
        fromUserId: transaction.fromUserId,
        amount: String(amount) as any,
        type: transaction.type as any,
        description: transaction.description,
        rideId: transaction.rideId,
      });

    return updatedWallet[0];
  } catch (error) {
    throw error;
  }
};

export const subtractTokens = async (userId: string, amount: number, transaction: Omit<TokenTransaction, 'toUserId'>) => {
  try {
    // Obtener billetera actual
    const wallet = await getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const currentBalance = parseFloat(wallet.balance as any);
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Actualizar saldo
    const newBalance = currentBalance - amount;

    const updatedWallet = await db
      .update(tokenWallets)
      .set({
        balance: String(newBalance) as any,
        totalSpent: String(parseFloat(wallet.totalSpent as any) + amount) as any,
        updatedAt: new Date(),
      })
      .where(eq(tokenWallets.userId, userId))
      .returning();

    // Registrar transacción
    await db
      .insert(tokenTransactions)
      .values({
        toUserId: userId,
        fromUserId: transaction.fromUserId,
        amount: String(amount) as any,
        type: transaction.type as any,
        description: transaction.description,
        rideId: transaction.rideId,
      });

    return updatedWallet[0];
  } catch (error) {
    throw error;
  }
};

export const getTransactionHistory = async (userId: string, limit: number = 50) => {
  try {
    const transactions = await db
      .select()
      .from(tokenTransactions)
      .where(eq(tokenTransactions.toUserId, userId))
      .limit(limit);

    return transactions;
  } catch (error) {
    throw error;
  }
};

export const rewardRideCompletion = async (passengerId: string, driverId: string, rideId: string) => {
  try {
    const rideReward = process.env.COCU_TOKEN_RIDE_REWARD || '5';
    const amount = parseFloat(rideReward);

    // Recompensar al pasajero
    await addTokens(passengerId, amount, {
      type: 'ride_completion',
      description: `Reward for completing ride ${rideId}`,
      rideId,
    });

    // Recompensar al conductor
    await addTokens(driverId, amount, {
      type: 'ride_completion',
      description: `Reward for completing ride ${rideId}`,
      rideId,
    });

    return { success: true, amount };
  } catch (error) {
    throw error;
  }
};

export const applyReferralBonus = async (referrerUserId: string, newUserId: string) => {
  try {
    const referralBonus = process.env.COCU_TOKEN_REFERRAL_BONUS || '10';
    const amount = parseFloat(referralBonus);

    // Recompensar al referidor
    await addTokens(referrerUserId, amount, {
      type: 'referral',
      description: `Referral bonus for new user ${newUserId}`,
    });

    // Dar bonificación al nuevo usuario
    await addTokens(newUserId, amount / 2, {
      type: 'bonus',
      description: `Welcome bonus from referral`,
    });

    return { success: true, referrerReward: amount, newUserReward: amount / 2 };
  } catch (error) {
    throw error;
  }
};

export const getTotalTokensInCirculation = async () => {
  try {
    const wallets = await db.select().from(tokenWallets);
    
    let totalTokens = 0;
    wallets.forEach((wallet) => {
      totalTokens += parseFloat(wallet.totalEarned as any);
    });

    return totalTokens;
  } catch (error) {
    throw error;
  }
};

export const getTopTokenHolders = async (limit: number = 10) => {
  try {
    const wallets = await db
      .select()
      .from(tokenWallets)
      .limit(limit);

    return wallets.sort((a, b) => {
      const balanceA = parseFloat(a.balance as any);
      const balanceB = parseFloat(b.balance as any);
      return balanceB - balanceA;
    });
  } catch (error) {
    throw error;
  }
};

