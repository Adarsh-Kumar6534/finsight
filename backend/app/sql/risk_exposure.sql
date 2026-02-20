-- Complex Risk Exposure Analysis
WITH ClientExposure AS (
    SELECT 
        c.client_id,
        c.name,
        c.risk_rating,
        c.region,
        SUM(t.amount) as total_exposure,
        COUNT(t.transaction_id) as txn_count
    FROM clients c
    JOIN transactions t ON c.client_id = t.client_id
    GROUP BY c.client_id, c.name, c.risk_rating, c.region
),
RankedExposure AS (
    SELECT
        *,
        DENSE_RANK() OVER (PARTITION BY region ORDER BY total_exposure DESC) as region_rank,
        NTILE(4) OVER (ORDER BY total_exposure DESC) as exposure_quartile
    FROM ClientExposure
)
SELECT 
    client_id,
    name,
    risk_rating,
    region,
    total_exposure,
    region_rank,
    exposure_quartile
FROM RankedExposure
WHERE risk_rating IN ('Medium', 'High')
ORDER BY total_exposure DESC
LIMIT 50;
