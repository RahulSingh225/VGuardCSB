export interface BankDetail {
  bank_account_name: string | '';
  bank_account_number: string | '';
  bank_account_ifsc: string | '';
  bank_account_type: string | '';
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
  transaction_count:number|0;
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


export class CouponData {
  userMobileNumber: string | null = null;
  couponCode: string | null = null;
  pin: string | null = null;
  smsText: string | null = null;
  from: string | null = null;
  userType: string | null = null;
  userId: number = 0;
  apmID: number = 0;
  rishtaId: string | null = null;

  latitude: string | null = null;
  longitude: string | null = null;
  geolocation: string | null = null;
  category: string | null = null;

  constructor(data?: Partial<CouponData>) {
      Object.assign(this, data);
  }
}


export interface CustomerData {
  contactNo: string;
  name: string;
  email: string;
  currAdd: string;
  alternateNo: string;
  state: string;
  district: string;
  city: string;
  landmark: string;
  pinCode: string;
  dealerName: string;
  dealerAdd: string;
  dealerState: string;
  dealerDist: string;
  dealerCity: string;
  dealerPinCode: string;
  dealerNumber: string;
  addedBy: string;
  transactId: string;
  billDetails: string;
  warrantyPhoto: string;
  sellingPrice: string;
  emptStr: string;
  cresp: {
    custIdForProdInstall: string;
    modelForProdInstall: string;
    errorCode: string;
    errorMsg: string;
    statusType: string;
    balance: string;
    currentPoints: string;
    couponPoints: string;
    promotionPoints: string;
    transactId: string;
    schemePoints: string;
    basePoints: string;
    clubPoints: string;
    scanDate: string;
    scanStatus: string;
    couponCode: string;
    bitEligibleScratchCard: string;
    pardId: string;
    partNumber: string;
    partName: string;
    couponCode: string;
    skuDetail: string;
    purchaseDate: string;
    categoryId: string;
    category: string;
    anomaly: string;
    warranty: string;
  };
  selectedProd: {
    specs: string;
    pointsFormat: string;
    product: string;
    productName: string;
    productCategory: string;
    productCode: string;
    points: string;
    imageUrl: string;
    userId: string;
    productId: string;
    paytmMobileNo: string;
  };
  latitude: string;
  longitude: string;
  geolocation: string;
  dealerCategory: string;
}
export class Claims {
  claim_number: string | null = '';
  claim_date: string | null = null;
  user_id: string | null = null;
  rishta_id: string | null = null;
  unique_id: string | null = '';
  start_date: string | null = null;
  end_date: string | null = null;
  pincode: string | null = null;
  claim_file: string | null = '';
  claim_status: string | null = '';
  claim_closed: string | null = '';
  comments: string | null = '';
  claim_data: string | null = null;
}

export class ClaimsData {
  category_id: string | null = '';
  subcategory_id: string | null = '';
  sku_name: string | null = '';
  sku_id: string | null = '';
  subcategory_name: string | null = '';
  category_name: string | null = '';
  quantity: number | null = 0;
  already_claimed_count: number | null = 0;
}
