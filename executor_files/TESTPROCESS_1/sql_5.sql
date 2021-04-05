alter table test_process_1 rename column third_column to some_id;
begin;
select pg_sleep(1);
commit;