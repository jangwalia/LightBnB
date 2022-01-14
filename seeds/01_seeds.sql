-- INSERTING FAKE DATA INTO USERS TABLE
INSERT INTO users (name,email,password)
VALUES ('Louisa Meyer','jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
        ('Dominic Parks',' victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

--INSERTING FAKE DATA IN PROPERTIES TABLE
INSERT INTO properties(owner_id,title,description,
thumbnail_photo_url,cover_photo_url ,
cost_per_night,parking_spaces ,number_of_bathrooms,
number_of_bedrooms,country,street ,city ,province,
post_code,active 
)VALUES(1,'Speed lamp','description',
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350 ',
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',930.61,6,4,8,'Canada',
'536 Namsub Highway','Sotboske','Quebec','28142',true
),
(
  2,'Blank corner','description',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',852.34,6,6,7,'Canada',
'651 Nami Road','Bohbatev','Alberta',83680,true
),
(
3, 'Habit mix','description',
'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg',460.58,0,5,6,'Canada',
' 513 Powov Grove ','Jaebvap','Ontario',38051,true
);

--INSERTING FAKE DATA IN RESERVARTIONS TABLE
INSERT INTO reservations(start_date,end_date,property_id,guest_id) 
VALUES('2018-09-11','2018-09-26',2,3),
('2019-01-04','2019-02-01',1,2),
('2021-10-01','2021-10-14' ,3,1);

--INSERTING FAKE DATA IN PROPERTY-REVIEWS TABLE

INSERT INTO property_reviews(property_id,guest_id,reservations_id,rating,message)
VALUES(1,2,3,3,'messages'),
(2,3,1,4,'messages'),
(3,1,2,4,'messages');
