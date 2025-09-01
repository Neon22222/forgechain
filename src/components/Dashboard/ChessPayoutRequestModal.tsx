'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, AlertTriangle, Crown, Copy, CheckCircle } from 'lucide-react'

interface ChessPayoutRequestModalProps {
  onClose: () => void
  onSubmit?: (amount: number, walletAddress: string) => void
  onDepositConfirm?: () => void
  deposit?: {
    transactionId: string
    amount: number
    coin: string
    network: string
    walletAddress: string
    positionId: string
    positionKey: string
    txHash?: string
  }
}

const ChessPayoutRequestModal: React.FC<ChessPayoutRequestModalProps> = ({ 
  onClose, 
  onSubmit, 
  onDepositConfirm, 
  deposit 
}) => {
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deposit) {
      if (onDepositConfirm) onDepositConfirm()
      onClose()
      return
    }
    if (onSubmit && amount && walletAddress) {
      onSubmit(parseFloat(amount), walletAddress)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="royal-modal rounded-2xl p-8 max-w-2xl w-full border border-yellow-500/30 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl mb-4 inline-block chess-piece-shadow"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {deposit ? '💰' : '🏦'}
            </motion.div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {deposit ? 'Complete Royal Tribute' : 'Treasury Withdrawal'}
            </h2>
            <p className="text-gray-300">
              {deposit ? 'Send tribute to secure your position in the kingdom' : 'Withdraw your conquered treasures'}
            </p>
          </div>

          {deposit && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Position Info */}
              <div className="glass-morphism rounded-xl p-6 mb-6 border border-purple-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span>Your Royal Position</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Battle Position</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {deposit.positionKey}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Position ID</p>
                    <p className="font-mono text-sm text-gray-300">
                      {deposit.positionId.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Wallet className="h-6 w-6 text-yellow-400" />
                  <span>Royal Treasury Instructions</span>
                </h3>
                
                <div className="grid gap-4">
                  {/* Amount */}
                  <div className="glass-morphism rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Tribute Amount</p>
                        <p className="text-3xl font-bold text-green-400">
                          {deposit.amount} {deposit.coin}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(deposit.amount.toString(), 'amount')}
                        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied === 'amount' ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-300" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="glass-morphism rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-sm text-gray-400 mb-1">Royal Treasury Vault</p>
                        <p className="font-mono text-sm text-blue-400 break-all">
                          {deposit.walletAddress}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(deposit.walletAddress, 'wallet')}
                        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied === 'wallet' ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-300" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Network */}
                  <div className="glass-morphism rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Royal Network</p>
                        <p className="text-lg font-bold text-purple-400">
                          {deposit.network}
                        </p>
                      </div>
                      <div className="text-2xl">🌐</div>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="glass-morphism rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-sm text-gray-400 mb-1">Royal Scroll ID (For Support)</p>
                        <p className="font-mono text-sm text-yellow-400">
                          {deposit.txHash || `DP${deposit.transactionId.slice(-5)}`}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(deposit.txHash || deposit.transactionId, 'txid')}
                        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied === 'txid' ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-300" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <motion.div 
                  className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl p-6 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-yellow-400 mb-3">Royal Decree & Warnings:</h4>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400">⚔️</span>
                          <span>Send the EXACT tribute amount specified above</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-400">🌐</span>
                          <span>Use only the {deposit.network} network</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">🛡️</span>
                          <span>Your position is permanently reserved (no time limit)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-400">📜</span>
                          <span>Keep your scroll ID for royal support</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-400">⚠️</span>
                          <span>Lesser tribute = account banishment & gold forfeiture</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-orange-400">🏰</span>
                          <span>Send from your registered royal vault address</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

          <form onSubmit={handleSubmit}>
            {!deposit && (
              <motion.div 
                className="space-y-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Withdrawal Amount (USDT)
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 royal-input rounded-xl"
                    placeholder="Enter amount to withdraw"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination Vault Address
                  </label>
                  <input 
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 royal-input rounded-xl"
                    placeholder="0x... or T..."
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button 
                type="button"
                onClick={onClose} 
                className="flex-1 px-6 py-4 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel Quest
              </motion.button>
              
              <motion.button 
                type="submit"
                className="flex-1 royal-button px-6 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {deposit ? '⚔️ Tribute Sent' : '💰 Request Treasury'}
              </motion.button>
            </div>
          </form>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6 text-gray-300" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ChessPayoutRequestModal