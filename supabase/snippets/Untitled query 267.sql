select *
from rooms as r
inner join users as u on u.id = r.booker_id
where r.id = '73e3d742-6b1e-4209-9a48-8c6e17881b57'