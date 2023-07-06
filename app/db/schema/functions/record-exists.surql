DEFINE FUNCTION fn::record_exists(
	$table: string,
  $id: string
) {
  LET $result = (SELECT VALUE id FROM type::thing($table, $id));
  RETURN array::len($result) = 1;
};
