import { getConnection } from 'typeorm';

export const getDbConnection = async () => {
  const con = getConnection();
  if (!con.isConnected) await con.connect();
  return con;
};
