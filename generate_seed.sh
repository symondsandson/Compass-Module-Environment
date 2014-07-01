# export app info
pg_dump --inserts -O -N -d emp_gr_development -t activity_classifications -t oauth_applications -a \
  | awk '{ gsub(/quill-questions-module.herokuapp.com/, "localhost:3002"); print }'  \
  > Compass/db/oauth.sql

# export activities
psql -d emp_gr_development -c "create table topic_id_1_activities as select * from activities where topic_id = 1;"
pg_dump --inserts -O -N -d emp_gr_development -t topic_id_1_activities -t topics -t sections -a \
  | sed s/topic_id_1_// \
  > Compass/db/activities.sql
psql -d emp_gr_development -c "drop table topic_id_1_activities;"

# export quill info
pg_dump --inserts -O -N -d emp_gr_development -a \
  -t categories \
  -t grammar_rules \
  -t grammar_tests \
  -t rule_examples \
  -t rule_questions \
  -t rules \
  -t rules_misseds \
  > Quill-Lessons/db/seed.sql
