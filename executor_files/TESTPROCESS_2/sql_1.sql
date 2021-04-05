
begin ;
create table if not exists test_process_2 (
    a bigint, 
    b bigint
);
select pg_sleep(5);

commit;