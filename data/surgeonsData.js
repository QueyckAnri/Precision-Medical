// Surgeon dataset — all media containers left empty (dashed placeholders)
// for manual population later.

export const SURGEONS = [
  {
    id: 'lapshov',
    name: 'Prof. Artemiy Lapshov',
    nameShort: 'A. Lapshov',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcqbgvZXxFdPVUqAWjYnysowToTwzn4hT7am5gpB6E7KzbG_fKH-N37tlwraPsyo4ZMknxNSxkwKIcB1hPV_BWfk6lidNtti6Z35R_S_442tERuBQKqvzrt0DRx3mNk1aPcJRH_mmwffmKJOM3D5OJFUU4g2W3GjpCTtp1Ge0T5axNF38HuQznefd2OaqvD4Chc56vXHKCImzDV56jJ445oJkXYPAU6WXIiKrqyKsAxH4kPgPr-69oCA',
    specialty: 'NEURO-ONCOLOGY',
    specialtyFull: 'Neuro-Oncologist',
    experience: 20,
    rating: 4.9,
    surgeries: 3200,
    quote:
      'Every tumour has a boundary. Our job is to find that boundary, honour it, and remove exactly what must be removed — no more.',
    bio: [
      { year: '2004', text: 'M.D. with Honours — Sechenov First Moscow State Medical University' },
      { year: '2007', text: 'Neurosurgery Residency — Burdenko National Medical Research Center of Neurosurgery' },
      { year: '2010', text: 'International Fellowship in Neuro-Oncology — Memorial Sloan Kettering Cancer Center, New York' },
      { year: '2013', text: 'Professor of Neurosurgery — appointed at the age of 35' },
      { year: '2016', text: 'Introduction of Intraoperative MRI-guided resection protocol at Precision Medical' },
      { year: '2024', text: 'Recipient of the European Association of Neurosurgical Societies Excellence Award' },
    ],
    lastCase: {
      difficulty: 'EXTREME',
      successBadge: '100% SUCCESS',
      diagnosis: 'Grade IV Glioblastoma, left temporal lobe, eloquent cortex involvement',
      timeline: [
        { time: '09:00', text: 'Patient admission, express pre-op preparation, neuropsychological baseline mapping' },
        { time: '12:00', text: 'Precision tumor resection using intraoperative MRI / CT navigation, awake craniotomy phase' },
        { time: '48 hrs', text: 'Successful discharge and verticalization via Fast-Track protocol' },
      ],
    },
    reviews: [
      { author: 'Elena K.', stars: 5, text: 'Professor Lapshov operated on my husband. He explained every step with calm clarity. The recovery was faster than any of us dared hope.' },
      { author: 'Dmitri S.', stars: 5, text: 'World-class skill. The pre-op briefing was detailed, the surgery flawless, and the follow-up caring. We came from Zurich specifically for this team.' },
      { author: 'Maria P.', stars: 5, text: 'After three other consultations abroad, Professor Lapshov was the only one who offered a curative approach. He was right.' },
    ],
  },
  {
    id: 'vasilieva',
    name: 'Dr. Elena Vasilieva',
    nameShort: 'E. Vasilieva',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5js0qN5xFGyNvWR98UhguKyoxagoFL7S-gl1vSeHMqyKPqsbupHvgFp2zBsJgV8fplvqgOAAQZdUy1PTBYmIMxlzYhRBAFqTLdh1wtO3PRdJWxKjkUT-scTT66iJ57jvpE8F29-Md374BCzqo7OMFNaNU9BmT5J4tTrjs3_zjIqAzMbTVMNYN8OKf-L_0zoQjnCcHt2XVfta1tPRPZ4M1-QVJJgJmoSJYzWx1j6sETU_hWHb29AoKQ',
    specialty: 'VASCULAR NEUROSURGERY',
    specialtyFull: 'Vascular Neurosurgeon',
    experience: 15,
    rating: 4.8,
    surgeries: 1800,
    quote:
      'Blood vessels in the brain are rivers of life. We do not dam them; we restore their natural course.',
    bio: [
      { year: '2009', text: 'M.D. — Pirogov Russian National Research Medical University' },
      { year: '2012', text: 'Neurosurgery Residency — Sklifosovsky Research Institute, Moscow' },
      { year: '2014', text: 'Fellowship in Cerebrovascular Surgery — University Hospital Zurich' },
      { year: '2018', text: 'Lead of Vascular Neurosurgery Unit — Precision Medical' },
    ],
    lastCase: {
      difficulty: 'HIGH',
      successBadge: 'NO NEUROLOGICAL DEFICIT',
      diagnosis: 'Giant posterior communicating artery aneurysm with subarachnoid haemorrhage risk',
      timeline: [
        { time: '08:00', text: 'Emergency admission, CT angiography, rapid surgical planning' },
        { time: '11:30', text: 'Microsurgical clipping of aneurysm under fluorescence video-angiography control' },
        { time: '36 hrs', text: 'Discharge with full neurological function preserved' },
      ],
    },
    reviews: [
      { author: 'Andrei V.', stars: 5, text: 'Dr. Vasilieva moved with the precision of a watchmaker. No complications, full recovery.' },
      { author: 'Olga M.', stars: 5, text: 'She was calm when I was not. That confidence was the medicine I needed before entering the theatre.' },
    ],
  },
  {
    id: 'petrov',
    name: 'Dr. Mikhail Petrov',
    nameShort: 'M. Petrov',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYUseDtxQArRPb_aVuiwM67Ft-tC8LpXmBRb9STEtQym96Day9mGdN3XWfS9HcYSsdu96Dy0D5PdTSxXKWv3JstG09417hpYekqRB8q1tXZb-MduV4H0mz1qce9mgST_OgNjARs12Ipjx2y9KHvfKuHpOrKWE6INmFhYi-TL1_HMrKvn-iTRff5YkwD2-0k1EkyO3-uzO9ZZr8Lkfn3cXlGCG4I9cADZW420YYiNjcnAwVoXv5shtK7g',
    specialty: 'SPINAL NEUROSURGERY',
    specialtyFull: 'Spinal Neurosurgeon',
    experience: 12,
    rating: 4.9,
    surgeries: 1400,
    quote:
      'The spine is the architectural pillar of human movement. Restore it correctly and the whole body follows.',
    bio: [
      { year: '2012', text: 'M.D. — Kazan State Medical University' },
      { year: '2015', text: 'Neurosurgery Specialisation — Novosibirsk Research Institute of Traumatology' },
      { year: '2017', text: 'Advanced Endoscopic Spine Fellowship — Heidelberg University Hospital' },
      { year: '2020', text: 'Introduced minimally invasive TLIF protocol at Precision Medical' },
    ],
    lastCase: {
      difficulty: 'HIGH',
      successBadge: '100% SUCCESS',
      diagnosis: 'Multilevel lumbar stenosis with severe myelopathy, three prior failed surgeries',
      timeline: [
        { time: '10:00', text: 'Patient intake, intraoperative neuromonitoring setup, final imaging review' },
        { time: '13:00', text: 'Minimally invasive endoscopic multi-level decompression' },
        { time: '24 hrs', text: 'Patient standing and walking with physical therapist — Fast-Track protocol' },
      ],
    },
    reviews: [
      { author: 'Sergei N.', stars: 5, text: 'I had been told I would never walk without pain again. Dr. Petrov proved three surgeons wrong.' },
    ],
  },
  {
    id: 'sorokina',
    name: 'Dr. Anna Sorokina',
    nameShort: 'A. Sorokina',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF5l-8ZoSd16DtNvBIwPgOz2b_LKJTAo7B7NhSO4R2iTMxfxynJUBb7lU31-1JzAdIw58hL54LLEklbMjQxi3LZhqBy4GXMt4WwEWf7Tk_uPQQPegEWde88RNRMvY-uy6I1pOX7GEHLEPdn1Y3KqG0sy995_BkYVI_sD3Ay-uFhJ1rkV9UY-w70GY9RGmmR2VsgduLodZ9S57Mi3yHepOOjXRi12TJdUyWoy65JmvVM2DyQB5cTT8MRg',
    specialty: 'PEDIATRIC NEUROSURGERY',
    specialtyFull: 'Pediatric Neurosurgeon',
    experience: 10,
    rating: 4.7,
    surgeries: 820,
    quote:
      'Children heal with extraordinary resilience. Our role is to remove the obstacle and step aside.',
    bio: [
      { year: '2014', text: 'M.D. — Saint Petersburg State Paediatric Medical University' },
      { year: '2017', text: 'Paediatric Neurosurgery Residency — Russian Children\'s Clinical Hospital' },
      { year: '2019', text: 'International Fellowship — Great Ormond Street Hospital, London' },
      { year: '2022', text: 'Joined Precision Medical — Head of Paediatric Neurosurgery Unit' },
    ],
    lastCase: {
      difficulty: 'STANDARD',
      successBadge: 'NO NEUROLOGICAL DEFICIT',
      diagnosis: 'Cerebellar astrocytoma, 8-year-old patient',
      timeline: [
        { time: '09:30', text: 'Patient and family briefing, anaesthesia induction, scalp block' },
        { time: '12:00', text: 'Gross total resection under neuromonitoring and intraoperative ultrasound' },
        { time: '48 hrs', text: 'Child playing with parents, preparing for early discharge' },
      ],
    },
    reviews: [
      { author: 'Tatiana R.', stars: 5, text: 'She treated our daughter as if she were her own. We cannot express our gratitude.' },
      { author: 'Alexei B.', stars: 5, text: 'Every question was answered before we could ask it. Remarkable surgeon and human being.' },
    ],
  },
  {
    id: 'kovalev',
    name: 'Dr. Igor Kovalev',
    nameShort: 'I. Kovalev',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRF0MOfSy7saUYvBIEAKU_JLY8vZfj568JgKweneSd9sg6YspyACOIvAxpIudcCTSDDN1WLQnGguVWJnbP-R8LvyMFN0JsKl49QR_tRvRz5q-pjm09JKvRUob8SJBnIueCP9fuOvjIeHBsiz1-ve2DftYssODlgb36wOWvBvUUxENK1yrObVtEhDLl3Sj3D7UG2GYshWquvzYDeGEubjwXKeFMM_L7vbMxP0UCNWWOZIKPJE7MOs7gMA',
    specialty: 'FUNCTIONAL NEUROSURGERY',
    specialtyFull: 'Functional Neurosurgeon',
    experience: 18,
    rating: 4.8,
    surgeries: 2100,
    quote:
      'We do not simply stop tremor; we give people back their handwriting, their music, their independence.',
    bio: [
      { year: '2006', text: 'M.D. with Honours — Moscow State Medical-Stomatological University' },
      { year: '2010', text: 'Functional Neurosurgery Fellowship — Toronto Western Hospital, Canada' },
      { year: '2013', text: 'Deep Brain Stimulation specialist — established first DBS programme in Eastern Europe' },
      { year: '2018', text: 'Head of Functional Neurosurgery — Precision Medical' },
    ],
    lastCase: {
      difficulty: 'HIGH',
      successBadge: '100% SUCCESS',
      diagnosis: 'Advanced Parkinson\'s disease, medication-refractory tremor',
      timeline: [
        { time: '09:00', text: 'Stereotactic frame placement, high-resolution MRI targeting, patient fully awake' },
        { time: '11:00', text: 'Bilateral STN Deep Brain Stimulation electrode placement with microelectrode recording' },
        { time: '72 hrs', text: 'Patient demonstrating fine motor control, tremor fully resolved' },
      ],
    },
    reviews: [
      { author: 'Nikolai G.', stars: 5, text: 'I could not hold a glass of water. After DBS with Dr. Kovalev I play chess again.' },
      { author: 'Irina F.', stars: 5, text: 'The most technically gifted surgeon I have encountered in 30 years of medical practice.' },
    ],
  },
];
