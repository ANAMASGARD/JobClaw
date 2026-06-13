// JobClaw Neo4j initialization — run once on fresh Aura instance.
// See context/architecture.md → Neo4j Graph Model
// Run: cypher-shell -u neo4j -p <password> -f scripts/neo4j-init.cypher

// ── Uniqueness Constraints ─────────────────────────────────────────────────────
CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT job_listing_id IF NOT EXISTS FOR (j:JobListing) REQUIRE j.id IS UNIQUE;
CREATE CONSTRAINT application_id IF NOT EXISTS FOR (a:Application) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT agent_run_id IF NOT EXISTS FOR (r:AgentRun) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT log_entry_id IF NOT EXISTS FOR (l:LogEntry) REQUIRE l.id IS UNIQUE;
CREATE CONSTRAINT onchain_log_id IF NOT EXISTS FOR (o:OnchainLog) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT delegation_id IF NOT EXISTS FOR (d:Delegation) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT resume_id IF NOT EXISTS FOR (r:Resume) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT x402_payment_id IF NOT EXISTS FOR (p:X402Payment) REQUIRE p.id IS UNIQUE;

// ── Lookup Indexes ─────────────────────────────────────────────────────────────
CREATE INDEX user_wallet IF NOT EXISTS FOR (u:User) ON (u.walletAddress);
CREATE INDEX user_web3auth IF NOT EXISTS FOR (u:User) ON (u.web3authSub);
CREATE INDEX user_smart_account IF NOT EXISTS FOR (u:User) ON (u.smartAccountAddress);
CREATE INDEX agent_run_phase IF NOT EXISTS FOR (r:AgentRun) ON (r.phase);
CREATE INDEX application_status IF NOT EXISTS FOR (a:Application) ON (a.status);
CREATE INDEX job_listing_source IF NOT EXISTS FOR (j:JobListing) ON (j.source);
CREATE INDEX onchain_log_type IF NOT EXISTS FOR (o:OnchainLog) ON (o.type);
