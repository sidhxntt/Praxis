WITH BaseEncounters AS (

  /*
  STEP 1: GRAB ENCOUNTERS
  - Corresponds to the initial `FROM cerner.encounter` and `INNER JOIN CERNER.ENCNTR_ALIAS`.
  - Establishes the base set of encounters with a valid Financial Number (FIN) within the measurement period.
  - Applies initial filters from the original WHERE clause related to the encounter itself.
  */
  SELECT
    e.encntr_id,
    e.person_id,
    e.encntr_reg_dttm,
    e.attending_provider_id,
    e.loc_facility_cd,
    e.encntr_type_code
  FROM
    {source_tables['dim_encounter_table']} AS e
  INNER JOIN
    {source_tables['encounter_identifier_ext_table']} AS eie
      ON e.encntr_id = eie.encounter_id
      AND eie.period_end > CURRENT_DATE
      AND eie.active_ind = 1
      AND eie.type_code = 1077 -- FIN
  WHERE
    DATEADD(hour, -7, e.encntr_reg_dttm) BETWEEN DATEADD(month, -12, CURRENT_DATE) AND CURRENT_DATE
    AND e.encntr_active_ind = 1
    AND e.encntr_status <> 855 -- Canceled
    AND e.encntr_type_code IN (681428, 3093962577, 10737660693) -- Office Visit, Telephone, Health Mgmt
    AND e.hosp_discharge_disposition_code NOT IN (312910, 638662, 638663, 679363, 679364, 3105897963) -- Exclude Discharged to Hospice
),



WithOfficeVisit AS (

  /*
  STEP 2: LIMIT TO OFFICE VISITS
  - Corresponds to the `INNER JOIN cerner.orders co`.
  - Filters the base encounters to only include those that are qualifying office visits based on associated order codes.
  */
  SELECT DISTINCT
    dbe.person_id,
    dbe.encntr_id,
    dbe.encntr_reg_dttm,
    dbe.attending_provider_id,
    dbe.loc_facility_cd
  FROM
    BaseEncounters dbe
  INNER JOIN
    {source_tables['servicerequest_table']} sr
      ON dbe.encntr_id = sr.encounter_reference AND dbe.person_id = sr.patient_reference
  WHERE
    sr.catalog_code IN ('2770068295', '2770068560', '2770068774', '2770069019', '2770069896', '2770070037', '2770070243', '2770070687', '2770071055', '2770083634', '2770083846', '2770084041', '2770084543', '2770084963', '2770085437', '2770085962', '2770086337', '2770089469', '2770089734', '2770089971', '2770091849', '2770211604', '2770211836', '2770264451', '2770268792', '2770269740', '2770270274', '2770278891', '2770278987', '2770279315', '2770280860', '2770281058', '2770281224', '2770285685', '2770285788', '3406432551', '7576095471', '3499977889', '5259606913', '5259604745', '4354158813', '4354159257', '3499973079', '4354158067', '3499976975', '4354161861', '3499974145', '5259605751', '4354156271', '7628610071', '7628758499', '7628759231', '7628759457', '7628759711', '7628760075', '7628760583', '7628760769', '7628761231', '7628776523', '10815685629', '10815681819', '10815723797')
),



Denominator_PatientInfo AS (

  /*
  STEP 3: PERSON INFO
  - Corresponds to the `INNER JOIN cerner.person AS pat`.
  - Gathers patient demographic data and applies filters for age, active status, test patients, and deceased status.
  */
  SELECT
    person_id,
    name_text,
    birthdate_local,
    FLOOR(DATEDIFF(day, birthdate_local, CURRENT_DATE) / 365.25) AS current_age
  FROM
    {source_tables['person_table']}
  WHERE
    person_type_code = 903 -- Patient
    AND active_ind = 1
    AND deceased_dt_tm IS NULL
    AND name_text NOT LIKE ANY ('%,', 'zzz%', 'zztest%', 'ZZTEST%', 'zzztest%', 'ZZZTEST%', 'ZzzTEST%', 'zz test%', 'test bob', 'ZZZXRAY%', 'Zzztest%', 'Zzzgarcia%', 'ZZZONC%')
    AND FLOOR(DATEDIFF(day, birthdate_local, CURRENT_DATE) / 365.25) BETWEEN 18 AND 75
),



Denominator_AttributedPCP AS (

  /*
  STEP 4: LIMIT TO ONLY THOSE WITH PCP IN THIS LIST
  - Corresponds to the series of joins from PERSON -> PERSON_PRSNL_RELTN -> PRSNL -> prsnl_alias -> REGIONS_PROVIDERS.
  - This identifies patients who have an assigned Primary Care Physician (PCP) belonging to the specified medical group.
  */
  SELECT DISTINCT
    p.person_id
  FROM
    {source_tables['person_table']} p
  LEFT JOIN
    {source_tables['practitionerrole_table']} ppr
      ON p.person_id = ppr.person_id
      AND ppr.priority_seq = 0
      AND ppr.period_end > CURRENT_DATE
      AND ppr.active_ind = 1
      AND ppr.person_prsnl_r_code = 1115 -- Primary Care Physician
  LEFT JOIN
    {source_tables['practitioner_table']} pr
      ON ppr.practitioner_reference = pr.practitioner_id
      AND pr.active_ind = 1
  LEFT JOIN
    {source_tables['practitioner_identifier_ext_table']} pie
      ON pr.practitioner_id = pie.practitioner_id
      AND pie.active_ind = 1
      AND pie.identifier_type_code = '28769904' -- NPI
  INNER JOIN
    {source_tables['regions_providers_table']} rp
      ON CAST(rp.national_provider_id AS VARCHAR(20)) = CAST(pie.identifier_value AS VARCHAR(20))
),



Denominator_WithValidAttending AS (

  /*
  STEP 4.5: ENCOUNTER ATTENDING PHYSICIAN INFORMATION
  - Corresponds to the `INNER JOIN CERNER.ENCNTR_PRSNL_RELTN AS PPR1` and subsequent joins.
  - This acts as a filter, ensuring that the encounter has a valid, active, and current
    attending physician associated with it. This directly translates the original query's logic
    for validating the attending provider.
  */
  SELECT DISTINCT 
    dwo.person_id,
    pie.identifier_value AS attending_provider_npi
    -- dwo.encntr_id,
    -- dwo.encntr_reg_dttm,
    -- -- We can select the provider ID directly from the participant reference
    -- epe.participant_indiv_ref AS attending_provider_id,
    -- dwo.loc_facility_cd
  FROM
    WithOfficeVisit dwo
  
  JOIN
    dev_bh_delivery_silver.clinical_fhir.encntr_participant_ext epe
      ON dwo.encntr_id = epe.encounter_id
      AND epe.participant_period_end > CURRENT_DATE
      AND epe.participant_indiv_ref <> 0
      AND epe.active_ind = 1
      AND epe.participant_type_code = 1119 
  
  LEFT JOIN
    {source_tables['practitioner_table']} pr
      ON epe.participant_indiv_ref = pr.practitioner_id
      AND pr.active_ind = 1
  
  LEFT JOIN
    {source_tables['practitioner_identifier_ext_table']} pie
      ON pr.practitioner_id = pie.practitioner_id
      AND pie.active_ind = 1
      AND pie.identifier_type_code = '28769904' -- NPI
)
,





Denominator_SeenPCPLastYear AS (

  /*
  STEP 5: SEEN PCP IN THE LAST YEAR ONLY
  - Corresponds to the `INNER JOIN (SELECT ... ) PCP`.
  - Ensures patients have had an encounter with a provider from the medical group within the last 12 months.
  */
  SELECT DISTINCT
    e.person_id
  FROM
    {source_tables['dim_encounter_table']} e
  JOIN
    {source_tables['practitioner_table']} pr
      ON e.attending_provider_id = pr.practitioner_id
      AND pr.active_ind = 1
  JOIN
    {source_tables['practitioner_identifier_ext_table']} pie
      ON pr.practitioner_id = pie.practitioner_id
      AND pie.active_ind = 1
      AND pie.identifier_type_code = '28769904' -- NPI
  INNER JOIN
    {source_tables['regions_providers_table']} rp
      ON CAST(rp.national_provider_id AS VARCHAR(20)) = CAST(pie.identifier_value AS VARCHAR(20))
  WHERE
    DATEADD(hour, -7, e.encntr_reg_dttm) BETWEEN DATEADD(month, -12, CURRENT_DATE) AND CURRENT_DATE
    AND rp.provider IS NOT NULL
),

Denominator_ValidProviderNPIs AS (

  /*
  STEP 5.1: CREATE MASTER LIST OF VALID PROVIDER NPIs
  - This CTE is a direct translation of the `PML1` subquery from the original query.
  
  */
  SELECT DISTINCT 
    pie.identifier_value AS national_provider_id
  FROM
    {source_tables['practitioner_identifier_ext_table']} pie
  -- Join to practitioner to ensure the provider is active
  INNER JOIN
    {source_tables['practitioner_table']} pr
      ON pie.practitioner_id = pr.practitioner_id
      AND pr.active_ind = 1
  -- Join to codesystem to validate the identifier type is NPI
  INNER JOIN
    {source_tables['codesystem_table']} cs
      ON pie.identifier_type_code = cs.identifier_value
      AND cs.valueset = 320 -- Equivalent to CODE_SET = 320
      --AND cs.title = 'NATIONALPROVIDERIDENTIFIER' -- Equivalent to DISPLAY_KEY
      AND cs.active_ind = 1
  WHERE
    pie.active_ind = 1
    AND pie.identifier_period_end >= CURRENT_TIMESTAMP
    AND pie.identifier_type_code IN ('28769904', '37966035')
),



Denominator_WithDiabetesDiagnosis AS (

  /*
  STEP 6: REDUCE TO PATIENTS WITH DIABETES DX
  - This version is modified to replicate the original query's multi-stage ranking logic EXACTLY,
    even though it is less efficient than a single-stage ranking.
  - It first finds the latest diagnosis and latest problem separately for each patient,
    then combines them, and finally selects the single most recent record overall.
  */
  SELECT Person_ID FROM (
    SELECT 
        Person_ID, 
        diag_time,
        ROW_NUMBER() OVER (PARTITION BY Person_ID ORDER BY diag_time DESC) as rn_final
    FROM (
      -- Part 1: Get the MOST RECENT qualifying diagnosis for each patient in the last 12 months
      SELECT Person_ID, diag_time FROM (
          SELECT
              cd.patient_reference AS Person_ID, 
              CAST(DATEADD(hour, -7, cd.onsetdatetime) AS DATE) AS diag_time,
              ROW_NUMBER() OVER (PARTITION BY cd.patient_reference ORDER BY cd.onsetdatetime DESC) as rn_diag
          FROM {source_tables['condition_diagnosis_ext_table']} cd
          JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = cd.diagnosis_code
          JOIN BaseEncounters be ON cd.encounter_reference = be.encntr_id AND be.encntr_type_code IN (681428, 3093962577)
          WHERE DATEADD(hour, -7, cd.onsetdatetime) >= DATEADD(month, -12, CURRENT_DATE) 
            AND cd.verificationstatus = 3305 
            AND cd.active_status_code = 188 
            AND cd.active_ind = 1
            -- AND cd.app_source_id = 200 -- Placeholder: Add correct column filter for source system
            AND nom.source_identifier IN ('E10.10', 'E10.11', 'E10.21', 'E10.22', 'E10.29', 'E10.311', 'E10.319', 'E10.321', 'E10.3211', 'E10.3212', 'E10.3213', 'E10.3219', 'E10.329', 'E10.3291', 'E10.3292', 'E10.3293', 'E10.3299', 'E10.331', 'E10.3311', 'E10.3312', 'E10.3313', 'E10.3319', 'E10.339', 'E10.3391', 'E10.3392', 'E10.3393', 'E10.3399', 'E10.341', 'E10.3411', 'E10.3412', 'E10.3413', 'E10.3419', 'E10.349', 'E10.3491', 'E10.3492', 'E10.3493', 'E10.3499', 'E10.351', 'E10.3511', 'E10.3512', 'E10.3513', 'E10.3519', 'E10.3521', 'E10.3522', 'E10.3523', 'E10.3529', 'E10.3531', 'E10.3532', 'E10.3533', 'E10.3539', 'E10.3541', 'E10.3542', 'E10.3543', 'E10.3549', 'E10.3551', 'E10.3552', 'E10.3553', 'E10.3559', 'E10.359', 'E10.3591', 'E10.3592', 'E10.3593', 'E10.3599', 'E10.36', 'E10.37X1', 'E10.37X2', 'E10.37X3', 'E10.37X9', 'E10.39', 'E10.40', 'E10.41', 'E10.42', 'E10.43', 'E10.44', 'E10.49', 'E10.51', 'E10.52', 'E10.59', 'E10.610', 'E10.618', 'E10.620', 'E10.621', 'E10.622', 'E10.628', 'E10.630', 'E10.638', 'E10.641', 'E10.649', 'E10.65', 'E10.69', 'E10.8', 'E10.9', 'E11.00', 'E11.01', 'E11.10', 'E11.11', 'E11.21', 'E11.22', 'E11.29', 'E11.311', 'E11.319', 'E11.321', 'E11.3211', 'E11.3212', 'E11.3213', 'E11.3219', 'E11.329', 'E11.3291', 'E11.3292', 'E11.3293', 'E11.3299', 'E11.331', 'E11.3311', 'E11.3312', 'E11.3313', 'E11.3319', 'E11.339', 'E11.3391', 'E11.3392', 'E11.3393', 'E11.3399', 'E11.341', 'E11.3411', 'E11.3412', 'E11.3413', 'E11.3419', 'E11.349', 'E11.3491', 'E11.3492', 'E11.3493', 'E11.3499', 'E11.351', 'E11.3511', 'E11.3512', 'E11.3513', 'E11.3519', 'E11.3521', 'E11.3522', 'E11.3523', 'E11.3529', 'E11.3531', 'E11.3532', 'E11.3533', 'E11.3539', 'E11.3541', 'E11.3542', 'E11.3543', 'E11.3549', 'E11.3551', 'E11.3552', 'E11.3553', 'E11.3559', 'E11.359', 'E11.3591', 'E11.3592', 'E11.3593', 'E11.3599', 'E11.36', 'E11.37X1', 'E11.37X2', 'E11.37X3', 'E11.37X9', 'E11.39', 'E11.40', 'E11.41', 'E11.42', 'E11.43', 'E11.44', 'E11.49', 'E11.51', 'E11.52', 'E11.59', 'E11.610', 'E11.618', 'E11.620', 'E11.621', 'E11.622', 'E11.628', 'E11.630', 'E11.638', 'E11.641', 'E11.649', 'E11.65', 'E11.69', 'E11.8', 'E11.9', 'E13.00', 'E13.01', 'E13.10', 'E13.11', 'E13.21', 'E13.22', 'E13.29', 'E13.311', 'E13.319', 'E13.321', 'E13.3211', 'E13.3212', 'E13.3213', 'E13.3219', 'E13.329', 'E13.3291', 'E13.3292', 'E13.3293', 'E13.3299', 'E13.331', 'E13.3311', 'E13.3312', 'E13.3313', 'E13.3319', 'E13.339', 'E13.3391', 'E13.3392', 'E13.3393', 'E13.3399', 'E13.341', 'E13.3411', 'E13.3412', 'E13.3413', 'E13.3419', 'E13.349', 'E13.3491', 'E13.3492', 'E13.3493', 'E13.3499', 'E13.351', 'E13.3511', 'E13.3512', 'E13.3513', 'E13.3519', 'E13.3521', 'E13.3522', 'E13.3523', 'E13.3529', 'E13.3531', 'E13.3532', 'E13.3533', 'E13.3539', 'E13.3541', 'E13.3542', 'E13.3543', 'E13.3549', 'E13.3551', 'E13.3552', 'E13.3553', 'E13.3559', 'E13.359', 'E13.3591', 'E13.3592', 'E13.3593', 'E13.3599', 'E13.36', 'E13.37X1', 'E13.37X2', 'E13.37X3', 'E13.37X9', 'E13.39', 'E13.40', 'E13.41', 'E13.42', 'E13.43', 'E13.44', 'E13.49', 'E13.51', 'E13.52', 'E13.59', 'E13.610', 'E13.618', 'E13.620', 'E13.621', 'E13.622', 'E13.628', 'E13.630', 'E13.638', 'E13.641', 'E13.649', 'E13.65', 'E13.69', 'E13.8', 'E13.9', 'O24.011', 'O24.012', 'O24.013', 'O24.019', 'O24.02', 'O24.03', 'O24.111', 'O24.112', 'O24.113', 'O24.119', 'O24.12', 'O24.13', 'O24.311', 'O24.312', 'O24.313', 'O24.319', 'O24.32', 'O24.33', 'O24.811', 'O24.812', 'O24.813', 'O24.819', 'O24.82', 'O24.83')
      ) WHERE rn_diag = 1

      UNION ALL

      -- Part 2: Get the MOST RECENT qualifying problem for each patient in the last 12 months
      SELECT Person_ID, diag_time FROM (
          SELECT
              cp.patient_reference AS Person_ID, 
              cp.meta_lastupdated AS diag_time,
              ROW_NUMBER() OVER (PARTITION BY cp.patient_reference ORDER BY cp.meta_lastupdated DESC) as rn_prob
          FROM {source_tables['condition_problem_ext_table']} cp
          JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = cp.problem_code
          JOIN BaseEncounters be ON cp.patient_reference = be.Person_ID
          WHERE cp.meta_lastupdated >= DATEADD(month, -12, CURRENT_DATE) 
            AND cp.clinicalstatus IN (3301, 3305) 
            AND cp.active_status_code = 188 
            AND cp.active_ind = 1
            -- AND cp.app_source_id = 200 -- Placeholder: Add correct column filter for source system
            AND nom.source_identifier IN ('2967854014', '3010513018', '2967818010', '125705011', '127435018', '197985011', '3013981017', '197763012', '474213016', '200951011', '3013049012', '3013072014', '3526507010', '1488898011', '38709010', '46924017', '17210010', '2618220016', '2618218019', '8973010', '2967867012', '2967875018', '3315042015', '2967831017', '2967850017', '3013129018', '3013580011', '292551012', '459294012', '292538019', '457325013', '3007241010', '459311019', '292576013', '459312014', '459306016', '292581016', '457330012', '459313016', '3866399017', '3788941013', '3012712016', '3688521010', '3698458010', '3698438014', '3779414013', '3793336013', '3778111019', '2967767019', '3297354019', '3698406016', '3297343012', '2618225014', '2618223019', '3789768010', '3698482017', '3698347017', '3690538013', '3289791018', '3289834016', '3789621012', '3697664014', '2623029013', '3695401013', '2618197018', '3780262015', '3780158017', '3289695015', '3695523010', '3297390014', '3012535016', '3699803011', '3013728017','3700121019', '3699407019', '3779404016', '3011256017', '3013341014', '3013343018', '3699440011', '3873346018', '3035408014', '3035536018', '3800383012', '3873346018')
      ) WHERE rn_prob = 1
    )
  ) WHERE rn_final = 1
),



Denominator AS (

  /*
  STEP 7: FINAL DENOMINATOR ASSEMBLY
  - Assembles the final denominator population by INNER JOINING all the preceding inclusionary CTEs.
  - This represents the full population eligible for the measure before any exclusions are applied.
  */
  SELECT
    pat.person_id,
    pat.name_text AS patient_name,
    pat.birthdate_local,
    pat.current_age,
    ov.encntr_id,
    ov.encntr_reg_dttm,
    ov.loc_facility_cd,
    ov.attending_provider_id
  FROM
    Denominator_PatientInfo pat
  INNER JOIN
    WithOfficeVisit ov ON pat.person_id = ov.person_id
  INNER JOIN
    Denominator_WithValidAttending att ON pat.person_id = att.person_id
  INNER JOIN
    Denominator_AttributedPCP apcp ON pat.person_id = apcp.person_id
  INNER JOIN
    Denominator_SeenPCPLastYear spcp ON pat.person_id = spcp.person_id
  INNER JOIN
    Denominator_WithDiabetesDiagnosis diab ON pat.person_id = diab.Person_ID
   INNER JOIN
     Denominator_ValidProviderNPIs vpn
     ON CAST(att.attending_provider_npi AS VARCHAR(20)) = CAST(vpn.national_provider_id AS VARCHAR(20))

)
,

-- 
-- EXCLUSION CTEs: Identifying patients to be removed from the denominator.
-- 

Exclusion_LongTermCare AS (
  /* EXCLUSION: PATIENTS 66+ W/ SNP OR LONG-TERM CARE (from `CO1`) */
  SELECT DISTINCT sr.patient_reference AS person_id
  FROM {source_tables['servicerequest_table']} sr
  WHERE sr.occurrence_datetime >= DATEADD(month, -12, CURRENT_DATE)
    AND sr.active_ind = 1 AND sr.active_status_code = 188
    AND sr.catalog_code IN ('3801224521', '3801225967', '3801226435', '3801227071', '3801227681', '3801228117', '3801228809', '3801229291', '3801229663', '5259600317', '5259600921', '5259602069', '5259602809', '5259603939')
),

Exclusion_Frailty_SNOMED AS (
  /* EXCLUSION: Frailty SNOMED codes portion (from `cce`) */
  SELECT DISTINCT sr.patient_reference AS person_id
  FROM {source_tables['servicerequest_table']} sr
  WHERE sr.occurrence_datetime >= DATEADD(month, -12, CURRENT_DATE)
    AND sr.active_ind = 1 AND sr.active_status_code = 188
    AND sr.catalog_code IN ('4342771049', '4342771233', '4342771945', '4342772563')
),

Exclusion_Dementia_Meds AS (
  /* EXCLUSION: Dementia meds portion (from `cce1`) */
  SELECT DISTINCT sr.patient_reference AS person_id
  FROM {source_tables['servicerequest_table']} sr
  WHERE sr.occurrence_datetime >= DATEADD(month, -12, CURRENT_DATE)
    AND sr.active_ind = 1 AND sr.active_status_code = 188
    AND sr.catalog_code IN ('3102866','3106137','3123304','3077768043')
),

Exclusion_Frailty_ICD AS (
  /* EXCLUSION: Frailty ICD10 codes (from `exc4`) */
  SELECT DISTINCT dia.patient_reference as person_id
  FROM {source_tables['condition_diagnosis_ext_table']} dia
  JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = dia.diagnosis_code
  WHERE dia.onsetdatetime >= DATEADD(month, -12, CURRENT_DATE)
    AND dia.active_status_code = 188 AND dia.active_ind=1 AND dia.verificationstatus = 3305
    AND (nom.source_identifier IN ('L89.119', 'L89.139', 'L89.149', 'L89.159', 'L89.209', 'L89.309', 'L89.899', 'L89.90', 'M62.50', 'M62.81', 'M62.84', 'W01.0XXA', 'W01.0XXD', 'W01.0XXS', 'W01.10XA', 'W01.10XD', 'W01.10XS', 'W01.110A', 'W01.110D', 'W01.110S', 'W01.111A', 'W01.111D', 'W01.111S', 'W01.118A', 'W01.118D', 'W01.118S', 'W01.119A', 'W01.119D', 'W01.119S', 'W01.190A', 'W01.190D', 'W01.190S', 'W01.198A', 'W01.198D', 'W01.198S', 'W06.XXXA', 'W06.XXXD', 'W06.XXXS', 'W07.XXXA', 'W07.XXXD', 'W07.XXXS', 'W08.XXXA', 'W08.XXXD', 'W08.XXXS', 'W10.0XXA', 'W10.0XXD', 'W10.0XXS', 'W10.1XXA', 'W10.1XXD', 'W10.1XXS', 'W10.2XXA', 'W10.2XXD', 'W10.2XXS', 'W10.8XXA', 'W10.8XXD', 'W10.8XXS', 'W10.9XXA', 'W10.9XXD', 'W10.9XXS', 'W18.00XA', 'W18.00XD', 'W18.00XS', 'W18.02XA', 'W18.02XD', 'W18.02XS', 'W18.09XA', 'W18.09XD', 'W18.09XS', 'W18.11XA', 'W18.11XD', 'W18.11XS', 'W18.12XA', 'W18.12XD', 'W18.12XS', 'W18.2XXA', 'W18.2XXD', 'W18.2XXS', 'W18.30XA', 'W18.30XD', 'W18.30XS', 'W18.31XA', 'W18.31XD', 'W18.31XS', 'W18.39XA', 'W18.39XD', 'W18.39XS', 'W19.XXXA', 'W19.XXXD', 'W19.XXXS', 'Y92.199', 'Z59.3', 'Z73.6', 'Z74.01', 'Z74.09', 'Z74.1', 'Z74.2', 'Z74.3', 'Z74.8', 'Z74.9', 'Z91.81', 'Z99.11', 'Z99.3', 'Z99.81', 'Z99.89', 'R26.0', 'R26.1', 'R26.2', 'R26.89', 'R26.9', 'R41.81', 'R53.1', 'R53.81', 'R53.83', 'R62.7', 'R63.4', 'R63.6')
    OR LEFT(nom.source_identifier,3) IN ('R64','R54'))
),

Exclusion_AdvancedIllness_IP AS (
  /* EXCLUSION: Advanced illness IP portion (from `EXC6`) */
  SELECT DISTINCT cd.patient_reference AS person_id
  FROM {source_tables['condition_diagnosis_ext_table']} cd
  JOIN {source_tables['dim_encounter_table']} e ON cd.encounter_reference = e.encntr_id AND e.encntr_type_code = 309308 -- Inpatient
  JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = cd.diagnosis_code
  WHERE cd.onsetdatetime >= DATEADD(month, -12, CURRENT_DATE) AND cd.verificationstatus = 3305
  AND (nom.source_identifier IN ('A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4', 'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3', 'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39', 'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19', 'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02', 'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32', 'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F04', 'F10.27', 'F10.96', 'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09', 'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1', 'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33', 'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812', 'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9', 'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112', 'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22', 'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2', 'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2', 'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6') OR LEFT(nom.source_identifier,3) IN ('G10','G20'))
),

Exclusion_AdvancedIllness_NonIP AS (
  /* EXCLUSION: Advanced illness OP/OBS/ED portion (from `EXC8`), requires 2+ visits */
  SELECT person_id FROM (
    SELECT cd.patient_reference AS person_id, ROW_NUMBER() OVER (PARTITION BY cd.patient_reference ORDER BY cd.onsetdatetime DESC) as rn
    FROM {source_tables['condition_diagnosis_ext_table']} cd
    JOIN {source_tables['dim_encounter_table']} e ON cd.encounter_reference = e.encntr_id AND e.encntr_type_code IN (309309, 309310, 309312) -- OP/OBS/ED
    JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = cd.diagnosis_code
    WHERE cd.onsetdatetime >= DATEADD(month, -12, CURRENT_DATE) AND cd.verificationstatus = 3305
    AND (nom.source_identifier IN ('A81.00', 'A81.01', 'A81.09', 'C25.0', 'C25.1', 'C25.2', 'C25.3', 'C25.4', 'C25.7', 'C25.8', 'C25.9', 'C71.9', 'C77.0', 'C77.1', 'C77.2', 'C77.3', 'C77.4', 'C77.5', 'C77.8', 'C77.9', 'C78.00', 'C78.1', 'C78.2', 'C78.39', 'C78.4', 'C78.5', 'C78.6', 'C78.7', 'C78.89', 'C79.00', 'C79.11', 'C79.19', 'C79.2', 'C79.31', 'C79.32', 'C79.49', 'C91.00', 'C91.02', 'C92.00', 'C92.02', 'C93.00', 'C93.02', 'C93.90', 'C93.92', 'C93.Z0', 'C93.Z2', 'C94.30', 'C94.32', 'F01.50', 'F01.51', 'F02.80', 'F02.81', 'F03.90', 'F03.91', 'F04', 'F10.27', 'F10.96', 'F10.97', 'G12.21', 'G30.0', 'G30.1', 'G30.8', 'G30.9', 'G31.01', 'G31.09', 'G31.83', 'I09.81', 'I11.0', 'I12.0', 'I13.0', 'I13.11', 'I13.2', 'I50.1', 'I50.20', 'I50.21', 'I50.22', 'I50.23', 'I50.30', 'I50.31', 'I50.32', 'I50.33', 'I50.40', 'I50.41', 'I50.42', 'I50.43', 'I50.810', 'I50.811', 'I50.812', 'I50.813', 'I50.814', 'I50.82', 'I50.83', 'I50.84', 'I50.89', 'I50.9', 'J43.0', 'J43.1', 'J43.2', 'J43.8', 'J43.9', 'J68.4', 'J84.10', 'J84.112', 'J84.17', 'J96.10', 'J96.11', 'J96.12', 'J96.20', 'J96.21', 'J96.22', 'J96.90', 'J96.91', 'J96.92', 'J98.2', 'J98.3', 'K70.10', 'K70.11', 'K70.2', 'K70.30', 'K70.31', 'K70.40', 'K70.41', 'K70.9', 'K74.0', 'K74.1', 'K74.2', 'K74.4', 'K74.5', 'K74.60', 'K74.69', 'N18.5', 'N18.6') OR LEFT(nom.source_identifier,3) IN ('G10','G20'))
  ) WHERE rn >= 2
),

Exclusion_Hospice_ProblemList AS (
  /* EXCLUSION: HOSPICE (from `PROBN1`) */
  SELECT DISTINCT cp.patient_reference AS person_id
  FROM {source_tables['condition_problem_ext_table']} cp
  LEFT JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = cp.problem_code
  WHERE cp.active_status_code = 188 AND cp.active_ind = 1 AND cp.clinicalstatus = 3301
    AND nom.source_string NOT IN ('Discern - Palliative Care Program')
    AND (nom.source_string LIKE ANY ('%Hospice%', '%Palliative care%', '%Comfort care%') OR cp.code_text LIKE ANY ('%Hospice%', '%Palliative care%', '%Comfort care%'))
),

Exclusion_PalliativeCare_ICD AS (
  /* EXCLUSION: Palliative care via ICD10 (from `EXC1`) */
  SELECT DISTINCT dia.patient_reference AS person_id
  FROM {source_tables['condition_diagnosis_ext_table']} dia
  LEFT JOIN {source_tables['nomenclature_ext_table']} nom ON nom.nomenclature_id = dia.diagnosis_code
  WHERE nom.source_identifier IN ('Z51.5')
    AND dia.active_status_code = 188 AND dia.active_ind=1 AND dia.verificationstatus = 3305
    AND dia.onsetdatetime >= DATEADD(month, -12, CURRENT_DATE)
),

-- 
-- EXCLUSION APPLICATION & NUMERATOR
-- 

FinalDenominator AS (

  /*
  STEP 8: APPLYING EXCLUSIONS
  - This CTE takes the full denominator and LEFT JOINs all exclusion CTEs.
  - The WHERE clause then filters out patients who meet any of the exclusion criteria,
    precisely replicating the logic from the original query's WHERE clause and CASE statements.
  */
  SELECT d.*
  FROM Denominator d
  LEFT JOIN Exclusion_LongTermCare exc_ltc ON d.person_id = exc_ltc.person_id
  LEFT JOIN Exclusion_Frailty_SNOMED exc_frail_snomed ON d.person_id = exc_frail_snomed.person_id
  LEFT JOIN Exclusion_Dementia_Meds exc_dem_meds ON d.person_id = exc_dem_meds.person_id
  LEFT JOIN Exclusion_Frailty_ICD exc_frail_icd ON d.person_id = exc_frail_icd.person_id
  LEFT JOIN Exclusion_AdvancedIllness_IP exc_adv_ip ON d.person_id = exc_adv_ip.person_id
  LEFT JOIN Exclusion_AdvancedIllness_NonIP exc_adv_nonip ON d.person_id = exc_adv_nonip.person_id
  LEFT JOIN Exclusion_Hospice_ProblemList exc_hospice ON d.person_id = exc_hospice.person_id
  LEFT JOIN Exclusion_PalliativeCare_ICD exc_pal_icd ON d.person_id = exc_pal_icd.person_id
  WHERE
    -- Direct exclusions (patient appears in the exclusion list)
    exc_hospice.person_id IS NULL
    AND exc_pal_icd.person_id IS NULL
    -- Combined/conditional exclusions
    AND NOT (d.current_age >= 66 AND exc_ltc.person_id IS NOT NULL) -- EXC2
    AND NOT (d.current_age >= 66 AND exc_frail_snomed.person_id IS NOT NULL AND exc_dem_meds.person_id IS NOT NULL) -- FRA_EXCL
    AND NOT (d.current_age >= 66 AND exc_frail_icd.person_id IS NOT NULL AND exc_dem_meds.person_id IS NOT NULL) -- FRA_EXCL_ICD
    AND NOT (d.current_age >= 66 AND exc_frail_icd.person_id IS NOT NULL AND exc_adv_ip.person_id IS NOT NULL) -- FRA_ADV_ILL
    AND NOT (d.current_age >= 66 AND exc_frail_icd.person_id IS NOT NULL AND exc_adv_nonip.person_id IS NOT NULL) -- FRA_ADV_ILL1
),

Numerator AS (

  /*
  STEP 9: NUMERATOR
  - Corresponds to the `LEFT JOIN (SELECT ... ) NUMR`.
  - Finds the most recent HbA1c lab result for each patient.
  */
  SELECT
    patient_reference AS person_id,
    effectiveperiod_end AS a1c_result_date,
    event_tag AS a1c_result,
    observation_code,
    CASE WHEN TRY_CAST(CASE WHEN event_tag LIKE '>%' THEN SPLIT_PART(event_tag, '>', 2) ELSE event_tag END AS FLOAT) > 9.0 THEN 1 ELSE 0 END AS qualified_results
  FROM
    {source_tables['observation_table']}
  WHERE
    observation_code IN ('463628023', '2776594653', '2891382661') -- HbA1c codes
    AND valid_until_dt_tm > CURRENT_TIMESTAMP
    AND event_tag NOT LIKE ANY ('In Error', 'Date/Time Correction', 'Cancelled', 'See Note', 'In Progress')
  QUALIFY ROW_NUMBER() OVER (PARTITION BY patient_reference ORDER BY effectiveperiod_end DESC) = 1
),

-- 
-- FINAL SELECT & ENRICHMENT
-- 

FinalData AS (

  /*
  STEP 10: JOINING FOR FINAL OUTPUT
  - Joins the final, filtered population with the numerator results.
  - This is the base data set from which the final report is generated.
  */
  SELECT
    fd.person_id,
    fd.patient_name,
    fd.birthdate_local,
    fd.current_age,
    fd.encntr_id,
    fd.encntr_reg_dttm,
    fd.loc_facility_cd,
    fd.attending_provider_id,
    num.a1c_result_date,
    num.a1c_result,
    num.observation_code,
    num.qualified_results
  FROM
    FinalDenominator fd
  LEFT JOIN
    Numerator num ON fd.person_id = num.person_id
),

final_cte as (

SELECT
  -- Provider and Location Details
  pcp_details.region AS Region,
  pcp_details.sub_region AS Sub_Region,
  pcp_details.clinic AS Clinic,
  pcp_details.medical_group AS MEDICAL_GROUP,
  pcp_details.provider_name AS PCP_Name,
  pcp_details.pcp_npi,
  -- Patient and Encounter Details
  f.person_id AS Patient_ID,
  f.patient_name AS Patient_Name,
  FLOOR(DATEDIFF(day, f.birthdate_local, f.encntr_reg_dttm) / 365.25) AS Patient_Age,
  CAST(f.birthdate_local AS DATE) AS Patient_DOB,
  f.current_age AS Patient_age_current,
  f.encntr_id,
  CAST(f.encntr_reg_dttm AS DATE) AS Last_PCP_Visit,
  -- Health Plan Details
  ip.plan_name AS Health_Plan_Name,
  cs.title AS Health_Plan_Type,
  -- Provider Details
  pcp_details.provider_name AS Assigned_Cerner_PCP,
  attending_details.provider_name AS Provider_Last_Visited,
  -- Numerator and Measure Outcome
  CASE
    WHEN (f.a1c_result_date) >= DATEADD(month, -12, CURRENT_DATE) AND f.qualified_results = 1 THEN 'Meets'
    WHEN f.observation_code IS NOT NULL AND f.a1c_result_date < DATEADD(month, -12, CURRENT_DATE) THEN 'Meets'
    WHEN f.observation_code IS NULL THEN 'Meets'
    ELSE 'No Meets'
  END AS MEETS,
  a1c_code.title AS A1c_Type,
  f.a1c_result AS A1c_Result,
  f.a1c_result_date AS A1c_Result_Date,
  -- System and Refresh Date
  CURRENT_TIMESTAMP AS Refresh_Date
FROM
  FinalData f
-- Enrichment Joins for descriptive fields
LEFT JOIN (
    SELECT DISTINCT p.person_id, pr.name_text AS provider_name, pie.identifier_value as pcp_npi, rp.region, rp.sub_region, rp.clinic, rp.medical_group
    FROM {source_tables['person_table']} p
    JOIN {source_tables['practitionerrole_table']} ppr ON p.person_id = ppr.person_id AND ppr.priority_seq = 0 AND ppr.period_end > CURRENT_DATE AND ppr.active_ind = 1 AND ppr.person_prsnl_r_code = 1115
    JOIN {source_tables['practitioner_table']} pr ON ppr.practitioner_reference = pr.practitioner_id AND pr.active_ind = 1
    JOIN {source_tables['practitioner_identifier_ext_table']} pie ON pr.practitioner_id = pie.practitioner_id AND pie.active_ind = 1 AND pie.identifier_type_code = '28769904'
    JOIN {source_tables['regions_providers_table']} rp ON CAST(rp.national_provider_id AS VARCHAR(20)) = CAST(pie.identifier_value AS VARCHAR(20))
  ) pcp_details ON f.person_id = pcp_details.person_id
LEFT JOIN (
    SELECT DISTINCT pr.practitioner_id, pr.name_text AS provider_name
    FROM {source_tables['practitioner_table']} pr WHERE pr.active_ind = 1
  ) attending_details ON f.attending_provider_id = attending_details.practitioner_id
LEFT JOIN
  {source_tables['coverage_table']} cov ON f.encntr_id = cov.encounter_id AND cov.active_ind = 1 AND cov.order = 1
LEFT JOIN
  {source_tables['insuranceplan_table']} ip ON cov.health_plan_id = ip.insuranceplan_id AND ip.active_ind = 1
LEFT JOIN
  {source_tables['codesystem_table']} cs ON ip.plan_type_code = cs.identifier_value
LEFT JOIN
  {source_tables['codesystem_table']} a1c_code ON f.observation_code = a1c_code.identifier_value AND a1c_code.active_ind = 1
-- Select the single, most recent encounter per patient from the final eligible population
QUALIFY ROW_NUMBER() OVER (PARTITION BY f.person_id ORDER BY f.encntr_reg_dttm DESC) = 1
)

select * from final_cte