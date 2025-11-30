import { Request, Response } from 'express';
import {
  getWallet,
  getTransactionHistory,
  getTotalTokensInCirculation,
  getTopTokenHolders,
  addTokens,
  subtractTokens,
} from '../services/tokenService';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const wallet = await getWallet(req.user.userId);

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({
      wallet: {
        balance: parseFloat(wallet.balance as any),
        totalEarned: parseFloat(wallet.totalEarned as any),
        totalSpent: parseFloat(wallet.totalSpent as any),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyTransactions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const transactions = await getTransactionHistory(req.user.userId, limit);

    res.status(200).json({
      transactions,
      total: transactions.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addTokensToWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, type, description, rideId } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wallet = await addTokens(req.user.userId, amount, {
      type: type as any,
      description,
      rideId,
    });

    res.status(200).json({
      message: 'Tokens added successfully',
      wallet: {
        balance: parseFloat(wallet.balance as any),
        totalEarned: parseFloat(wallet.totalEarned as any),
        totalSpent: parseFloat(wallet.totalSpent as any),
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const subtractTokensFromWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, type, description } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wallet = await subtractTokens(req.user.userId, amount, {
      type: type as any,
      description,
    });

    res.status(200).json({
      message: 'Tokens subtracted successfully',
      wallet: {
        balance: parseFloat(wallet.balance as any),
        totalEarned: parseFloat(wallet.totalEarned as any),
        totalSpent: parseFloat(wallet.totalSpent as any),
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTokenStats = async (req: Request, res: Response) => {
  try {
    const totalTokens = await getTotalTokensInCirculation();
    const topHolders = await getTopTokenHolders(10);

    res.status(200).json({
      stats: {
        totalTokensInCirculation: totalTokens,
        topHolders: topHolders.map((holder) => ({
          userId: holder.userId,
          balance: parseFloat(holder.balance as any),
          totalEarned: parseFloat(holder.totalEarned as any),
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

