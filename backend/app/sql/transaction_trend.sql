-- Rolling 7-day transaction trend analysis
WITH DailyStats AS (
    SELECT 
        DATE(transaction_date) as day,
        SUM(amount) as daily_vol,
        COUNT(*) as daily_count
    FROM transactions
    WHERE transaction_date >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(transaction_date)
),
RollingStats AS (
    SELECT
        day,
        daily_vol,
        daily_count,
        AVG(daily_vol) OVER (
            ORDER BY day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as rolling_7d_avg
    FROM DailyStats
)
SELECT 
    day, 
    daily_vol as volume, 
    daily_count as count,
    rolling_7d_avg
FROM RollingStats
ORDER BY day DESC;
