begin;

select plan(4);


select is(
  (public.save_enquiry_with_content_dedup(
    '11111111-1111-4111-8111-111111111111',
    'TTT-TEST-0000000000000001',
    'Test Customer',
    'dedup-test@example.com',
    null,
    'Nepal',
    'email',
    'trekking',
    'Please send details about this trekking itinerary.',
    null,
    true,
    2::smallint,
    'trek',
    'everest-base-camp',
    null,
    repeat('a', 64),
    '/contact',
    'pending'
  )->>'duplicate')::boolean,
  false,
  'the first matching enquiry is inserted'
);

select is(
  public.save_enquiry_with_content_dedup(
    '11111111-1111-4111-8111-111111111111',
    'TTT-TEST-0000000000000002',
    'Test Customer',
    'dedup-test@example.com',
    null,
    'Nepal',
    'email',
    'trekking',
    'Please send details about this trekking itinerary.',
    null,
    true,
    2::smallint,
    'trek',
    'everest-base-camp',
    null,
    repeat('a', 64),
    '/contact',
    'pending'
  )->>'duplicate_reason',
  'submission',
  'retries with the same submission id resolve to the original row'
);

select is(
  public.save_enquiry_with_content_dedup(
    '22222222-2222-4222-8222-222222222222',
    'TTT-TEST-0000000000000003',
    'Test Customer',
    'dedup-test@example.com',
    null,
    'Nepal',
    'email',
    'trekking',
    'Please send details about this trekking itinerary.',
    null,
    true,
    2::smallint,
    'trek',
    'everest-base-camp',
    null,
    repeat('a', 64),
    '/contact',
    'pending'
  )->>'duplicate_reason',
  'content',
  'a different submission id with the same fingerprint is suppressed'
);

select is(
  (select count(*)::integer
   from public.enquiries
   where content_fingerprint = repeat('a', 64)),
  1,
  'only one enquiry row exists for the fingerprint'
);

select * from finish();

rollback;
