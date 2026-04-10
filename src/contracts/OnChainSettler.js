// ─────────────────────────────────────────────────────────────────────────────
// OnChainSettler.js — Real Etherlink (Tezos EVM) on-chain settlement
// Uses ethers.js v6 + MetaMask/injected wallet when available
// Falls back to read-only provider (no wallet needed to play)
// ─────────────────────────────────────────────────────────────────────────────
import { ethers } from 'ethers';
import ABI from './TribunalVerifier.abi.json';

const CONTRACT_ADDRESS = import.meta.env?.VITE_CONTRACT_ADDRESS || null;

const ETHERLINK_TESTNET = {
  chainId:  '0x1f47b',   // 128123
  chainName: 'Etherlink Testnet',
  rpcUrls:  ['https://etherlink-testnet.rpc.thirdweb.com'],
  nativeCurrency: { name: 'XTZ', symbol: 'XTZ', decimals: 18 },
  blockExplorerUrls: ['https://testnet.explorer.etherlink.com'],
};

export class OnChainSettler {
  constructor() {
    this.verdicts    = [];
    this.provider    = null;
    this.signer      = null;
    this.contract    = null;
    this.walletAddr  = null;
    this.mode        = 'offline';   // 'wallet' | 'readonly' | 'offline'
    this._init();
  }

  async _init() {
    // No contract deployed yet — stay offline
    if (!CONTRACT_ADDRESS) {
      console.info('[Settler] No contract address — running in offline mode');
      return;
    }

    // Try MetaMask / injected wallet
    if (window.ethereum) {
      try {
        await this._connectWallet();
        return;
      } catch (e) {
        console.warn('[Settler] Wallet connect failed, trying read-only:', e.message);
      }
    }

    // Fallback: read-only provider (can read chain state, can't write)
    try {
      this.provider = new ethers.JsonRpcProvider(ETHERLINK_TESTNET.rpcUrls[0]);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.provider);
      this.mode = 'readonly';
      console.info('[Settler] Connected read-only to Etherlink testnet');
    } catch (e) {
      console.warn('[Settler] RPC failed, offline mode:', e.message);
    }
  }

  async _connectWallet() {
    this.provider = new ethers.BrowserProvider(window.ethereum);

    // Request accounts
    await this.provider.send('eth_requestAccounts', []);

    // Switch to / add Etherlink testnet
    try {
      await this.provider.send('wallet_switchEthereumChain', [{ chainId: ETHERLINK_TESTNET.chainId }]);
    } catch (switchErr) {
      if (switchErr.code === 4902) {
        await this.provider.send('wallet_addEthereumChain', [ETHERLINK_TESTNET]);
      } else throw switchErr;
    }

    this.signer     = await this.provider.getSigner();
    this.walletAddr = await this.signer.getAddress();
    this.contract   = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.signer);
    this.mode       = 'wallet';
    console.info('[Settler] Wallet connected:', this.walletAddr);
  }

  // ── Submit verdict to chain ────────────────────────────────────────────────
  async submitVerdict(proof) {
    const v  = proof.verdict;
    const pi = proof.publicInputs;

    // Always build a local receipt first (used in offline/readonly mode)
    const localReceipt = {
      txHash:      proof.txHash,
      blockNumber: null,
      contract:    CONTRACT_ADDRESS || '(not deployed)',
      network:     'Etherlink Testnet',
      chainId:     128123,
      gasUsed:     null,
      status:      'offline',
      proofId:     proof.id,
      verdict:     v,
      timestamp:   Date.now(),
      explorerUrl: null,
    };

    if (this.mode !== 'wallet' || !this.contract) {
      await new Promise(r => setTimeout(r, 500));
      this.verdicts.push(localReceipt);
      return localReceipt;
    }

    try {
      // Convert proof fields to bytes32
      const commitment   = ethers.zeroPadValue('0x' + proof.commitment.slice(0, 64), 32);
      const analysisHash = ethers.zeroPadValue('0x' + pi.analysisHash.padStart(64, '0'), 32);
      const proofPiBytes = ethers.zeroPadValue('0x' + proof.proofPi.slice(0, 64), 32);
      const vkHashBytes  = ethers.zeroPadValue('0x' + proof.vkHash.slice(0, 64), 32);

      const tx = await this.contract.recordVerdict(
        proof.id,
        pi.round,
        commitment,
        analysisHash,
        proofPiBytes,
        vkHashBytes,
        v.guilty,
        v.confidence,
      );

      const receipt = await tx.wait();

      const onChainReceipt = {
        txHash:      tx.hash,
        blockNumber: receipt.blockNumber,
        contract:    CONTRACT_ADDRESS,
        network:     'Etherlink Testnet',
        chainId:     128123,
        gasUsed:     receipt.gasUsed?.toString(),
        status:      'confirmed',
        proofId:     proof.id,
        verdict:     v,
        timestamp:   Date.now(),
        explorerUrl: `https://testnet.explorer.etherlink.com/tx/${tx.hash}`,
      };

      this.verdicts.push(onChainReceipt);
      console.info('[Settler] Verdict on-chain:', tx.hash);
      return onChainReceipt;

    } catch (e) {
      console.error('[Settler] TX failed:', e.message);
      // Return local receipt so game continues
      this.verdicts.push(localReceipt);
      return localReceipt;
    }
  }

  // ── Dispute a verdict on-chain ─────────────────────────────────────────────
  async disputeVerdict(proofId) {
    if (this.mode !== 'wallet' || !this.contract) {
      return { disputeId: `DISPUTE-${Date.now()}`, status: 'offline' };
    }
    try {
      const tx = await this.contract.disputeVerdict(proofId);
      await tx.wait();
      return {
        disputeId:   tx.hash,
        proofId,
        status:      'on-chain',
        explorerUrl: `https://testnet.explorer.etherlink.com/tx/${tx.hash}`,
      };
    } catch (e) {
      console.error('[Settler] Dispute TX failed:', e.message);
      return { disputeId: `DISPUTE-${Date.now()}`, status: 'failed', error: e.message };
    }
  }

  // ── Read a verdict from chain ──────────────────────────────────────────────
  async getVerdict(proofId) {
    if (!this.contract || this.mode === 'offline') return null;
    try {
      return await this.contract.getVerdict(proofId);
    } catch { return null; }
  }

  get isOnChain() { return this.mode === 'wallet'; }
  get statusLabel() {
    if (this.mode === 'wallet')   return `⛓ ${this.walletAddr.slice(0,6)}...${this.walletAddr.slice(-4)}`;
    if (this.mode === 'readonly') return '👁 Read-only';
    return '📴 Offline';
  }
}
