-- COLLECTIONS

-- get all snippets in a collection
select
  value ->saved[
    where collection = type::thing('collection', ${collectionId})
  ]->snippet
from $auth

-- get collections and their snippet counts
-- select
--   <-saved as saved
-- from snippet
-- group by saved.collection

-- get all collections
select ->saved.collection as collection
from $auth
group by collection
