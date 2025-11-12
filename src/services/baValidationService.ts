import { BAValidationResult, BAParty, BAPemeriksaanDetail, BASerahTerimaDetail } from '../types/ba';

export class BAValidationService {
  static validateParties(parties: BAParty[]): BAValidationResult {
    const errors: { field: string; message: string; severity: 'error' | 'warning' }[] = [];

    const makerVendors = parties.filter(p => p.role_type === 'Maker Vendor');
    const makerPLNs = parties.filter(p => p.role_type === 'Maker PLN');
    const checkerVendors = parties.filter(p => p.role_type === 'Checker Vendor');
    const checkerPLNs = parties.filter(p => p.role_type === 'Checker PLN');
    const approverVendors = parties.filter(p => p.role_type === 'Approver Vendor');
    const approverPLNs = parties.filter(p => p.role_type === 'Approver PLN');

    if (makerVendors.length === 0) {
      errors.push({ field: 'parties', message: 'Maker Vendor is required', severity: 'error' });
    } else if (makerVendors.length > 1) {
      errors.push({
        field: 'parties',
        message: 'Only one Maker Vendor is allowed',
        severity: 'error'
      });
    }

    if (makerPLNs.length === 0) {
      errors.push({ field: 'parties', message: 'Maker PLN is required', severity: 'error' });
    } else if (makerPLNs.length > 1) {
      errors.push({ field: 'parties', message: 'Only one Maker PLN is allowed', severity: 'error' });
    }

    if (checkerVendors.length > 3) {
      errors.push({
        field: 'parties',
        message: 'Maximum 3 Checker Vendors allowed',
        severity: 'error'
      });
    }

    if (checkerPLNs.length > 3) {
      errors.push({
        field: 'parties',
        message: 'Maximum 3 Checker PLNs allowed',
        severity: 'error'
      });
    }

    if (approverVendors.length > 3) {
      errors.push({
        field: 'parties',
        message: 'Maximum 3 Approver Vendors allowed',
        severity: 'error'
      });
    }

    if (approverPLNs.length > 3) {
      errors.push({
        field: 'parties',
        message: 'Maximum 3 Approver PLNs allowed',
        severity: 'error'
      });
    }

    parties.forEach((party, index) => {
      if (!party.party_name) {
        errors.push({
          field: `parties[${index}].party_name`,
          message: 'Party name is required',
          severity: 'error'
        });
      }

      if (party.party_email && !this.isValidEmail(party.party_email)) {
        errors.push({
          field: `parties[${index}].party_email`,
          message: 'Invalid email format',
          severity: 'error'
        });
      }
    });

    const plnUserIds = parties
      .filter(p => p.role_side === 'PLN' && p.party_user_id)
      .map(p => p.party_user_id);
    const duplicatePLNUsers = plnUserIds.filter(
      (id, index) => plnUserIds.indexOf(id) !== index
    );

    if (duplicatePLNUsers.length > 0) {
      errors.push({
        field: 'parties',
        message: 'Maker PLN cannot overlap with Checker/Approver PLN',
        severity: 'warning'
      });
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  }

  static validatePemeriksaanDetails(details: BAPemeriksaanDetail[]): BAValidationResult {
    const errors: { field: string; message: string; severity: 'error' | 'warning' }[] = [];

    if (details.length === 0) {
      errors.push({
        field: 'inspection_details',
        message: 'At least one inspection detail is required',
        severity: 'error'
      });
      return { isValid: false, errors };
    }

    details.forEach((detail, index) => {
      if (!detail.material_description) {
        errors.push({
          field: `inspection_details[${index}].material_description`,
          message: 'Material description is required',
          severity: 'error'
        });
      }

      if (!detail.inspection_date) {
        errors.push({
          field: `inspection_details[${index}].inspection_date`,
          message: 'Inspection date is required',
          severity: 'error'
        });
      }

      if (detail.qty_ordered <= 0) {
        errors.push({
          field: `inspection_details[${index}].qty_ordered`,
          message: 'Ordered quantity must be greater than 0',
          severity: 'error'
        });
      }

      if (detail.qty_inspected <= 0) {
        errors.push({
          field: `inspection_details[${index}].qty_inspected`,
          message: 'Inspected quantity must be greater than 0',
          severity: 'error'
        });
      }

      if (detail.qty_approved < 0 || detail.qty_rejected < 0) {
        errors.push({
          field: `inspection_details[${index}]`,
          message: 'Approved and rejected quantities cannot be negative',
          severity: 'error'
        });
      }

      if (detail.qty_approved + detail.qty_rejected !== detail.qty_inspected) {
        errors.push({
          field: `inspection_details[${index}]`,
          message: 'Approved + Rejected quantities must equal Inspected quantity',
          severity: 'error'
        });
      }

      const availableQty = detail.qty_ordered - detail.qty_previously_received;
      if (detail.qty_inspected > availableQty) {
        errors.push({
          field: `inspection_details[${index}].qty_inspected`,
          message: `Inspected quantity (${detail.qty_inspected}) exceeds available quantity (${availableQty})`,
          severity: 'error'
        });
      }

      if (!detail.inspection_by_both_parties) {
        errors.push({
          field: `inspection_details[${index}].inspection_by_both_parties`,
          message: 'Inspection must be verified by both parties',
          severity: 'warning'
        });
      }
    });

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  }

  static validateSerahTerimaDetails(details: BASerahTerimaDetail[]): BAValidationResult {
    const errors: { field: string; message: string; severity: 'error' | 'warning' }[] = [];

    if (details.length === 0) {
      errors.push({
        field: 'handover_details',
        message: 'At least one handover detail is required',
        severity: 'error'
      });
      return { isValid: false, errors };
    }

    details.forEach((detail, index) => {
      if (!detail.material_description) {
        errors.push({
          field: `handover_details[${index}].material_description`,
          message: 'Material description is required',
          severity: 'error'
        });
      }

      if (!detail.handover_date) {
        errors.push({
          field: `handover_details[${index}].handover_date`,
          message: 'Handover date is required',
          severity: 'error'
        });
      }

      if (!detail.delivery_location) {
        errors.push({
          field: `handover_details[${index}].delivery_location`,
          message: 'Delivery location is required',
          severity: 'error'
        });
      }

      if (detail.qty_ordered <= 0) {
        errors.push({
          field: `handover_details[${index}].qty_ordered`,
          message: 'Ordered quantity must be greater than 0',
          severity: 'error'
        });
      }

      if (detail.qty_this_handover <= 0) {
        errors.push({
          field: `handover_details[${index}].qty_this_handover`,
          message: 'Handover quantity must be greater than 0',
          severity: 'error'
        });
      }

      const availableQty = detail.qty_ordered - detail.qty_already_handed_over;
      if (detail.qty_this_handover > availableQty) {
        errors.push({
          field: `handover_details[${index}].qty_this_handover`,
          message: `Handover quantity (${detail.qty_this_handover}) exceeds available quantity (${availableQty})`,
          severity: 'error'
        });
      }

      if (!detail.handover_by_both_parties) {
        errors.push({
          field: `handover_details[${index}].handover_by_both_parties`,
          message: 'Handover must be verified by both parties',
          severity: 'warning'
        });
      }
    });

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateDates(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
  }

  static isFutureDate(date: string): boolean {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate > today;
  }
}
