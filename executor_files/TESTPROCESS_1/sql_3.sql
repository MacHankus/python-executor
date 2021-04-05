alter table TEST_PROCESS_1 add fourth_column bigint;
begin;
select pg_sleep(1);
commit;