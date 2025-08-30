--  GRAIN IS PATIENT_ID
WITH 
-- =====================================================
-- BASE PATIENT AND ENCOUNTER DATA (with office visits)
-- =====================================================
office_visits AS (
    SELECT DISTINCT
        sr.encounter_reference,
        sr.patient_reference,
        sr.catalog_code
    FROM servicerequest sr
    WHERE sr.catalog_code IN (
        '2770068560', '2770068774', '2770069019', '2770069896', '2770070037',
        '2770070243', '2770070687', '2770071055', '2770083634', '2770083846',
        '2770084041', '2770084543', '2770084963', '2770085437', '2770085962',
        '2770086337', '2770278891', '2770278987', '2770279315', '2770280860',
        '2770281058', '2770281224', '2770285685', '2770285788', '7576095471',
        '4354156271', '7628610071', '7628758499', '7628759231', '7628759457',
        '7628759711', '7628760075', '7628760583', '7628760769', '7628761231',
        '7628776523', '10815685629', '10815681819', '10815723797'
    )
    AND sr.active_ind = 1
    AND sr.app_source_id = 200
),

base_encounters AS (
    SELECT 
        e.encounter_id,
        e.patient_reference,
        e.reg_dt_tm,
        e.type_code
    FROM encounter e
    INNER JOIN office_visits ov 
        ON ov.encounter_reference = e.encounter_id
        WHERE CAST(e.reg_dt_tm AS DATE) BETWEEN ADD_MONTHS(CURRENT_DATE, -12) AND CURRENT_DATE
        AND e.type_code IN (681428, 3093962577, 10737660693)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference ORDER BY e.reg_dt_tm DESC) = 1
),

base_patients AS (
    SELECT 
        p.person_id,
        p.name_text,
        p.birthdate_local,
    FROM person p
    WHERE p.person_type_code = 903
        AND p.name_text NOT LIKE ','
        AND p.name_text NOT LIKE 'zz%'
        AND p.name_text NOT LIKE 'test bob'
        AND p.active_ind = 1
        AND p.app_source_id = 200
        AND p.deceased_dt_tm IS NULL
    QUALIFY ROW_NUMBER() OVER (PARTITION BY p.person_id ORDER BY p.meta_lastupdated DESC) = 1
),


valid_patients AS (
    SELECT * FROM (
            SELECT 
        be.*,
        pd.name_text AS patient_name,
        pd.birthdate_local,
        pd.patient_age_current,
        FLOOR(DATEDIFF(day, pd.birthdate_local, be.reg_dt_tm) / 365.25) AS patient_age_at_visit
        FLOOR(DATEDIFF(day, pd.birthdate_local, CURRENT_DATE) / 365.25) AS patient_age_current
    FROM base_encounters be
    INNER JOIN base_patients pd 
        ON be.patient_reference = pd.person_id
    )
    WHERE patient_age_at_visit  BETWEEN 18 AND 25
    AND patient_age_current <= 85
),


-- =====================================================
-- PHYSICIAN INFORMATION (attending and PCP)
-- =====================================================

--join with valid_patients and inner join encntr_participant_ext
attending_physicians AS (
    SELECT 
        epe.encounter_id,
        epe.participant_indiv_ref,
        p.practitioner_id,
        pie.identifier_value AS npi
    FROM encntr_participant_ext epe
    WHERE epe.app_source_id = '200'
        AND epe.participant_period_end > CURRENT_DATE
        AND epe.participant_indiv_ref <> 0
        AND epe.active_ind = 1
        AND epe.participant_type_code = 1119
    QUALIFY ROW_NUMBER() OVER (PARTITION BY epe.encounter_id ORDER BY p.practitioner_id) = 1
),-- not used in select, we can remove it.


-- CTE for patient PCP information - DEDUPLICATED
patient_pcp AS (
--     SELECT 
--         pr.person_id,
--         pr.practitionerrole_id AS prsnl_person_id,
--         p.practitioner_id,
--         pie.identifier_value AS pcp_npi
--     FROM practitionerrole pr
--     INNER JOIN practitioner p
--         ON pr.practitionerrole_id = p.practitioner_id
--         AND p.app_source_id = '200'
--         AND p.active_ind = 1
--     LEFT JOIN practitioner_identifier_ext pie
--         ON pie.practitioner_id = p.practitioner_id
--         AND pie.active_ind = 1
--         AND pie.app_source_id = 200
--         AND pie.identifier_type_code = '28769904'
--     WHERE pr.priority_seq = 0
--         AND pr.app_source_id = 200
--         AND pr.period_end > CURRENT_DATE
--         AND pr.practitionerrole_id <> 0
--         AND pr.active_ind = 1
--         AND pr.person_prsnl_r_code = 1115
--     QUALIFY ROW_NUMBER() OVER (PARTITION BY pr.person_id ORDER BY pr.practitionerrole_id) = 1

region provider
),
---- not used in select, we can remove it.


-- =====================================================
-- HYPERTENSION PATIENTS (diagnosis and problem list)
-- =====================================================

hypertension_dx_diagnosis AS (
    SELECT  
        e.encounter_id AS enc,
        e.patient_reference AS pat_id,
        n.source_identifier AS HTNdiag_code,
        CAST(cd.onsetdatetime AS DATE) AS diag_time
    FROM encounter e
    JOIN condition_diagnosis_ext cd
        ON e.patient_reference = cd.patient_reference
        AND cd.app_source_id = 200
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE (n.source_identifier IN ('401.0', '401.1', '401.9')
           OR LEFT(n.source_identifier, 3) IN ('I10'))
        AND cd.onsetdatetime <= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE)||'0630', 'yyyyMMdd')
        AND e.hosp_dischdispos_code NOT IN (312910, 638662, 638663, 679363, 679364, 3105897963)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference, n.nomenclature_id
                              ORDER BY cd.onsetdatetime DESC) = 1
),

hypertension_dx_problem AS (
    SELECT  
        e.encounter_id AS enc,
        e.patient_reference AS pat_id,
        n.source_identifier AS HTNdiag_code,
        CAST(cp.meta_lastupdated - INTERVAL '7' HOUR AS DATE) AS diag_time
    FROM encounter e
    JOIN condition_problem_ext cp
        ON e.patient_reference = cp.patient_reference
        AND cp.app_source_id = 200
        AND cp.active_status_code = 188
        AND cp.active_ind = 1
        AND cp.clinicalstatus = 3301
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cp.problem_code
    WHERE n.source_identifier IN (
        '1215744012', '64176011', '3135013', '18632012', '80224019',
        '99042012', '108859012', '1209829017', '77481016', '131046010',
        '99206014', '2695883018', '93494011'
    )
        AND cp.meta_lastupdated <= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE)||'0630', 'yyyyMMdd')
        AND e.hosp_dischdispos_code NOT IN (312910, 638662, 638663, 679363, 679364, 3105897963)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference, n.nomenclature_id
                              ORDER BY cp.meta_lastupdated DESC) = 1
),

hypertension_dx AS (
    SELECT
        pat_id,
        diag_time,
        HTNdiag_code,
        enc
    FROM (
        SELECT * FROM hypertension_dx_diagnosis
        UNION
        SELECT * FROM hypertension_dx_problem
    ) nested
    QUALIFY ROW_NUMBER() OVER (PARTITION BY pat_id ORDER BY diag_time DESC) = 1
),

-- Hypertension patients
hypertension_patients AS (
    SELECT ve.*
    FROM valid_patients ve
    INNER JOIN hypertension_dx htn 
        ON htn.pat_id = ve.patient_reference
),


-- =====================================================
-- ALL EXCLUSIONS 
-- =====================================================
-- CTE for EXCLUSION 1: ESRD, CKD S5, KIDNEY Trans
exc1_esrd_ckd AS (
    SELECT
        cd.diagnosis_code AS id,
        n.source_identifier,
        cd.patient_reference AS person_id,
        cd.onsetdatetime AS diag_dt_tm
    FROM condition_diagnosis_ext cd
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE n.source_identifier IN ('N18.6', 'Z94.0', 'N18.5')
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
        AND cd.app_source_id = 200
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cd.patient_reference
                              ORDER BY cd.onsetdatetime DESC) = 1
),


-- CTE for EXCLUSION 2: PREGNANCY via Dx
exc2_pregnancy_dx AS (
    SELECT
        cd.diagnosis_code AS id,
        n.source_identifier,
        cd.patient_reference AS person_id,
        cd.encounter_reference AS enc,
        cd.onsetdatetime AS diag_dt_tm
    FROM condition_diagnosis_ext cd
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE (n.source_identifier IN ('Z33.1','Z33.3')
           OR LEFT(n.source_identifier, 3) IN (
                'Z34', 'O00', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15',
                'O16', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O28',
                'O29', 'O30', 'O31', 'O32', 'O33', 'O34', 'O35', 'O36', 'O40',
                'O41', 'O42', 'O43', 'O44', 'O45', 'O46', 'O47', 'O48', 'O60',
                'O71', 'O88', 'O90', 'O91', 'O92', 'O98', 'O99', 'O9A'
           ))
        AND (cd.onsetdatetime - INTERVAL '7' HOUR) BETWEEN ADD_MONTHS(CURRENT_DATE, -10) AND CURRENT_DATE
        AND cd.app_source_id = 200
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cd.patient_reference
                              ORDER BY cd.onsetdatetime DESC) = 1
),


-- CTE for EXCLUSION 3: PREGNANCY via PROBLEM LIST
exc3_pregnancy_problem AS (
    SELECT
        cp.problem_code AS id3,
        n.source_identifier,
        cp.patient_reference AS person_id
    FROM condition_problem_ext cp
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cp.problem_code
    WHERE cp.app_source_id = 200
        AND cp.active_status_code = 188
        AND cp.active_ind = 1
        AND cp.clinicalstatus IN (3301, 3305)
        AND n.source_identifier IN (
            '2973315017', '2951964014', '371604011', '371605012', '429598013',
            '3670615010', '262994015', '651019', '1224189011', '429597015', '3013977017',
            '2646260019', '191073013', '263013015', '262993014', '263026016',
            '371603017', '1224188015', '263101010', '2668577016', '263103013',
            '263105018', '263108016', '263107014', '263100011', '371607016', '263102015',
            '2770252017', '380609015', '3012807011', '429599017', '487407014',
            '133898015', '1218885012', '429600019'
        )
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cp.patient_reference
                              ORDER BY cp.meta_lastupdated DESC) = 1
),


-- CTE for EXCLUSION 4: RENAL/KIDNEY TRANSFER
exc4_renal_transfer AS (
    SELECT
        cp.patient_reference AS person_id,
        cp.problem_id
    FROM condition_problem_ext cp
    WHERE (cp.code_text LIKE '%renal transplant%' 
           OR cp.code_text LIKE '%dialysis%'
           OR cp.code_text LIKE '%esrd%'
           OR cp.code_text LIKE '%kidney trans%')
        AND cp.clinicalstatus <> 3302
        AND cp.active_status_code = 188
        AND cp.active_ind = 1
        AND cp.app_source_id = 200
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cp.patient_reference 
                              ORDER BY cp.meta_lastupdated DESC) = 1
),


-- CTE for EXCLUSION 5: DIALYSIS
exc5_dialysis AS (
    SELECT
        cd.diagnosis_code AS id,
        n.source_identifier,
        cd.patient_reference AS person_id,
        cd.onsetdatetime AS diag_dt_tm
    FROM condition_diagnosis_ext cd
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE LEFT(n.source_identifier, 3) IN ('Z49','Z91','Z99')
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
        AND cd.app_source_id = 200
        AND n.principle_type_code = 1252
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cd.patient_reference
                              ORDER BY cd.onsetdatetime DESC) = 1
),


-- CTE for EXCLUSION 8: PATIENTS 66+ W/ SNP OR LONG-TERM CARE
exc8_longterm AS (
    SELECT
        sr.patient_reference AS person_id,
        sr.occurrence_datetime AS orig_order_dt_tm,
        sr.catalog_code,
        CASE WHEN sr.catalog_code IS NOT NULL THEN sr.order_mnemonic ELSE NULL END AS exc8,
        CASE WHEN sr.catalog_code IS NOT NULL 
             THEN CAST((sr.occurrence_datetime - INTERVAL '7' HOUR) AS DATE) END AS ltr_order_day
    FROM servicerequest sr
        WHERE sr.active_ind = 1
        AND sr.app_source_id = 200
        AND sr.active_status_code = 188
        AND sr.occurrence_datetime >= ADD_MONTHS(CURRENT_DATE, -12)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY sr.patient_reference
                              ORDER BY sr.occurrence_datetime DESC) = 1
), --catalog code missing


-- CTE for EXCLUSION 9: Frailty SNOMED codes portion
exc9_frailty AS (
    SELECT
        sr.patient_reference AS person_id,
        CASE WHEN sr.catalog_code IS NOT NULL THEN sr.order_mnemonic ELSE NULL END AS frailty,
        CASE WHEN sr.catalog_code IS NOT NULL 
             THEN (sr.occurrence_datetime - INTERVAL '7' HOUR) END AS fra_order_time,
        CASE WHEN sr.catalog_code IS NOT NULL 
             THEN CAST((sr.occurrence_datetime - INTERVAL '7' HOUR) AS DATE) END AS fra_order_day
    FROM servicerequest sr
    WHERE sr.app_source_id = 200
        AND sr.active_ind = 1
        AND sr.active_status_code = 188
        AND sr.catalog_code IN ('4342771049','4342771233','4342771945','4342772563')
        AND (sr.occurrence_datetime - INTERVAL '7' HOUR) >= ADD_MONTHS(CURRENT_DATE, -12)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY sr.patient_reference
                              ORDER BY sr.occurrence_datetime DESC) = 1
),


-- CTE for EXCLUSION 91: Dementia meds portion
exc91_dementia_meds AS (
    SELECT  
        sr.patient_reference AS person_id,
        CASE WHEN sr.catalog_code IS NOT NULL THEN sr.order_mnemonic ELSE NULL END AS dem_meds,
        CASE WHEN sr.catalog_code IS NOT NULL 
             THEN (sr.occurrence_datetime - INTERVAL '7' HOUR) END AS order_time1,
        CASE WHEN sr.catalog_code IS NOT NULL 
             THEN CAST((sr.occurrence_datetime - INTERVAL '7' HOUR) AS DATE) END AS med_order_day
    FROM servicerequest sr
    WHERE sr.app_source_id = 200
        AND sr.active_ind = 1
        AND sr.active_status_code = 188
        AND (sr.occurrence_datetime - INTERVAL '7' HOUR) >= ADD_MONTHS(CURRENT_DATE, -12)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY sr.patient_reference
                              ORDER BY sr.occurrence_datetime DESC) = 1
),--catalog code missing


-- CTE for EXCLUSION 10: Frailty ICD10 codes
exc10_frailty_icd AS (
    SELECT
        cd.diagnosis_code AS id,
        CASE WHEN n.source_identifier IS NOT NULL THEN n.source_identifier ELSE NULL END AS frailty1,
        cd.patient_reference AS personid,
        cd.onsetdatetime AS diag_dt_tm
    FROM condition_diagnosis_ext cd
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE (n.source_identifier IN (
            'L89.119', 'L89.139', 'L89.149', 'L89.159', 'L89.209', 'L89.309',
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
            'R63.4', 'R63.6'
        )
           OR LEFT(n.source_identifier, 3) IN ('R64','R54'))
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
        AND cd.app_source_id = 200
        AND cd.verificationstatus = 3305
        AND cd.onsetdatetime >= ADD_MONTHS(CURRENT_DATE, -12)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cd.patient_reference
                              ORDER BY cd.onsetdatetime DESC) = 1
),


-- CTE for EXCLUSION 11: Advanced illness IP portion
exc11_advanced_illness_ip AS (
    SELECT
        cd.diagnosis_code AS id,
        n.source_identifier AS adv_ill,
        cd.patient_reference AS personid,
        cd.onsetdatetime - INTERVAL '7' HOUR AS diadd,
        e.encounter_id AS enc,
        e.type_code AS inpatient
    FROM encounter e
    JOIN condition_diagnosis_ext cd
        ON e.encounter_id = cd.encounter_reference
        AND e.active_ind = 1
        AND e.active_status_code = 188
        AND e.app_source_id = 200
        AND cd.verificationstatus = 3305
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE (n.source_identifier IN (
            'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
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
           OR LEFT(n.source_identifier, 3) IN ('F04', 'G10','G20'))
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
        AND cd.app_source_id = 200
        AND cd.onsetdatetime >= ADD_MONTHS(CURRENT_DATE, -12)
        AND e.type_code IN (309309, 309310, 309312)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference
                              ORDER BY (cd.onsetdatetime - INTERVAL '7' HOUR) DESC,
                                       (e.reg_dt_tm - INTERVAL '7' HOUR)) = 1
),


-- CTE for EXCLUSION 12: Advanced illness OP/OBS/ED portion
exc12_advanced_illness_op AS (
    SELECT
        cd.diagnosis_code AS id,
        n.source_identifier AS adv,
        cd.patient_reference AS personid,
        cd.onsetdatetime - INTERVAL '7' HOUR AS dd,
        e.encounter_id AS enc,
        e.type_code
    FROM encounter e
    JOIN condition_diagnosis_ext cd
        ON e.encounter_id = cd.encounter_reference
        AND e.active_ind = 1
        AND e.active_status_code = 188
        AND e.app_source_id = 200
        AND cd.verificationstatus = 3305
    JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE(n.source_identifier IN (
            'A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4',
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
        ) OR LEFT(n.source_identifier, 3) IN ('F04', 'G10','G20'))
         AND cd.active_ind = 1
        AND cd.app_source_id = 200
        AND cd.onsetdatetime >= ADD_MONTHS(CURRENT_DATE, -12)
        AND e.type_code = 309308
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference
                              ORDER BY (cd.onsetdatetime - INTERVAL '7' HOUR) DESC,
                                       (e.reg_dt_tm - INTERVAL '7' HOUR)) = 1
),


-- CTE for HOSPICE EXCLUSION
hospice_exclusion AS (
    SELECT
        cp.patient_reference AS pp,
        cp.problem_id
    FROM condition_problem_ext cp
    LEFT JOIN nomenclature_ext n
        ON n.nomenclature_id = cp.problem_code
    WHERE (n.source_string LIKE '%Hospice%' 
           OR n.source_string LIKE '%Palliative care%'
           OR n.source_string LIKE '%Comfort care%'
           OR cp.code_text LIKE '%Hospice%'
           OR cp.code_text LIKE '%Palliative care%'
           OR cp.code_text LIKE '%Comfort care%')
        AND n.source_string NOT IN ('Discern - Palliative Care Program')
        AND cp.active_status_code = 188
        AND cp.active_ind = 1
        AND cp.clinicalstatus = 3301
        AND cp.app_source_id = 200
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cp.patient_reference
                              ORDER BY cp.meta_lastupdated DESC) = 1
),


-- CTE for EXCLUSION 13: Palliative care via ICD10
exc13_palliative AS (
    SELECT    
        cd.patient_reference AS personid,
        cd.onsetdatetime AS diag_dt_tm
    FROM condition_diagnosis_ext cd
    LEFT JOIN nomenclature_ext n
        ON n.nomenclature_id = cd.diagnosis_code
    WHERE n.source_identifier IN ('Z51.5')
        AND cd.active_status_code = 188
        AND cd.active_ind = 1
        AND cd.app_source_id = 200
        AND cd.verificationstatus = 3305
        AND cd.onsetdatetime >= ADD_MONTHS(CURRENT_DATE, -12)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY cd.patient_reference
                              ORDER BY cd.onsetdatetime DESC) = 1
),

-- ALL Exclusions
exclusions AS (
    SELECT 
        ve.patient_reference,
        ve.patient_age_current,
        -- Basic exclusions
        CASE WHEN exc1.source_identifier IS NOT NULL THEN 1 ELSE 0 END AS has_esrd_ckd,
        CASE WHEN exc2.source_identifier IS NOT NULL THEN 1 ELSE 0 END AS has_pregnancy_dx,
        CASE WHEN exc3.source_identifier IS NOT NULL THEN 1 ELSE 0 END AS has_pregnancy_problem,
        CASE WHEN exc4.problem_id IS NOT NULL THEN 1 ELSE 0 END AS has_renal_transfer,
        CASE WHEN exc5.source_identifier IS NOT NULL THEN 1 ELSE 0 END AS has_dialysis,
        CASE WHEN hosp.problem_id IS NOT NULL THEN 1 ELSE 0 END AS has_hospice,
        CASE WHEN exc13.diag_dt_tm IS NOT NULL THEN 1 ELSE 0 END AS has_palliative,
        
        -- Age-dependent exclusions (66+)
        CASE WHEN exc8.exc8 IS NOT NULL AND ve.patient_age_current >= 66 THEN 1 ELSE 0 END AS exc_longterm,
        CASE WHEN (exc10.personid = exc91.person_id)
              AND (exc10.frailty1 IS NOT NULL)
              AND (exc91.dem_meds IS NOT NULL)
              AND (ve.patient_age_current >= 66) THEN 1 ELSE 0 END AS fra_exc_byicd10,
        CASE WHEN exc9.person_id = exc91.person_id
              AND (exc9.frailty IS NOT NULL)
              AND (exc91.dem_meds IS NOT NULL)
              AND ve.patient_age_current >= 66 THEN 1 ELSE 0 END AS fra_exc_byhcpcs,
        CASE WHEN (exc11.personid = exc10.personid)
              AND (exc11.adv_ill IS NOT NULL)
              AND (exc10.frailty1 IS NOT NULL)
              AND (ve.patient_age_current >= 66) THEN 1 ELSE 0 END AS fra_adv_ill_acuteinp,
        CASE WHEN (exc12.personid = exc10.personid)
              AND (exc12.adv IS NOT NULL)
              AND (exc10.frailty1 IS NOT NULL)
              AND (ve.patient_age_current >= 66) THEN 1 ELSE 0 END AS fra_adv_ill_op_obs_ed
    FROM valid_patients ve
    LEFT JOIN exc1_esrd_ckd exc1 ON ve.patient_reference = exc1.person_id
    LEFT JOIN exc2_pregnancy_dx exc2 ON ve.patient_reference = exc2.person_id
    LEFT JOIN exc3_pregnancy_problem exc3 ON ve.patient_reference = exc3.person_id
    LEFT JOIN exc4_renal_transfer exc4 ON ve.patient_reference = exc4.person_id
    LEFT JOIN exc5_dialysis exc5 ON ve.patient_reference = exc5.person_id
    LEFT JOIN exc8_longterm exc8 ON ve.patient_reference = exc8.person_id
    LEFT JOIN exc9_frailty exc9 ON ve.patient_reference = exc9.person_id
    LEFT JOIN exc91_dementia_meds exc91 ON ve.patient_reference = exc91.person_id
    LEFT JOIN exc10_frailty_icd exc10 ON ve.patient_reference = exc10.personid
    LEFT JOIN exc11_advanced_illness_ip exc11 ON ve.patient_reference = exc11.personid
    LEFT JOIN exc12_advanced_illness_op exc12 ON ve.patient_reference = exc12.personid
    LEFT JOIN hospice_exclusion hosp ON ve.patient_reference = hosp.pp
    LEFT JOIN exc13_palliative exc13 ON ve.patient_reference = exc13.personid
),

-- =====================================================
-- BLOOD PRESSURE MEASUREMENTS (both systolic and diastolic)
-- =====================================================
-- CTE for BP events (most recent)
bp_events AS (
    SELECT
        e.encounter_id AS enc,
        e.patient_reference AS person_id,
        FLOOR(DATEDIFF(day, p.birthdate_local, e.reg_dt_tm) / 365.25) AS last_bp_age,
        p.birthdate_local AS birthdate,
        CASE 
            WHEN o1.observation_code IN (3788748719, 3059679)
            THEN TRY_CAST(o1.event_tag AS BIGINT) 
            ELSE NULL 
        END AS bp_systolic,
        CASE 
            WHEN o2.observation_code IN (3788728913, 3059689)
            THEN TRY_CAST(o2.event_tag AS BIGINT) 
            ELSE NULL 
        END AS bp_diastolic,
        DATEADD(hour, -7, o1.effectiveperiod_end) AS bpsystolic_measure_time,
        CAST(DATEADD(hour, -7, o1.effectiveperiod_end) AS DATE) AS bpsystolic_measure_day,
        DATEADD(hour, -7, o2.effectiveperiod_end) AS bpdiastolic_measure_time,
        CAST(DATEADD(hour, -7, o2.effectiveperiod_end) AS DATE) AS bpdiastolic_measure_day
    FROM encounter e
    JOIN person p
        ON e.patient_reference = p.person_id
        AND p.person_type_code = 903
        AND p.name_text NOT LIKE ','
        AND p.name_text NOT LIKE 'zz%'
        AND p.name_text NOT LIKE 'test bob'
        AND p.active_ind = 1
    JOIN observation o1
        ON e.encounter_id = o1.encounter_reference
        AND e.patient_reference = o1.patient_reference
        AND o1.observation_code IN (3059679, 3788748719)
        AND o1.event_tag NOT IN ('in error', 'In Error', 'Date\\Time Correction', 'Cancelled', 'See Note')
        AND o1.valid_until_dt_tm > CURRENT_TIMESTAMP
    JOIN observation o2
        ON e.encounter_id = o2.encounter_reference
        AND o1.effectiveperiod_end = o2.effectiveperiod_end
        AND e.patient_reference = o2.patient_reference
        AND o2.observation_code IN(3059689, 3788728913)
        AND o2.event_tag NOT IN ('in error', 'In Error', 'Date\\Time Correction', 'Cancelled', 'See Note')
        AND o2.valid_until_dt_tm > CURRENT_TIMESTAMP
    WHERE e.hosp_dischdispos_code NOT IN (638666, 638669, 679541, 679542)
        AND e.type_code IN (681428, 3093962577, 10737660693)
        AND DATEADD(hour, -7, o1.effectiveperiod_end) >= DATEADD(month, -12, CURRENT_DATE)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference
                              ORDER BY o1.effectiveperiod_end DESC,
                                       o2.effectiveperiod_end DESC) = 1
),

-- CTE for Previous BP event
bp_events_previous AS (
    SELECT   
        e.encounter_id AS enc,
        e.patient_reference AS person_id,
        FLOOR(DATEDIFF(day, p.birthdate_local, e.reg_dt_tm) / 365.25) AS last_bp_age_previous,
        p.birthdate_local AS birthdate,
        CASE 
            WHEN o1.observation_code IN (3788748719, 3059679)
            THEN TRY_CAST(o1.event_tag AS BIGINT) 
            ELSE NULL 
        END AS bp_systolic_previous,
        CASE 
            WHEN o2.observation_code IN (3788728913, 3059689)
            THEN TRY_CAST(o2.event_tag AS BIGINT) 
            ELSE NULL 
        END AS bp_diastolic_previous,
        DATEADD(hour, -7, o1.effectiveperiod_end) AS bpsystolic_measure_time_previous,
        DATEADD(hour, -7, o2.effectiveperiod_end) AS bpdiastolic_measure_time_previous
    FROM encounter e
    JOIN person p
        ON e.patient_reference = p.person_id
        AND p.person_type_code = 903
        AND p.name_text NOT LIKE ','
        AND p.name_text NOT LIKE 'zz%'
        AND p.name_text NOT LIKE 'test bob'
        AND p.active_ind = 1
    JOIN observation o1
        ON e.encounter_id = o1.encounter_reference
        AND e.patient_reference = o1.patient_reference
        AND o1.observation_code IN (3059679, 3788748719)
        AND o1.event_tag NOT IN ('in error', 'In Error', 'Date\\Time Correction', 'Cancelled', 'See Note')
        AND o1.valid_until_dt_tm > CURRENT_TIMESTAMP
    LEFT JOIN observation o2
        ON e.encounter_id = o2.encounter_reference
        AND o1.effectiveperiod_end = o2.effectiveperiod_end
        AND e.patient_reference = o2.patient_reference
        AND o2.observation_code IN  (3059689, 3788728913)
        AND o2.event_tag NOT IN ('in error', 'In Error', 'Date\\Time Correction', 'Cancelled', 'See Note')
        AND o2.valid_until_dt_tm > CURRENT_TIMESTAMP
    WHERE e.hosp_dischdispos_code NOT IN (638666, 638669, 679541, 679542)
        AND e.type_code IN (681428, 3093962577, 10737660693)
        AND DATEADD(hour, -7, o1.effectiveperiod_end) >= DATEADD(month, -12, CURRENT_DATE)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY e.patient_reference
                              ORDER BY o1.effectiveperiod_end DESC,
                                       COALESCE(o2.effectiveperiod_end, o1.effectiveperiod_end) DESC) = 2
),

-- BP measurements
bp_measurements AS (
    SELECT 
        person_id,
        CASE WHEN TRY_CAST(bp_diastolic AS INTEGER) IS NOT NULL 
            THEN TRY_CAST(bp_diastolic AS INTEGER) ELSE NULL END AS bp_diastolic,
        CASE WHEN TRY_CAST(bp_systolic AS INTEGER) IS NOT NULL 
            THEN TRY_CAST(bp_systolic AS INTEGER) ELSE NULL END AS bp_systolic,
        last_bp_age
    FROM bp_events
), -- why its required?


-- Previous blood pressure measurements
bp_previous AS (
    SELECT 
        person_id,
        CASE WHEN TRY_CAST(bp_diastolic_previous AS INTEGER) IS NOT NULL 
            THEN TRY_CAST(bp_diastolic_previous AS INTEGER) ELSE NULL END AS bp_diastolic_previous,
        CASE WHEN TRY_CAST(bp_systolic_previous AS INTEGER) IS NOT NULL 
            THEN TRY_CAST(bp_systolic_previous AS INTEGER) ELSE NULL END AS bp_systolic_previous,
        CAST(bpdiastolic_measure_time_previous AS DATE) AS bpdiastolic_measure_time_previous
    FROM bp_events_previous
),

-- =====================================================
-- HEALTH PLAN INFORMATION (insurance plan)
-- =====================================================

health_plan_info AS (
    SELECT 
        c.encounter_id,
        ip.insuranceplan_id AS health_plan_id,
        ip.plan_name,
        cs.title AS plan_type_display
    FROM coverage c
    JOIN insuranceplan ip
        ON ip.insuranceplan_id = c.health_plan_id
        AND ip.active_ind = 1
    LEFT JOIN codesystem cs
        ON cs.identifier_value = ip.plan_type_code
        AND cs.app_source_id = 200
    WHERE c.active_ind = 1 
        AND c.order = 1
    QUALIFY ROW_NUMBER() OVER (PARTITION BY c.encounter_id ORDER BY ip.plan_name) = 1
), --check we really required row_number calculation here


-- Health plan information
health_plans AS (
    SELECT 
        encounter_id,
        plan_name,
        plan_type_display
    FROM health_plan_info
),

-- =====================================================
-- INTERMEDIATE CTES FOR FINAL CTES
-- =====================================================

-- Encounter physicians 


--not used in select clause check wether we can remove this,encounter_physicians,patient_pcp_info
encounter_physicians AS (
    SELECT 
        hp.encounter_id,
        hp.patient_reference,
        ap.npi AS attending_npi,
        pml1.provider AS pcp_seen,
        pml1.region,
        pml1.sub_region,
        pml1.clinic,
        pml1.medical_group
    FROM hypertension_patients hp
    INNER JOIN attending_physicians ap 
        ON hp.encounter_id = ap.encounter_id
    INNER JOIN reference.regions_providers pml1 
        ON CAST(pml1.national_provider_id AS VARCHAR(20)) = CAST(ap.npi AS VARCHAR(20))
    QUALIFY ROW_NUMBER() OVER (PARTITION BY hp.encounter_id ORDER BY ap.npi) = 1
),  --inner join regions_providers

-- Patient PCP info
patient_pcp_info AS (
    SELECT 
        ep.*,
        pcp.pcp_npi,
        ep.pcp_seen AS assigned_cerner_pcp
    FROM encounter_physicians ep
    INNER JOIN valid_patients ve 
        ON ep.encounter_id = ve.encounter_id
    LEFT JOIN patient_pcp pcp 
        ON ep.patient_reference = pcp.person_id
    LEFT JOIN reference.regions_providers pml  
        ON CAST(pml.national_provider_id AS VARCHAR(20)) = CAST(pcp.pcp_npi AS VARCHAR(20))
    QUALIFY ROW_NUMBER() OVER (PARTITION BY ep.encounter_id ORDER BY pcp.pcp_npi NULLS LAST) = 1
), ---regions_providers iner join


-- Qualified encounters
qualified_encounters AS (
    SELECT 
        pcp.encounter_id,
        pcp.patient_reference,
        pcp.attending_npi,
        pcp.pcp_seen,
        pcp.region,
        pcp.sub_region,
        pcp.clinic,
        pcp.medical_group,
        pcp.pcp_npi,
        pcp.assigned_cerner_pcp,
        exc.has_esrd_ckd,
        exc.has_pregnancy_dx,
        exc.has_pregnancy_problem,
        exc.has_renal_transfer,
        exc.has_dialysis,
        exc.has_hospice,
        exc.has_palliative,
        exc.exc_longterm,
        exc.fra_exc_byicd10,
        exc.fra_exc_byhcpcs,
        exc.fra_adv_ill_acuteinp,
        exc.fra_adv_ill_op_obs_ed,
        ve.patient_name,
        ve.birthdate_local,
        ve.patient_age_current,
        ve.patient_age_at_visit,
        ROW_NUMBER() OVER (PARTITION BY pcp.patient_reference ORDER BY ve.reg_dt_tm DESC) AS rn
    FROM patient_pcp_info pcp
    INNER JOIN valid_patients ve 
        ON pcp.encounter_id = ve.encounter_id
    INNER JOIN exclusions exc 
        ON pcp.patient_reference = exc.patient_reference
),



-- =====================================================
-- FINAL CTE
-- =====================================================

final_cte AS (
    SELECT 
        qe.region AS Region,
        qe.sub_region AS Sub_Region,
        qe.clinic AS Clinic,
        qe.medical_group,
        qe.assigned_cerner_pcp AS PCP_Name,
        qe.patient_reference AS Patient_ID,
        qe.pcp_npi AS PCP_NPI,
        qe.patient_name AS Patient_Name,
        qe.patient_age_at_visit AS Patient_Age,
        CAST(qe.birthdate_local AS DATE) AS Patient_DOB,
        hp.plan_name AS Health_Plan_Name,
        hp.plan_type_display AS Health_Plan_Type,
        qe.assigned_cerner_pcp AS Assigned_Cerner_PCP,
        bp.bp_diastolic AS bpDiastolic,
        bp.bp_systolic AS bpSystolic,
        bp2.bp_diastolic_previous,
        bp2.bp_systolic_previous,
        bp2.bpdiastolic_measure_time_previous AS BPDIASTOLIC_measure_time_Previous,
        qe.pcp_seen AS PCP_seen,
        CAST(ve.reg_dt_tm AS DATE) AS PCP_visit_time,
        CASE WHEN bp.last_bp_age <= 85
              AND bp.bp_systolic < 140
              AND bp.bp_diastolic < 90 THEN 'Meets' ELSE 'No Meets' END AS MEETS,
        CASE WHEN bp.last_bp_age <= 85
              AND bp.bp_systolic < 140
              AND bp.bp_diastolic < 90 THEN 'Meets' ELSE 'No Meets' END AS ACO_Meets,
        CASE WHEN bp.last_bp_age <= 85
              AND bp.bp_systolic < 140
              AND bp.bp_diastolic < 90 THEN 'Meets' ELSE 'No Meets' END AS NUM,
        CURRENT_TIMESTAMP AS Refresh_Date,
        qe.encounter_id AS last_enc,
        qe.patient_age_at_visit AS AGE,
        qe.patient_age_current AS Patient_age_current,
        qe.exc_longterm AS EXC88,
        qe.fra_exc_byicd10,
        qe.fra_exc_byhcpcs,
        qe.fra_adv_ill_acuteinp,
        qe.fra_adv_ill_op_obs_ed
    FROM qualified_encounters qe
    INNER JOIN valid_patients ve 
        ON qe.encounter_id = ve.encounter_id
    LEFT JOIN health_plans hp 
        ON qe.encounter_id = hp.encounter_id
    LEFT JOIN bp_measurements bp 
        ON qe.patient_reference = bp.person_id
    LEFT JOIN bp_previous bp2 
        ON qe.patient_reference = bp2.person_id
    INNER JOIN exclusions exc 
        ON qe.patient_reference = exc.patient_reference
    WHERE qe.rn = 1
  
    QUALIFY ROW_NUMBER() OVER (PARTITION BY qe.patient_reference ORDER BY qe.encounter_id DESC) = 1
)
SELECT * FROM final_cte
-- SELECT Patient_ID, count(*) as duplicates
-- FROM final_cte
-- GROUP BY Patient_ID
-- HAVING COUNT(*) > 1
