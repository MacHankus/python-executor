create table if not exists TEST_PROCESS_1 (
    first_column bigint,
    second_column bigint
);
do $$
begin
    perform pg_sleep(1);
end $$;
