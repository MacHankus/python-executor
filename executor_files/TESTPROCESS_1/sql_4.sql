alter table TEST_PROCESS_1 drop fourth_column;
begin;
select pg_sleep(1);
commit;