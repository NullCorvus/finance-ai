-- Diccionario de datos de Finance AI (PostgreSQL).
-- Adaptación a PostgreSQL de la plantilla Diccionario_Datos.sql (originalmente SQL Server).
-- Devuelve las mismas columnas del informe: REPORT, ServerName, DatabaseName, TableName, SchemaName,
-- ColumnName, DataType, MaxLength, IsNull, IsIdentity y Description.
SELECT
    'DATADICTIONARY'                                                AS "REPORT",
    COALESCE(NULLIF(current_setting('cluster_name'), ''),
             host(inet_server_addr()), 'localhost')                 AS "ServerName",
    current_database()                                              AS "DatabaseName",
    c.table_name                                                    AS "TableName",
    c.table_schema                                                  AS "SchemaName",
    c.column_name                                                   AS "ColumnName",
    CASE WHEN c.data_type = 'character varying' THEN 'varchar'
         ELSE c.data_type END                                       AS "DataType",
    c.character_maximum_length                                      AS "MaxLength",
    CASE WHEN c.is_nullable = 'NO' THEN 'NO' ELSE 'YES' END         AS "IsNull",
    CASE WHEN c.is_identity = 'YES' THEN 'YES' ELSE 'NO' END        AS "IsIdentity",
    COALESCE(col_description(
                 format('%I.%I', c.table_schema, c.table_name)::regclass::oid,
                 c.ordinal_position),
             '-- add description here')                             AS "Description"
FROM information_schema.columns c
JOIN information_schema.tables  t
  ON t.table_schema = c.table_schema AND t.table_name = c.table_name
WHERE t.table_type = 'BASE TABLE'
  AND c.table_schema = 'public'
  AND c.table_name <> 'alembic_version'
ORDER BY c.table_name, c.ordinal_position;
