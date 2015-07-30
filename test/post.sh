
curl -H "Content-Type: application/json" -X POST -d '{"sql":"EXPLAIN SELECT * FROM crs_XX_21_04_2015 LIMIT 1;"}' http://localhost:12345/q.json
echo

curl -H "Content-Type: application/json" -X POST -d '{"sql":"SELECT * FROM crs_XX_21_04_2015 LIMIT 1;"}' http://localhost:12345/q.json
echo

curl -H "Content-Type: application/json" -X POST -d '{"sql":"SELECT * FROM crs_XX_21_04_2015 LIMIT intentionalerror;"}' http://localhost:12345/q.json
echo

curl -H "Content-Type: application/json" -X POST -d '{"sql":"ANALYSE;"}' http://localhost:12345/q.json
echo

