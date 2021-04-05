alter table TEST_PROCESS_1 add third_column bigint;
begin;
select pg_sleep(1);
commit;