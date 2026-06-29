-- À exécuter connecté à la base système « postgres » (pas à kwetu_garage).
-- Exemple : psql -U postgres -d postgres -f 00-create-database.sql
--
-- CREATE DATABASE ne peut pas être placé dans un bloc DO / transaction.

CREATE DATABASE kwetu_garage
  WITH
  ENCODING = 'UTF8'
  TEMPLATE = template0;
