export interface UserDetails {
    id: string;
    email: string;   
    fullName: string;
    roles: string[];
    phoneNumber: string;
    twoFactorEnabled: true;
    emailConfirmed: true;
    accessFailedCount:0;
    status:false;
}