// Neo4j driver singleton — server-only. Never import this in client components.
// All graph access must go through lib/neo4j/repositories/*.

import neo4j, { type Driver, type Session } from "neo4j-driver";

let _driver: Driver | null = null;

export function getDriver(): Driver {
  if (!_driver) {
    const uri = process.env.NEO4J_URI;
    const username = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !username || !password) {
      throw new Error(
        "Missing Neo4j env vars: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD"
      );
    }

    _driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 10000,
      }
    );
  }
  return _driver;
}

export async function withSession<T>(
  fn: (session: Session) => Promise<T>
): Promise<T> {
  const session = getDriver().session({ database: "neo4j" });
  try {
    return await fn(session);
  } finally {
    await session.close();
  }
}
