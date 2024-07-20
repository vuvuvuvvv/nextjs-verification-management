// lib/types.ts
export interface ResetEmailCredentials {
    email: string;
    password: string;
}
export interface ResetPasswordCredentials {
    old_password: string;
    new_password: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
    remember: boolean;
}

export interface RegisterCredentials {
    username: string;
    fullname: string;
    password: string;
    email: string;
}

export interface ReportDataType {
    "id": number,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "numberOfClocks": number,
    "status": string,
}

export interface WaterMeterDataType {
    "id": number,
    "serialNumber": string,
    "type": string,
    "accuracyClass": string,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "status": string,
}