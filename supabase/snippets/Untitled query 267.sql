select *
from rooms as r
inner join users as u on u.id = r.booker_id
-- inner join devices as d on d.hoster_id = r.id
where r.id = '8b97536e-006b-42e2-b780-9f1dec9b8a42'