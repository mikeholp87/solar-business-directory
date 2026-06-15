insert into public.territories (name, slug, region, counties, postcode_prefixes, status, priority, lead_volume)
values
('North Wales', 'north-wales', 'Wales', '["Gwynedd","Conwy","Denbighshire","Flintshire","Wrexham","Anglesey"]', '["LL","CH5","CH6","CH7","CH8"]', 'limited', false, 86),
('South Wales', 'south-wales', 'Wales', '["Cardiff","Swansea","Newport","Bridgend","Vale of Glamorgan"]', '["CF","SA","NP"]', 'priority', true, 128),
('Mid Wales', 'mid-wales', 'Wales', '["Powys","Ceredigion"]', '["SY","LD"]', 'available', false, 34),
('North West England', 'north-west-england', 'England', '["Greater Manchester","Merseyside","Lancashire","Cheshire"]', '["M","L","WA","WN","PR","BB","BL","OL","SK"]', 'full', false, 146),
('Yorkshire', 'yorkshire', 'England', '["West Yorkshire","South Yorkshire","North Yorkshire","East Riding"]', '["LS","YO","HU","HD","HX","S","BD","WF"]', 'available', false, 72),
('Midlands', 'midlands', 'England', '["West Midlands","Nottinghamshire","Derbyshire","Leicestershire","Warwickshire"]', '["B","CV","DE","LE","NG","WS","WV"]', 'limited', false, 91),
('South West England', 'south-west-england', 'England', '["Devon","Cornwall","Somerset","Dorset","Gloucestershire"]', '["EX","PL","TR","TA","BS","GL"]', 'available', false, 65),
('South East England', 'south-east-england', 'England', '["Kent","Surrey","Sussex","Hampshire","Berkshire"]', '["GU","RH","BN","TN","ME","RG","SO"]', 'available', false, 99),
('London', 'london', 'England', '["Greater London"]', '["E","EC","N","NW","SE","SW","W","WC"]', 'priority', true, 156),
('Scotland', 'scotland', 'Scotland', '["Central Belt","Highlands","Aberdeenshire","Borders"]', '["G","EH","AB","DD","FK","IV","PA","PH"]', 'available', false, 58),
('Isle of Man', 'isle-of-man', 'Isle of Man', '["Isle of Man"]', '["IM"]', 'available', false, 12);

insert into public.installers (company_name, slug, contact_name, email, phone, website, logo_url, description, mcs_number, bus_registered, accreditations_verified, services, areas_covered, monthly_install_capacity, survey_turnaround_days, status, subscription_status, lead_price, installer_fee_type)
values
('Cambrian Eco Heat Ltd', 'cambrian-eco-heat', 'Rhys Morgan', 'hello@cambrian.example', '02920 000001', 'https://example.com', 'CE', 'Welsh renewables contractor specialising in low-carbon heating upgrades.', 'MCS-984512', true, true, '["Air source heat pumps","Heat loss calculations","BUS applications","Solar PV"]', '["Bangor","Conwy","Wrexham","Aberystwyth"]', 14, 5, 'active', 'active', 38, 'monthly_directory'),
('Valley Renewables Group', 'valley-renewables-group', 'Ceri Lewis', 'hello@valley.example', '02920 000002', 'https://example.com', 'VR', 'Cardiff-based heating and electrical team.', 'MCS-441209', true, true, '["Air source heat pumps","Battery storage","Technical surveys","Finance available"]', '["Cardiff","Newport","Swansea","Bridgend"]', 18, 4, 'active', 'offline_active', 42, 'hybrid'),
('Northline Heat Partners', 'northline-heat-partners', 'Sam Taylor', 'hello@northline.example', '01610 000003', 'https://example.com', 'NH', 'Regional low-carbon heating partner for Manchester and Liverpool.', 'MCS-120773', true, true, '["Air source heat pumps","Ground source heat pumps","Heat loss calculations"]', '["Manchester","Liverpool","Preston","Warrington"]', 22, 6, 'active', 'active', 45, 'pay_per_lead'),
('Mercia Home Energy', 'mercia-home-energy', 'Amira Clarke', 'hello@mercia.example', '01210 000004', 'https://example.com', 'MH', 'Midlands installer combining heat pump design, PV and battery storage.', 'MCS-556712', true, true, '["Air source heat pumps","Solar PV","Battery storage","Finance available"]', '["Birmingham","Coventry","Leicester","Nottingham"]', 16, 7, 'active', 'active', 40, 'monthly_directory'),
('Thames Clean Heat', 'thames-clean-heat', 'Ben Shah', 'hello@thames.example', '02070 000005', 'https://example.com', 'TC', 'London and South East heating specialist.', 'MCS-700941', true, true, '["Air source heat pumps","Technical surveys","BUS applications","Warranty packages"]', '["London","Croydon","Guildford","Reading"]', 20, 3, 'active', 'active', 55, 'hybrid'),
('Caledonia Heatworks', 'caledonia-heatworks', 'Iona Kerr', 'hello@caledonia.example', '01410 000006', 'https://example.com', 'CH', 'Scottish installer experienced with colder-climate design.', 'MCS-612908', true, true, '["Air source heat pumps","Ground source heat pumps","Heat loss calculations"]', '["Glasgow","Edinburgh","Stirling","Perth"]', 12, 8, 'active', 'active', 39, 'monthly_directory');

insert into public.installer_territories (installer_id, territory_id, status)
select i.id, t.id, 'active'
from public.installers i
join public.territories t on
  (i.slug = 'cambrian-eco-heat' and t.slug in ('north-wales','mid-wales'))
  or (i.slug = 'valley-renewables-group' and t.slug = 'south-wales')
  or (i.slug = 'northline-heat-partners' and t.slug = 'north-west-england')
  or (i.slug = 'mercia-home-energy' and t.slug = 'midlands')
  or (i.slug = 'thames-clean-heat' and t.slug in ('london','south-east-england'))
  or (i.slug = 'caledonia-heatworks' and t.slug = 'scotland');

insert into public.installer_applications (company_name, contact_name, email, phone, mcs_number, bus_registered, services, areas_covered, preferred_territories, monthly_install_capacity, survey_turnaround_days, handles_bus_applications, completes_heat_loss_calculations, offers_solar, offers_battery, open_to_monthly_listing, open_to_pay_per_install, notes)
values
('Severn Green Homes', 'Alex Price', 'alex@severn.example', '07000 000101', 'MCS-APP-101', true, '["Air source heat pumps","Solar PV"]', '["Gloucester","Bristol"]', '["south-west-england"]', 9, 6, true, true, true, false, true, true, 'Interested in South West priority campaigns.'),
('Peak District Renewables', 'Morgan Hill', 'morgan@peak.example', '07000 000102', 'MCS-APP-102', true, '["Air source heat pumps","Battery storage"]', '["Derby","Sheffield"]', '["midlands","yorkshire"]', 11, 7, true, true, false, true, true, false, 'Can take overflow leads.');

insert into public.reviews (installer_id, customer_name, rating, review_text, approved)
select id, 'Rhian P.', 5, 'Clear survey, tidy installation and good support with the grant paperwork.', true from public.installers where slug = 'cambrian-eco-heat'
union all
select id, 'Martin D.', 5, 'They explained the running costs honestly and handled the BUS application.', true from public.installers where slug = 'valley-renewables-group'
union all
select id, 'Asha K.', 5, 'Fast survey and a sensible design for a London terrace.', true from public.installers where slug = 'thames-clean-heat';

insert into public.leads (first_name, last_name, email, phone, postcode, homeowner_status, current_heating_source, property_type, bedrooms, interests, consent_contact, consent_marketing, source, campaign, stage, referral_fee_due, invoice_status)
select
  'Homeowner ' || gs,
  'Example',
  'homeowner' || gs || '@example.com',
  '07000 000000',
  case when gs % 5 = 0 then 'CF10 1AA' when gs % 5 = 1 then 'LL57 1AA' when gs % 5 = 2 then 'M1 1AA' when gs % 5 = 3 then 'B1 1AA' else 'SW1A 1AA' end,
  true,
  case when gs % 3 = 0 then 'Gas' when gs % 3 = 1 then 'Oil' else 'Electric' end,
  case when gs % 4 = 0 then 'Detached' when gs % 4 = 1 then 'Semi-detached' when gs % 4 = 2 then 'Terraced' else 'Bungalow' end,
  3,
  '["Air source heat pump","Boiler Upgrade Scheme"]',
  true,
  gs % 2 = 0,
  'UKSD directory',
  'Seed campaign',
  (array['new_enquiry','contacted','qualified','survey_booked','bus_accepted','installation_completed'])[1 + (gs % 6)]::lead_stage,
  case when gs % 6 in (4,5) then 1250 else 0 end,
  case when gs % 6 in (4,5) then 'draft'::invoice_status else 'not_invoiced'::invoice_status end
from generate_series(1,20) gs;
