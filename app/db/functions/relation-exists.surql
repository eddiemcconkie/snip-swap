DEFINE FUNCTION fn::relation_exists(
	$in: record(),
	$tb: string,
	$out: record()
) {
	LET $results = SELECT VALUE id FROM type::table($tb) WHERE in = $in AND out = $out;
    RETURN array::len($results) > 0;
};
