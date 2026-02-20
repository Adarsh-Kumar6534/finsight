-- Operations breakdown (Placeholder)
SELECT 
    region,
    status,
    COUNT(*) as op_count
FROM operations
GROUP BY region, status;
