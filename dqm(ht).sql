-- valid service request codes
SELECT * FROM (
    SELECT * FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.servicerequest_table s
    ON fp.dim_patient_sk = s.patient_reference
    WHERE s.catalog_code IN (
     '2770068560', '2770068774', '2770069019', '2770069896', '2770070037',
     '2770070243', '2770070687', '2770071055', '2770083634', '2770083846',
     '2770084041', '2770084543', '2770084963', '2770085437', '2770085962',
     '2770086337', '2770278891', '2770278987', '2770279315', '2770280860',
     '2770281058', '2770281224', '2770285685', '2770285788', '7576095471',
     '4354156271', '7628610071', '7628758499', '7628759231', '7628759457',
     '7628759711', '7628760075', '7628760583', '7628760769', '7628761231',
     '7628776523', '10815685629', '10815681819', '10815723797',

     '4342771049','4342771233','4342771945','4342772563',
     )
)
WHERE catalog_code not IN (
     '2770068560', '2770068774', '2770069019', '2770069896', '2770070037',
     '2770070243', '2770070687', '2770071055', '2770083634', '2770083846',
     '2770084041', '2770084543', '2770084963', '2770085437', '2770085962',
     '2770086337', '2770278891', '2770278987', '2770279315', '2770280860',
     '2770281058', '2770281224', '2770285685', '2770285788', '7576095471',
     '4354156271', '7628610071', '7628758499', '7628759231', '7628759457',
     '7628759711', '7628760075', '7628760583', '7628760769', '7628761231',
    '7628776523', '10815685629', '10815681819', '10815723797',

     '4342771049','4342771233','4342771945','4342772563',
)

-- Only active records
SELECT * FROM (
    SELECT  
    s.active_ind AS one
    p.active_ind AS two
    e.active_ind AS three
    n.active_ind AS four
    cd.active_ind AS five
    cp.active_ind AS six
    FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.servicerequest s ON s.patient_reference = fp.dim_patient_sk 
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.person p ON  p.person_id = s.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e ON s.patient_reference = e.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_diagnosis_ext cd ON e.patient_reference = cd.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_problem_ext cp ON cd.patient_reference = cp.patient_reference
    WHERE s.active_ind = 1
    AND p.active_ind = 1
    AND e.active_ind = 1
    AND n.active_ind = 1
    AND cd.active_ind = 1
    AND cp.active_ind = 1
)
WHERE one != 1
    AND two != 1
    AND three != 1
    AND four != 1
    AND five != 1
    AND six != 1 

-- Only valid app source records 
SELECT * FROM (
    SELECT  
    s.active_ind AS one
    p.active_ind AS two
    e.active_ind AS three
    n.active_ind AS four
    cd.active_ind AS five
    cp.active_ind AS six
    FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.servicerequest s ON s.patient_reference = fp.dim_patient_sk 
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.person p ON  p.person_id = s.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e ON s.patient_reference = e.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_diagnosis_ext cd ON e.patient_reference = cd.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_problem_ext cp ON cd.patient_reference = cp.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.nomenclature_ext n ON n.nomenclature_id = cd.diagnosis_code
    WHERE s.app_source_id = 200
    AND p.app_source_id = 200
    AND e.app_source_id = 200
    AND n.app_source_id = 200
    AND cd.app_source_id = 200
    AND cp.app_source_id = 200
)
WHERE one != 200
    AND two != 200
    AND three != 200
    AND four != 200
    AND five != 200
    AND six != 200

-- Only valid active_status_code records 
SELECT * FROM (
    SELECT  
    s.active_ind AS one
    p.active_ind AS two
    e.active_ind AS three
    n.active_ind AS four
    cd.active_ind AS five
    cp.active_ind AS six
    FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.servicerequest s ON s.patient_reference = fp.dim_patient_sk 
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.person p ON  p.person_id = s.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e ON s.patient_reference = e.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_diagnosis_ext cd ON e.patient_reference = cd.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_problem_ext cp ON cd.patient_reference = cp.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.nomenclature_ext n ON n.nomenclature_id = cd.diagnosis_code
    WHERE s.app_source_id = 188
    AND e.app_source_id = 188
    AND n.app_source_id = 188
    AND cd.app_source_id = 188
    AND cp.app_source_id = 188
)
WHERE one != 188
    AND two != 188
    AND three != 188
    AND four != 188
    AND five != 188
    AND six != 188

-- valid encounter type codes
SELECT * FROM (
    SELECT * FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e ON fp.dim_patient_sk = e.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.person e ON fp.dim_patient_sk = e.patient_reference
    e.type_code IN (681428, 3093962577, 10737660693, 309309, 309310, 309312, 309308)
)
WHERE type_code NOT IN (681428, 3093962577, 10737660693, 309309, 309310, 309312, 309308)

-- valid  hospital discharge codes (encounter)
SELECT * FROM (
    SELECT * FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e
     ON fp.dim_patient_sk = e.patient_reference
    e.hosp_dischdispos_code NOT IN (312910, 638662, 638663, 679363, 679364, 3105897963, 638666, 638669, 679541, 679542)
)
WHERE type_code IN (312910, 638662, 638663, 679363, 679364, 3105897963, 638666, 638669, 679541, 679542)

-- valid patients
SELECT * FROM (
    SELECT * FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.person_table p
    ON fp.dim_patient_sk = p.person_id
    WHERE p.person_type_code = 903
    AND p.name_text NOT LIKE ','
    AND p.name_text NOT LIKE 'zz%'
    AND p.name_text NOT LIKE 'test bob'
    AND p.active_ind = 1
    AND p.app_source_id = 200
    AND p.deceased_dt_tm IS NULL
) 
WHERE person_type_code != 903
    AND name_text  LIKE ','
    AND name_text  LIKE 'zz%'
    AND name_text  LIKE 'test bob'
    AND active_ind != 1
    AND app_source_id != 200
    AND deceased_dt_tm IS NOT NULL 

-- valid observation_codes
SELECT * FROM (
    SELECT *  
    FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.observation o ON o.patient_reference = fp.dim_patient_sk 
    WHERE o.observation_code IN (3059679, 3788748719, 3059689, 3788728913)
)
WHERE observation_code NOT IN (3059679, 3788748719, 3059689, 3788728913)

-- valid nomenclature source identifiers
SELECT * FROM 
(
    SELECT * FROM dev_bh_delivery_gold.clinical.fact_person_clinical_measure fp
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.encounter e ON fp.dim_patient_sk = e.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.condition_diagnosis_ext cd ON e.patient_reference = cd.patient_reference
    LEFT JOIN dev_bh_delivery_silver.clinical_fhir.nomenclature_ext n ON n.nomenclature_id = cd.diagnosis_code
    WHERE n.source_identifier IN (
            '401.0', '401.1', '401.9',  '1215744012', '64176011', '3135013', '18632012', '80224019',
            '99042012', '108859012', '1209829017', '77481016', '131046010',
            '99206014', '2695883018', '93494011',  'Z34', 'O00', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15',
            'O16', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O28',
            'O29', 'O30', 'O31', 'O32', 'O33', 'O34', 'O35', 'O36', 'O40',
            'O41', 'O42', 'O43', 'O44', 'O45', 'O46', 'O47', 'O48', 'O60',
            'O71', 'O88', 'O90', 'O91', 'O92', 'O98', 'O99', 'O9A', '2973315017', '2951964014', '371604011', '371605012', '429598013',
            '3670615010', '262994015', '651019', '1224189011', '429597015', '3013977017',
            '2646260019', '191073013', '263013015', '262993014', '263026016',
            '371603017', '1224188015', '263101010', '2668577016', '263103013',
            '263105018', '263108016', '263107014', '263100011', '371607016', '263102015',
            '2770252017', '380609015', '3012807011', '429599017', '487407014',
            '133898015', '1218885012', '429600019',  'L89.119', 'L89.139', 'L89.149', 'L89.159', 'L89.209', 'L89.309',
            'L89.899', 'L89.90', 'M62.50', 'M62.81', 'M62.84', 'W01.0XXA',
            'W01.0XXD', 'W01.0XXS', 'W01.10XA', 'W01.10XD', 'W01.10XS',
            'W01.110A', 'W01.110D', 'W01.110S', 'W01.111A', 'W01.111D',
            'W01.111S', 'W01.118A', 'W01.118D', 'W01.118S', 'W01.119A',
            'W01.119D', 'W01.119S', 'W01.190A', 'W01.190D', 'W01.190S',
            'W01.198A', 'W01.198D', 'W01.198S', 'W06.XXXA', 'W06.XXXD',
            'W06.XXXS', 'W07.XXXA', 'W07.XXXD', 'W07.XXXS', 'W08.XXXA',
            'W08.XXXD', 'W08.XXXS', 'W10.0XXA', 'W10.0XXD', 'W10.0XXS',
            'W10.1XXA', 'W10.1XXD', 'W10.1XXS', 'W10.2XXA', 'W10.2XXD',
            'W10.2XXS', 'W10.8XXA', 'W10.8XXD', 'W10.8XXS', 'W10.9XXA',
            'W10.9XXD', 'W10.9XXS', 'W18.00XA', 'W18.00XD', 'W18.00XS',
            'W18.02XA', 'W18.02XD', 'W18.02XS', 'W18.09XA', 'W18.09XD',
            'W18.09XS', 'W18.11XA', 'W18.11XD', 'W18.11XS', 'W18.12XA',
            'W18.12XD', 'W18.12XS', 'W18.2XXA', 'W18.2XXD', 'W18.2XXS',
            'W18.30XA', 'W18.30XD', 'W18.30XS', 'W18.31XA', 'W18.31XD',
            'W18.31XS', 'W18.39XA', 'W18.39XD', 'W18.39XS', 'W19.XXXA',
            'W19.XXXD', 'W19.XXXS', 'Y92.199', 'Z59.3', 'Z73.6', 'Z74.01',
            'Z74.09', 'Z74.1', 'Z74.2', 'Z74.3', 'Z74.8', 'Z74.9', 'Z91.81',
            'Z99.11', 'Z99.3', 'Z99.81', 'Z99.89', 'R26.0', 'R26.1', 'R26.2',
            'R26.89', 'R26.9', 'R41.81', 'R53.1', 'R53.81', 'R53.83', 'R62.7',
            'R63.4', 'R63.6','R64','R54', 'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
            'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3',
            'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39',
            'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19',
            'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02',
            'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32',
            'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F10.27', 'F10.96',
            'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09',
            'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1',
            'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33',
            'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812',
            'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9',
            'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112',
            'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22',
            'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2',
            'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2',
            'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6','F04', 'G10','G20', 'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
            'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3',
            'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39',
            'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19',
            'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02',
            'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32',
            'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F10.27', 'F10.96',
            'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09',
            'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1',
            'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33',
            'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812',
            'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9',
            'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112',
            'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22',
            'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2',
            'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2',
            'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6'
        )
)
WHERE source_identifier NOT IN (
'401.0', '401.1', '401.9',  '1215744012', '64176011', '3135013', '18632012', '80224019',
            '99042012', '108859012', '1209829017', '77481016', '131046010',
            '99206014', '2695883018', '93494011',  'Z34', 'O00', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15',
            'O16', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O28',
            'O29', 'O30', 'O31', 'O32', 'O33', 'O34', 'O35', 'O36', 'O40',
            'O41', 'O42', 'O43', 'O44', 'O45', 'O46', 'O47', 'O48', 'O60',
            'O71', 'O88', 'O90', 'O91', 'O92', 'O98', 'O99', 'O9A', '2973315017', '2951964014', '371604011', '371605012', '429598013',
            '3670615010', '262994015', '651019', '1224189011', '429597015', '3013977017',
            '2646260019', '191073013', '263013015', '262993014', '263026016',
            '371603017', '1224188015', '263101010', '2668577016', '263103013',
            '263105018', '263108016', '263107014', '263100011', '371607016', '263102015',
            '2770252017', '380609015', '3012807011', '429599017', '487407014',
            '133898015', '1218885012', '429600019',  'L89.119', 'L89.139', 'L89.149', 'L89.159', 'L89.209', 'L89.309',
            'L89.899', 'L89.90', 'M62.50', 'M62.81', 'M62.84', 'W01.0XXA',
            'W01.0XXD', 'W01.0XXS', 'W01.10XA', 'W01.10XD', 'W01.10XS',
            'W01.110A', 'W01.110D', 'W01.110S', 'W01.111A', 'W01.111D',
            'W01.111S', 'W01.118A', 'W01.118D', 'W01.118S', 'W01.119A',
            'W01.119D', 'W01.119S', 'W01.190A', 'W01.190D', 'W01.190S',
            'W01.198A', 'W01.198D', 'W01.198S', 'W06.XXXA', 'W06.XXXD',
            'W06.XXXS', 'W07.XXXA', 'W07.XXXD', 'W07.XXXS', 'W08.XXXA',
            'W08.XXXD', 'W08.XXXS', 'W10.0XXA', 'W10.0XXD', 'W10.0XXS',
            'W10.1XXA', 'W10.1XXD', 'W10.1XXS', 'W10.2XXA', 'W10.2XXD',
            'W10.2XXS', 'W10.8XXA', 'W10.8XXD', 'W10.8XXS', 'W10.9XXA',
            'W10.9XXD', 'W10.9XXS', 'W18.00XA', 'W18.00XD', 'W18.00XS',
            'W18.02XA', 'W18.02XD', 'W18.02XS', 'W18.09XA', 'W18.09XD',
            'W18.09XS', 'W18.11XA', 'W18.11XD', 'W18.11XS', 'W18.12XA',
            'W18.12XD', 'W18.12XS', 'W18.2XXA', 'W18.2XXD', 'W18.2XXS',
            'W18.30XA', 'W18.30XD', 'W18.30XS', 'W18.31XA', 'W18.31XD',
            'W18.31XS', 'W18.39XA', 'W18.39XD', 'W18.39XS', 'W19.XXXA',
            'W19.XXXD', 'W19.XXXS', 'Y92.199', 'Z59.3', 'Z73.6', 'Z74.01',
            'Z74.09', 'Z74.1', 'Z74.2', 'Z74.3', 'Z74.8', 'Z74.9', 'Z91.81',
            'Z99.11', 'Z99.3', 'Z99.81', 'Z99.89', 'R26.0', 'R26.1', 'R26.2',
            'R26.89', 'R26.9', 'R41.81', 'R53.1', 'R53.81', 'R53.83', 'R62.7',
            'R63.4', 'R63.6','R64','R54', 'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
            'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3',
            'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39',
            'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19',
            'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02',
            'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32',
            'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F10.27', 'F10.96',
            'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09',
            'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1',
            'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33',
            'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812',
            'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9',
            'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112',
            'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22',
            'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2',
            'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2',
            'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6','F04', 'G10','G20', 'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
            'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3',
            'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39',
            'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19',
            'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02',
            'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32',
            'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F10.27', 'F10.96',
            'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09',
            'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1',
            'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33',
            'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812',
            'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9',
            'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112',
            'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22',
            'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2',
            'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2',
            'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6'
)