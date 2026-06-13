// JobClaw Neo4j schema — run once on fresh Aura instance
// See context/architecture.md → Neo4j Graph Model

CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT job_listing_id IF NOT EXISTS FOR (j:JobListing) REQUIRE j.id IS UNIQUE;
CREATE CONSTRAINT application_id IF NOT EXISTS FOR (a:Application) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT agent_run_id IF NOT EXISTS FOR (r:AgentRun) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;

CREATE INDEX user_wallet IF NOT EXISTS FOR (u:User) ON (u.walletAddress);
CREATE INDEX user_web3auth IF NOT EXISTS FOR (u:User) ON (u.web3authSub);
