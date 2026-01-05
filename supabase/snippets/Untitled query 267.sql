select r.name
from rooms as r
-- inner join users as u on u.id = r.booker_id
inner join devices as d on d.hoster_id = r.id
