// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TribunalVerifier
 * @notice On-chain settlement contract for ZK-AI Tribunal verdicts
 * @dev Deployed on Tezos EVM (Etherlink) — accepts ZK proof commitments
 *      and records verifiable AI verdicts without revealing model weights
 *      or raw player behavioral data.
 *
 * In production this would integrate with:
 *   - EZKL verifier contract for Groth16 proof verification
 *   - Axiom/Brevis coprocessor for historical data proofs
 */
contract TribunalVerifier {

    // ── Events ────────────────────────────────────────────────────────────────
    event VerdictRecorded(
        uint256 indexed proofId,
        uint256 indexed round,
        address indexed submitter,
        bytes32 commitment,
        bytes32 analysisHash,
        bool guilty,
        uint256 timestamp
    );

    event VerdictDisputed(
        uint256 indexed proofId,
        address indexed disputer,
        uint256 timestamp
    );

    event DisputeResolved(
        uint256 indexed proofId,
        bool upheld,
        uint256 timestamp
    );

    // ── Structs ───────────────────────────────────────────────────────────────
    struct Verdict {
        uint256 proofId;
        uint256 round;
        address submitter;
        bytes32 commitment;      // Pedersen commitment to suspicion score
        bytes32 analysisHash;    // Hash of full behavioral analysis
        bytes32 proofPi;         // Groth16 proof π (truncated for gas)
        bytes32 vkHash;          // Verification key hash
        bool guilty;
        uint256 confidence;      // 0–100
        uint256 timestamp;
        bool disputed;
        bool resolved;
    }

    // ── State ─────────────────────────────────────────────────────────────────
    mapping(uint256 => Verdict) public verdicts;
    mapping(uint256 => address) public disputants;
    uint256 public verdictCount;
    address public owner;

    // ── Modifiers ─────────────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ── Core: Record a ZK-verified verdict ────────────────────────────────────
    /**
     * @param proofId      Unique proof identifier from the ZK prover
     * @param round        Game round number
     * @param commitment   Pedersen commitment to the suspicion score
     * @param analysisHash Hash of the full behavioral analysis (public input)
     * @param proofPi      Groth16 proof bytes (first 32 bytes)
     * @param vkHash       Verification key hash
     * @param guilty       Verdict: true = guilty, false = innocent
     * @param confidence   Confidence percentage (0–100)
     */
    function recordVerdict(
        uint256 proofId,
        uint256 round,
        bytes32 commitment,
        bytes32 analysisHash,
        bytes32 proofPi,
        bytes32 vkHash,
        bool guilty,
        uint256 confidence
    ) external {
        require(verdicts[proofId].timestamp == 0, "Proof already recorded");
        require(confidence <= 100, "Invalid confidence");

        verdicts[proofId] = Verdict({
            proofId:      proofId,
            round:        round,
            submitter:    msg.sender,
            commitment:   commitment,
            analysisHash: analysisHash,
            proofPi:      proofPi,
            vkHash:       vkHash,
            guilty:       guilty,
            confidence:   confidence,
            timestamp:    block.timestamp,
            disputed:     false,
            resolved:     false
        });

        verdictCount++;

        emit VerdictRecorded(
            proofId, round, msg.sender,
            commitment, analysisHash, guilty, block.timestamp
        );
    }

    // ── Dispute a verdict ─────────────────────────────────────────────────────
    function disputeVerdict(uint256 proofId) external {
        Verdict storage v = verdicts[proofId];
        require(v.timestamp != 0, "Verdict not found");
        require(!v.disputed, "Already disputed");
        require(block.timestamp <= v.timestamp + 1 hours, "Dispute window closed");

        v.disputed = true;
        disputants[proofId] = msg.sender;

        emit VerdictDisputed(proofId, msg.sender, block.timestamp);
    }

    // ── Resolve a dispute (owner/DAO) ─────────────────────────────────────────
    function resolveDispute(uint256 proofId, bool upheld) external onlyOwner {
        Verdict storage v = verdicts[proofId];
        require(v.disputed, "Not disputed");
        require(!v.resolved, "Already resolved");

        v.resolved = true;
        if (!upheld) v.guilty = !v.guilty; // Overturn verdict

        emit DisputeResolved(proofId, upheld, block.timestamp);
    }

    // ── View: Get verdict ─────────────────────────────────────────────────────
    function getVerdict(uint256 proofId) external view returns (Verdict memory) {
        return verdicts[proofId];
    }

    // ── View: Verify commitment (public) ──────────────────────────────────────
    /**
     * @notice Anyone can verify that a score commitment is consistent
     *         with a claimed score + blinding factor (ZK opening)
     */
    function verifyCommitment(
        bytes32 commitment,
        uint256 score,
        uint256 blindingFactor
    ) external pure returns (bool) {
        bytes32 computed = keccak256(abi.encodePacked(score, blindingFactor));
        return computed == commitment;
    }
}
