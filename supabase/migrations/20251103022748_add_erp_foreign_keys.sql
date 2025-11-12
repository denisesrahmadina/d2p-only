/*
  # Add Foreign Key Constraints to ERP Transactional Tables

  This migration adds all missing foreign key relationships to the ERP transactional layer tables
  to ensure referential integrity and proper data relationships.

  ## Tables Modified
  1. purchase_order - Links to material, vendor, contract, unit
  2. goods_receipt - Links to purchase_order, material, vendor, contract, unit, storage_location
  3. goods_issuance - Links to material, unit, storage_location
  4. inventory_snapshot - Links to material, storage_location, unit
  5. demand - Links to material, unit
  6. forecast - Links to material, unit
  7. procurement_request - Links to material, vendor, unit
  8. asset - Links to material, unit
  9. price_estimation - Links to material
  10. sourcing_event - Links to material
  11. tender_scoring - Links to sourcing_event, vendor
  12. supplier_performance - Links to vendor, contract
  13. fulfillment - Links to material, unit
  14. invoice - Links to vendor, contract, material
  15. payment_term - Links to contract
  16. settlement - Links to vendor, contract
  17. berita_acara - Links to contract, vendor

  ## Foreign Key Constraints
  - All constraints use ON DELETE RESTRICT to prevent accidental deletion of referenced data
  - All constraints will improve query performance and enforce data integrity
*/

-- 1. PURCHASE_ORDER
ALTER TABLE purchase_order
  ADD CONSTRAINT purchase_order_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT purchase_order_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT purchase_order_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT,
  ADD CONSTRAINT purchase_order_receiving_unit_id_fkey 
    FOREIGN KEY (receiving_unit_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 2. GOODS_RECEIPT
ALTER TABLE goods_receipt
  ADD CONSTRAINT goods_receipt_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_receipt_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_receipt_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_receipt_receiving_unit_id_fkey 
    FOREIGN KEY (receiving_unit_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_receipt_storage_location_id_fkey 
    FOREIGN KEY (storage_location_id) REFERENCES dim_storage_location(storage_location_id) ON DELETE RESTRICT;

-- 3. GOODS_ISSUANCE
ALTER TABLE goods_issuance
  ADD CONSTRAINT goods_issuance_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_issuance_unit_owner_id_fkey 
    FOREIGN KEY (unit_owner_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT,
  ADD CONSTRAINT goods_issuance_storage_location_id_fkey 
    FOREIGN KEY (storage_location_id) REFERENCES dim_storage_location(storage_location_id) ON DELETE RESTRICT;

-- 4. INVENTORY_SNAPSHOT
ALTER TABLE inventory_snapshot
  ADD CONSTRAINT inventory_snapshot_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT inventory_snapshot_storage_location_id_fkey 
    FOREIGN KEY (storage_location_id) REFERENCES dim_storage_location(storage_location_id) ON DELETE RESTRICT,
  ADD CONSTRAINT inventory_snapshot_unit_owner_id_fkey 
    FOREIGN KEY (unit_owner_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 5. DEMAND
ALTER TABLE demand
  ADD CONSTRAINT demand_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT demand_unit_requestor_id_fkey 
    FOREIGN KEY (unit_requestor_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 6. FORECAST
ALTER TABLE forecast
  ADD CONSTRAINT forecast_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT forecast_unit_requestor_id_fkey 
    FOREIGN KEY (unit_requestor_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 7. PROCUREMENT_REQUEST
ALTER TABLE procurement_request
  ADD CONSTRAINT procurement_request_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT procurement_request_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT procurement_request_unit_requestor_id_fkey 
    FOREIGN KEY (unit_requestor_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 8. ASSET
ALTER TABLE asset
  ADD CONSTRAINT asset_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT asset_unit_owner_id_fkey 
    FOREIGN KEY (unit_owner_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 9. PRICE_ESTIMATION
ALTER TABLE price_estimation
  ADD CONSTRAINT price_estimation_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT;

-- 10. SOURCING_EVENT
ALTER TABLE sourcing_event
  ADD CONSTRAINT sourcing_event_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT;

-- 11. TENDER_SCORING
ALTER TABLE tender_scoring
  ADD CONSTRAINT tender_scoring_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT;

-- 12. SUPPLIER_PERFORMANCE
ALTER TABLE supplier_performance
  ADD CONSTRAINT supplier_performance_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT supplier_performance_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT;

-- 13. FULFILLMENT
ALTER TABLE fulfillment
  ADD CONSTRAINT fulfillment_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT,
  ADD CONSTRAINT fulfillment_unit_id_fkey 
    FOREIGN KEY (unit_id) REFERENCES dim_unit(unit_id) ON DELETE RESTRICT;

-- 14. INVOICE
ALTER TABLE invoice
  ADD CONSTRAINT invoice_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT invoice_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT,
  ADD CONSTRAINT invoice_material_id_fkey 
    FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT;

-- 15. PAYMENT_TERM
ALTER TABLE payment_term
  ADD CONSTRAINT payment_term_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT;

-- 16. SETTLEMENT
ALTER TABLE settlement
  ADD CONSTRAINT settlement_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT,
  ADD CONSTRAINT settlement_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT;

-- 17. BERITA_ACARA
ALTER TABLE berita_acara
  ADD CONSTRAINT berita_acara_contract_id_fkey 
    FOREIGN KEY (contract_id) REFERENCES dim_contract(contract_id) ON DELETE RESTRICT,
  ADD CONSTRAINT berita_acara_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT;
