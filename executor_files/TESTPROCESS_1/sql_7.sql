delete from test_process_1 where some_id = 1;
update test_process_1 set first_column = 1111 where some_id = 3;
begin;
select pg_sleep(5);
commit;