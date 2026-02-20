-- Ultra-efficient KPI aggregation using CTEs and Window Functions
WITH TransactionStats AS (
    SELECT 
        COUNT(*) AS total_txns,
        SUM(amount) AS total_vol,
        SUM(CASE WHEN sla_breach_flag = true THEN 1 ELSE 0 END) AS breach_count
    FROM transactions
),
RiskStats AS (
    SELECT 
        COUNT(*) AS high_risk_clients
    FROM clients
    WHERE risk_rating = 'High'
)
SELECT 
    ts.total_vol AS total_volume,
    ts.total_txns AS total_transactions,
    rs.high_risk_clients AS high_risk_count,
    (CAST(ts.breach_count AS FLOAT) / NULLIF(ts.total_txns, 0)) * 100 AS sla_breach_rate
FROM TransactionStats ts, RiskStats rs;
