--Insert statements

INSERT INTO public.account (account_firstname, account_lastname,
account_email, account_password)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Update statements

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

--Delete Statements

DELETE FROM public.account
WHERE account_firstname = 'Tony';

--update statements

UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM';

--Join Statements
SELECT classification_name,inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

--Update Statements with replace function

UPDATE public.inventory
SET 
inv_image =  REPLACE (inv_image,'images/', 'images/vehicles/'),
inv_thumbnail = REPLACE (inv_thumbnail,'images/', 'images/vehicles/' );

--





