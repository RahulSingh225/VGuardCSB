export interface BankDetail {
  bank_account_name: string | null = null;
  bank_account_number: string | null = null;
  bank_account_ifsc: string | null = null;
  bank_account_type: string | null = null;
}

interface PointsSummary {
  pointsBalance: string | '';
  redeemedPoints: string | '';
  numberOfScan: string | '';
  tdsPoints: string | '';
  schemePoints: string | '';
  totalPointsRedeemed: string | '';
  totalPointsEarned: string | '';
}

interface KycDetails {
  kycFlag: string | '';
  userId: string | '';
  kycIdName: string | '';
  kycId: string | '';
  selfie: string | '';
  aadharOrVoterOrDLFront: string | '';
  aadharOrVoterOrDlBack: string | '';
  aadharOrVoterOrDlNo: string | '';
  panCardFront: string | '';
  panCardBack: string | '';
  panCardNo: string | '';
  gstFront: string | '';
  gstNo: string | '';
  gstYesNo: string | '';
}

interface WelcomeBanner {
  code: number | 0;
  textMessage: string | '';
  videoPath: string | '';
  imgPath: string | '';
  vdoText: string | '';
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface VguardUser {
  name: string | '';
  dob: string | '';
  unique_id: string | '';
  contact: string | '';
  gender: string | '';
  alternate_contact: string | '';
  mapped_parent_name: string | '';
  mapped_parent_ID: string | '';
  pic_code: string | '';
  pic_name: string | '';
  cs_type: string | '';
  tagged_categories: string | '';
  activation_status: string | '';
  block_status: string | '';
  sales_office: string | '';
  aadhar: string | '';
  pan: string | '';
  login_date: string | '';
  user_id: string | '';
  rishta_id: string | '';
  isActive: string | '';
  currentaddress1: string | '';
  currentaddress2: string | '';
  currentaddress3: string | '';
  pincode: string | '';
  city: string | '';
  district: string | '';
  district_id: number | '';
  state: string | '';
  state_id: number | '';
  bank_details: BankDetail;
  bank_account_change_count: string | '';
  bank_verified: number | 0;
  vpa_id: string | '';
  preferred_language: number | 1;
  vpa_verified: number | 0;
  email: string | '';
  selfie: string | '';
  tds_flag: number | 0;
  tds_percent: number | 20;
  tds_kitty: number | 0.0;
  earned_points: number | 0.0;
  redeemded_points: number | 0.0;
  balance_points: number | 0.0;
  resend_invite_link: boolean | false;
  retrigger_invite: boolean | false;
  access_token: string | '';
  refresh_token: string | '';
}

export interface User {
  vguardRishtaUser: VguardUser;
  tokens: Tokens;
}

export interface State {
  stateId: number | 0;
  stateName: string | '';
}
export interface Cities {
  cityId: number | 0;
  cityName: string | '';
}
export interface District {
  distId: number | 0;
  districtName: string | '';
}
